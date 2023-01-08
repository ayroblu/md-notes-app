import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  server: {
    host: true,
  },
  plugins: [
    react(),
    // https://web.dev/add-manifest/
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Markdown Notes App",
        short_name: "Md Notes App",
        theme_color: "#323232",
        background_color: "#323232",
        icons: [
          {
            src: "/favicons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: { navigateFallback: null },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});