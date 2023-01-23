import React from "react";
import ReactMarkdown from "react-markdown";
import { useRecoilValue } from "recoil";
import remarkGfm from "remark-gfm";

import { markdownReactState } from "@/data-model/markdown";
import { cn } from "@/utils/main";

import { Code } from "./Code";
import styles from "./Markdown.module.css";

const isUnified = true;
export const Markdown: React.FC<{ text: string; className?: string }> =
  React.memo(({ className, text }) =>
    isUnified ? (
      <div className={cn(styles.markdown, className)}>
        <MyReactMarkdown text={text} />
      </div>
    ) : (
      <ReactMarkdown
        children={text}
        className={cn(styles.markdown, className)}
        components={{
          code: Code,
        }}
        remarkPlugins={[remarkGfm]}
      />
    ),
  );

export default Markdown;

export function MyReactMarkdown({ text }: { text: string }) {
  const Content = useRecoilValue(markdownReactState(text));
  return Content;
}
