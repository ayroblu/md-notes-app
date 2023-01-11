import React from "react";

import { cssConstants } from "@/css-constants";

import styles from "./ScrollMask.module.css";

type ScrollMaskProps = {
  containerRef: React.MutableRefObject<HTMLElement | null>;
};
export function ScrollMask({ containerRef }: ScrollMaskProps) {
  const [opacity, setOpacity] = React.useState<number | null>(null);

  React.useEffect(() => {
    let animationId = 0;
    const container = containerRef.current;
    if (!container) return;
    const func = () => {
      window.cancelAnimationFrame(animationId);
      animationId = window.requestAnimationFrame(() => {
        const navWidth = cssConstants.navWidth;
        const isSmall = window.matchMedia(
          cssConstants.mobileBreakpoint,
        ).matches;
        if (isSmall && container.scrollLeft < navWidth) {
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

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const navWidth = cssConstants.navWidth;
    const func = () => {
      const isSmall = window.matchMedia(cssConstants.mobileBreakpoint).matches;
      if (isSmall && container.scrollLeft < navWidth) {
        setOpacity(((navWidth - container.scrollLeft) / navWidth) * 0.5);
      } else {
        setOpacity(null);
      }
    };
    window.addEventListener("resize", func);
    return () => {
      window.removeEventListener("resize", func);
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
