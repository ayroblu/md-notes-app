import type { files as DropboxFiles } from "dropbox";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { dropboxFilesState } from "../../data-model/dropbox";
import { activeFilenameState } from "../../data-model/main";
import { exhaustiveCheck } from "../../utils/main";

import styles from "./FileList.module.css";
import { scrollToFirstPane } from "./utils";

export function FileList() {
  const files = useRecoilValue(dropboxFilesState);
  return (
    <ul className={styles.main}>
      {files.result.entries.map((entry) => {
        switch (entry[".tag"]) {
          case "file":
          case "folder":
            return <FileEntry entry={entry} key={entry.id} />;
          case "deleted":
            return null;
          default:
            exhaustiveCheck(entry);
            return null;
        }
      })}
    </ul>
  );
}
function FileEntry({
  entry,
}: {
  entry: DropboxFiles.ListFolderResult["entries"][number];
}) {
  const setFilename = useSetRecoilState(activeFilenameState);
  const setFilenameHandler = React.useCallback(() => {
    if (entry.path_lower) {
      setFilename(entry.path_lower);
      scrollToFirstPane({ behavior: "smooth" });
    }
  }, [entry, setFilename]);
  switch (entry[".tag"]) {
    case "file":
      return (
        <li key={entry.id} onClick={setFilenameHandler}>
          {entry.name}
        </li>
      );
    case "folder":
      return <li key={entry.id}>{entry.name}</li>;
    case "deleted":
      return null;
    default:
      exhaustiveCheck(entry);
      return null;
  }
}
