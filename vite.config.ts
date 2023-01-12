import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

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
      workbox: {
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              ["document", "iframe", "worker"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              plugins: [getHeadersPlugin()],
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
function getHeadersPlugin() {
  return {
    handlerWillRespond: async ({ response }) => {
      const headers = new Headers(response.headers);
      headers.set("Cross-Origin-Embedder-Policy", "require-corp");
      headers.set("Cross-Origin-Opener-Policy", "same-origin");

      return new Response(response.body, {
        headers,
        status: response.status,
        statusText: response.statusText,
      });
    },
  };
}
