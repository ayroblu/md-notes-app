import React from "react";
import ReactMarkdown from "react-markdown";
import type { CodeProps } from "react-markdown/lib/ast-to-react";
import remarkGfm from "remark-gfm";

import { cn } from "@/utils/main";

import styles from "./Markdown.module.css";

const SyntaxHighlighter = React.lazy(() => import("./SyntaxHighlighter"));

export const Markdown: React.FC<{ text: string; className?: string }> =
  React.memo(({ className, text }) => (
    <ReactMarkdown
      children={text}
      className={cn(styles.markdown, className)}
      components={{
        code: Code,
      }}
      remarkPlugins={[remarkGfm]}
    />
  ));

const Code: React.FC<CodeProps> = ({
  children,
  className,
  inline,
  node,
  ...props
}) => {
  const match = /language-(?<lang>\w+)/.exec(className || "");
  const language = match?.groups?.["lang"];
  return !inline && language ? (
    <React.Suspense>
      <SyntaxHighlighter children={children} language={language} {...props} />
    </React.Suspense>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
export default Markdown;
