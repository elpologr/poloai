// ---------- Control de versión ----------
// index.html, styles.css y app.js deben ser de la MISMA versión. Si no lo son,
// se muestra un aviso arriba de la página diciendo cuál archivo hay que volver a subir.
const VERSION = "8";

(function revisarArchivos() {
  const IDS_NECESARIOS = [
    "calendario", "cal-mes", "cal-anio", "cal-anterior", "cal-siguiente",
    "cal-hoy", "cal-actualizar", "cal-cuadricula", "cal-estado",
    "dia-popover", "pop-titulo", "pop-cerrar", "pop-secciones",
    "btn-menu-lateral", "barra-lateral", "google-boton",
  ];
  const problemas = [];

  const faltan = IDS_NECESARIOS.filter((id) => !document.getElementById(id));
  const meta = document.querySelector('meta[name="app-version"]');
  if (faltan.length || !meta || meta.content !== VERSION) problemas.push("index.html");

  const cssVersion = getComputedStyle(document.documentElement)
    .getPropertyValue("--app-version")
    .replace(/["'\s]/g, "");
  if (cssVersion !== VERSION) problemas.push("styles.css");

  if (!problemas.length) return;

  const aviso = document.createElement("div");
  aviso.style.cssText =
    "background:#fff3bf;color:#5c3d00;border-bottom:3px solid #f08c00;" +
    "padding:12px 16px;font:15px/1.4 system-ui,sans-serif;text-align:center;";
  aviso.textContent =
    "⚠️ Archivos desactualizados: " + problemas.join(" y ") +
    ". Sube de nuevo TODOS los archivos de la última versión (index.html, styles.css, " +
    "app.js y config.js) y recarga la página con Ctrl+F5 (en Mac: Cmd+Shift+R).";
  document.body.prepend(aviso);

  // Si falta algo del HTML, el resto del código no puede funcionar: se detiene aquí.
  if (faltan.length) throw new Error("index.html desactualizado. Faltan: " + faltan.join(", "));
})();

// ---------- Menú principal ----------
const botonesMenu = document.querySelectorAll(".btn-menu");
const secciones = document.querySelectorAll(".seccion");
const mensajeInicio = document.getElementById("inicio");

function mostrarSeccion(id) {
  mensajeInicio.hidden = true;
  secciones.forEach((s) => (s.hidden = s.id !== id));
  botonesMenu.forEach((b) =>
    b.classList.toggle("activo", b.dataset.seccion === id)
  );
  if (id === "calendario") irAHoy(); // siempre abre en la fecha actual
  else cerrarPopover();
}

botonesMenu.forEach((b) =>
  b.addEventListener("click", () => mostrarSeccion(b.dataset.seccion))
);

// ---------- Datos (Google Sheets mediante Apps Script) ----------
// Columnas de la hoja: A Fecha | B Actividades | C Descripcion | D Anotaciones
const CAMPOS = [
  { clave: "actividades", etiqueta: "Actividades" },
  { clave: "descripcion", etiqueta: "Descripción" },
  { clave: "anotaciones", etiqueta: "Anotaciones" },
];

const datos = {}; // { "2026-10-13": { actividades, descripcion, anotaciones } }
const estadoCal = document.getElementById("cal-estado");

function configurado() {
  return typeof CONFIG !== "undefined" && CONFIG.APPS_SCRIPT_URL && CONFIG.TOKEN;
}

function mostrarEstadoCal(texto, tipo) {
  estadoCal.textContent = texto;
  estadoCal.className = "cal-estado" + (tipo ? " " + tipo : "");
  estadoCal.hidden = !texto;
}

async function cargarDatos() {
  if (!configurado()) {
    mostrarEstadoCal(
      "Falta conectar Google Sheets: revisa config.js y el README.",
      "error"
    );
    return;
  }
  mostrarEstadoCal("Cargando datos…");
  try {
    const r = await fetch(
      CONFIG.APPS_SCRIPT_URL + "?token=" + encodeURIComponent(CONFIG.TOKEN)
    );
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "Error desconocido");
    Object.keys(datos).forEach((k) => delete datos[k]);
    Object.assign(datos, j.datos);
    mostrarEstadoCal("");
    dibujarCalendario();
  } catch (e) {
    mostrarEstadoCal("No se pudieron cargar los datos: " + e.message, "error");
  }
}

async function guardarCampo(fecha, campo, valor) {
  if (!configurado()) throw new Error("Falta configurar config.js");
  // text/plain evita el "preflight" de CORS con Apps Script
  const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: CONFIG.TOKEN, fecha, campo, valor }),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Error al guardar");
  datos[fecha] = datos[fecha] || {};
  datos[fecha][campo] = valor;
}

function tieneDatos(fecha) {
  const d = datos[fecha];
  return !!d && CAMPOS.some((c) => (d[c.clave] || "").trim() !== "");
}

// ---------- Varios elementos en una sola celda, entre paréntesis ----------
// Descripción, Actividades y Anotaciones funcionan igual. Ejemplo en la hoja:
//   (primer elemento) (segundo elemento) (tercer elemento)

function parentesisBalanceados(s) {
  let n = 0;
  for (const ch of s) {
    if (ch === "(") n++;
    else if (ch === ")") {
      n--;
      if (n < 0) return false;
    }
  }
  return n === 0;
}

// Si el texto trae paréntesis sueltos, se cambian por corchetes para no romper el formato
function limpiarElemento(s) {
  s = s.trim();
  return parentesisBalanceados(s) ? s : s.replace(/\(/g, "[").replace(/\)/g, "]");
}

// Convierte el contenido de una celda en una lista de elementos.
// Si la celda tiene texto antiguo sin el formato de paréntesis, se muestra como un solo elemento.
function parsearElementos(texto) {
  const t = (texto || "").trim();
  if (!t) return [];
  const elementos = [];
  let profundidad = 0;
  let actual = "";
  for (const ch of t) {
    if (profundidad === 0) {
      if (ch === "(") {
        profundidad = 1;
        actual = "";
      } else if (/\s/.test(ch)) {
        continue;
      } else {
        return [t]; // hay texto fuera de los paréntesis: es contenido antiguo
      }
    } else if (ch === "(") {
      profundidad++;
      actual += ch;
    } else if (ch === ")") {
      profundidad--;
      if (profundidad === 0) elementos.push(actual.trim());
      else actual += ch;
    } else {
      actual += ch;
    }
  }
  if (profundidad !== 0) return [t]; // paréntesis sin cerrar: contenido antiguo
  return elementos.filter((e) => e !== "");
}

function serializarElementos(elementos) {
  return elementos.map((e) => "(" + limpiarElemento(e) + ")").join(" ");
}

// ---------- Calendario (1930 - 2100) ----------
const ANIO_MIN = 1930;
const ANIO_MAX = 2100;
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]; // semana inicia en lunes

const selMes = document.getElementById("cal-mes");
const selAnio = document.getElementById("cal-anio");
const btnAnterior = document.getElementById("cal-anterior");
const btnSiguiente = document.getElementById("cal-siguiente");
const btnHoy = document.getElementById("cal-hoy");
const btnActualizar = document.getElementById("cal-actualizar");
const cuadricula = document.getElementById("cal-cuadricula");

let hoy = new Date();
let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();
let seleccion = null; // fecha seleccionada "YYYY-MM-DD"

const dos = (n) => String(n).padStart(2, "0");
const claveFecha = (a, m, d) => `${a}-${dos(m + 1)}-${dos(d)}`;

MESES.forEach((nombre, i) => selMes.add(new Option(nombre, i)));
for (let a = ANIO_MIN; a <= ANIO_MAX; a++) selAnio.add(new Option(a, a));

function dibujarCalendario() {
  selMes.value = mesActual;
  selAnio.value = anioActual;
  btnAnterior.disabled = anioActual === ANIO_MIN && mesActual === 0;
  btnSiguiente.disabled = anioActual === ANIO_MAX && mesActual === 11;

  cuadricula.innerHTML = "";

  DIAS.forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-dia-semana";
    el.textContent = d;
    cuadricula.appendChild(el);
  });

  // getDay(): 0=domingo ... 6=sábado. Convertimos a lunes=0.
  const primerDia = (new Date(anioActual, mesActual, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement("div");
    vacio.className = "cal-dia vacio";
    cuadricula.appendChild(vacio);
  }

  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = claveFecha(anioActual, mesActual, d);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cal-dia";
    el.textContent = d;
    el.dataset.fecha = fecha;

    const diaSemana = (primerDia + d - 1) % 7;
    if (diaSemana >= 5) el.classList.add("finde");

    if (d === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear()) {
      el.classList.add("hoy");
    }
    if (fecha === seleccion) el.classList.add("seleccionado");
    if (tieneDatos(fecha)) el.classList.add("con-datos");

    el.addEventListener("click", () => abrirDia(fecha));
    cuadricula.appendChild(el);
  }
}

function cambiarMes(delta) {
  cerrarPopover();
  mesActual += delta;
  if (mesActual < 0) { mesActual = 11; anioActual--; }
  if (mesActual > 11) { mesActual = 0; anioActual++; }
  if (anioActual < ANIO_MIN) { anioActual = ANIO_MIN; mesActual = 0; }
  if (anioActual > ANIO_MAX) { anioActual = ANIO_MAX; mesActual = 11; }
  dibujarCalendario();
}

btnAnterior.addEventListener("click", () => cambiarMes(-1));
btnSiguiente.addEventListener("click", () => cambiarMes(1));
selMes.addEventListener("change", () => {
  cerrarPopover();
  mesActual = Number(selMes.value);
  dibujarCalendario();
});
selAnio.addEventListener("change", () => {
  cerrarPopover();
  anioActual = Number(selAnio.value);
  dibujarCalendario();
});
// Vuelve al mes y año de hoy (vuelve a leer la fecha por si la página lleva días abierta)
function irAHoy() {
  hoy = new Date();
  mesActual = hoy.getMonth();
  anioActual = hoy.getFullYear();
  cerrarPopover();
  dibujarCalendario();
}

btnHoy.addEventListener("click", irAHoy);
btnActualizar.addEventListener("click", () => {
  cerrarPopover();
  cargarDatos();
});

// ---------- Panel del día ----------
const seccionCal = document.getElementById("calendario");
const popover = document.getElementById("dia-popover");
const popTitulo = document.getElementById("pop-titulo");
const popCerrar = document.getElementById("pop-cerrar");

// Textos de cada sección (el orden en pantalla lo define index.html)
const TEXTOS = {
  descripcion: {
    vacio: "Aún no hay descripciones para este día.",
    confirmar: "¿Eliminar esta descripción?",
  },
  actividades: {
    vacio: "Aún no hay actividades para este día.",
    confirmar: "¿Eliminar esta actividad?",
  },
  anotaciones: {
    vacio: "Aún no hay anotaciones para este día.",
    confirmar: "¿Eliminar esta anotación?",
  },
};

function setEstado(el, texto, tipo) {
  el.textContent = texto;
  el.classList.remove("ok", "error");
  if (tipo) el.classList.add(tipo);
}

function actualizarMarca(fecha) {
  const celda = cuadricula.querySelector(`[data-fecha="${fecha}"]`);
  if (celda) celda.classList.toggle("con-datos", tieneDatos(fecha));
}

// Cada sección: botón del título (abre la zona de texto) + botón "Desplegar" (abre los recuadros)
const bloquesDia = Array.from(
  document.querySelectorAll("#pop-secciones .pop-seccion[data-campo]")
).map((el) => ({
  campo: el.dataset.campo,
  btnTexto: el.querySelector('[data-accion="texto"]'),
  panelTexto: el.querySelector(".pop-panel-texto"),
  txt: el.querySelector("textarea"),
  btnGuardar: el.querySelector(".btn-guardar"),
  est: el.querySelector(".pop-panel-texto .pop-estado"),
  btnLista: el.querySelector('[data-accion="lista"]'),
  panelLista: el.querySelector(".pop-panel-lista"),
  fija: el.querySelector(".lista-fija"),
  lista: el.querySelector(".lista-extra"),
  etiquetaLista: el.querySelector(".pop-lista-etiqueta"),
  estLista: el.querySelector(".pop-estado-lista"),
}));

function plegar(boton, panel) {
  panel.hidden = true;
  boton.setAttribute("aria-expanded", "false");
}

// Muestra u oculta un panel. Sin "abrir", cambia al estado contrario.
function alternar(boton, panel, abrir) {
  const mostrar = abrir === undefined ? panel.hidden : abrir;
  panel.hidden = !mostrar;
  boton.setAttribute("aria-expanded", String(mostrar));
  if (mostrar) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function elementosDe(fecha, campo) {
  return parsearElementos((datos[fecha] || {})[campo]);
}

const MAX_VISIBLES = 4; // los primeros 4 recuadros siempre se ven

function crearNota(texto, indice, b) {
  const caja = document.createElement("div");
  caja.className = "nota";
  const t = document.createElement("p");
  t.className = "nota-texto";
  t.textContent = texto;
  const x = document.createElement("button");
  x.type = "button";
  x.className = "nota-borrar";
  x.setAttribute("aria-label", "Eliminar");
  x.textContent = "×";
  x.addEventListener("click", () => borrarElemento(b, indice));
  caja.append(t, x);
  return caja;
}

function dibujarLista(fecha, b) {
  b.fija.innerHTML = "";
  b.lista.innerHTML = "";
  const elementos = elementosDe(fecha, b.campo);

  if (!elementos.length) {
    const p = document.createElement("p");
    p.className = "sin-notas";
    p.textContent = TEXTOS[b.campo].vacio;
    b.fija.appendChild(p);
  }

  elementos.forEach((texto, i) => {
    const caja = crearNota(texto, i, b);
    (i < MAX_VISIBLES ? b.fija : b.lista).appendChild(caja);
  });

  // El botón "Desplegar" solo aparece si hay más de 4 recuadros
  const extras = Math.max(0, elementos.length - MAX_VISIBLES);
  b.btnLista.hidden = extras === 0;
  b.etiquetaLista.textContent = extras ? `Desplegar (${extras} más)` : "Desplegar";
  if (extras === 0) plegar(b.btnLista, b.panelLista);
}

// Fecha y hora del momento de guardar, con el formato: 14/10/2026 21:35
function selloFechaHora() {
  const n = new Date();
  return `${dos(n.getDate())}/${dos(n.getMonth() + 1)}/${n.getFullYear()} ` +
    `${dos(n.getHours())}:${dos(n.getMinutes())}`;
}

async function agregarElemento(b) {
  const fecha = seleccion;
  const texto = b.txt.value.trim();
  if (!fecha) return;
  if (!texto) {
    setEstado(b.est, "Escribe algo primero", "error");
    return;
  }
  // La fecha y hora van al inicio del recuadro, en su propia línea, antes del texto
  const conSello = selloFechaHora() + "\n" + texto;
  const elementos = elementosDe(fecha, b.campo).concat(limpiarElemento(conSello));
  b.btnGuardar.disabled = true;
  setEstado(b.est, "Guardando…");
  try {
    await guardarCampo(fecha, b.campo, serializarElementos(elementos));
    if (seleccion === fecha) {
      b.txt.value = "";
      dibujarLista(fecha, b);
      // Si el recuadro nuevo quedó después del 4.º, abre la lista para que se vea
      if (elementos.length > MAX_VISIBLES) alternar(b.btnLista, b.panelLista, true);
      setEstado(b.est, "Guardado ✓", "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    setEstado(b.est, "Error: " + e.message, "error");
  } finally {
    b.btnGuardar.disabled = false;
  }
}

async function borrarElemento(b, indice) {
  const fecha = seleccion;
  if (!fecha) return;
  if (!window.confirm(TEXTOS[b.campo].confirmar)) return;
  const elementos = elementosDe(fecha, b.campo);
  elementos.splice(indice, 1);
  setEstado(b.estLista, "Guardando…");
  try {
    await guardarCampo(fecha, b.campo, serializarElementos(elementos));
    if (seleccion === fecha) {
      dibujarLista(fecha, b);
      setEstado(b.estLista, "Eliminado", "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    setEstado(b.estLista, "Error: " + e.message, "error");
  }
}

bloquesDia.forEach((b) => {
  b.btnTexto.addEventListener("click", () => {
    alternar(b.btnTexto, b.panelTexto);
    if (!b.panelTexto.hidden) b.txt.focus();
  });
  b.btnLista.addEventListener("click", () => alternar(b.btnLista, b.panelLista));
  b.btnGuardar.addEventListener("click", () => agregarElemento(b));
});

function textoFecha(fecha) {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function posicionarPopover(celda) {
  const rs = seccionCal.getBoundingClientRect();
  const rc = celda.getBoundingClientRect();
  const ancho = popover.offsetWidth;
  const centro = rc.left - rs.left + rc.width / 2;
  const izq = Math.max(0, Math.min(centro - ancho / 2, rs.width - ancho));
  popover.style.left = izq + "px";
  popover.style.top = rc.bottom - rs.top + 10 + "px";
  popover.style.setProperty("--flecha", centro - izq + "px");
}

function abrirDia(fecha) {
  seleccion = fecha;
  dibujarCalendario();

  popTitulo.textContent = textoFecha(fecha);
  // Al abrir un día se ven los 3 títulos y sus primeros 4 recuadros; lo demás empieza plegado
  bloquesDia.forEach((b) => {
    b.txt.value = "";
    setEstado(b.est, "");
    setEstado(b.estLista, "");
    plegar(b.btnTexto, b.panelTexto);
    plegar(b.btnLista, b.panelLista);
    dibujarLista(fecha, b);
  });

  popover.hidden = false;
  posicionarPopover(cuadricula.querySelector(`[data-fecha="${fecha}"]`));
  popover.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cerrarPopover() {
  if (popover.hidden && !seleccion) return;
  popover.hidden = true;
  seleccion = null;
  cuadricula
    .querySelectorAll(".seleccionado")
    .forEach((e) => e.classList.remove("seleccionado"));
}

popCerrar.addEventListener("click", cerrarPopover);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarPopover();
});
document.addEventListener("click", (e) => {
  if (popover.hidden) return;
  const ruta = e.composedPath();
  if (ruta.includes(popover)) return;
  if (ruta.some((n) => n.classList && n.classList.contains("cal-dia"))) return;
  cerrarPopover();
});
window.addEventListener("resize", () => {
  if (!popover.hidden && seleccion) {
    const celda = cuadricula.querySelector(`[data-fecha="${seleccion}"]`);
    if (celda) posicionarPopover(celda);
  }
});

// ---------- Barra lateral e inicio de sesión con Google ----------
const btnLateral = document.getElementById("btn-menu-lateral");
const barraLateral = document.getElementById("barra-lateral");
const fondoLateral = document.getElementById("fondo-lateral");
const btnCerrarLateral = document.getElementById("lateral-cerrar");

function abrirLateral() {
  barraLateral.classList.add("abierta");
  barraLateral.setAttribute("aria-hidden", "false");
  fondoLateral.hidden = false;
  btnLateral.setAttribute("aria-expanded", "true");
}

function cerrarLateral() {
  barraLateral.classList.remove("abierta");
  barraLateral.setAttribute("aria-hidden", "true");
  fondoLateral.hidden = true;
  btnLateral.setAttribute("aria-expanded", "false");
}

btnLateral.addEventListener("click", () =>
  barraLateral.classList.contains("abierta") ? cerrarLateral() : abrirLateral()
);
btnCerrarLateral.addEventListener("click", cerrarLateral);
fondoLateral.addEventListener("click", cerrarLateral);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarLateral();
});

const CLAVE_SESION = "polo-ai-sesion";
const cuentaSin = document.getElementById("cuenta-sin-sesion");
const cuentaCon = document.getElementById("cuenta-con-sesion");
const googleBoton = document.getElementById("google-boton");
const googleAviso = document.getElementById("google-aviso");
const cuentaFoto = document.getElementById("cuenta-foto");
const cuentaNombre = document.getElementById("cuenta-nombre");
const cuentaCorreo = document.getElementById("cuenta-correo");
const btnSalir = document.getElementById("cuenta-salir");

let usuario = null; // { nombre, correo, foto }
try {
  usuario = JSON.parse(localStorage.getItem(CLAVE_SESION));
} catch (e) {
  usuario = null;
}

// El token de Google (JWT) trae los datos de la cuenta en su parte central, en base64
function decodificarJWT(token) {
  const base = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base)
      .split("")
      .map((ch) => "%" + ("00" + ch.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(json);
}

function dibujarCuenta() {
  cuentaSin.hidden = !!usuario;
  cuentaCon.hidden = !usuario;
  if (!usuario) return;
  cuentaNombre.textContent = usuario.nombre || "";
  cuentaCorreo.textContent = usuario.correo || "";
  const fotoValida = typeof usuario.foto === "string" && usuario.foto.startsWith("https://");
  cuentaFoto.hidden = !fotoValida;
  if (fotoValida) cuentaFoto.src = usuario.foto;
}

function respuestaGoogle(resp) {
  try {
    const p = decodificarJWT(resp.credential);
    usuario = { nombre: p.name || "", correo: p.email || "", foto: p.picture || "" };
    try {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } catch (e) {}
    dibujarCuenta();
  } catch (e) {
    googleAviso.textContent = "No se pudo iniciar sesión: " + e.message;
    googleAviso.hidden = false;
  }
}

function cerrarSesion() {
  usuario = null;
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.disableAutoSelect();
  }
  dibujarCuenta();
}
btnSalir.addEventListener("click", cerrarSesion);

function iniciarGoogle() {
  if (typeof CONFIG === "undefined" || !CONFIG.GOOGLE_CLIENT_ID) {
    googleAviso.textContent =
      "Falta configurar GOOGLE_CLIENT_ID en config.js (revisa el README).";
    googleAviso.hidden = false;
    return;
  }
  const s = document.createElement("script");
  s.src = "https://accounts.google.com/gsi/client";
  s.async = true;
  s.defer = true;
  s.onload = () => {
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: respuestaGoogle,
    });
    google.accounts.id.renderButton(googleBoton, {
      theme: "filled_black",
      size: "large",
      text: "signin_with",
      locale: "es",
    });
  };
  s.onerror = () => {
    googleAviso.textContent = "No se pudo cargar el servicio de Google. Revisa tu conexión.";
    googleAviso.hidden = false;
  };
  document.head.appendChild(s);
}

dibujarCuenta();
iniciarGoogle();

// ---------- Inicio ----------
// Al abrir o recargar la página (F5) el calendario ya aparece en la fecha actual
mostrarSeccion("calendario");
cargarDatos();
