import { cssConstants } from "@/css-constants";
import { option } from "@/utils/option";

export function scrollToClass(
  className: string,
  options?: Parameters<Element["scrollIntoView"]>[0],
) {
  const isSmall = window.matchMedia(cssConstants.mobileBreakpoint).matches;
  if (isSmall) {
    option(document.querySelector(`.${className}`)).map((el) => {
      el.scrollIntoView(options);
    });
  }
}
