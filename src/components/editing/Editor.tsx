import React from "react";
import { useRecoilValue } from "recoil";

import { dropboxFileContentsState } from "../../data-model/dropbox";
import { activeFilenameState } from "../../data-model/main";

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
type FileFoundEditorProps = {
  filename: string;
};
const LazyVimEditor = React.lazy(() => import("./VimEditor"));
function FileFoundEditor({ filename }: FileFoundEditorProps) {
  const fileDetails = useRecoilValue(dropboxFileContentsState(filename));
  if (!fileDetails) {
    return <div>File not found</div>;
  } else {
    // return <pre>{fileDetails}</pre>;
    return <LazyVimEditor />;
  }
}
// <h3>Editor</h3>
// {Array(100)
//   .fill("lorem")
//   .map((t, i) => (
//     <p key={i}>{t}</p>
//   ))}
