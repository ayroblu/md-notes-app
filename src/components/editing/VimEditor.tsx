import React from "react";
import { useVim } from "react-vim-wasm";
import vimWorkletUrl from "vim-wasm/vim.js?url";

import styles from "./VimEditor.module.css";

export default function VimEditor() {
  const [canvasRef, inputRef, _vim] = useVim({
    worker: vimWorkletUrl,
  });
  const [width, setWidth] = React.useState(500);
  const [height, setHeight] = React.useState(500);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setWidth(rect.width);
    setHeight(rect.width);
  }, []);

  // Access to `vim` instance if you want

  // Set refs to render screen and handle key inputs
  return (
    <div className={styles.container} ref={containerRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
      <input className={styles.input} ref={inputRef} />
    </div>
  );
}
