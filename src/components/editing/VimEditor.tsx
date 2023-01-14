import React from "react";
import { Vim } from "react-vim-wasm";
import vimWorkletUrl from "vim-wasm/vim.js?url";

import styles from "./VimEditor.module.css";

type Props = {
  filename: string;
  initialContents: string;
  onEdit: (contents: string) => void;
};
export default function VimEditor({
  filename,
  initialContents,
  onEdit,
}: Props) {
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
      // console.log("file exported:", fullpath, result);
    },
    [filename, onEdit],
  );
  return (
    <div className={styles.container}>
      <Vim
        className={styles.canvas}
        cmdArgs={cmdArgs}
        dirs={dirs}
        files={files}
        onError={console.error}
        onFileExport={onFileExport}
        onWriteClipboard={navigator.clipboard && navigator.clipboard.writeText}
        readClipboard={navigator.clipboard && navigator.clipboard.readText}
        worker={vimWorkletUrl}
      />
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
