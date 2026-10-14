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
  if (id !== "calendario") cerrarPopover();
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
const cuadricula = document.getElementById("cal-cuadricula");

const hoy = new Date();
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
btnHoy.addEventListener("click", () => {
  cerrarPopover();
  mesActual = hoy.getMonth();
  anioActual = hoy.getFullYear();
  dibujarCalendario();
});

// ---------- Submenú del día ----------
const seccionCal = document.getElementById("calendario");
const popover = document.getElementById("dia-popover");
const popTitulo = document.getElementById("pop-titulo");
const popCerrar = document.getElementById("pop-cerrar");
const popBotones = document.getElementById("pop-botones");
const popEditor = document.getElementById("pop-editor");
const popEtiqueta = document.getElementById("pop-etiqueta");
const popTexto = document.getElementById("pop-texto");
const popGuardar = document.getElementById("pop-guardar");
const popEstado = document.getElementById("pop-estado");

let campoActivo = null;

// Crea los botones Actividades / Descripción / Anotaciones una sola vez
CAMPOS.forEach((c) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "pop-btn";
  b.dataset.campo = c.clave;
  b.textContent = c.etiqueta;
  b.addEventListener("click", () => elegirCampo(c.clave));
  popBotones.appendChild(b);
});

function textoFecha(fecha) {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function marcarBotonesPopover() {
  popBotones.querySelectorAll(".pop-btn").forEach((b) => {
    const valor = ((datos[seleccion] || {})[b.dataset.campo] || "").trim();
    b.classList.toggle("con-datos", valor !== "");
    b.classList.toggle("activo", b.dataset.campo === campoActivo);
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
  campoActivo = null;
  popEditor.hidden = true;
  popEstado.textContent = "";
  dibujarCalendario();

  popTitulo.textContent = textoFecha(fecha);
  marcarBotonesPopover();
  popover.hidden = false;
  posicionarPopover(cuadricula.querySelector(`[data-fecha="${fecha}"]`));
}

function elegirCampo(clave) {
  campoActivo = clave;
  const info = CAMPOS.find((c) => c.clave === clave);
  popEtiqueta.textContent = info.etiqueta;
  popTexto.value = (datos[seleccion] || {})[clave] || "";
  popEstado.textContent = "";
  popEstado.className = "pop-estado";
  popEditor.hidden = false;
  marcarBotonesPopover();
  popTexto.focus();
}

function cerrarPopover() {
  if (popover.hidden && !seleccion) return;
  popover.hidden = true;
  campoActivo = null;
  seleccion = null;
  cuadricula
    .querySelectorAll(".seleccionado")
    .forEach((e) => e.classList.remove("seleccionado"));
}

popGuardar.addEventListener("click", async () => {
  if (!seleccion || !campoActivo) return;
  const fecha = seleccion;
  const campo = campoActivo;
  popGuardar.disabled = true;
  popEstado.className = "pop-estado";
  popEstado.textContent = "Guardando…";
  try {
    await guardarCampo(fecha, campo, popTexto.value);
    if (seleccion === fecha) {
      popEstado.className = "pop-estado ok";
      popEstado.textContent = "Guardado ✓";
      marcarBotonesPopover();
    }
    const celda = cuadricula.querySelector(`[data-fecha="${fecha}"]`);
    if (celda) celda.classList.toggle("con-datos", tieneDatos(fecha));
  } catch (e) {
    popEstado.className = "pop-estado error";
    popEstado.textContent = "Error: " + e.message;
  } finally {
    popGuardar.disabled = false;
  }
});

popCerrar.addEventListener("click", cerrarPopover);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarPopover();
});
document.addEventListener("click", (e) => {
  if (popover.hidden) return;
  if (popover.contains(e.target) || e.target.closest(".cal-dia")) return;
  cerrarPopover();
});
window.addEventListener("resize", () => {
  if (!popover.hidden && seleccion) {
    const celda = cuadricula.querySelector(`[data-fecha="${seleccion}"]`);
    if (celda) posicionarPopover(celda);
  }
});

dibujarCalendario();
cargarDatos();
