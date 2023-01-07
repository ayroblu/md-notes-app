import { selector } from "recoil";

import { dropboxClientState } from "./dropbox-auth";

export const dropboxFilesState = selector({
  key: "dropboxFilesState",
  get: async ({ get }) => {
    const dbx = get(dropboxClientState);
    return dbx.filesListFolder({ path: "" }).then((result) => {
      console.log(result);
      return result;
    });
  },
});
