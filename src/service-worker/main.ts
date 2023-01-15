/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
import type { PrecacheEntry } from "./types";

const cacheName = `main-cache-${self.registration.scope}`;

export function cleanupStaleAssets(event: ExtendableEvent) {
  event.waitUntil(handleRemoveStaleAssets());
}
export function precacheManifest(event: ExtendableEvent) {
  event.waitUntil(handlePrecacheManifest());
}

async function handlePrecacheManifest() {
  const workboxManifest = self.__WB_MANIFEST || [];
  const cacheablePaths = getCacheablePaths(workboxManifest);
  const cache = await caches.open(cacheName);
  const cachedRequests = await cache.keys();
  const cachedUrls = new Set(cachedRequests.map(({ url }) => url));
  const newPaths = cacheablePaths.filter((url) => !cachedUrls.has(url));

  for (const path of newPaths) {
    const reqUrl = new URL(path);
    await cache.add(reqUrl);
  }
}

async function handleRemoveStaleAssets() {
  const workboxManifest = self.__WB_MANIFEST || [];
  const cacheablePathsSet = new Set(getCacheablePaths(workboxManifest));
  const cache = await caches.open(cacheName);
  const cachedRequests = await cache.keys();
  const staleRequests = cachedRequests.filter(
    (req) => !cacheablePathsSet.has(req.url),
  );
  await Promise.all(staleRequests.map((req) => cache.delete(req)));
}

function getCacheablePaths(
  workboxManifest: (PrecacheEntry | string)[],
): string[] {
  const manifestEntries = workboxManifest as PrecacheEntry[];
  const cacheableUrls = manifestEntries.map(({ revision, url }) => {
    const reqUrl = new URL(url);
    if (revision) {
      reqUrl.searchParams.append("__WB_REVISION__", revision);
    }
    return reqUrl.href;
  });
  return cacheableUrls;
}

export function proxyFetch(event: FetchEvent) {
  event.waitUntil(handleFetch(event));
}
async function handleFetch(event: FetchEvent) {
  const cache = await caches.open(cacheName);
  const match = await cache.match(event.request, { ignoreSearch: true });
  if (match) {
    match.headers.append("Cross-Origin-Opener-Policy", "same-origin");
    match.headers.append("Cross-Origin-Embedder-Policy", "require-corp");
    event.respondWith(match);
  }
}
