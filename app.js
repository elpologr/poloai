// ---------- Control de versión ----------
// index.html, styles.css y app.js deben ser de la MISMA versión. Si no lo son,
// se muestra un aviso arriba de la página diciendo cuál archivo hay que volver a subir.
const VERSION = "13";

(function revisarArchivos() {
  const IDS_NECESARIOS = [
    "calendario", "cal-mes", "cal-anio", "cal-anterior", "cal-siguiente",
    "cal-hoy", "cal-actualizar", "cal-cuadricula", "cal-estado",
    "dia-popover", "pop-titulo", "pop-cerrar", "pop-secciones",
    "btn-menu-lateral", "barra-lateral", "google-boton", "btn-notas", "panel-notas",
    "notas-nueva-btn", "notas-fecha", "notas-cancelar", "notas-estado-lista",
    "notas-submenu", "notas-sub-lista", "notas-mas-colores", "notas-color-personal",
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
  // Para modificar la hoja hace falta haber iniciado sesión con Google
  const idToken = credencialVigente();
  if (!idToken) {
    abrirLateral();
    throw new Error("Inicia sesión con Google para guardar");
  }
  // text/plain evita el "preflight" de CORS con Apps Script
  const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: CONFIG.TOKEN, idToken, fecha, campo, valor }),
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

let usuario = null; // { nombre, correo, foto, credencial, exp }
try {
  usuario = JSON.parse(localStorage.getItem(CLAVE_SESION));
} catch (e) {
  usuario = null;
}

// La credencial de Google dura cerca de 1 hora. Pasado ese tiempo hay que volver a entrar
// (si ya habías aceptado antes, Google suele volver a iniciar sesión solo).
function sesionVigente() {
  return !!(usuario && usuario.credencial && usuario.exp * 1000 > Date.now() + 15000);
}

function credencialVigente() {
  return sesionVigente() ? usuario.credencial : null;
}

let sesionCaducada = false; // había una sesión guardada pero ya venció
if (usuario && !sesionVigente()) {
  usuario = null;
  sesionCaducada = true;
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
}

let temporizadorSesion = null;
function programarCaducidad() {
  clearTimeout(temporizadorSesion);
  if (!usuario) return;
  const ms = Math.max(usuario.exp * 1000 - Date.now() - 15000, 0);
  temporizadorSesion = setTimeout(expirarSesion, ms);
}

// Vence la credencial: se cierra la sesión en pantalla y se intenta volver a entrar sola
function expirarSesion() {
  usuario = null;
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
  dibujarCuenta();
  actualizarPanelNotas();
  if (window.google && google.accounts && google.accounts.id) google.accounts.id.prompt();
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
    usuario = {
      nombre: p.name || "",
      correo: p.email || "",
      foto: p.picture || "",
      credencial: resp.credential,
      exp: p.exp,
    };
    try {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } catch (e) {}
    googleAviso.hidden = true;
    dibujarCuenta();
    programarCaducidad();
    actualizarPanelNotas();
  } catch (e) {
    googleAviso.textContent = "No se pudo iniciar sesión: " + e.message;
    googleAviso.hidden = false;
  }
}

function cerrarSesion() {
  clearTimeout(temporizadorSesion);
  usuario = null;
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.disableAutoSelect();
  }
  dibujarCuenta();
  actualizarPanelNotas();
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
      auto_select: true,
    });
    google.accounts.id.renderButton(googleBoton, {
      theme: "filled_black",
      size: "large",
      text: "signin_with",
      locale: "es",
    });
    // Si había una sesión que ya venció, intenta entrar de nuevo sin pedirte nada
    if (sesionCaducada) google.accounts.id.prompt();
  };
  s.onerror = () => {
    googleAviso.textContent = "No se pudo cargar el servicio de Google. Revisa tu conexión.";
    googleAviso.hidden = false;
  };
  document.head.appendChild(s);
}

// ---------- Notas (hoja «Notas» de Google Sheets) ----------
const btnNotas = document.getElementById("btn-notas");
const panelNotas = document.getElementById("panel-notas");
const notasSinSesion = document.getElementById("notas-sin-sesion");
const notasContenido = document.getElementById("notas-contenido");
const notasTexto = document.getElementById("notas-texto");
const notasForm = document.getElementById("notas-form");
const notasNombre = document.getElementById("notas-nombre");
const notasEtiqueta = document.getElementById("notas-etiqueta");
const notasColores = document.getElementById("notas-colores");
const notasGuardar = document.getElementById("notas-guardar");
const notasEstado = document.getElementById("notas-estado");
const notasEstadoLista = document.getElementById("notas-estado-lista");
const notasNuevaBtn = document.getElementById("notas-nueva-btn");
const notasCancelar = document.getElementById("notas-cancelar");
const notasFecha = document.getElementById("notas-fecha");
const notasSubmenu = document.getElementById("notas-submenu");
const notasSubTitulo = document.getElementById("notas-sub-titulo");
const notasSubLista = document.getElementById("notas-sub-lista");
const notasSubVolver = document.getElementById("notas-sub-volver");
const notasMasColores = document.getElementById("notas-mas-colores");
const notasPaleta = document.getElementById("notas-paleta");
const notasPaletaFamilias = document.getElementById("notas-paleta-familias");
const notasColorPersonal = document.getElementById("notas-color-personal");
const notasPersonal = document.getElementById("notas-personal");
const notasLista = document.getElementById("notas-lista");

let notas = []; // [{ id, nombre, fecha, etiqueta, texto, color }]
let notasCargadas = false;
let etiquetaAbierta = null; // etiqueta cuyo submenú está abierto (null = ninguno)
const MAX_FILA_NOTAS = 4; // notas visibles por fila; el resto va en el submenú

// Etiquetas y colores (los nombres se guardan tal cual en la hoja; deben coincidir con el Apps Script)
const ETIQUETAS_NOTA = [
  "General",
  "Tarea/Actividad",
  "Conjunto de Datos",
  "Sueños",
  "Pendiente Importante",
  "Pedidos de Yeso",
];
const COLORES_NOTA = [
  { nombre: "Blanco", hex: "#ffffff" },
  { nombre: "Azul", hex: "#c4e1fb" },
  { nombre: "Rosa", hex: "#fbd3e3" },
  { nombre: "Menta", hex: "#cdf1de" },
  { nombre: "Lila", hex: "#e3d7f8" },
  { nombre: "Durazno", hex: "#fddcc6" },
  { nombre: "Amarillo", hex: "#fff4bd" },
  { nombre: "Turquesa", hex: "#c8f0f0" },
];
let colorElegido = "Blanco";

// Más colores (además de los pasteles de arriba): familias de claro a oscuro.
// Estos se guardan en la hoja como código "#rrggbb"; los pasteles, por su nombre.
const PALETA_COLORES = [
  { titulo: "Más pasteles", colores: ["#e6e6fa", "#ffd6cc", "#e6f7b8", "#d6ecff", "#f3d1f4", "#f5e6cc"] },
  { titulo: "Rojos", colores: ["#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#991b1b"] },
  { titulo: "Naranjas", colores: ["#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#9a3412"] },
  { titulo: "Amarillos", colores: ["#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#854d0e"] },
  { titulo: "Verdes", colores: ["#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#166534"] },
  { titulo: "Turquesas", colores: ["#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#155e75"] },
  { titulo: "Azules", colores: ["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e40af"] },
  { titulo: "Morados", colores: ["#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#5b21b6"] },
  { titulo: "Rosas", colores: ["#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#9d174d"] },
  { titulo: "Cafés", colores: ["#e7cfb4", "#d2a679", "#b07a4a", "#8b5a2b", "#6b4423", "#3f2a14"] },
  { titulo: "Grises", colores: ["#f1f5f9", "#cbd5e1", "#94a3b8", "#64748b", "#334155", "#111827"] },
];

// Acepta el nombre de un pastel ("Rosa") o un código "#rrggbb"
function hexDeColor(valor) {
  const v = String(valor || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
  const c = COLORES_NOTA.find((x) => x.nombre === v);
  return c ? c.hex : "#ffffff";
}

// Si el color es oscuro, el texto pasa a blanco para que se pueda leer
function esColorOscuro(hex) {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return false;
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => parseInt(x, 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}
function aplicarContraste(el, hex) {
  if (esColorOscuro(hex)) {
    el.style.setProperty("color", "#fff");
    el.style.setProperty("--nb-suave", "rgba(255, 255, 255, 0.8)");
  } else {
    el.style.removeProperty("color");
    el.style.removeProperty("--nb-suave");
  }
}

// El color elegido se ve de fondo en el formulario mientras escribes la nota
function elegirColor(valor) {
  colorElegido = valor;
  const hex = hexDeColor(valor);
  notasForm.style.setProperty("--fondo-nota", hex);
  aplicarContraste(notasForm, hex);
  let enMuestra = false;
  notasForm.querySelectorAll(".color-op").forEach((b) => {
    const activo = b.dataset.color.toLowerCase() === String(valor).toLowerCase();
    if (activo) enMuestra = true;
    b.classList.toggle("elegido", activo);
    b.setAttribute("aria-checked", activo ? "true" : "false");
  });
  notasColorPersonal.value = hex;
  notasPersonal.classList.toggle("elegido", !enMuestra);
}

function crearMuestraColor(valor, hex, titulo) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "color-op";
  b.dataset.color = valor;
  b.title = titulo;
  b.setAttribute("role", "radio");
  b.setAttribute("aria-label", titulo);
  b.style.background = hex;
  b.addEventListener("click", () => elegirColor(valor));
  return b;
}

ETIQUETAS_NOTA.forEach((e) => {
  const op = document.createElement("option");
  op.value = e;
  op.textContent = e;
  notasEtiqueta.appendChild(op);
});
COLORES_NOTA.forEach((c) => notasColores.appendChild(crearMuestraColor(c.nombre, c.hex, c.nombre)));
PALETA_COLORES.forEach((f) => {
  const fila = document.createElement("div");
  fila.className = "paleta-fila";
  const nombre = document.createElement("span");
  nombre.className = "paleta-nombre";
  nombre.textContent = f.titulo;
  const cont = document.createElement("div");
  cont.className = "notas-colores";
  cont.setAttribute("role", "radiogroup");
  cont.setAttribute("aria-label", f.titulo);
  f.colores.forEach((hex) => cont.appendChild(crearMuestraColor(hex, hex, f.titulo + " " + hex)));
  fila.append(nombre, cont);
  notasPaletaFamilias.appendChild(fila);
});
// Selector libre: cualquier color del espectro
notasColorPersonal.addEventListener("input", () => elegirColor(notasColorPersonal.value.toLowerCase()));
notasMasColores.addEventListener("click", () => {
  const abrir = notasPaleta.hidden;
  notasPaleta.hidden = !abrir;
  notasMasColores.setAttribute("aria-expanded", abrir ? "true" : "false");
  notasMasColores.textContent = abrir ? "Menos colores ▴" : "Más colores ▾";
});
elegirColor("Blanco");

// Llama al Apps Script para las notas (siempre con la sesión de Google)
async function llamarNotas(accion, extra) {
  if (!configurado()) throw new Error("Falta configurar config.js");
  const idToken = credencialVigente();
  if (!idToken) throw new Error("Inicia sesión con Google");
  // text/plain evita el "preflight" de CORS con Apps Script
  const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ token: CONFIG.TOKEN, idToken, accion }, extra || {})),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Error");
  return j;
}

// ----- Fechas de las notas: se guardan como "dd/mm/aaaa hh:mm" -----
// "dd/mm/aaaa hh:mm" -> "aaaa-mm-ddThh:mm" (formato del campo de fecha y hora); "" si no se entiende
function fechaAInput(s) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T](\d{1,2}):(\d{2})/.exec(String(s || "").trim());
  if (!m) return "";
  return `${m[3]}-${dos(m[2])}-${dos(m[1])}T${dos(m[4])}:${m[5]}`;
}
// "aaaa-mm-ddThh:mm" -> "dd/mm/aaaa hh:mm"; "" si el campo está vacío
function inputAFecha(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v || "");
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : "";
}
function fechaActualInput() {
  const n = new Date();
  return `${n.getFullYear()}-${dos(n.getMonth() + 1)}-${dos(n.getDate())}` +
    `T${dos(n.getHours())}:${dos(n.getMinutes())}`;
}
function marcaTiempo(s) {
  const v = fechaAInput(s);
  return v ? Date.parse(v) : NaN;
}

// Muestra u oculta las opciones para crear una nota (el botón "Nueva nota" hace lo contrario)
function mostrarFormNota(mostrar) {
  notasForm.hidden = !mostrar;
  notasNuevaBtn.hidden = mostrar;
  if (mostrar) {
    notasFecha.value = fechaActualInput();
    setEstado(notasEstado, "");
    notasNombre.focus();
  }
}

// Fecha de una tarjeta: texto + lápiz para cambiarla
function dibujarFechaNota(cont, n) {
  cont.innerHTML = "";
  const txt = document.createElement("span");
  txt.textContent = n.fecha;
  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "tarjeta-editar-fecha";
  editar.title = "Cambiar fecha y hora";
  editar.setAttribute("aria-label", "Cambiar fecha y hora de la nota");
  editar.textContent = "✎";
  editar.addEventListener("click", () => editarFechaNota(cont, n));
  cont.append(txt, editar);
}

function editarFechaNota(cont, n) {
  cont.innerHTML = "";
  const inp = document.createElement("input");
  inp.type = "datetime-local";
  inp.className = "tarjeta-fecha-input";
  inp.value = fechaAInput(n.fecha) || fechaActualInput();
  const ok = document.createElement("button");
  ok.type = "button";
  ok.className = "tarjeta-fecha-ok";
  ok.textContent = "Guardar";
  const no = document.createElement("button");
  no.type = "button";
  no.className = "tarjeta-fecha-no";
  no.textContent = "Cancelar";
  ok.addEventListener("click", () => guardarFechaNota(n, inp.value, ok));
  no.addEventListener("click", () => dibujarFechaNota(cont, n));
  cont.append(inp, ok, no);
  inp.focus();
}

async function guardarFechaNota(n, valor, boton) {
  const fecha = inputAFecha(valor);
  if (!fecha) {
    setEstado(notasEstadoLista, "Elige una fecha y hora", "error");
    return;
  }
  boton.disabled = true;
  setEstado(notasEstadoLista, "Guardando fecha…");
  try {
    await llamarNotas("nota_fecha", { id: n.id, fecha });
    n.fecha = fecha;
    dibujarNotas();
    setEstado(notasEstadoLista, "Fecha actualizada ✓", "ok");
  } catch (e) {
    boton.disabled = false;
    setEstado(notasEstadoLista, "Error: " + e.message, "error");
  }
}

// Todas las notas, de la más reciente a la más antigua según su fecha
// (si dos tienen la misma, sale primero la última guardada)
function notasOrdenadas() {
  const orden = notas.map((n, i) => ({ n, i, t: marcaTiempo(n.fecha) }));
  orden.sort((x, y) => {
    const tx = isNaN(x.t) ? -Infinity : x.t;
    const ty = isNaN(y.t) ? -Infinity : y.t;
    return tx === ty ? y.i - x.i : ty - tx;
  });
  return orden.map((o) => o.n);
}

// Agrupa por etiqueta: primero las etiquetas conocidas (en su orden) y luego cualquier otra.
// Las etiquetas sin notas no se muestran.
function notasPorEtiqueta(lista) {
  const mapa = new Map();
  ETIQUETAS_NOTA.forEach((e) => mapa.set(e, []));
  lista.forEach((n) => {
    const e = n.etiqueta || "General";
    if (!mapa.has(e)) mapa.set(e, []);
    mapa.get(e).push(n);
  });
  return [...mapa].filter(([, l]) => l.length);
}

function crearTarjetaNota(n) {
  const hex = hexDeColor(n.color);
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-nota";
  tarjeta.style.setProperty("--fondo", hex);
  aplicarContraste(tarjeta, hex);
  const nombre = document.createElement("div");
  nombre.className = "tarjeta-nombre";
  nombre.textContent = n.nombre || "Sin nombre";
  const etiqueta = document.createElement("span");
  etiqueta.className = "tarjeta-etiqueta";
  etiqueta.textContent = n.etiqueta || "General";
  const fecha = document.createElement("div");
  fecha.className = "tarjeta-fecha";
  dibujarFechaNota(fecha, n);
  const texto = document.createElement("p");
  texto.className = "tarjeta-texto";
  texto.textContent = n.texto;
  const borrar = document.createElement("button");
  borrar.type = "button";
  borrar.className = "tarjeta-borrar";
  borrar.setAttribute("aria-label", "Eliminar nota");
  borrar.textContent = "×";
  borrar.addEventListener("click", () => borrarNota(n.id));
  tarjeta.append(nombre, etiqueta, fecha, texto, borrar);
  return tarjeta;
}

function dibujarNotas() {
  notasLista.innerHTML = "";
  if (!notas.length) {
    const p = document.createElement("p");
    p.className = "notas-vacio";
    p.textContent = "Aún no hay notas. ¡Escribe la primera! ✨";
    notasLista.appendChild(p);
    cerrarSubmenu();
    return;
  }
  notasPorEtiqueta(notasOrdenadas()).forEach(([etiqueta, lista]) => {
    const seccion = document.createElement("section");
    seccion.className = "notas-grupo";

    const titulo = document.createElement("h3");
    titulo.className = "notas-grupo-titulo";
    const nombreEt = document.createElement("span");
    nombreEt.textContent = etiqueta;
    const cuenta = document.createElement("span");
    cuenta.className = "notas-grupo-cuenta";
    cuenta.textContent = String(lista.length);
    titulo.append(nombreEt, cuenta);

    // Fila: las primeras 4 notas una al lado de la otra y, si hay más, el botón a la derecha
    const fila = document.createElement("div");
    fila.className = "notas-grupo-fila";
    const tarjetas = document.createElement("div");
    tarjetas.className = "notas-grupo-cards";
    lista.slice(0, MAX_FILA_NOTAS).forEach((n) => tarjetas.appendChild(crearTarjetaNota(n)));
    fila.appendChild(tarjetas);
    if (lista.length > MAX_FILA_NOTAS) {
      const mas = document.createElement("button");
      mas.type = "button";
      mas.className = "notas-grupo-mas";
      mas.setAttribute("aria-label", "Ver las " + lista.length + " notas de " + etiqueta);
      mas.innerHTML =
        '<span>Ver todas</span><span class="notas-grupo-num"></span>' +
        '<span class="flecha-mas" aria-hidden="true">›</span>';
      mas.querySelector(".notas-grupo-num").textContent = "(" + lista.length + ")";
      mas.addEventListener("click", () => abrirSubmenu(etiqueta));
      fila.appendChild(mas);
    }

    seccion.append(titulo, fila);
    notasLista.appendChild(seccion);
  });
  dibujarSubmenu(); // si hay un submenú abierto, se actualiza también
}

// Submenú: todas las notas de una etiqueta
function abrirSubmenu(etiqueta) {
  etiquetaAbierta = etiqueta;
  notasSubmenu.hidden = false;
  dibujarSubmenu();
  notasSubVolver.focus();
}
function cerrarSubmenu() {
  etiquetaAbierta = null;
  notasSubmenu.hidden = true;
  notasSubLista.innerHTML = "";
}
function dibujarSubmenu() {
  if (etiquetaAbierta === null) return;
  const lista = notasOrdenadas().filter((n) => (n.etiqueta || "General") === etiquetaAbierta);
  if (!lista.length) {
    cerrarSubmenu();
    return;
  }
  notasSubTitulo.textContent = etiquetaAbierta + " (" + lista.length + ")";
  notasSubLista.innerHTML = "";
  lista.forEach((n) => notasSubLista.appendChild(crearTarjetaNota(n)));
}

async function cargarNotas() {
  setEstado(notasEstadoLista, "Cargando…");
  try {
    const j = await llamarNotas("nota_listar");
    notas = Array.isArray(j.notas) ? j.notas : [];
    notasCargadas = true;
    dibujarNotas();
    setEstado(notasEstadoLista, "");
  } catch (e) {
    setEstado(notasEstadoLista, "Error: " + e.message, "error");
  }
}

async function agregarNota() {
  const texto = notasTexto.value.trim();
  if (!texto) {
    setEstado(notasEstado, "Escribe algo primero", "error");
    return;
  }
  const nota = {
    id: String(Date.now()),
    nombre: notasNombre.value.trim() || "Sin nombre",
    // La fecha se puede cambiar en el formulario; si queda vacía se usa la actual
    fecha: inputAFecha(notasFecha.value) || selloFechaHora(),
    etiqueta: notasEtiqueta.value,
    texto,
    color: colorElegido,
  };
  notasGuardar.disabled = true;
  setEstado(notasEstado, "Guardando…");
  try {
    await llamarNotas("nota_agregar", nota);
    notas.push(nota);
    notasTexto.value = "";
    notasNombre.value = "";
    notasEtiqueta.selectedIndex = 0;
    elegirColor("Blanco");
    dibujarNotas();
    setEstado(notasEstado, "");
    mostrarFormNota(false);
    setEstado(notasEstadoLista, "Guardada ✓", "ok");
  } catch (e) {
    setEstado(notasEstado, "Error: " + e.message, "error");
  } finally {
    notasGuardar.disabled = false;
  }
}

async function borrarNota(id) {
  if (!window.confirm("¿Eliminar esta nota?")) return;
  setEstado(notasEstadoLista, "Eliminando…");
  try {
    await llamarNotas("nota_borrar", { id });
    notas = notas.filter((n) => n.id !== id);
    dibujarNotas();
    setEstado(notasEstadoLista, "Eliminada", "ok");
  } catch (e) {
    setEstado(notasEstadoLista, "Error: " + e.message, "error");
  }
}

// Muestra el aviso de inicio de sesión o el contenido, según la sesión
function actualizarPanelNotas() {
  if (panelNotas.hidden) return;
  const dentro = sesionVigente();
  notasSinSesion.hidden = dentro;
  notasContenido.hidden = !dentro;
  if (dentro) {
    if (!notasCargadas) cargarNotas();
  } else {
    notasCargadas = false;
    notas = [];
  }
}

function abrirNotas() {
  cerrarLateral();
  panelNotas.hidden = false;
  mostrarFormNota(false); // al abrir, primero se ve la lista de notas
  cerrarSubmenu();
  actualizarPanelNotas();
}

function cerrarNotas() {
  cerrarSubmenu();
  panelNotas.hidden = true;
}

btnNotas.addEventListener("click", abrirNotas);
document.getElementById("notas-cerrar").addEventListener("click", cerrarNotas);
document.getElementById("notas-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarNotas();
  else actualizarPanelNotas();
});
document.getElementById("notas-ir-login").addEventListener("click", () => {
  cerrarNotas();
  abrirLateral();
});
notasGuardar.addEventListener("click", agregarNota);
notasNuevaBtn.addEventListener("click", () => mostrarFormNota(true));
notasCancelar.addEventListener("click", () => mostrarFormNota(false));
notasSubVolver.addEventListener("click", cerrarSubmenu);
// Tocar el fondo oscuro (fuera de la caja) cierra el panel; Esc también
panelNotas.addEventListener("click", (e) => {
  if (e.target === panelNotas) cerrarNotas();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panelNotas.hidden) {
    // Esc cierra primero el submenú y, si no hay, el panel de notas
    if (etiquetaAbierta !== null) cerrarSubmenu();
    else cerrarNotas();
  }
});

dibujarCuenta();
programarCaducidad();
iniciarGoogle();

// ---------- Inicio ----------
// Al abrir o recargar la página (F5) el calendario ya aparece en la fecha actual
mostrarSeccion("calendario");
cargarDatos();
