import React from "react";
import { useRecoilValue } from "recoil";

import { dropboxFileContentsState } from "@/data-model/dropbox";
import { activeFilenameState, editedFileHelper } from "@/data-model/main";

import { Markdown } from "./Markdown";

export function MarkdownViewer() {
  const filename = useRecoilValue(activeFilenameState);
  if (!filename) {
    return <div>Select a file</div>;
  } else {
    return (
      <React.Suspense>
        <FileFoundMarkdownViewer filename={filename} />
      </React.Suspense>
    );
  }
}
type FileFoundMarkdownViewerProps = {
  filename: string;
};
function FileFoundMarkdownViewer({ filename }: FileFoundMarkdownViewerProps) {
  const fileDetails = useRecoilValue(dropboxFileContentsState(filename));
  const editFile = editedFileHelper.useGet(filename);
  if (!fileDetails) {
    return <div>File not found</div>;
  } else {
    return <Markdown text={editFile?.contents ?? fileDetails} />;
  }
}
