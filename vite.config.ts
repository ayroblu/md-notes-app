import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const withStatsVis = false;

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  server: {
    host: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    // https://www.npmjs.com/package/html-minifier-terser options
    ViteMinifyPlugin({}),
    // https://web.dev/add-manifest/
    VitePWA({
      // registerType: "autoUpdate",
      manifest: {
        name: "Markdown Notes App",
        short_name: "Md Notes App",
        theme_color: "#323232",
        background_color: "#323232",
        icons: [
          {
            src: "favicons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // workbox: {
      //   navigateFallback: null,
      // },
      filename: "sw.ts",
      srcDir: "src/service-worker",
      strategies: "injectManifest",
      injectRegister: "inline",
      // devOptions: {
      //   enabled: true,
      //   type: "module",
      // },
    }),
    ...(process.env.NODE_ENV === "production" && withStatsVis
      ? [visualizer() as unknown as PluginOption]
      : []),
  ],
});
