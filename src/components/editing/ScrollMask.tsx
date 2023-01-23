import React from "react";

import { cssConstants } from "@/css-constants";

import styles from "./ScrollMask.module.css";

type ScrollMaskProps = {
  containerRef: React.MutableRefObject<HTMLElement | null>;
  distance: number;
  direction: "left" | "right";
};
function getScrollRight(container: HTMLElement): number {
  return container.scrollWidth - container.clientWidth - container.scrollLeft;
}
export function ScrollMask({
  containerRef,
  direction,
  distance,
}: ScrollMaskProps) {
  const [opacity, setOpacity] = React.useState<number | null>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    let animationId = 0;
    const container = containerRef.current;
    if (!container) return;
    if (!isMobile) return;

    const func = () => {
      window.cancelAnimationFrame(animationId);
      animationId = window.requestAnimationFrame(() => {
        const scrollDistance =
          direction === "left"
            ? container.scrollLeft
            : getScrollRight(container);
        if (scrollDistance < distance) {
          setOpacity((Math.abs(distance - scrollDistance) / distance) * 0.5);
        } else {
          setOpacity(null);
        }
      });
    };
    func();
    container.addEventListener("scroll", func, { passive: true });
    return () => {
      container.removeEventListener("scroll", func);
    };
  }, [containerRef, direction, distance, isMobile]);

  const onClickHandler = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const left =
      direction === "left"
        ? distance
        : container.scrollWidth - container.clientWidth - distance;
    container.scrollTo({
      behavior: "smooth",
      left,
    });
  }, [containerRef, direction, distance]);

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
function useIsMobile() {
  const isSmall = window.matchMedia(cssConstants.mobileBreakpoint).matches;
  const [isMobile, setIsMobile] = React.useState(isSmall);
  React.useEffect(() => {
    const func = () => {
      const isSmall = window.matchMedia(cssConstants.mobileBreakpoint).matches;
      setIsMobile(isSmall);
    };
    window.addEventListener("resize", func);
    return () => {
      window.removeEventListener("resize", func);
    };
  }, []);
  return isMobile;
}
