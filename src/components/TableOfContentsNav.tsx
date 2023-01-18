import type { Root, Heading, PhrasingContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import React, { createElement, Fragment } from "react";
import { useRecoilValue } from "recoil";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { dropboxFileContentsState } from "@/data-model/dropbox";
import { activeFilenameState, editedFileHelper } from "@/data-model/main";
import { exhaustiveCheck, isNonNullable } from "@/utils/main";

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
//exported for warnings
export function TableOfContentsOld({ text }: { text: string }) {
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

function TableOfContents({ text }: { text: string }) {
  const headings = getHeaders(text);
  console.log(headings);
  const headerElements = headings.map((heading, i) => {
    const headingText = renderChildren(heading.children);
    const headingSlug = slugify(headingText.filter(isNonNullable).join("-"));
    return (
      <li className={classForDepth[heading.depth]} key={i}>
        <a className={styles.link} href={`#${headingSlug}`}>
          {headingText}
        </a>
      </li>
    );
  });
  return <ul className={styles.headings}>{headerElements}</ul>;
}
export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

const classForDepth = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
  6: styles.h6,
} as const;

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
function getHeaders(text: string): Heading[] {
  const tree: Root = fromMarkdown(text);
  const headings: Heading[] = [];
  visit<Root, Heading["type"]>(tree, "heading", (node, __index, _parent) => {
    headings.push(node);
  });

  return headings;
}
function renderChildren(children: PhrasingContent[]): string[] {
  return children.map((child) => renderChild(child));
}
function renderChild(child: PhrasingContent): string {
  switch (child.type) {
    case "text":
      return child.value;
    case "emphasis":
    case "strong":
      return renderChildren(child.children).filter(isNonNullable).join("");
    case "link":
    case "html":
    // maybe could support up to here
    case "linkReference":
    case "delete":
    case "break":
    case "image":
    case "footnote":
    case "inlineCode":
    case "imageReference":
    case "footnoteReference":
      return "";
    default:
      exhaustiveCheck(child);
      return "";
  }
}
