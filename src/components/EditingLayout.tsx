import React from "react";
import { useSetRecoilState } from "recoil";

import {
  dropboxAccessTokenState,
  dropboxRefreshTokenState,
} from "@/data-model/dropbox-auth";

import styles from "./EditingLayout.module.css";
import { Editor } from "./editing/Editor";
import { FileList } from "./editing/FileList";
import { ScrollMask } from "./editing/ScrollMask";
import { scrollToClass } from "./editing/utils";
import { MarkdownViewer } from "./viewing/MarkdownViewer";

export function EditingLayout() {
  useScrollToFirst();
  const containerRef = React.useRef<HTMLElement | null>(null);
  useScrollToFirstOnResize(containerRef);
  return (
    <section className={styles.container} ref={containerRef}>
      <nav className={styles.nav}>
        <h3>Markdown Notes App</h3>
        <FileList />
        <LogoutButton />
      </nav>
      <div className={styles.pane}>
        <ScrollMask containerRef={containerRef} />
        <Editor />
      </div>
      <div className={styles.pane}>
        <MarkdownViewer />
      </div>
    </section>
  );
}
function useScrollToFirst() {
  React.useEffect(() => {
    scrollToFirstPane();
  }, []);
}
function useScrollToFirstOnResize(
  containerRef: React.MutableRefObject<HTMLElement | null>,
) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      scrollToFirstPane();
    });

    ro.observe(container);
    return () => {
      ro.unobserve(container);
    };
  }, [containerRef]);
}
export function scrollToFirstPane(
  options?: Parameters<Element["scrollIntoView"]>[0],
) {
  scrollToClass(styles.pane, options);
}

function LogoutButton() {
  const setRefreshToken = useSetRecoilState(dropboxRefreshTokenState);
  const setAccessToken = useSetRecoilState(dropboxAccessTokenState);
  const onLogoutHandler = React.useCallback(() => {
    if (confirm("Are you sure you want to log out?")) {
      setRefreshToken(undefined);
      setAccessToken(undefined);
    }
  }, [setAccessToken, setRefreshToken]);
  return <button onClick={onLogoutHandler}>Logout</button>;
}
