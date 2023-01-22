import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";

import type { DropboxFile } from "@/data-model/dropbox";
import {
  useListenForFilesUpdate,
  dropboxFilesSetState,
  dropboxFilesState,
} from "@/data-model/dropbox";
import { activeFilenameState } from "@/data-model/main";
import { exhaustiveCheck } from "@/utils/main";

import { scrollToFirstPane } from "../EditingLayout";

import styles from "./FileList.module.css";
import { Icon } from "./Icon";

export function FileList() {
  const files = useRecoilValue(dropboxFilesState);
  useAdjustDropboxFilename();
  useListenForFilesUpdate();
  return <FileEntries files={files} />;
}
function useAdjustDropboxFilename() {
  const [activeFilename, setActiveFilename] =
    useRecoilState(activeFilenameState);
  const filesSet = useRecoilValue(dropboxFilesSetState);
  React.useLayoutEffect(() => {
    if (activeFilename && !filesSet.has(activeFilename)) {
      setActiveFilename(undefined);
    }
  }, [activeFilename, filesSet, setActiveFilename]);
}
function FileEntries({ files }: { files: DropboxFile[] }) {
  return (
    <ul className={styles.main}>
      {files.map((file) => {
        switch (file.entry[".tag"]) {
          case "file":
          case "folder":
            return <FileEntry file={file} key={file.entry.id} />;
          case "deleted":
            return null;
          default:
            exhaustiveCheck(file.entry);
            return null;
        }
      })}
    </ul>
  );
}
function FileEntry({ file: { children, entry } }: { file: DropboxFile }) {
  const [isFolderOpen, setIsFolderOpen] = React.useState(false);
  const setFilename = useSetRecoilState(activeFilenameState);
  const setFilenameHandler = React.useCallback(() => {
    if (entry.path_lower) {
      setFilename(entry.path_lower);
      scrollToFirstPane({ behavior: "smooth" });
    }
  }, [entry, setFilename]);
  const toggleOpenHandler = React.useCallback(() => {
    setIsFolderOpen((v) => !v);
  }, []);
  switch (entry[".tag"]) {
    case "file":
      return (
        <li className={styles.file} key={entry.id} onClick={setFilenameHandler}>
          <Icon name={getIconForFile(entry.name) ?? ""} />
          {entry.name}
        </li>
      );
    case "folder":
      ////Open Folder Icon
      return (
        <>
          <li className={styles.folder} key={entry.id}>
            <div className={styles.folderName} onClick={toggleOpenHandler}>
              <Icon
                name={
                  isFolderOpen
                    ? getIconForOpenFolder(entry.name)
                    : getIconForFolder(entry.name)
                }
              />
              {entry.name}
            </div>
            {isFolderOpen && <FileEntries files={children} />}
          </li>
        </>
      );
    case "deleted":
      return null;
    default:
      exhaustiveCheck(entry);
      return null;
  }
}
