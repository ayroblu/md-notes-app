import type { TocEntry } from "@stefanprobst/rehype-extract-toc";
import React from "react";
import { useRecoilValue } from "recoil";

import { dropboxFileContentsState } from "@/data-model/dropbox";
import { activeFilenameState, editedFileHelper } from "@/data-model/main";
import { markdownHeadingsState } from "@/data-model/markdown";

import styles from "./TableOfContentsNav.module.css";

export function TableOfContentsNav() {
  const filename = useRecoilValue(activeFilenameState);
  if (!filename) {
    return <div>Select a file</div>;
  } else {
    return (
      <React.Suspense>
        <FileFoundTableOfContentsNav filename={filename} />
      </React.Suspense>
    );
  }
}
type FileFoundTableOfContentsNavProps = {
  filename: string;
};
function FileFoundTableOfContentsNav({
  filename,
}: FileFoundTableOfContentsNavProps) {
  const fileDetails = useRecoilValue(dropboxFileContentsState(filename));
  const editFile = editedFileHelper.useGet(filename);
  if (!fileDetails) {
    return <div>File not found</div>;
  } else {
    return <TableOfContents text={editFile?.contents ?? fileDetails} />;
  }
}

function TableOfContents({ text }: { text: string }) {
  const headings = useRecoilValue(markdownHeadingsState(text));
  return <HeadingList toc={headings} />;
}
function HeadingList({ toc }: { toc: TocEntry[] }): JSX.Element {
  const headerElements = toc.map(({ children, id, value }, i) => (
    <li className={styles.headingItem} key={id ?? `h-index-${i}`}>
      <a className={styles.link} href={id ? `#${id}` : undefined}>
        {value}
      </a>
      {children ? <HeadingList toc={children} /> : null}
    </li>
  ));
  return <ul className={styles.headings}>{headerElements}</ul>;
}
