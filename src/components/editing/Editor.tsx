import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  dropboxFileContentsState,
  dropboxUploadFileState,
} from "@/data-model/dropbox";
import { activeFilenameState, editedFileHelper } from "@/data-model/main";

export function Editor() {
  const filename = useRecoilValue(activeFilenameState);
  if (!filename) {
    return <div>Select a file</div>;
  } else {
    return (
      <React.Suspense>
        <FileFoundEditor filename={filename} />
      </React.Suspense>
    );
  }
}

const LazyVimEditor = React.lazy(() => import("./VimEditor"));

type FileFoundEditorProps = {
  filename: string;
};
function FileFoundEditor({ filename }: FileFoundEditorProps) {
  const fileDetails = useRecoilValue(dropboxFileContentsState(filename));
  const editFile = editedFileHelper.useGet(filename);
  const setEditFile = editedFileHelper.useSet(filename);
  const saveToDropbox = useSetRecoilState(dropboxUploadFileState(filename));
  const onEdit = React.useCallback(
    (contents: string) => {
      setEditFile({
        dateEdited: +new Date(),
        contents,
      });
      saveToDropbox(contents);
    },
    [saveToDropbox, setEditFile],
  );
  if (!fileDetails) {
    return <div>File not found</div>;
  } else {
    // return <pre>{fileDetails}</pre>;
    return (
      <LazyVimEditor
        filename={filename}
        initialContents={editFile?.contents ?? fileDetails}
        key={filename}
        onEdit={onEdit}
      />
    );
  }
}
// <h3>Editor</h3>
// {Array(100)
//   .fill("lorem")
//   .map((t, i) => (
//     <p key={i}>{t}</p>
//   ))}
