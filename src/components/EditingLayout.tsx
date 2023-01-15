import React from "react";
import { useSetRecoilState } from "recoil";

import {
  dropboxAccessTokenState,
  dropboxRefreshTokenState,
} from "@/data-model/dropbox-auth";
import { cn } from "@/utils/main";

import styles from "./EditingLayout.module.css";
import {
  useAnimateScroll,
  useScrollToFirst,
  useScrollToFirstOnResize,
} from "./editing-hooks";
import { Editor } from "./editing/Editor";
import { FileList } from "./editing/FileList";
import { ScrollMask } from "./editing/ScrollMask";
import { scrollToClass } from "./editing/utils";
import { MarkdownViewer } from "./viewing/MarkdownViewer";

export function EditingLayout() {
  useScrollToFirst();
  const containerRef = React.useRef<HTMLElement | null>(null);
  useScrollToFirstOnResize(containerRef);
  // const { isParallax, watchingItemRef } = useParallax();
  const childRef = React.useRef<HTMLDivElement | null>(null);
  const { isParallax } = useAnimateScroll({
    containerRef,
    childRef,
  });
  return (
    <section className={styles.container} ref={containerRef}>
      <nav className={styles.nav}>
        <h3>Markdown Notes App</h3>
        <FileList />
        <LogoutButton />
      </nav>
      <div className={styles.pane}>
        <ScrollMask containerRef={containerRef} />
        <div
          className={cn(
            styles.parallaxContainer,
            isParallax ? styles.parallax : undefined,
          )}
          ref={childRef}
        >
          <Editor />
        </div>
      </div>
      <div className={cn(styles.pane, styles.markdownPane)}>
        <MarkdownViewer />
      </div>
    </section>
  );
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
