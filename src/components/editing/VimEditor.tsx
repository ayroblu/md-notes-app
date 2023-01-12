import React from "react";
import { Vim } from "react-vim-wasm";
import vimWorkletUrl from "vim-wasm/vim.js?url";

import styles from "./VimEditor.module.css";

type Props = {
  filename: string;
  contents: string;
};
export default function VimEditor({ contents, filename }: Props) {
  const dirs = React.useMemo(() => ["/work"], []);
  filename = basename(filename);
  console.log(filename);
  const filepath = `/work/${filename}`;
  const files = React.useMemo(
    () => ({
      [filepath]: contents,
      "/home/web_user/.vim/vimrc": vimrc,
    }),
    [contents, filepath],
  );
  const cmdArgs = React.useMemo(() => [filepath], [filepath]);
  return (
    <div className={styles.container}>
      <Vim
        className={styles.canvas}
        cmdArgs={cmdArgs}
        dirs={dirs}
        files={files}
        onError={console.error}
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
`.trim();

function basename(input: string): string {
  return input.slice(input.lastIndexOf("/") + 1);
}
