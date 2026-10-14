// ---------- Control de versión ----------
// index.html, styles.css y app.js deben ser de la MISMA versión. Si no lo son,
// se muestra un aviso arriba de la página diciendo cuál archivo hay que volver a subir.
const VERSION = "4";

(function revisarArchivos() {
  const IDS_NECESARIOS = [
    "calendario", "cal-mes", "cal-anio", "cal-anterior", "cal-siguiente",
    "cal-hoy", "cal-actualizar", "cal-cuadricula", "cal-estado",
    "dia-popover", "pop-titulo", "pop-cerrar", "pop-secciones",
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
  lista: el.querySelector(".lista-notas"),
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

function dibujarLista(fecha, b) {
  b.lista.innerHTML = "";
  const elementos = elementosDe(fecha, b.campo);
  if (!elementos.length) {
    const p = document.createElement("p");
    p.className = "sin-notas";
    p.textContent = TEXTOS[b.campo].vacio;
    b.lista.appendChild(p);
    return;
  }
  elementos.forEach((texto, i) => {
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
    x.addEventListener("click", () => borrarElemento(b, i));
    caja.append(t, x);
    b.lista.appendChild(caja);
  });
}

async function agregarElemento(b) {
  const fecha = seleccion;
  const texto = b.txt.value.trim();
  if (!fecha) return;
  if (!texto) {
    setEstado(b.est, "Escribe algo primero", "error");
    return;
  }
  const elementos = elementosDe(fecha, b.campo).concat(limpiarElemento(texto));
  b.btnGuardar.disabled = true;
  setEstado(b.est, "Guardando…");
  try {
    await guardarCampo(fecha, b.campo, serializarElementos(elementos));
    if (seleccion === fecha) {
      b.txt.value = "";
      dibujarLista(fecha, b);
      alternar(b.btnLista, b.panelLista, true); // muestra el recuadro recién agregado
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
  // Al abrir un día solo se ven los tres títulos: todo lo demás empieza plegado
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

dibujarCalendario();
cargarDatos();
