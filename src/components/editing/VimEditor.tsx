import React from "react";
import { checkVimWasmIsAvailable, useVim } from "react-vim-wasm";
import vimWorkletUrl from "vim-wasm/vim.js?url";

import styles from "./VimEditor.module.css";

type Props = {
  filename: string;
  initialContents: string;
  onEdit: (contents: string) => void;
};
export default function VimEditor(props: Props) {
  const errMsg = checkVimWasmIsAvailable();
  if (errMsg) return <>{errMsg}</>;
  return <VimEditorMain {...props} />;
}
function VimEditorMain({ filename, initialContents, onEdit }: Props) {
  const dirs = React.useMemo(() => ["/work"], []);
  filename = basename(filename);
  const filepath = `/work/${filename}`;
  const [contents] = React.useState(initialContents);
  const files = React.useMemo(
    () => ({
      [filepath]: contents,
      "/home/web_user/.vim/vimrc": vimrc,
    }),
    [contents, filepath],
  );
  const cmdArgs = React.useMemo(() => [filepath], [filepath]);
  const onFileExport = React.useCallback(
    (fullpath: string, buf: ArrayBuffer) => {
      const enc = new TextDecoder("utf-8");
      const result = enc.decode(buf);
      if (basename(fullpath) !== filename) return;
      onEdit(result);
    },
    [filename, onEdit],
  );
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  useKeydownListener(containerRef);
  const [canvasRef, inputRef, _vim] = useVim({
    cmdArgs,
    dirs,
    files,
    onError: console.error,
    onFileExport,
    onWriteClipboard: navigator.clipboard && navigator.clipboard.writeText,
    readClipboard: navigator.clipboard && navigator.clipboard.readText,
    worker: vimWorkletUrl,
  });

  return (
    <div className={styles.container} ref={containerRef}>
      <input ref={inputRef} />
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
}
const vimrc = `
set guifont=Monaco:h14
colorscheme onedark
set number
set expandtab
set tabstop=2 shiftwidth=2 softtabstop=2
syntax enable
autocmd BufWritePost * :export
imap jj <Esc>l
imap jk <Esc>l
`.trim();

function basename(input: string): string {
  return input.slice(input.lastIndexOf("/") + 1);
}
function useKeydownListener(
  containerRef: React.MutableRefObject<HTMLElement | null>,
) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const func = (event: KeyboardEvent) => {
      if (event.metaKey) {
        event.stopPropagation();
      }
    };
    window.addEventListener("keydown", func, true);
    return () => {
      window.removeEventListener("keydown", func, true);
    };
  }, [containerRef]);
}
