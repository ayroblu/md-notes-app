import React from "react";
import type { CodeProps } from "react-markdown/lib/ast-to-react";

const SyntaxHighlighter = React.lazy(() => import("./SyntaxHighlighter"));

export const Code: React.FC<CodeProps> = ({
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

export const CodeWithSyntax: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ children, className, ...props }) => {
  const match = /language-(?<lang>\w+)/.exec(className || "");
  const language = match?.groups?.["lang"];
  return language ? (
    <React.Suspense>
      <SyntaxHighlighter
        children={children as React.ReactNode & React.ReactNode[]}
        language={language}
        {...props}
      />
    </React.Suspense>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
