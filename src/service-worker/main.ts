/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

export function cleanupStaleAssets(event: ExtendableEvent) {
  event.waitUntil(Promise.resolve(event));
}
export function precacheManifest(event: ExtendableEvent) {
  event.waitUntil(handlePrecacheManifest());
}
async function handlePrecacheManifest() {
  console.log(self.__WB_MANIFEST || []);
  // precacheAndRoute(self.__WB_MANIFEST || []);
}

interface ServiceWorkerGlobalScope {
  __WB_MANIFEST?: Array<string>;
}
