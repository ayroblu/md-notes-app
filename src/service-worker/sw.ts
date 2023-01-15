import "./types";
import { precacheManifest, proxyFetch } from "./main";

declare const self: ServiceWorkerGlobalScope;
// import { precacheAndRoute } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";
//
// precacheAndRoute(self.__WB_MANIFEST || []);
//
// // registerRoute(
// //   ({ request }) => request.mode === "navigate",
// //   createHandlerBoundToURL("/index.html"),
// // );
// const handlerCb = async ({ event, params, request, url }) => {
//   const response = await fetch(request);
//   const responseBody = await response.text();
//   return new Response(responseBody, {
//     headers: response.headers,
//   });
// };
// registerRoute(new RegExp("/"), handlerCb);

self.addEventListener("fetch", proxyFetch);

self.addEventListener("install", precacheManifest);
// Skip Waiting makes the new service worker the active service worker
self.addEventListener("install", () => self.skipWaiting());
// claim makes the new requests go to the new service worker
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);
