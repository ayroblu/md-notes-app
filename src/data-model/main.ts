import { atom } from "recoil";

import { syncIdbEffect } from "./effects";

export const activeFilenameState = atom<string | undefined>({
  key: "activeFileState",
  default: undefined,
  effects: [syncIdbEffect("activeFilename")],
});
