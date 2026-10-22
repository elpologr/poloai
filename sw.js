// Service worker de Polo AI.
// 1) Guarda la app completa (index.html, app.js, styles.css...) para que abra SIN internet con la misma pantalla principal.
// 2) Con internet siempre se usa la versión nueva de los archivos (y se actualiza la copia guardada).
//    Si la red no responde en ESPERA_RED ms, se muestra la copia guardada mientras la red sigue intentando en segundo plano.
// 3) «sin-internet.html» queda solo como último recurso (si nunca se abrió la app con internet en este dispositivo).
const CACHE = "polo-app-v3";
const PAGINA_OFFLINE = "sin-internet.html";
const ESPERA_RED = 4000; // ms que se espera a la red antes de usar la copia guardada

// Imprescindibles: si no se pueden guardar, la instalación se reintenta después
const CRITICOS = ["index.html", "styles.css", "app.js", "voz.js", "config.js", PAGINA_OFFLINE];
const OPCIONALES = [
  "firebase.js", "manifest-principal.json", "manifest.json", "icon.svg",
  "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png",
  "imagenes/perfil.webp",
];
const ARCHIVOS = CRITICOS.concat(OPCIONALES);

// Carpeta donde vive la app (en GitHub Pages: https://usuario.github.io/repositorio/)
const BASE = new URL("./", self.registration.scope).href;

// Nombre del archivo dentro de la app («app.js?v=59» -> «app.js»); null si no es de la app
function claveDe(urlTexto) {
  const u = new URL(urlTexto);
  if (u.origin !== location.origin) return null;
  const raiz = new URL(BASE).pathname;
  if (!u.pathname.startsWith(raiz)) return null;
  let ruta = u.pathname.slice(raiz.length);
  if (ruta === "") ruta = "index.html";
  return ARCHIVOS.includes(ruta) ? ruta : null;
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await Promise.all(CRITICOS.map((a) => c.add(new Request(BASE + a, { cache: "reload" }))));
      await Promise.all(OPCIONALES.map((a) => c.add(new Request(BASE + a, { cache: "reload" })).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero (con límite de espera); si no hay red o tarda demasiado, la copia guardada
async function responder(e, clave) {
  const req = e.request;
  const llave = BASE + clave;
  // «no-cache»: siempre se pregunta al servidor si hay versión nueva (si no cambió, responde rápido sin descargar de nuevo)
  const red = fetch(req.url, { cache: "no-cache" }).then(async (r) => {
    if (r.ok) {
      const copia = r.clone();
      const c = await caches.open(CACHE);
      await c.put(llave, copia);
    }
    return r;
  });
  e.waitUntil(red.catch(() => {})); // aunque se muestre la copia, la actualización sigue en segundo plano

  const espera = new Promise((res) => setTimeout(() => res(null), ESPERA_RED));
  const r = await Promise.race([red.catch(() => null), espera]);
  if (r && r.ok) return r;

  const guardada = await caches.match(llave);
  if (guardada) return guardada;
  if (r) return r; // la red respondió con error y no hay copia: se deja ese error
  try {
    return await red; // tardó mucho pero no hay copia: se espera a la red
  } catch (err) {
    if (req.mode === "navigate") {
      const offline = await caches.match(BASE + PAGINA_OFFLINE);
      if (offline) return offline;
    }
    return Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const clave = claveDe(req.url);
  if (clave) {
    e.respondWith(responder(e, clave));
    return;
  }
  // Una página de la app que no está en la lista (o una dirección rara) sin internet: la pantalla principal guardada
  if (req.mode === "navigate" && new URL(req.url).origin === location.origin) {
    e.respondWith(
      fetch(req).catch(async () => (await caches.match(BASE + "index.html")) || (await caches.match(BASE + PAGINA_OFFLINE)) || Response.error())
    );
  }
});

// Al tocar un aviso de alarma se abre (o se enfoca) la app
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) { if ("focus" in c) return c.focus(); }
      return self.clients.openWindow("index.html");
    })
  );
});
