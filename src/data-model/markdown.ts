import type { Toc } from "@stefanprobst/rehype-extract-toc";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import { createElement, Fragment } from "react";
import { selectorFamily } from "recoil";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { CodeWithSyntax } from "@/components/viewing/Code";

import { allowedLanguages } from "./allowed-languages";

const preprocessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [
        ...(defaultSchema.attributes?.["code"] || []),
        // List of all allowed languages:
        ["className", ...allowedLanguages],
      ],
    },
  })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "append" });
const reactProcessor = preprocessor.use(rehypeReact, {
  createElement,
  Fragment,
  components: {
    code: CodeWithSyntax,
  },
} as const);
const tocProcessor = preprocessor.use(rehypeExtractToc);

export const markdownReactState = selectorFamily<React.ReactElement, string>({
  key: "markdownState",
  get:
    (text) =>
    async ({}) => {
      const { result } = reactProcessor.processSync(text);
      // const result = await markdownToReactNodes(text);
      return result;
    },
});

export const markdownHeadingsState = selectorFamily<Toc, string>({
  key: "markdownState",
  get:
    (text) =>
    async ({}) => {
      const file = tocProcessor.processSync(text);
      return file.data.toc || [];
    },
});
