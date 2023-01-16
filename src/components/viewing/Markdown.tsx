import React from "react";
import ReactMarkdown from "react-markdown";
import type { CodeProps, HeadingProps } from "react-markdown/lib/ast-to-react";
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
        h2: HeadingRenderer,
        h3: HeadingRenderer,
        h4: HeadingRenderer,
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
type Child = ReturnType<typeof React.Children.toArray>[number];
function flatten(text: string, child: Child): string {
  return typeof child === "string" || typeof child === "number"
    ? text + child
    : "props" in child
    ? React.Children.toArray(child.props.children).reduce(flatten, text)
    : text + child;
}

function HeadingRenderer(props: HeadingProps) {
  var children = React.Children.toArray(props.children);
  var text = children.reduce(flatten, "");
  var slug = text.toLowerCase().replace(/\W/g, "-");
  return React.createElement(`h${props.level}`, { id: slug }, props.children);
}
export default Markdown;
