import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

import "./index.module.css";
import { routes } from "./routes";

const router = createHashRouter(routes);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw",
    {
      type: import.meta.env.MODE === "production" ? "classic" : "module",
      scope: "./",
    },
  );
}
// Inline script uses:
// if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('./sw.js', { scope: './' })})}
