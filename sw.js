// Service worker de la versión sin internet: guarda la página para que abra aunque no haya conexión.
const CACHE = "polo-offline-v1";
const ARCHIVOS = ["sin-internet.html", "config.js", "manifest.json", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(ARCHIVOS.map((a) => c.add(a).catch(() => {})))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Con internet se usa la versión nueva (y se actualiza la copia); sin internet, la copia guardada
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const nombre = url.pathname.split("/").pop() || "";
  if (!ARCHIVOS.includes(nombre)) return;
  e.respondWith(
    fetch(req)
      .then((r) => {
        const copia = r.clone();
        caches.open(CACHE).then((c) => c.put(nombre, copia));
        return r;
      })
      .catch(() => caches.match(nombre, { ignoreSearch: true }))
  );
});
