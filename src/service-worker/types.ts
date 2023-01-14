/// <reference lib="webworker" />
export type {};
// declare const self: ServiceWorkerGlobalScope;

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST?: Array<PrecacheEntry | string>;
  }
}
interface PrecacheEntry {
  integrity?: string;
  url: string;
  revision?: string | null;
}
