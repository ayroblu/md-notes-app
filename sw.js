const r=`sw-precache-${self.registration.scope}`,p=`sw-runtimecache-${self.registration.scope}`,l=new Set,o={[self.registration.scope]:`${self.registration.scope}index.html`},w=[`${self.registration.scope}favicons`,`${self.registration.scope}assets`],u=[{"revision":null,"url":"assets/index-1dd69468.js"},{"revision":null,"url":"assets/index-7b223323.css"},{"revision":null,"url":"assets/Markdown-5ffa92be.js"},{"revision":null,"url":"assets/Markdown-8973ebc1.css"},{"revision":null,"url":"assets/SyntaxHighlighter-238db0a4.js"},{"revision":null,"url":"assets/SyntaxHighlighter-e8a0e38f.css"},{"revision":null,"url":"assets/vim-b27d49a7.js"},{"revision":null,"url":"assets/VimEditor-8268fd74.js"},{"revision":null,"url":"assets/VimEditor-f83ed094.css"},{"revision":"6ce49c905b53458b41ed28ac77aec867","url":"index.html"},{"revision":"ddfd4d18a7fe3a71da7d9f9d2a2d7eaf","url":"favicons/android-chrome-192x192.png"},{"revision":"aba35c7688ad433ace60c7e0a7c9de1d","url":"favicons/android-chrome-512x512.png"},{"revision":"a767b8463fe60a9633503ecacd57811c","url":"manifest.webmanifest"}]||[];function m(e){e.waitUntil(g())}async function g(){const e=f(u);R(e);const t=await caches.open(r),a=await t.keys(),s=new Set(a.map(({url:n})=>n)),c=e.filter(n=>!s.has(n));for(const n of c){const d=new URL(n);await t.add(d)}}function R(e){for(const t of e){const a=new URL(t),s=`${a.origin}${a.pathname}`;l.add(s)}}function q(e){e.waitUntil(U())}async function U(){const e=new Set(f(u)),t=await caches.open(r),s=(await t.keys()).filter(c=>!e.has(c.url));await Promise.all(s.map(c=>t.delete(c)))}function P(e){const t=new URL(e.request.url),a=`${t.origin}${t.pathname}`;l.has(a)?e.respondWith(h(e)):o[a]?e.respondWith(h(e,o[a])):w.some(s=>a.startsWith(s))&&e.respondWith(y(e))}async function h(e,t=e.request.url){const s=await(await caches.open(r)).match(t,{ignoreSearch:!0});if(s)return i(s);const c=await fetch(e.request.clone());return i(c)}function i(e){const t=new Headers(e.headers);return t.set("Cross-Origin-Embedder-Policy","require-corp"),t.set("Cross-Origin-Opener-Policy","same-origin"),new Response(e.body,{headers:t,status:e.status,statusText:e.statusText})}async function y(e){const t=await caches.open(p),a=await t.match(e.request,{ignoreSearch:!0});if(a)return a;const s=await fetch(e.request);return t.put(e.request,s.clone()),i(s)}function f(e){return e.map(({revision:s,url:c})=>{const n=new URL(self.registration.scope+c);return s&&n.searchParams.append("__WB_REVISION__",s),n.href})}self.addEventListener("fetch",P);self.addEventListener("install",m);self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));self.addEventListener("activate",q);
