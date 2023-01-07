import type { CodeProps } from "react-markdown/lib/ast-to-react";
import { Prism } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";

import styles from "./SyntaxHighlighter.module.css";

type Props = Omit<CodeProps, "className" | "inline" | "node"> & {
  language: string;
};
export const SyntaxHighlighter: React.FC<Props> = ({
  children,
  language,
  style, // https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479#issuecomment-1267772279
  ...props
}) => (
  <Prism
    PreTag="div"
    children={String(children).replace(/\n$/, "")}
    codeTagProps={{ className: styles.code }}
    customStyle={{
      padding: "3px 6px",
      margin: "4px 0",
      lineHeight: "inherit",
      fontSize: "0.9em",
      border: "none",
    }}
    language={language}
    style={xonokai}
    wrapLongLines
    {...props}
  />
);
export default SyntaxHighlighter;
