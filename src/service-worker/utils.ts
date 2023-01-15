/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const cacheName = "main-cache-";
export async function runCache() {
  const cache = await caches.open(cacheName);
  const cachedRequests = await cache.keys();
  // const newRequests =
}
