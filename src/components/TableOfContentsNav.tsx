import React, { createElement, Fragment } from "react";
import { useRecoilValue } from "recoil";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { dropboxFileContentsState } from "@/data-model/dropbox";
import { activeFilenameState, editedFileHelper } from "@/data-model/main";

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
export function TableOfContents({ text }: { text: string }) {
  const [Content, setContent] = React.useState<React.ReactElement>(Loading);
  React.useEffect(() => {
    let isActive = true;
    run(text).then((result) => {
      if (!isActive) return;
      setContent(result);
    });
    return () => {
      isActive = false;
    };
  }, [text]);
  return Content;
}
function Loading() {
  return <>Loading...</>;
}
async function run(text: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeReact, { createElement, Fragment })
    .process(text)
    .then((file) => file.result);
}
