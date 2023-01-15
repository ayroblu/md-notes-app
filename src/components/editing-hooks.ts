import React from "react";

import { scrollToFirstPane } from "./EditingLayout";

export function useObjectAppearObserver({
  onAppear,
  watchingItemRef,
}: {
  watchingItemRef: React.MutableRefObject<HTMLDivElement | null>;
  onAppear: (isEnter: boolean) => void;
}) {
  React.useEffect(() => {
    const watchingItem = watchingItemRef.current;
    if (!watchingItem) return;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0.01],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        console.log(entry);
        onAppear(entry.isIntersecting);
      }
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(watchingItem);
    return () => {
      observer.unobserve(watchingItem);
    };
  }, [onAppear, watchingItemRef]);
}
export function useParallax() {
  const [isParallax, setIsParallax] = React.useState(false);
  const watchingItemRef = React.useRef<HTMLDivElement | null>(null);
  const onAppear = React.useCallback((isVisible: boolean) => {
    setIsParallax(isVisible);
  }, []);
  useObjectAppearObserver({ watchingItemRef, onAppear });
  return {
    watchingItemRef,
    isParallax,
  };
}

export function useAnimateScroll({
  childRef,
  containerRef,
}: {
  childRef: React.MutableRefObject<HTMLElement | null>;
  containerRef: React.MutableRefObject<HTMLElement | null>;
}) {
  const [isParallax, setIsParallax] = React.useState(false);
  React.useEffect(() => {
    const container = containerRef.current;
    const child = childRef.current;
    if (!container || !child) return;

    let isNormal = true;
    // const containerRect = container.getBoundingClientRect();
    // const childRect = child.getBoundingClientRect();
    // const childLeft = childRect.left - containerRect.left;
    const childLeft = child.offsetLeft + container.scrollLeft;
    const childWidth = child.getBoundingClientRect().width;
    let animationId = 0;
    const func = () => {
      if (isNormal && container.scrollLeft > childLeft) {
        setIsParallax(true);
        isNormal = false;
      } else if (!isNormal && container.scrollLeft <= childLeft) {
        setIsParallax(false);
        isNormal = true;
      }
      window.cancelAnimationFrame(animationId);
      animationId = window.requestAnimationFrame(() => {
        if (!isNormal) {
          const val = ((container.scrollLeft - childLeft) / childWidth) * 50;
          child.style.transform = `translateX(${-val}px)`;
          const blurVal = val / 10;
          child.style.filter = `blur(${blurVal}px)`;
        } else {
          child.style.transform = "";
        }
      });
    };
    container.addEventListener("scroll", func, { passive: true });
    return () => {
      container.removeEventListener("scroll", func);
    };
  }, [childRef, containerRef]);
  return { isParallax };
}
// function useAnimateScroll({
//   childRef,
//   containerRef,
//   relativeRef,
// }: {
//   childRef: React.MutableRefObject<HTMLElement | null>;
//   containerRef: React.MutableRefObject<HTMLElement | null>;
//   relativeRef: React.MutableRefObject<HTMLElement | null>;
// }) {
//   React.useEffect(() => {
//     const container = containerRef.current;
//     const child = childRef.current;
//     const relative = relativeRef.current;
//     if (!container || !child || !relative) return;
//     let animationId = 0;
//     const func = () => {
//       window.cancelAnimationFrame(animationId);
//       animationId = window.requestAnimationFrame(() => {
//         const { left } = relative.getBoundingClientRect();
//         if (left < 0) {
//           child.style.transform = `translateX(${-left}px)`;
//         } else {
//           child.style.transform = "";
//         }
//       });
//     };
//     container.addEventListener("scroll", func, { passive: true });
//     return () => {
//       container.removeEventListener("scroll", func);
//     };
//   }, [childRef, containerRef, relativeRef]);
// }

export function useScrollToFirst() {
  React.useEffect(() => {
    scrollToFirstPane();
  }, []);
}
export function useScrollToFirstOnResize(
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
