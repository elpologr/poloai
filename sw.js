// Service worker de Polo AI.
// 1) Guarda la versión «Sin internet» para que abra aunque no haya conexión.
// 2) Si abres la app (index.html) sin internet, o con una conexión tan mala que no responde,
//    muestra automáticamente la versión «Sin internet» en lugar de la pantalla de error del navegador.
const CACHE = "polo-offline-v3";
const PAGINA_OFFLINE = "sin-internet.html";
// Imprescindibles: si no se pueden guardar, la instalación del service worker se reintenta después
const CRITICOS = [PAGINA_OFFLINE, "config.js", "manifest.json", "icon.svg"];
const OPCIONALES = ["manifest-principal.json", "icon-app.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
const ARCHIVOS = CRITICOS.concat(OPCIONALES);
const ESPERA_RED = 7000; // ms que se espera a la red antes de pasar a la versión sin internet

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await Promise.all(CRITICOS.map((a) => c.add(new Request(a, { cache: "reload" }))));
      await Promise.all(OPCIONALES.map((a) => c.add(new Request(a, { cache: "reload" })).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Navegaciones (abrir la app o una página): con internet, la página normal; sin internet o sin respuesta a tiempo, la versión sin internet
async function navegar(req) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_RED);
  try {
    const r = await fetch(req, { signal: control.signal });
    clearTimeout(reloj);
    if (r.ok && new URL(req.url).pathname.split("/").pop() === PAGINA_OFFLINE) {
      const copia = r.clone();
      caches.open(CACHE).then((c) => c.put(PAGINA_OFFLINE, copia));
    }
    return r;
  } catch (err) {
    clearTimeout(reloj);
    const guardada = await caches.match(PAGINA_OFFLINE, { ignoreSearch: true });
    return guardada || Response.error();
  }
}

// Archivos de la versión sin internet: con internet se usa la versión nueva (y se actualiza la copia); sin internet, la copia guardada
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(navegar(req));
    return;
  }
  const nombre = url.pathname.split("/").pop() || "";
  if (!ARCHIVOS.includes(nombre)) return;
  e.respondWith(
    fetch(req)
      .then((r) => {
        if (r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then((c) => c.put(nombre, copia));
        }
        return r;
      })
      .catch(() => caches.match(nombre, { ignoreSearch: true }))
  );
});
