import type { files } from "dropbox";
import {
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
} from "recoil";

import { isNonNullable, readContentsOfBlob } from "@/utils/main";

import { dropboxClientState } from "./dropbox-auth";
import { syncIdbEffect } from "./idb-effect";
import { editedFileHelper } from "./main";

const dropboxFilesRawState = selector<files.ListFolderResult>({
  key: "dropboxFilesRawState",
  get: async ({ get }) => {
    const dbx = get(dropboxClientState);
    const response = await dbx.filesListFolder({ path: "", recursive: true });
    return response.result;
  },
});
export const dropboxFilesState = selector<DropboxFile[]>({
  key: "dropboxFilesState",
  get: async ({ get }) => {
    const result = get(dropboxFilesRawState);
    return getDropboxFiles(result.entries);
  },
});
export const dropboxFilesSetState = selector<Set<string>>({
  key: "dropboxFilesSetState",
  get: async ({ get }) => {
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

const dropboxFileDownloadSelectorState = selectorFamily<
  files.FileMetadata & { fileBlob: Blob },
  string
>({
  key: "dropboxFileDownloadSelectorState",
  get:
    (filename) =>
    async ({ get }) => {
      const dbx = get(dropboxClientState);
      const response = await dbx.filesDownload({ path: filename });
      const result = withBlob(response.result);
      return result;
    },
});
const dropboxFileDownloadState = atomFamily<
  files.FileMetadata & { fileBlob: Blob },
  string
>({
  key: "dropboxFileDownloadState",
  default: (filename) => dropboxFileDownloadSelectorState(filename),
  effects: (filename) => [syncIdbEffect(`dropboxFileDownload/${filename}`)],
});
export const dropboxFileContentsState = selectorFamily<string | null, string>({
  key: "dropboxFileDownloadSelectorState",
  get:
    (filename) =>
    async ({ get }) => {
      const result = get(dropboxFileDownloadState(filename));
      return readContentsOfBlob(result.fileBlob);
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
          const result = withBlob(response.result);
          set(dropboxFileDownloadState(filename), result);
        }
      },
    [filename],
  );
}
