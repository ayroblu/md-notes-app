import type { files } from "dropbox";
import { atomFamily, selector, selectorFamily } from "recoil";

import { isNonNullable } from "@/utils/main";

import { dropboxClientState } from "./dropbox-auth";
import { syncIdbEffect } from "./effects";
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
      const blob = result.fileBlob;
      const reader = new FileReader();
      return new Promise<string | null>((resolve) => {
        reader.addEventListener(
          "loadend",
          () =>
            resolve(
              reader.result instanceof ArrayBuffer
                ? decodeArrayBuffer(reader.result)
                : reader.result,
            ),
          { once: true },
        );
        reader.readAsText(blob);
      });
    },
});
function decodeArrayBuffer(buf: ArrayBuffer): string {
  const enc = new TextDecoder("utf-8");
  return enc.decode(buf);
}
export const dropboxUploadFileState = selectorFamily<string, string>({
  key: "dropboxUploadFileState",
  get: (_filename) => () => "",
  set:
    (filename) =>
    async ({ get }) => {
      const dbx = get(dropboxClientState);
      const downloadedMetadata = get(dropboxFileDownloadState(filename));
      const fileDetails = get(editedFileHelper.normState(filename));
      if (!fileDetails) return console.error("file edits not found");

      const metadata = await dbx.filesGetMetadata({ path: filename });
      if (metadata.result[".tag"] !== "file")
        return console.log("expected file metadata");
      const { contents } = fileDetails;
      if (
        downloadedMetadata.content_hash === metadata.result.content_hash ||
        confirm("File has changed on dropbox, are you sure you want to save?")
      ) {
        dbx.filesUpload({ path: filename, contents });
      }
    },
});
