const r = `sw-precache-${self.registration.scope}`, p = `sw-runtimecache-${self.registration.scope}`, l = /* @__PURE__ */ new Set(), o = {
  [self.registration.scope]: `${self.registration.scope}index.html`
}, w = [
  `${self.registration.scope}favicons`,
  `${self.registration.scope}assets`
], u = [{"revision":null,"url":"assets/abap-7ad4f8f0.js"},{"revision":null,"url":"assets/apex-87f66fc2.js"},{"revision":null,"url":"assets/azcli-67c34a04.js"},{"revision":null,"url":"assets/bat-b8f4738b.js"},{"revision":null,"url":"assets/bicep-b104b38b.js"},{"revision":null,"url":"assets/cameligo-001d1ded.js"},{"revision":null,"url":"assets/clojure-fa9652a1.js"},{"revision":null,"url":"assets/coffee-b69a8315.js"},{"revision":null,"url":"assets/cpp-8053752f.js"},{"revision":null,"url":"assets/csharp-886041a3.js"},{"revision":null,"url":"assets/csp-e846bce6.js"},{"revision":null,"url":"assets/css-50032e5e.js"},{"revision":null,"url":"assets/css.worker-81836681.js"},{"revision":null,"url":"assets/cssMode-b898cf56.js"},{"revision":null,"url":"assets/cypher-6f93a845.js"},{"revision":null,"url":"assets/dart-14284236.js"},{"revision":null,"url":"assets/dockerfile-e9935eb4.js"},{"revision":null,"url":"assets/ecl-9c89f204.js"},{"revision":null,"url":"assets/editor.worker-9916778a.js"},{"revision":null,"url":"assets/elixir-ca8bf661.js"},{"revision":null,"url":"assets/flow9-ac147227.js"},{"revision":null,"url":"assets/freemarker2-447ba7bb.js"},{"revision":null,"url":"assets/fsharp-8eaad024.js"},{"revision":null,"url":"assets/go-05529e2e.js"},{"revision":null,"url":"assets/graphql-8f5b3fdd.js"},{"revision":null,"url":"assets/handlebars-b2c7a663.js"},{"revision":null,"url":"assets/hcl-9e201a51.js"},{"revision":null,"url":"assets/html-b4fb94d2.js"},{"revision":null,"url":"assets/html.worker-172580e7.js"},{"revision":null,"url":"assets/htmlMode-eb9bd781.js"},{"revision":null,"url":"assets/index-6b15e8f0.css"},{"revision":null,"url":"assets/index-e757c411.js"},{"revision":null,"url":"assets/ini-31a5619d.js"},{"revision":null,"url":"assets/java-8c6e1ae8.js"},{"revision":null,"url":"assets/javascript-f19ffd42.js"},{"revision":null,"url":"assets/json.worker-ffeb3056.js"},{"revision":null,"url":"assets/jsonMode-68ddf7e9.js"},{"revision":null,"url":"assets/julia-200d0fc6.js"},{"revision":null,"url":"assets/kotlin-bfa96180.js"},{"revision":null,"url":"assets/less-0b6a8ff1.js"},{"revision":null,"url":"assets/lexon-585e5248.js"},{"revision":null,"url":"assets/liquid-6ef9fa32.js"},{"revision":null,"url":"assets/lua-f6c17885.js"},{"revision":null,"url":"assets/m3-1b6456c5.js"},{"revision":null,"url":"assets/markdown-7bc251f9.js"},{"revision":null,"url":"assets/Markdown-cf1a299a.css"},{"revision":null,"url":"assets/Markdown-fc1ff691.js"},{"revision":null,"url":"assets/mips-2df76781.js"},{"revision":null,"url":"assets/MonacoEditor-f20774fc.css"},{"revision":null,"url":"assets/msdax-8c38e8b4.js"},{"revision":null,"url":"assets/mysql-abbb9ca3.js"},{"revision":null,"url":"assets/objective-c-efbfd08b.js"},{"revision":null,"url":"assets/pascal-08abee72.js"},{"revision":null,"url":"assets/pascaligo-200db0cf.js"},{"revision":null,"url":"assets/perl-079789ee.js"},{"revision":null,"url":"assets/pgsql-efd093d4.js"},{"revision":null,"url":"assets/php-75c530f2.js"},{"revision":null,"url":"assets/pla-a55a2765.js"},{"revision":null,"url":"assets/postiats-6098f37b.js"},{"revision":null,"url":"assets/powerquery-949bb7fe.js"},{"revision":null,"url":"assets/powershell-7e550b21.js"},{"revision":null,"url":"assets/protobuf-25a4d695.js"},{"revision":null,"url":"assets/pug-f8c9f493.js"},{"revision":null,"url":"assets/python-15a93ad7.js"},{"revision":null,"url":"assets/qsharp-c4b94317.js"},{"revision":null,"url":"assets/r-614353db.js"},{"revision":null,"url":"assets/razor-783d2b2f.js"},{"revision":null,"url":"assets/redis-fb089f4d.js"},{"revision":null,"url":"assets/redshift-a620fcb0.js"},{"revision":null,"url":"assets/restructuredtext-7ab09fcf.js"},{"revision":null,"url":"assets/ruby-922be722.js"},{"revision":null,"url":"assets/rust-23e08578.js"},{"revision":null,"url":"assets/sb-ccceec0f.js"},{"revision":null,"url":"assets/scala-0535664d.js"},{"revision":null,"url":"assets/scheme-dba621eb.js"},{"revision":null,"url":"assets/scss-28539a11.js"},{"revision":null,"url":"assets/shell-5b92a834.js"},{"revision":null,"url":"assets/solidity-f63d6049.js"},{"revision":null,"url":"assets/sophia-12e9ad90.js"},{"revision":null,"url":"assets/sparql-dedb74aa.js"},{"revision":null,"url":"assets/sql-975a69d7.js"},{"revision":null,"url":"assets/st-69a83c52.js"},{"revision":null,"url":"assets/swift-e180a143.js"},{"revision":null,"url":"assets/SyntaxHighlighter-cb5f1513.js"},{"revision":null,"url":"assets/SyntaxHighlighter-e8a0e38f.css"},{"revision":null,"url":"assets/systemverilog-c5592fac.js"},{"revision":null,"url":"assets/tcl-996f4ac7.js"},{"revision":null,"url":"assets/tsMode-5f0b2ccf.js"},{"revision":null,"url":"assets/twig-4859b551.js"},{"revision":null,"url":"assets/typescript-dcc0a6f0.js"},{"revision":null,"url":"assets/vb-ad68fa9a.js"},{"revision":null,"url":"assets/vim-b27d49a7.js"},{"revision":null,"url":"assets/VimEditor-0d5bb137.js"},{"revision":null,"url":"assets/VimEditor-3b546c64.css"},{"revision":null,"url":"assets/wgsl-33e72ee3.js"},{"revision":null,"url":"assets/xml-14ffc612.js"},{"revision":null,"url":"assets/yaml-28cb5ca6.js"},{"revision":"67e2b2fee33cb0b2bd29ab8a1c512ccc","url":"index.html"},{"revision":"402b66900e731ca748771b6fc5e7a068","url":"registerSW.js"},{"revision":"ddfd4d18a7fe3a71da7d9f9d2a2d7eaf","url":"favicons/android-chrome-192x192.png"},{"revision":"aba35c7688ad433ace60c7e0a7c9de1d","url":"favicons/android-chrome-512x512.png"},{"revision":"a767b8463fe60a9633503ecacd57811c","url":"manifest.webmanifest"}] || [];
function m(e) {
  e.waitUntil(g());
}
async function g() {
  const e = f(u);
  R(e);
  const t = await caches.open(r), a = await t.keys(), s = new Set(a.map(({ url: n }) => n)), c = e.filter((n) => !s.has(n));
  for (const n of c) {
    const d = new URL(n);
    await t.add(d);
  }
}
function R(e) {
  for (const t of e) {
    const a = new URL(t), s = `${a.origin}${a.pathname}`;
    l.add(s);
  }
}
function q(e) {
  e.waitUntil(U());
}
async function U() {
  const e = new Set(f(u)), t = await caches.open(r), s = (await t.keys()).filter(
    (c) => !e.has(c.url)
  );
  await Promise.all(s.map((c) => t.delete(c)));
}
function P(e) {
  const t = new URL(e.request.url), a = `${t.origin}${t.pathname}`;
  l.has(a) ? e.respondWith(h(e)) : o[a] ? e.respondWith(h(e, o[a])) : w.some((s) => a.startsWith(s)) && e.respondWith(y(e));
}
async function h(e, t = e.request.url) {
  const s = await (await caches.open(r)).match(t, { ignoreSearch: !0 });
  if (s)
    return i(s);
  const c = await fetch(e.request.clone());
  return i(c);
}
function i(e) {
  const t = new Headers(e.headers);
  return t.set("Cross-Origin-Embedder-Policy", "require-corp"), t.set("Cross-Origin-Opener-Policy", "same-origin"), new Response(e.body, {
    headers: t,
    status: e.status,
    statusText: e.statusText
  });
}
async function y(e) {
  const t = await caches.open(p), a = await t.match(e.request, { ignoreSearch: !0 });
  if (a)
    return i(a);
  const s = await fetch(e.request);
  return s.ok && t.put(e.request, s.clone()), i(s);
}
function f(e) {
  return e.map(({ revision: s, url: c }) => {
    const n = new URL(self.registration.scope + c);
    return s && n.searchParams.append("__WB_REVISION__", s), n.href;
  });
}
self.addEventListener("fetch", P);
self.addEventListener("install", m);
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener(
  "activate",
  (e) => e.waitUntil(self.clients.claim())
);
self.addEventListener("activate", q);