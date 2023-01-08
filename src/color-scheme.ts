import styles from "./index.module.css";

// Purely for controlling iOS PWA status bar color
// https://stackoverflow.com/questions/57527418/how-can-i-refresh-the-apple-mobile-web-app-status-bar-style-meta-tag
function onColorSchemeChange(isDark: boolean) {
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  if (isDark) {
    metaThemeColor?.setAttribute("content", styles.backgroundColorDark);
  } else {
    metaThemeColor?.setAttribute("content", styles.backgroundColorLight);
  }
}

const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
darkModePreference.addEventListener("change", (e) =>
  onColorSchemeChange(e.matches),
);
onColorSchemeChange(darkModePreference.matches);
