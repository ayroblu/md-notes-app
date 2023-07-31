import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import React from "react";

import styles from "./MonacoEditor.module.css";

type Props = {
  filename: string;
  initialContents: string;
  onEdit: (contents: string) => void;
};
export function MonacoEditor({ filename, initialContents, onEdit }: Props) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const wordWrap = true;
  const [actuallyInitialContents] = React.useState(initialContents);
  React.useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }
    const model = monaco.editor.createModel(
      actuallyInitialContents,
      undefined, // language
      monaco.Uri.file(filename), // uri
    );

    // monaco.editor.create(div, {
    //   value: "function hello() {\n\talert('Hello world!');\n}",
    //   language: "javascript",
    // });
    const safeAreaTopStr = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--sat");
    const safeAreaBottomStr = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--sab");
    const safeAreaTopUnsafe = parseInt(safeAreaTopStr.slice(0, -2), 10);
    const safeAreaBottomUnsafe = parseInt(safeAreaBottomStr.slice(0, -2), 10);
    const safeAreaTop = isNaN(safeAreaTopUnsafe) ? 0 : safeAreaTopUnsafe;
    const safeAreaBottom = isNaN(safeAreaBottomUnsafe)
      ? 0
      : safeAreaBottomUnsafe;
    const editor = monaco.editor.create(div, {
      model,
      // value: "",
      // language: "markdown",
      theme: "vs-dark", // vs-light by default
      automaticLayout: true, // false by default, autoresizes
      fontSize: 16,
      scrollBeyondLastLine: false,
      wordWrap: wordWrap ? "on" : "off",
      autoClosingBrackets: "never",
      tabSize: 2,
      overviewRulerLanes: 0,
      minimap: {
        enabled: false,
      },
      scrollbar: {
        vertical: "hidden",
        alwaysConsumeMouseWheel: false,
        // Waiting for: https://github.com/microsoft/monaco-editor/issues/4108
      },
      padding: { top: safeAreaTop, bottom: safeAreaBottom },
    });
    const throttledOnEdit = throttle(() => {
      onEdit(model.getValue());
    }, 3000);
    model.onDidChangeContent(() => {
      throttledOnEdit();
    });
    return () => {
      throttledOnEdit.dispose();
      editor.dispose();
      model.dispose();
    };
  }, [actuallyInitialContents, filename, onEdit, wordWrap]);

  return <div className={styles.editor} ref={divRef} />;
}

function throttle<F extends () => void>(
  f: F,
  delayMs: number,
): (() => void) & { dispose: () => void } {
  let timeout: number | undefined;
  const result = () => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => f(), delayMs);
  };
  result.dispose = () => {
    clearTimeout(timeout);
  };
  return result;
}

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export default MonacoEditor;
