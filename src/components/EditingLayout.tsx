import React from "react";
import { useSetRecoilState } from "recoil";

import { cssConstants } from "../css-constants";
import {
  dropboxAccessTokenState,
  dropboxRefreshTokenState,
} from "../data-model/dropbox-auth";

import styles from "./EditingLayout.module.css";
import { Editor } from "./editing/Editor";
import { FileList } from "./editing/FileList";
import { scrollToFirstPane } from "./editing/utils";
import { MarkdownViewer } from "./viewing/MarkdownViewer";

export function EditingLayout() {
  useScrollToFirst();
  const containerRef = React.useRef<HTMLElement | null>(null);
  return (
    <section className={styles.container} ref={containerRef}>
      <nav className={styles.nav}>
        <h2>Markdown Notes App</h2>
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

type ScrollMaskProps = {
  containerRef: React.MutableRefObject<HTMLElement | null>;
};
function ScrollMask({ containerRef }: ScrollMaskProps) {
  const [opacity, setOpacity] = React.useState<number | null>(null);
  React.useEffect(() => {
    let animationId = 0;
    const container = containerRef.current;
    if (!container) return;
    const func = () => {
      window.cancelAnimationFrame(animationId);
      animationId = window.requestAnimationFrame(() => {
        const navWidth = cssConstants.navWidth;
        if (container.scrollLeft < navWidth) {
          setOpacity(((navWidth - container.scrollLeft) / navWidth) * 0.5);
        } else {
          setOpacity(null);
        }
      });
    };
    container.addEventListener("scroll", func, { passive: true });
    return () => {
      container.removeEventListener("scroll", func);
    };
  }, [containerRef]);
  const onClickHandler = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      behavior: "smooth",
      left: cssConstants.navWidth,
    });
  }, [containerRef]);
  if (opacity === null) {
    return null;
  } else {
    return (
      <div
        className={styles.scrollMask}
        onClick={onClickHandler}
        style={{ opacity }}
      />
    );
  }
}
function useScrollToFirst() {
  React.useEffect(() => {
    scrollToFirstPane();
  }, []);
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
