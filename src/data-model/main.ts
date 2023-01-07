import { atom } from "recoil";

export const activeFilenameState = atom<string | undefined>({
  key: "activeFileState",
  default: undefined,
});
