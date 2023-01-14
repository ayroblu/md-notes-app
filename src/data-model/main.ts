import { atom } from "recoil";

import { syncIdbEffect } from "./effects";
import { normalisedState } from "./normalised";

export const activeFilenameState = atom<string | undefined>({
  key: "activeFileState",
  default: undefined,
  effects: [syncIdbEffect("activeFilename")],
});

type FileDetails = {
  contents: string;
  dateEdited: number;
};
export const editedFileHelper = normalisedState<string, FileDetails>(
  "editedFile",
  { isPersisted: true },
);
