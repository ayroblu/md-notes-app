import { getVSIFileIcon, getVSIFolderIcon } from "file-extension-icon-js";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import type { DropboxFile } from "../../data-model/dropbox";
import { dropboxFilesState } from "../../data-model/dropbox";
import { activeFilenameState } from "../../data-model/main";
import { exhaustiveCheck } from "../../utils/main";

import styles from "./FileList.module.css";
import { scrollToFirstPane } from "./utils";

export function FileList() {
  const files = useRecoilValue(dropboxFilesState);
  console.log("files", files);
  return <FileEntries files={files} />;
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
          <img alt="js" src={getVSIFileIcon(entry.name)} width="24" />
          {entry.name}
        </li>
      );
    case "folder":
      ////Open Folder Icon
      //<img src=`${getVSIFolderIcon('android', 1)}` alt="android" width="24" />
      return (
        <>
          <li className={styles.folder} key={entry.id}>
            <div className={styles.folderName} onClick={toggleOpenHandler}>
              <img
                alt={entry.name}
                src={getVSIFolderIcon(entry.name, isFolderOpen)}
                width="24"
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
