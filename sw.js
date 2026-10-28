// Service worker de Polo AI.
// 1) La app completa (index.html, app.js, styles.css...) se guarda en el dispositivo y SIEMPRE se abre desde esa copia,
//    al instante, sin esperar a la red (antes se esperaba hasta 4 s por cada archivo cuando la señal era mala).
// 2) Las actualizaciones se revisan en segundo plano (la página lo pide unos segundos después de abrir). Si hay una versión
//    nueva, se guarda COMPLETA de una sola vez (nunca a medias) y la página avisa «Hay una versión nueva» para recargar.
// 3) «sin-internet.html» queda solo como último recurso (si nunca se abrió la app con internet en este dispositivo).
const CACHE = "polo-app-v6";
const PAGINA_OFFLINE = "sin-internet.html";
const LIMITE_RED = 15000; // ms máximos por archivo al revisar actualizaciones en segundo plano

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

// Copia guardada primero (instantáneo). Solo si no hay copia (primera vez) se usa la red.
async function responder(e, clave) {
  const req = e.request;
  const llave = BASE + clave;
  const c = await caches.open(CACHE);
  const guardada = await c.match(llave);
  if (guardada) return guardada;
  try {
    const r = await fetch(req.url, { cache: "no-cache" });
    if (r.ok) await c.put(llave, r.clone());
    return r;
  } catch (err) {
    if (req.mode === "navigate") {
      const offline = await c.match(BASE + PAGINA_OFFLINE);
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

// ---------- Revisar si hay versión nueva (en segundo plano) ----------
async function mismoContenido(a, b) {
  const [x, y] = await Promise.all([a.clone().arrayBuffer(), b.clone().arrayBuffer()]);
  if (x.byteLength !== y.byteLength) return false;
  const u = new Uint8Array(x);
  const v = new Uint8Array(y);
  for (let i = 0; i < u.length; i++) if (u[i] !== v[i]) return false;
  return true;
}

async function pedirConLimite(url) {
  const ctl = new AbortController();
  const reloj = setTimeout(() => ctl.abort(), LIMITE_RED);
  try {
    return await fetch(url, { cache: "no-cache", signal: ctl.signal });
  } finally {
    clearTimeout(reloj);
  }
}

let revisando = null;
let ultimaRevision = 0;
function revisarActualizacion() {
  if (revisando) return revisando;
  if (Date.now() - ultimaRevision < 120000) return Promise.resolve();
  revisando = (async () => {
    try {
      const c = await caches.open(CACHE);
      const nuevos = [];
      let cambio = false;
      for (const a of ARCHIVOS) {
        const llave = BASE + a;
        let r;
        try { r = await pedirConLimite(llave); } catch (err) { return; } // sin red o muy lenta: no se cambia nada
        if (!r.ok) {
          if (CRITICOS.includes(a)) return; // si falta un archivo importante no se actualiza nada (para no dejar la app a medias)
          continue;
        }
        const vieja = await c.match(llave);
        if (!vieja || !(await mismoContenido(r, vieja))) cambio = true;
        nuevos.push([llave, r]);
      }
      if (!cambio) return;
      // Se guardan todos juntos: la app nunca queda mezclada entre versión vieja y nueva
      await Promise.all(nuevos.map(([k, r]) => c.put(k, r)));
      const ventanas = await self.clients.matchAll({ type: "window" });
      ventanas.forEach((v) => v.postMessage({ tipo: "polo-nueva-version" }));
    } catch (err) {
      /* se vuelve a intentar la próxima vez */
    } finally {
      ultimaRevision = Date.now();
      revisando = null;
    }
  })();
  return revisando;
}

self.addEventListener("message", (e) => {
  if (e.data && e.data.tipo === "revisar") e.waitUntil(revisarActualizacion());
});

// Al tocar un aviso se abre (o se enfoca) la app y se lleva a su destino: «diario» (nota nueva de hoy) o «tareas»
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const destino = (e.notification.data && e.notification.data.destino) || "";
  const url = BASE + "index.html" + (destino ? "?abrir=" + destino : "");
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ("focus" in c) {
          const avisar = () => { try { c.postMessage({ tipo: "polo-abrir", destino }); } catch (err) {} };
          return c.focus().then(avisar, avisar);
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
