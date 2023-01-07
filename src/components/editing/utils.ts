import { cssConstants } from "../../css-constants";
import { option } from "../../utils/option";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../EditingLayout.module.css";

function scrollToClass(
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
export function scrollToFirstPane(
  options?: Parameters<Element["scrollIntoView"]>[0],
) {
  scrollToClass(styles.pane, options);
}
