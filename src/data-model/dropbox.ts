import type { files } from "dropbox";
import { selector, selectorFamily } from "recoil";

import { dropboxClientState } from "./dropbox-auth";

export const dropboxFilesState = selector<DropboxFile[]>({
  key: "dropboxFilesState",
  get: async ({ get }) => {
    const dbx = get(dropboxClientState);
    const response = await dbx.filesListFolder({ path: "", recursive: true });
    const entries = response.result.entries;
    return getDropboxFiles(entries);
  },
});
function getIntermediaryGroup(
  entries: files.ListFolderResult["entries"],
): Intermediary {
  console.log("entries", entries);
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
export const dropboxFileContentsState = selectorFamily<string | null, string>({
  key: "dropboxFileContentsState",
  get:
    (fileName) =>
    async ({ get }) => {
      const dbx = get(dropboxClientState);
      try {
        const response = await dbx.filesDownload({ path: fileName });
        const result = withBlob(response.result);
        const blob = result.fileBlob;
        const reader = new FileReader();
        return new Promise<string | null>((resolve) => {
          reader.addEventListener(
            "loadend",
            () => resolve(reader.result as string | null),
            { once: true },
          );
          reader.readAsText(blob);
        });
      } catch (err) {
        console.error(err);
        return null;
      }
    },
});
// Incorrect types on Dropbox SDK
function withBlob<T>(item: T): T & { fileBlob: Blob } {
  const adjustedItem = item as T & { fileBlob: Blob };
  if (!adjustedItem.fileBlob) throw new Error("Expected fileBlob on file");
  return adjustedItem;
}
