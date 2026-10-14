// ---------- Control de versión ----------
// index.html, styles.css y app.js deben ser de la MISMA versión. Si no lo son,
// se muestra un aviso arriba de la página diciendo cuál archivo hay que volver a subir.
const VERSION = "3";

(function revisarArchivos() {
  const IDS_NECESARIOS = [
    "calendario", "cal-mes", "cal-anio", "cal-anterior", "cal-siguiente",
    "cal-hoy", "cal-actualizar", "cal-cuadricula", "cal-estado",
    "dia-popover", "pop-titulo", "pop-cerrar",
    "txt-nueva-nota", "btn-agregar-nota", "estado-nota", "lista-notas",
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

// ---------- Anotaciones: varias notas en una sola celda, entre paréntesis ----------
// Ejemplo en la hoja:  (primera nota) (segunda nota) (tercera nota)

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

// Si la nota trae paréntesis sueltos, se cambian por corchetes para no romper el formato
function limpiarNota(s) {
  s = s.trim();
  return parentesisBalanceados(s) ? s : s.replace(/\(/g, "[").replace(/\)/g, "]");
}

function parsearNotas(texto) {
  const notas = [];
  let profundidad = 0;
  let actual = "";
  let fuera = "";
  for (const ch of texto || "") {
    if (ch === "(") {
      if (profundidad === 0) {
        if (fuera.trim()) notas.push(fuera.trim());
        fuera = "";
        actual = "";
      } else {
        actual += ch;
      }
      profundidad++;
    } else if (ch === ")" && profundidad > 0) {
      profundidad--;
      if (profundidad === 0) {
        notas.push(actual);
        actual = "";
      } else {
        actual += ch;
      }
    } else if (profundidad > 0) {
      actual += ch;
    } else {
      fuera += ch;
    }
  }
  if (profundidad > 0) fuera += "(" + actual; // paréntesis sin cerrar: se trata como texto
  if (fuera.trim()) notas.push(fuera.trim());
  return notas.map((n) => n.trim()).filter((n) => n !== "");
}

function serializarNotas(notas) {
  return notas.map((n) => "(" + limpiarNota(n) + ")").join(" ");
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

function setEstado(el, texto, tipo) {
  el.textContent = texto;
  el.className = "pop-estado" + (tipo ? " " + tipo : "");
}

function actualizarMarca(fecha) {
  const celda = cuadricula.querySelector(`[data-fecha="${fecha}"]`);
  if (celda) celda.classList.toggle("con-datos", tieneDatos(fecha));
}

// Bloques simples: Actividades y Descripción (un cuadro de texto + Guardar)
const bloquesSimples = Array.from(
  document.querySelectorAll(".pop-bloque[data-campo]")
).map((bloque) => ({
  campo: bloque.dataset.campo,
  txt: bloque.querySelector("textarea"),
  btn: bloque.querySelector(".btn-guardar"),
  est: bloque.querySelector(".pop-estado"),
}));

bloquesSimples.forEach((b) => {
  b.btn.addEventListener("click", async () => {
    const fecha = seleccion;
    if (!fecha) return;
    b.btn.disabled = true;
    setEstado(b.est, "Guardando…");
    try {
      await guardarCampo(fecha, b.campo, b.txt.value);
      if (seleccion === fecha) setEstado(b.est, "Guardado ✓", "ok");
      actualizarMarca(fecha);
    } catch (e) {
      setEstado(b.est, "Error: " + e.message, "error");
    } finally {
      b.btn.disabled = false;
    }
  });
});

// Anotaciones: varios recuadros
const txtNota = document.getElementById("txt-nueva-nota");
const btnNota = document.getElementById("btn-agregar-nota");
const estNota = document.getElementById("estado-nota");
const listaNotas = document.getElementById("lista-notas");

function notasDe(fecha) {
  return parsearNotas((datos[fecha] || {}).anotaciones);
}

function dibujarNotas(fecha) {
  listaNotas.innerHTML = "";
  const notas = notasDe(fecha);
  if (!notas.length) {
    const p = document.createElement("p");
    p.className = "sin-notas";
    p.textContent = "Aún no hay anotaciones para este día.";
    listaNotas.appendChild(p);
    return;
  }
  notas.forEach((texto, i) => {
    const caja = document.createElement("div");
    caja.className = "nota";
    const t = document.createElement("p");
    t.className = "nota-texto";
    t.textContent = texto;
    const x = document.createElement("button");
    x.type = "button";
    x.className = "nota-borrar";
    x.setAttribute("aria-label", "Eliminar anotación");
    x.textContent = "×";
    x.addEventListener("click", () => borrarNota(i));
    caja.append(t, x);
    listaNotas.appendChild(caja);
  });
}

btnNota.addEventListener("click", async () => {
  const fecha = seleccion;
  const texto = txtNota.value.trim();
  if (!fecha) return;
  if (!texto) {
    setEstado(estNota, "Escribe algo primero", "error");
    return;
  }
  const notas = notasDe(fecha).concat(limpiarNota(texto));
  btnNota.disabled = true;
  setEstado(estNota, "Guardando…");
  try {
    await guardarCampo(fecha, "anotaciones", serializarNotas(notas));
    if (seleccion === fecha) {
      txtNota.value = "";
      dibujarNotas(fecha);
      setEstado(estNota, "Guardado ✓", "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    setEstado(estNota, "Error: " + e.message, "error");
  } finally {
    btnNota.disabled = false;
  }
});

async function borrarNota(indice) {
  const fecha = seleccion;
  if (!fecha) return;
  if (!window.confirm("¿Eliminar esta anotación?")) return;
  const notas = notasDe(fecha);
  notas.splice(indice, 1);
  setEstado(estNota, "Guardando…");
  try {
    await guardarCampo(fecha, "anotaciones", serializarNotas(notas));
    if (seleccion === fecha) {
      dibujarNotas(fecha);
      setEstado(estNota, "Anotación eliminada", "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    setEstado(estNota, "Error: " + e.message, "error");
  }
}

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
  const d = datos[fecha] || {};
  bloquesSimples.forEach((b) => {
    b.txt.value = d[b.campo] || "";
    setEstado(b.est, "");
  });
  txtNota.value = "";
  setEstado(estNota, "");
  dibujarNotas(fecha);

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

dibujarCalendario();
cargarDatos();
