import { selector, selectorFamily } from "recoil";

import { dropboxClientState } from "./dropbox-auth";

export const dropboxFilesState = selector({
  key: "dropboxFilesState",
  get: async ({ get }) => {
    const dbx = get(dropboxClientState);
    return dbx.filesListFolder({ path: "" });
  },
});
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
            () => {
              resolve(reader.result as string | null);
            },
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
