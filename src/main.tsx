import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

import "./index.module.css";
import { routes } from "./routes";

const customBasename = "/md-notes-app";
const router = createBrowserRouter(routes, {
  basename: location.pathname.startsWith(customBasename) ? customBasename : "/",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  if (import.meta.env.MODE === "production") {
    navigator.serviceWorker.register(
      import.meta.env.MODE === "production" ? "./sw.js" : "./dev-sw.js?dev-sw",
      {
        type: import.meta.env.MODE === "production" ? "classic" : "module",
        scope: "./",
      },
    );
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}
// Inline script uses:
// if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('./sw.js', { scope: './' })})}
