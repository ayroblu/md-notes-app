import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { cssConstants } from "@/css-constants";
import {
  dropboxAccessTokenState,
  dropboxRefreshTokenState,
} from "@/data-model/dropbox-auth";
import { activeFilenameState } from "@/data-model/main";
import { cn } from "@/utils/main";

import styles from "./EditingLayout.module.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { TableOfContentsNav } from "./TableOfContentsNav";
import { Editor } from "./editing/Editor";
import { FileList } from "./editing/FileList";
import { ScrollMask } from "./editing/ScrollMask";
import { scrollToClass } from "./editing/utils";
import { MarkdownViewer } from "./viewing/MarkdownViewer";

export function EditingLayout() {
  useScrollToFirst();
  const containerRef = React.useRef<HTMLElement | null>(null);
  useScrollToFirstOnResize(containerRef);
  const filename = useRecoilValue(activeFilenameState);
  return (
    <section className={styles.container} ref={containerRef}>
      <nav className={styles.nav}>
        <h3>Markdown Notes App</h3>
        <ErrorBoundary>
          <FileList />
        </ErrorBoundary>
        <LogoutButton />
      </nav>
      <div className={styles.pane}>
        <ScrollMask
          containerRef={containerRef}
          direction="left"
          distance={cssConstants.navWidth}
        />
        <ErrorBoundary key={filename}>
          <Editor />
        </ErrorBoundary>
      </div>
      <div className={cn(styles.pane, styles.viewer)}>
        <ScrollMask
          containerRef={containerRef}
          direction="right"
          distance={cssConstants.tocWidth}
        />
        <ErrorBoundary key={filename}>
          <MarkdownViewer />
        </ErrorBoundary>
      </div>
      <div className={styles.tableOfContents}>
        <ErrorBoundary key={filename}>
          <TableOfContentsNav />
        </ErrorBoundary>
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
      if (container.scrollLeft < 100) {
        scrollToFirstPane();
      }
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
