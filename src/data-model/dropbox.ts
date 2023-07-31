import type { files } from "dropbox";
import React from "react";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from "recoil";

import {
  exhaustiveCheck,
  isNonNullable,
  orderBy,
  readContentsOfBlob,
  wait,
} from "@/utils/main";

import { dropboxClientState } from "./dropbox-auth";
import type { EffectParams } from "./idb-effect";
import { syncIdbEffect } from "./idb-effect";
import { getViewerExtensionInfo } from "./mimetypes";

// const dropboxFilesRawSelectorState = selector<files.ListFolderResult>({
//   key: "dropboxFilesRawSelectorState",
//   get: async ({ get }) => {
//     const dbx = get(dropboxClientState);
//     console.log("raw files");
//     const response = await dbx.filesListFolder({ path: "", recursive: true });
//     const entriesList = response.result.entries;
//     let responseResult = response.result;
//     while (responseResult.has_more) {
//       const next = await dbx.filesListFolderContinue({
//         cursor: responseResult.cursor,
//       });
//       responseResult = next.result;
//       entriesList.push(...next.result.entries);
//     }
//     const entries = compactDropboxFiles(entriesList);
//     return {
//       entries,
//       cursor: responseResult.cursor,
//       has_more: false,
//     };
//   },
// });
async function dropboxFilesRawFetch({ getPromise }: EffectParams) {
  const dbx = await getPromise(dropboxClientState);
  console.log("raw files fetch");
  const response = await dbx.filesListFolder({ path: "", recursive: true });
  const entriesList = response.result.entries;
  let responseResult = response.result;
  while (responseResult.has_more) {
    const next = await dbx.filesListFolderContinue({
      cursor: responseResult.cursor,
    });
    responseResult = next.result;
    entriesList.push(...next.result.entries);
  }
  const entries = compactDropboxFiles(entriesList);
  return {
    entries,
    cursor: responseResult.cursor,
    has_more: false,
  };
}
const dropboxFilesRawState = atom<files.ListFolderResult>({
  key: "dropboxFilesRawState",
  effects: [syncIdbEffect(`dropboxListFiles`, dropboxFilesRawFetch)],
});
function useDropboxUpdateFiles() {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        const dbx = await snapshot.getPromise(dropboxClientState);
        const result = await snapshot.getPromise(dropboxFilesRawState);

        let responseResult = result;
        const entriesList = [...result.entries];
        do {
          const next = await dbx.filesListFolderContinue({
            cursor: responseResult.cursor,
          });
          responseResult = next.result;
          entriesList.push(...next.result.entries);
        } while (responseResult.has_more);
        const entries = compactDropboxFiles(entriesList);
        set(dropboxFilesRawState, {
          cursor: responseResult.cursor,
          entries,
          has_more: false,
        });
      },
    [],
  );
}
export function useListenForFilesUpdate() {
  const dbx = useRecoilValue(dropboxClientState);
  const result = useRecoilValue(dropboxFilesRawState);
  const updateFiles = useDropboxUpdateFiles();
  React.useEffect(() => {
    let isActive = true;
    async function run() {
      while (isActive) {
        const response = await dbx.filesListFolderLongpoll({
          cursor: result.cursor,
        });
        if (!isActive) break;
        if (response.result.changes) {
          await updateFiles();
        } else {
          await wait(2000);
        }
        if (response.result.backoff) {
          await wait(response.result.backoff * 1000);
        }
      }
    }
    run().catch(console.error);
    return () => {
      isActive = false;
    };
  });
}
function compactDropboxFiles(
  entries: files.ListFolderResult["entries"],
): files.ListFolderResult["entries"] {
  // insert into new array in reverse order then run reverse()
  const newEntries: typeof entries = [];
  const seenIdsSet = new Set<string>();
  for (let i = entries.length - 1; i >= 0; --i) {
    const entry = entries[i];
    switch (entry[".tag"]) {
      case "file":
        if (
          seenIdsSet.has(entry.id) ||
          (entry.path_lower && seenIdsSet.has(entry.path_lower))
        ) {
          break;
        }
        newEntries.push(entry);
        seenIdsSet.add(entry.id);
        if (entry.path_lower) {
          seenIdsSet.add(entry.path_lower);
        }
        break;
      case "folder":
        if (
          seenIdsSet.has(entry.id) ||
          (entry.path_lower && seenIdsSet.has(entry.path_lower))
        ) {
          break;
        }
        newEntries.push(entry);
        seenIdsSet.add(entry.id);
        if (entry.path_lower) {
          seenIdsSet.add(entry.path_lower);
        }
        break;
      case "deleted":
        if (entry.path_lower) {
          seenIdsSet.add(entry.path_lower);
        }
        break;
      default:
        exhaustiveCheck(entry);
    }
  }
  return newEntries.reverse();
}
export const dropboxFilesState = selector<DropboxFile[]>({
  key: "dropboxFilesState",
  get: ({ get }) => {
    const result = get(dropboxFilesRawState);
    const files = getDropboxFiles(result.entries);
    return files.sort(
      orderBy(
        [(file) => file.entry[".tag"] === "file", (file) => file.entry.name],
        ["asc", "asc"],
      ),
    );
  },
});
export const dropboxFilesSetState = selector<Set<string>>({
  key: "dropboxFilesSetState",
  get: ({ get }) => {
    const result = get(dropboxFilesRawState);
    return new Set(
      result.entries.map(({ path_lower }) => path_lower).filter(isNonNullable),
    );
  },
});

function getIntermediaryGroup(
  entries: files.ListFolderResult["entries"],
): Intermediary {
  return entries.reduce<Intermediary>((map, next) => {
    if (next.path_lower) {
      const sections = next.path_lower.split("/");
      let part = map;
      // 1 skips first one (empty) and last one which is the new one to be added
      for (let i = 1; i < sections.length - 1; ++i) {
        part = part[sections[i]].children;
      }
      part[sections[sections.length - 1]] = { entry: next, children: {} };
    }
    return map;
  }, {});
}
function convertIntermediaryToList(intermediary: Intermediary): DropboxFile[] {
  const result = Object.values(intermediary);
  result.forEach((r) => {
    (r as any).children = convertIntermediaryToList(r.children);
  });
  return result as any as DropboxFile[];
}
function getDropboxFiles(
  entries: files.ListFolderResult["entries"],
): DropboxFile[] {
  return convertIntermediaryToList(getIntermediaryGroup(entries));
}
export type DropboxFile = {
  entry: files.ListFolderResult["entries"][number];
  children: DropboxFile[];
};
type Intermediary = {
  [path: string]: {
    entry: files.ListFolderResult["entries"][number];
    children: Intermediary;
  };
};
// Incorrect types on Dropbox SDK
function withBlob<T>(item: T): T & { fileBlob: Blob } {
  const adjustedItem = item as T & { fileBlob: Blob };
  if (!adjustedItem.fileBlob) throw new Error("Expected fileBlob on file");
  return adjustedItem;
}

// const dropboxFileDownloadSelectorState = selectorFamily<
//   files.FileMetadata & { fileBlob: Blob },
//   string
// >({
//   key: "dropboxFileDownloadSelectorState",
//   get:
//     (filename) =>
//     async ({ get }) => {
//       const dbx = get(dropboxClientState);
//       const response = await dbx.filesDownload({ path: filename });
//       const result = withBlob(response.result);
//       return result;
//     },
// });
function dropboxFileDownload(filename: string) {
  return async ({ getPromise }: EffectParams) => {
    const dbx = await getPromise(dropboxClientState);
    const response = await dbx.filesDownload({ path: filename });
    const result = withBlob(response.result);
    return result;
  };
}
const dropboxFileDownloadState = atomFamily<
  files.FileMetadata & { fileBlob: Blob; fileBlobContents?: string | null },
  string
>({
  key: "dropboxFileDownloadState",
  // default: (filename) => dropboxFileDownloadSelectorState(filename),
  effects: (filename) => [
    syncIdbEffect(
      `dropboxFileDownload/${filename}`,
      dropboxFileDownload(filename),
    ),
  ],
});
export const dropboxFileBlobUrlState = selectorFamily<string, string>({
  key: "dropboxFileBlobUrlState",
  get:
    (filename) =>
    ({ get }) => {
      const result = get(dropboxFileDownloadState(filename));
      const mimetype = getViewerExtensionInfo(filename)?.mimetype;
      const blob = mimetype
        ? result.fileBlob.slice(0, result.fileBlob.size, mimetype)
        : result.fileBlob;
      return URL.createObjectURL(blob);
    },
});
export const dropboxFileContentsState = selectorFamily<string | null, string>({
  key: "dropboxFileContentsState",
  get:
    (filename) =>
    ({ get }) => {
      const result = get(dropboxFileDownloadState(filename));
      return result.fileBlobContents ?? readContentsOfBlob(result.fileBlob);
    },
});
export function useDropboxFileUpload(filename: string) {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async (contents: string) => {
        const dbx = await snapshot.getPromise(dropboxClientState);
        const downloadedMetadata = await snapshot.getPromise(
          dropboxFileDownloadState(filename),
        );
        const dropboxContents = await snapshot.getPromise(
          dropboxFileContentsState(filename),
        );
        if (dropboxContents === contents) return; // no change

        const metadata = await dbx.filesGetMetadata({ path: filename });
        if (metadata.result[".tag"] !== "file")
          return console.log("expected file metadata");
        if (
          downloadedMetadata.content_hash === metadata.result.content_hash ||
          confirm("File has changed on dropbox, are you sure you want to save?")
        ) {
          await dbx.filesUpload({
            path: filename,
            contents,
            mode: {
              ".tag": "update",
              update: metadata.result.rev,
            },
          });
          const response = await dbx.filesDownload({ path: filename });
          const blobResult = withBlob(response.result);
          const fileBlobContents = await readContentsOfBlob(
            blobResult.fileBlob,
          );
          const result = withFileBlobContents(blobResult, fileBlobContents);
          set(dropboxFileDownloadState(filename), result);
        }
      },
    [filename],
  );
}

function withFileBlobContents<T>(
  t: T,
  fileBlobContents: string | null,
): T & { fileBlobContents: string | null } {
  const result = t as T & { fileBlobContents: string | null };
  result.fileBlobContents = fileBlobContents;
  return result;
}
