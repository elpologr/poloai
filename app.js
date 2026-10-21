// ---------- Control de versión ----------
// index.html, styles.css y app.js deben ser de la MISMA versión. Si no lo son,
// se muestra un aviso arriba de la página diciendo cuál archivo hay que volver a subir.
const VERSION = "59";

(function revisarArchivos() {
  const IDS_NECESARIOS = [
    "calendario", "cal-mes", "cal-anio", "cal-anterior", "cal-siguiente",
    "cal-hoy", "cal-actualizar", "cal-cuadricula", "cal-estado",
    "dia-popover", "pop-titulo", "pop-cerrar", "pop-secciones", "cal-desc-dia", "cal-chips", "cal-form",
    "btn-menu-lateral", "barra-lateral", "google-boton", "btn-notas", "panel-notas",
    "notas-nueva-btn", "notas-fecha", "notas-cancelar", "notas-estado-lista",
    "notas-submenu", "notas-sub-lista", "notas-mas-colores", "notas-color-personal",
    "notas-identificador", "notas-destino", "notas-form-titulo", "btn-proyectos", "panel-proyectos", "proy-form",
    "btn-yeso", "btn-galeria", "panel-galeria", "gal-form",
    "zona-actividades", "zona-trabajo", "btn-menu-notas", "seccion-notas", "btn-menu-ejercicio",
    "panel-ejercicio", "ej-cuadricula", "ej-dia", "ej-form",
    "btn-menu-diario", "panel-diario", "di-cuadricula", "di-dia", "di-form",
    "seccion-ejercicio", "seccion-diario", "di-ejercicios", "di-ej-detalle", "zona-pedidos-yeso", "bazar-division-yeso",
    "pop-color", "pop-colores", "pop-mas-colores", "pop-paleta", "pop-color-personal",
    "btn-menu-deudas", "seccion-deudas", "panel-deudas", "de-chips", "de-form",
    "btn-menu-informacion", "seccion-informacion", "panel-informacion", "ip-chips", "ip-form", "ip-fecha",
    "btn-menu-comandos", "seccion-comandos", "panel-comandos", "cm-chips", "cm-form", "cm-fecha",
    "btn-menu-bazar", "seccion-bazar", "panel-bazar", "bz-chips", "bz-form", "bz-informacion",
    "cuenta-nota", "cuenta-dispositivos", "disp-panel", "disp-estado", "disp-lista", "disp-todas",
    "bz-categoria", "bz-zona-yeso", "bz-chips-yeso", "bz-zona-ventas", "bz-chips-ventas", "bazar-division-ventas",
    "btn-menu-hoy", "seccion-hoy", "panel-hoy", "hy-grupos", "hy-detalle", "hy-detalle-fin", "hy-detalle-estado",
    "btn-menu-empresas", "seccion-empresas", "panel-empresas", "em-chips", "em-form", "em-fecha", "em-url-img", "em-usar-url", "em-detalle", "em-det-ajustes", "em-hoja", "em-hoja-abrir", "em-hoja-abrir-2", "em-hoja-nota-esp", "em-nesp", "em-canal",
    "ej-destino", "di-destino", "de-destino", "ip-destino", "cm-destino", "bz-destino",
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
  // Pedidos de Yeso ya no es una sección aparte: vive dentro de la página de Bazar
  if (id === "pedidos-yeso") id = "seccion-bazar";
  // Si hay una nota a medias (en Notas o en una zona), se pregunta antes de salir
  if (!confirmarAbandonoEdicion()) return;
  mensajeInicio.hidden = true;
  secciones.forEach((s) => (s.hidden = s.id !== id));
  botonesMenu.forEach((b) =>
    b.classList.toggle("activo", b.dataset.seccion === id)
  );
  if (id === "calendario") irAHoy(); // siempre abre en la fecha actual
  else cerrarPopover();
  // La página de Notas se prepara al entrar (lista primero, sin formularios abiertos)
  panelNotas.hidden = id !== "seccion-notas";
  if (id === "seccion-notas") entrarNotas();
  // Ejercicio y Diario también son páginas: se preparan al entrar y se limpian al salir
  if (id === "seccion-ejercicio") entrarEjercicio();
  else cerrarEjercicio();
  if (id === "seccion-diario") entrarDiario();
  else cerrarDiario();
  // Deudas también es una página
  if (id === "seccion-deudas") entrarDeudas();
  else cerrarDeudas();
  // Información Primordial también es una página
  if (id === "seccion-informacion") entrarInformacion();
  else cerrarInformacion();
  // Comandos también es una página
  if (id === "seccion-comandos") entrarComandos();
  else cerrarComandos();
  // Bazar también es una página
  if (id === "seccion-bazar") entrarBazar();
  else cerrarBazar();
  // Empresas/Proyectos también es una página
  if (id === "seccion-empresas") entrarEmpresas();
  else cerrarEmpresas();
  // Día de Hoy también es una página
  if (id === "seccion-hoy") entrarHoy();
  else cerrarHoy();
  // Tareas Obligatorias Diarias también es una página
  if (id === "seccion-tareas") entrarTareas();
  // Los Notarios se leen la primera vez que se ve una zona que los tiene
  if (typeof actualizarNotarios === "function") actualizarNotarios();
}

// Todos los botones del menú cambian de sección (Ejercicio y Diario también son páginas)
botonesMenu.forEach((b) => {
  if (b.dataset.seccion) b.addEventListener("click", () => mostrarSeccion(b.dataset.seccion));
});

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

let calendarioCargado = false; // ya se leyeron los datos del calendario con la sesión actual

// Quita los datos del calendario de la pantalla (sin sesión nadie los ve)
function vaciarCalendario(aviso) {
  Object.keys(datos).forEach((k) => delete datos[k]);
  calendarioCargado = false;
  cerrarPopover();
  dibujarCalendario();
  mostrarEstadoCal(aviso || "");
}

// Leer el calendario también exige iniciar sesión con la cuenta autorizada
async function cargarDatos() {
  if (!configurado()) {
    mostrarEstadoCal(
      "Falta conectar Google Sheets: revisa config.js y el README.",
      "error"
    );
    return;
  }
  const idToken = credencialVigente();
  if (!idToken) {
    vaciarCalendario("Inicia sesión con Google (menú ☰) para ver tu calendario.");
    return;
  }
  mostrarEstadoCal("Cargando datos…");
  try {
    // text/plain evita el "preflight" de CORS con Apps Script
    const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: CONFIG.TOKEN, idToken, accion: "calendario_listar" }),
    });
    const j = await leerJsonRespuesta(r);
    sesionRechazada(j);
    if (!j.ok) throw new Error(j.error || "Error desconocido");
    Object.keys(datos).forEach((k) => delete datos[k]);
    Object.assign(datos, j.datos);
    calendarioCargado = true;
    mostrarEstadoCal("");
    dibujarCalendario();
  } catch (e) {
    mostrarEstadoCal("No se pudieron cargar los datos: " + e.message, "error");
  }
}

// Se llama cuando cambia la sesión: al entrar se leen los datos y al salir se quitan de pantalla
function actualizarCalendarioSesion() {
  if (sesionVigente()) {
    if (!calendarioCargado) cargarDatos();
  } else {
    vaciarCalendario("Inicia sesión con Google (menú ☰) para ver tu calendario.");
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
  const j = await leerJsonRespuesta(r);
  sesionRechazada(j);
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

// Color de un día (vacío = sin color): un pastel con nombre o un código #rrggbb
function colorDeDia(fecha) {
  const c = String((datos[fecha] || {}).color || "").trim();
  return c ? hexDeColor(c) : "";
}

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
    const colorDia = colorDeDia(fecha);
    if (colorDia) {
      el.classList.add("con-color");
      el.style.background = colorDia;
      el.style.color = esColorOscuro(colorDia) ? "#fff" : "#2b2140";
    }

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

// ---------- Página del día (igual que la del Diario) ----------
// Al tocar un día, el calendario se cambia por una página con: el botón largo «Descripción del día»
// (texto corto: Día de bazar, Día de descanso…), un recuadro por cada Actividad y Anotación del día y un
// recuadro «+ Añadir». Los datos son los mismos de siempre (columnas B, C y D de la primera hoja).
const seccionCal = document.getElementById("calendario");
const popover = document.getElementById("dia-popover"); // la página del día
const popTitulo = document.getElementById("pop-titulo");
const popCerrar = document.getElementById("pop-cerrar"); // botón «‹ Volver»
const calDescBtn = document.getElementById("cal-desc-dia");
const calDescTexto = document.getElementById("cal-desc-texto");
const calDiaEstado = document.getElementById("cal-dia-estado");
const calChips = document.getElementById("cal-chips");
const calForm = document.getElementById("cal-form");
const calFormTitulo = document.getElementById("cal-form-titulo");
const calTipoCampo = document.getElementById("cal-tipo-campo");
const calTipo = document.getElementById("cal-tipo");
const calTambienCampo = document.getElementById("cal-tambien-campo");
const calTambien = document.getElementById("cal-tambien");
const calTextoEtiqueta = document.getElementById("cal-texto-etiqueta");
const calTexto = document.getElementById("cal-texto");
const calGuardar = document.getElementById("cal-guardar");
const calBorrar = document.getElementById("cal-borrar");
const calFormEstado = document.getElementById("cal-form-estado");

// Tipos de recuadro que se dibujan en la página del día (la descripción va en su propio botón)
const CAL_TIPOS = {
  actividades: { icono: "🎯", nombre: "Actividad", confirmar: "¿Eliminar esta actividad?" },
  anotaciones: { icono: "📝", nombre: "Anotación", confirmar: "¿Eliminar esta anotación?" },
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

function elementosDe(fecha, campo) {
  return parsearElementos((datos[fecha] || {})[campo]);
}

// Fecha y hora del momento de guardar, con el formato: 14/10/2026 21:35
function selloFechaHora() {
  const n = new Date();
  return `${dos(n.getDate())}/${dos(n.getMonth() + 1)}/${n.getFullYear()} ` +
    `${dos(n.getHours())}:${dos(n.getMinutes())}`;
}

// Los textos de Actividades y Anotaciones empiezan con una línea «dd/mm/aaaa hh:mm»: se separa del texto
function partirSello(t) {
  const m = /^(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2})[ \t]*\r?\n([\s\S]*)$/.exec(String(t || "").trim());
  return m ? { sello: m[1], texto: m[2].trim() } : { sello: "", texto: String(t || "").trim() };
}

// ----- Botón «Descripción del día» -----
// La descripción es una sola por día (si en la hoja había varias, se unen en un solo texto)
const textoDescripcionDia = (fecha) => elementosDe(fecha, "descripcion").join("\n\n");

function dibujarDescDia(fecha) {
  const t = textoDescripcionDia(fecha);
  calDescTexto.textContent = t || "Toca para escribir…";
  calDescBtn.classList.toggle("vacia", !t);
  calDescBtn.title = t || "Descripción del día";
}

// ----- Recuadros de Actividades y Anotaciones -----
function dibujarChipsCal(fecha) {
  calChips.innerHTML = "";
  Object.keys(CAL_TIPOS).forEach((campo) => {
    const tipo = CAL_TIPOS[campo];
    elementosDe(fecha, campo).forEach((crudo, indice) => {
      const { sello, texto } = partirSello(crudo);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ej-chip ej-chip-resumen";
      b.title = tipo.nombre + (sello ? " (" + sello + ")" : "");
      b.setAttribute("aria-label", "Ver o editar la " + tipo.nombre.toLowerCase());
      const n = document.createElement("span");
      n.className = "ej-chip-nombre";
      n.textContent = tipo.icono + " " + tipo.nombre;
      const d = document.createElement("span");
      d.className = "ej-chip-desc";
      d.textContent = resumenCorto(texto, 70);
      if (sello) {
        const f = document.createElement("span");
        f.className = "ej-chip-fecha";
        f.textContent = sello.split(" ")[1] || sello; // solo la hora; la fecha ya es el día abierto
        b.append(n, f, d);
      } else {
        b.append(n, d);
      }
      b.addEventListener("click", () => abrirFormCal(campo, indice));
      calChips.appendChild(b);
    });
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir una actividad o anotación");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormCal("nuevo", null));
  calChips.appendChild(nuevo);
}

// ----- Ventana para escribir / editar -----
// calEditando = { campo: "descripcion" | "actividades" | "anotaciones" | "nuevo", indice }
let calEditando = null;

function abrirFormCal(campo, indice) {
  const fecha = seleccion;
  if (!fecha) return;
  calEditando = { campo, indice };
  let texto = "";
  let hayGuardado = false;
  calTipoCampo.hidden = campo !== "nuevo";
  calTambienCampo.hidden = campo !== "nuevo"; // «Anotar también en» solo al crear
  calTambien.value = "";
  if (campo === "descripcion") {
    texto = textoDescripcionDia(fecha);
    hayGuardado = !!texto;
    calFormTitulo.textContent = "Descripción del día";
    calTextoEtiqueta.textContent = "Descripción del día";
    calTexto.placeholder = "Ej. Día de bazar, día de descanso, día de compras…";
  } else if (campo === "nuevo") {
    calFormTitulo.textContent = "Nueva nota del día";
    calTextoEtiqueta.textContent = "Texto";
    calTexto.placeholder = "Escribe aquí…";
    calTipo.value = "actividades";
  } else {
    const crudo = elementosDe(fecha, campo)[indice];
    if (crudo === undefined) return;
    texto = partirSello(crudo).texto;
    hayGuardado = true;
    calFormTitulo.textContent = "Editar " + CAL_TIPOS[campo].nombre.toLowerCase();
    calTextoEtiqueta.textContent = "Texto";
    calTexto.placeholder = "Escribe aquí…";
  }
  calTexto.value = texto;
  calBorrar.hidden = !hayGuardado;
  calBorrar.disabled = false;
  calGuardar.disabled = false;
  setEstado(calFormEstado, "");
  calForm.hidden = false;
  calTexto.focus();
}

function cerrarFormCal() {
  calForm.hidden = true;
  calEditando = null;
}

async function guardarFormCal() {
  const fecha = seleccion;
  const edit = calEditando;
  if (!fecha || !edit) return;
  const texto = calTexto.value.trim();
  if (!texto) {
    setEstado(calFormEstado, edit.campo === "descripcion" ? "Escribe la descripción (o usa Eliminar)" : "Escribe algo primero", "error");
    return;
  }
  let campo = edit.campo;
  let elementos;
  if (campo === "descripcion") {
    elementos = [limpiarElemento(texto)]; // la descripción es una sola
  } else if (campo === "nuevo") {
    campo = calTipo.value === "anotaciones" ? "anotaciones" : "actividades";
    // La fecha y hora van al inicio del recuadro, en su propia línea, antes del texto
    elementos = elementosDe(fecha, campo).concat(limpiarElemento(selloFechaHora() + "\n" + texto));
  } else {
    elementos = elementosDe(fecha, campo);
    if (edit.indice >= elementos.length) {
      setEstado(calFormEstado, "Ese texto ya no existe. Vuelve a abrir el día.", "error");
      return;
    }
    const { sello } = partirSello(elementos[edit.indice]);
    elementos[edit.indice] = limpiarElemento(sello ? sello + "\n" + texto : texto); // se conserva su fecha y hora
  }
  calGuardar.disabled = true;
  setEstado(calFormEstado, "Guardando…");
  try {
    await guardarCampo(fecha, campo, serializarElementos(elementos));
    // Si se pidió, además se crea como Actividad o Trabajo (en la hoja «Notas», con la fecha de este día)
    let avisoAct = "";
    const tambien = edit.campo === "nuevo" ? calTambien.value : "";
    if (tambien) {
      try {
        await crearActividadDeRecuerdo({
          idRecuerdo: String(Date.now() * 1000 + Math.floor(Math.random() * 1000)),
          nombre: nombreCortoDeTexto(texto),
          dia: fecha,
          texto,
          tipo: tambien,
        });
      } catch (err2) {
        avisoAct = "Se guardó en el calendario, pero no se pudo crear en " + (tambien === "trabajo" ? "Trabajo" : "Actividades") + ": " + err2.message;
      }
    }
    if (seleccion === fecha) {
      cerrarFormCal();
      dibujarDescDia(fecha);
      dibujarChipsCal(fecha);
      setEstado(calDiaEstado, avisoAct || "Guardado ✓", avisoAct ? "error" : "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    setEstado(calFormEstado, "Error: " + e.message, "error");
  } finally {
    calGuardar.disabled = false;
  }
}

async function borrarFormCal() {
  const fecha = seleccion;
  const edit = calEditando;
  if (!fecha || !edit || edit.campo === "nuevo") return;
  const aviso = edit.campo === "descripcion" ? "¿Eliminar la descripción del día?" : CAL_TIPOS[edit.campo].confirmar;
  if (!window.confirm(aviso)) return;
  const elementos = edit.campo === "descripcion" ? [] : elementosDe(fecha, edit.campo);
  if (edit.campo !== "descripcion") elementos.splice(edit.indice, 1);
  calBorrar.disabled = true;
  setEstado(calFormEstado, "Eliminando…");
  try {
    await guardarCampo(fecha, edit.campo, serializarElementos(elementos));
    if (seleccion === fecha) {
      cerrarFormCal();
      dibujarDescDia(fecha);
      dibujarChipsCal(fecha);
      setEstado(calDiaEstado, "Eliminado", "ok");
    }
    actualizarMarca(fecha);
  } catch (e) {
    calBorrar.disabled = false;
    setEstado(calFormEstado, "Error: " + e.message, "error");
  }
}

calDescBtn.addEventListener("click", () => abrirFormCal("descripcion", 0));
calGuardar.addEventListener("click", guardarFormCal);
calBorrar.addEventListener("click", borrarFormCal);
document.getElementById("cal-cancelar").addEventListener("click", cerrarFormCal);

function textoFecha(fecha) {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function abrirDia(fecha) {
  seleccion = fecha;
  dibujarCalendario();

  popTitulo.textContent = textoFecha(fecha);
  cerrarFormCal();
  setEstado(calDiaEstado, "");
  dibujarDescDia(fecha);
  dibujarChipsCal(fecha);

  pintarPanelDia((datos[fecha] || {}).color);
  setEstado(popColorEstado, "");
  plegarPaletaDia();

  // El calendario se cambia por la página del día (como en el Diario); «‹ Volver» lo trae de vuelta
  seccionCal.classList.add("con-dia-abierto");
  popover.hidden = false;
  popover.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cerrarPopover() {
  if (popover.hidden && !seleccion) return;
  cerrarFormCal();
  popover.hidden = true;
  seleccion = null;
  seccionCal.classList.remove("con-dia-abierto");
  cuadricula
    .querySelectorAll(".seleccionado")
    .forEach((e) => e.classList.remove("seleccionado"));
}

popCerrar.addEventListener("click", cerrarPopover);
// Esc cierra primero la ventana de escritura y después la página del día
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || popover.hidden) return;
  if (!calForm.hidden) cerrarFormCal();
  else cerrarPopover();
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
const cuentaNota = document.getElementById("cuenta-nota");
const btnDispositivos = document.getElementById("cuenta-dispositivos");
const panelDispositivos = document.getElementById("disp-panel");
const dispEstado = document.getElementById("disp-estado");
const dispLista = document.getElementById("disp-lista");
const dispTodas = document.getElementById("disp-todas");

let usuario = null; // { nombre, correo, foto, credencial, exp, tipo }  (tipo: "dispositivo" o "google")
try {
  usuario = JSON.parse(localStorage.getItem(CLAVE_SESION));
} catch (e) {
  usuario = null;
}

// Cómo dura la sesión:
//  - "dispositivo": al iniciar sesión con Google, el Apps Script le da a ESTE dispositivo un pase propio de
//    larga duración (365 días) que se renueva solo cada vez que abres la página. Así la sesión casi nunca
//    se cierra. Se puede cerrar desde la barra lateral (Dispositivos).
//  - "google": respaldo si el Apps Script no entregó el pase: la credencial de Google dura cerca de 1 hora
//    y pasado ese tiempo hay que volver a entrar.
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

function guardarUsuario() {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  } catch (e) {}
}

let temporizadorSesion = null;
function programarCaducidad() {
  clearTimeout(temporizadorSesion);
  if (!usuario) return;
  // setTimeout no admite esperas de más de ~24 días: se programa por tramos
  const ms = Math.min(Math.max(usuario.exp * 1000 - Date.now() - 15000, 0), 2000000000);
  temporizadorSesion = setTimeout(expirarSesion, ms);
}

// Vence la credencial: se cierra la sesión en pantalla y se intenta volver a entrar sola
function expirarSesion() {
  // Si la sesión se renovó mientras tanto (o el tramo del temporizador no era el final), no se cierra
  if (sesionVigente()) {
    programarCaducidad();
    return;
  }
  clearTimeout(temporizadorSesion);
  usuario = null;
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) {}
  dibujarCuenta();
  actualizarPanelNotas();
  if (window.google && google.accounts && google.accounts.id) google.accounts.id.prompt();
}

// El Apps Script avisa con «sesionInvalida» cuando el pase de este dispositivo ya no sirve
// (se cerró desde otro dispositivo, venció, etc.): se cierra la sesión en pantalla
function sesionRechazada(j) {
  if (j && j.sesionInvalida && usuario && usuario.tipo === "dispositivo") {
    usuario.exp = 0;
    expirarSesion();
  }
}

// Llamada directa al Apps Script para las acciones de sesión
async function llamarSesion(accion, credencial, extra) {
  const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ token: CONFIG.TOKEN, idToken: credencial, accion }, extra || {})),
  });
  return leerJsonRespuesta(r);
}

// Nombre corto del dispositivo, para reconocerlo en la lista («Chrome en Android»…)
function nombreDispositivo() {
  if (esAppNativa()) return "App Polo AI en Android";
  const ua = navigator.userAgent || "";
  const nav = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox"
    : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Navegador";
  const so = /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iPhone/iPad" : /Windows/.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "otro sistema";
  return nav + " en " + so;
}

// Con el token de Google recién emitido, pide al Apps Script el pase de este dispositivo.
// Si falla (por ejemplo, el Apps Script aún es una versión vieja), se sigue con la credencial de Google.
async function crearSesionDispositivo(credencialGoogle) {
  if (!configurado()) return null;
  try {
    const j = await llamarSesion("sesion_crear", credencialGoogle, { dispositivo: nombreDispositivo() });
    if (j.ok && j.token && j.exp) return { token: j.token, exp: j.exp };
  } catch (e) {
    /* se usa la credencial de Google */
  }
  return null;
}

// Renueva el pase de este dispositivo (se llama al abrir la página y cada cierto tiempo)
async function renovarSesionDispositivo() {
  if (!usuario || usuario.tipo !== "dispositivo" || !sesionVigente() || !configurado()) return;
  try {
    const j = await llamarSesion("sesion_renovar", usuario.credencial);
    sesionRechazada(j);
    if (j.ok && j.exp && usuario && usuario.tipo === "dispositivo") {
      usuario.exp = j.exp;
      guardarUsuario();
      programarCaducidad();
    }
  } catch (e) {
    /* sin conexión: se reintenta la próxima vez */
  }
}
setInterval(renovarSesionDispositivo, 6 * 60 * 60 * 1000);

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
  if (!usuario) {
    cerrarDispositivos();
    return;
  }
  cuentaNombre.textContent = usuario.nombre || "";
  cuentaCorreo.textContent = usuario.correo || "";
  const fotoValida = typeof usuario.foto === "string" && usuario.foto.startsWith("https://");
  cuentaFoto.hidden = !fotoValida;
  if (fotoValida) cuentaFoto.src = usuario.foto;
  // «Dispositivos» solo tiene sentido con el pase de dispositivo
  btnDispositivos.hidden = usuario.tipo !== "dispositivo";
  cuentaNota.textContent =
    usuario.tipo === "dispositivo"
      ? "Sesión guardada en este dispositivo."
      : "Sesión temporal (dura cerca de 1 hora).";
}

async function respuestaGoogle(resp) {
  try {
    const p = decodificarJWT(resp.credential);
    googleAviso.hidden = true;
    // Primero se intenta el pase de larga duración de este dispositivo; si no, se usa el token de Google
    const pase = await crearSesionDispositivo(resp.credential);
    usuario = {
      nombre: p.name || "",
      correo: p.email || "",
      foto: p.picture || "",
      credencial: pase ? pase.token : resp.credential,
      exp: pase ? pase.exp : p.exp,
      tipo: pase ? "dispositivo" : "google",
    };
    guardarUsuario();
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
  ofBorrarDatos(); // las listas guardadas para usar sin internet se borran del dispositivo
  nativoAlCerrarSesion(); // app de Android: se cancelan las alarmas del sistema y se sale de Google
  // Se cierra también en el Apps Script el pase de este dispositivo (si lo hay)
  if (usuario && usuario.tipo === "dispositivo" && usuario.credencial && configurado()) {
    llamarSesion("sesion_cerrar", usuario.credencial).catch(() => {});
  }
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

// ----- Dispositivos con sesión guardada (barra lateral) -----
function fechaHoraCorta(ms) {
  if (!ms) return "—";
  const d = new Date(ms);
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

function cerrarDispositivos() {
  if (typeof panelDispositivos !== "undefined") panelDispositivos.hidden = true;
}

async function cargarDispositivos() {
  if (!usuario || usuario.tipo !== "dispositivo") return;
  dispEstado.textContent = "Cargando…";
  try {
    const j = await llamarSesion("sesion_listar", usuario.credencial);
    sesionRechazada(j);
    if (!j.ok) throw new Error(j.error || "Error");
    dispEstado.textContent = j.sesiones.length ? "" : "No hay dispositivos guardados.";
    dispLista.innerHTML = "";
    j.sesiones.forEach((x) => {
      const li = document.createElement("li");
      li.className = "disp-item";
      const txt = document.createElement("div");
      txt.className = "disp-texto";
      const n = document.createElement("strong");
      n.textContent = x.dispositivo + (x.actual ? " (este dispositivo)" : "");
      const f = document.createElement("span");
      f.textContent = "Último uso: " + fechaHoraCorta(x.ultimo);
      txt.append(n, f);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "disp-cerrar";
      b.textContent = x.actual ? "Salir" : "Cerrar";
      b.addEventListener("click", async () => {
        if (!window.confirm("¿Cerrar la sesión de «" + x.dispositivo + "»?")) return;
        b.disabled = true;
        if (x.actual) {
          cerrarSesion();
          return;
        }
        try {
          const r = await llamarSesion("sesion_revocar", usuario.credencial, { id: x.id });
          if (!r.ok) throw new Error(r.error || "Error");
          cargarDispositivos();
        } catch (err) {
          dispEstado.textContent = "Error: " + err.message;
          b.disabled = false;
        }
      });
      li.append(txt, b);
      dispLista.appendChild(li);
    });
  } catch (err) {
    dispEstado.textContent = "Error: " + err.message;
  }
}

btnDispositivos.addEventListener("click", () => {
  panelDispositivos.hidden = !panelDispositivos.hidden;
  if (!panelDispositivos.hidden) cargarDispositivos();
});
dispTodas.addEventListener("click", async () => {
  if (!window.confirm("¿Cerrar la sesión en TODOS los dispositivos, incluido este?")) return;
  try {
    await llamarSesion("sesion_revocar", usuario.credencial, { todas: true });
  } catch (err) {
    /* aun así se cierra la de este dispositivo */
  }
  cerrarSesion();
});

function iniciarGoogle() {
  if (typeof CONFIG === "undefined" || !CONFIG.GOOGLE_CLIENT_ID) {
    googleAviso.textContent =
      "Falta configurar GOOGLE_CLIENT_ID en config.js (revisa el README).";
    googleAviso.hidden = false;
    return;
  }
  // App de Android (Capacitor): el botón de Google de la web no funciona dentro de la app; se usa el inicio de sesión nativo
  if (esAppNativa()) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Iniciar sesión con Google";
    b.style.cssText = "padding:12px 20px;font:inherit;font-weight:700;color:#fff;background:#1a1a1a;border:1px solid #5f6368;border-radius:999px;cursor:pointer";
    b.addEventListener("click", loginGoogleNativo);
    googleBoton.innerHTML = "";
    googleBoton.appendChild(b);
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
const notasDestino = document.getElementById("notas-destino");
const notasColores = document.getElementById("notas-colores");
const notasGuardar = document.getElementById("notas-guardar");
const notasEstado = document.getElementById("notas-estado");
const notasEstadoLista = document.getElementById("notas-estado-lista");
const notasNuevaBtn = document.getElementById("notas-nueva-btn");
const notasCancelar = document.getElementById("notas-cancelar");
const notasTipo = document.getElementById("notas-tipo");
const notasCampoTipo = document.getElementById("notas-campo-tipo");
const migNotas = montarMigrar(notasDestino, {
  accion: "migrar_drive",
  extra: { zona: "nota" },
  obtener: () => notaEditando,
  estado: notasEstado,
  listo: () => {
    // el formulario ya no cuenta el cambio de lugar como «cambios sin guardar»
    try { const a = JSON.parse(notasSnap); a[6] = "drive"; notasSnap = JSON.stringify(a); } catch (e) {}
    dibujarNotas();
  },
});
function aplicarTipoNotas() {
  ntAplicarTipoForm(notasForm, notasTipo, notasDestino, notasNombre, notasTexto, notasGuardar, notaEditando ? "Guardar cambios" : "Guardar nota");
  migNotas.actualizar(notaEditando && notasTipo.value !== "notario" ? notaEditando : null);
}
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
const notasIdent = document.getElementById("notas-identificador");
const notasFormTitulo = document.getElementById("notas-form-titulo");
const notasCaja = document.querySelector("#panel-notas .notas-caja");

let notaEditando = null; // nota que se está editando en el formulario (null = nota nueva)

let notas = []; // [{ id, nombre, fecha, etiqueta, texto, color, identificador }]
let notasCargadas = false;
let etiquetaAbierta = null; // etiqueta cuyo submenú está abierto (null = ninguno)
let etiquetaPendiente = null; // etiqueta a abrir en cuanto terminen de cargar las notas (acceso directo)
const MAX_FILA_NOTAS = 4; // notas visibles por fila; el resto va en el submenú

// Etiquetas y colores (los nombres se guardan tal cual en la hoja; deben coincidir con el Apps Script)
const ETIQUETAS_NOTA = [
  "General",
  "Tarea/Actividad",
  "Conjunto de Datos",
  "Sueños",
  "Pendiente Importante",
  "Pedidos de Yeso",
  "Actividades",
  "Trabajo",
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

// Lee la respuesta del Apps Script. Si Google devuelve una página HTML (en vez de JSON) se explica con claridad,
// en lugar de mostrar «Unexpected token '<'»
async function leerJsonRespuesta(r) {
  const texto = await r.text();
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(
      "Google respondió una página en vez de datos (código " + r.status + "). Suele pasar si el Apps Script no está " +
      "implementado con su última versión, si el acceso no es «Cualquier persona», o si tardó demasiado. Intenta de nuevo."
    );
  }
}

// Llama al Apps Script para las notas (siempre con la sesión de Google)
// Llamada directa a internet (sin modo «sin internet»). limiteMs (opcional): si la red no responde en ese tiempo se corta.
async function llamarNotasRed(accion, extra, limiteMs) {
  if (!configurado()) throw new Error("Falta configurar config.js");
  const idToken = credencialVigente();
  if (!idToken) throw new Error("Inicia sesión con Google");
  const ctl = limiteMs ? new AbortController() : null;
  const reloj = ctl ? setTimeout(() => ctl.abort(), limiteMs) : null;
  let j;
  try {
    // text/plain evita el "preflight" de CORS con Apps Script
    const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ token: CONFIG.TOKEN, idToken, accion }, extra || {})),
      signal: ctl ? ctl.signal : undefined,
    });
    j = await leerJsonRespuesta(r);
  } finally {
    if (reloj) clearTimeout(reloj);
  }
  sesionRechazada(j);
  if (!j.ok) throw new Error(j.error || "Error");
  return j;
}

// ---------- Modo sin internet ----------
// Todas las lecturas y guardados de las zonas pasan por llamarNotas. Aquí se agrega:
//  - Con conexión, la última lista de cada zona se guarda en este dispositivo.
//  - Sin conexión (o con una red que no responde), se muestra esa última lista más las notas nuevas que aún no se suben,
//    y los guardados NUEVOS (no las ediciones ni los borrados) se ponen en la cola «polo-offline-cola», que se sube sola
//    al volver el internet (ver subirPendientesSinInternet, al final de este archivo).
const OF_CLAVE_COLA = "polo-offline-cola"; // la misma que usa sin-internet.html
const OF_CLAVE_DATOS = "polo-offline-datos:";
// acción de lectura -> nombre de la lista dentro de la respuesta
const OF_LISTAS = {
  nota_listar: "notas", ejercicio_listar: "ejercicios", diario_listar: "diarios", deuda_listar: "deudas",
  informacion_listar: "informaciones", comando_listar: "comandosLista", bazar_listar: "bazarLista",
  empresa_listar: "empresas", proyecto_listar: "proyectos", notario_listar: "notarios", tarea_diaria_listar: "tareas",
};
// guardado nuevo permitido sin internet -> [lectura que lo muestra, nombre de la zona]
const OF_AGREGAR = {
  nota_agregar: ["nota_listar", "Notas"],
  ejercicio_agregar: ["ejercicio_listar", "Ejercicio"],
  diario_agregar: ["diario_listar", "Diario"],
  deuda_agregar: ["deuda_listar", "Deudas"],
  informacion_agregar: ["informacion_listar", "Información Primordial"],
  comando_agregar: ["comando_listar", "Comandos"],
  bazar_agregar: ["bazar_listar", "Bazar"],
};

function ofLeerCola() {
  try { return JSON.parse(localStorage.getItem(OF_CLAVE_COLA)) || []; } catch (e) { return []; }
}
function ofGuardarCola(c) {
  try { localStorage.setItem(OF_CLAVE_COLA, JSON.stringify(c)); return true; } catch (e) { return false; }
}
function ofLeerLista(accion) {
  try { return JSON.parse(localStorage.getItem(OF_CLAVE_DATOS + accion)); } catch (e) { return null; }
}
function ofEscribirLista(accion, c) {
  try { localStorage.setItem(OF_CLAVE_DATOS + accion, JSON.stringify(c)); } catch (e) { /* sin espacio: se sigue sin copia */ }
}
// Al cerrar sesión se borran las listas guardadas en el dispositivo (la cola de notas pendientes se conserva)
function ofBorrarDatos() {
  try {
    Object.keys(localStorage).forEach((k) => { if (k.indexOf(OF_CLAVE_DATOS) === 0) localStorage.removeItem(k); });
  } catch (e) {}
}

// Agrega un elemento nuevo a la copia guardada de su lista (para que no «desaparezca» si luego se abre sin internet)
function ofMezclarEnCache(accionAgregar, payload) {
  const def = OF_AGREGAR[accionAgregar];
  if (!def || !payload || !payload.id) return;
  const c = ofLeerLista(def[0]);
  const clave = OF_LISTAS[def[0]];
  if (!c || !c.j || !Array.isArray(c.j[clave])) return;
  if (c.j[clave].some((x) => String(x.id) === String(payload.id))) return;
  c.j[clave].push(payload);
  ofEscribirLista(def[0], c);
}

function ofSinRed(e) {
  return navigator.onLine === false || (e && e.name === "AbortError") ||
    (e instanceof TypeError && /fetch|network|load failed|conexi/i.test(String(e.message)));
}

let ofAvisoEl = null;
let ofAvisoTimer = null;
let ofAvisoMostrado = false;
function ofAviso(texto, siempre) {
  if (ofAvisoMostrado && !siempre) return;
  ofAvisoMostrado = true;
  if (!ofAvisoEl) {
    ofAvisoEl = document.createElement("div");
    ofAvisoEl.className = "aviso-flotante";
    ofAvisoEl.setAttribute("role", "status");
    document.body.appendChild(ofAvisoEl);
  }
  ofAvisoEl.textContent = texto;
  ofAvisoEl.hidden = false;
  clearTimeout(ofAvisoTimer);
  ofAvisoTimer = setTimeout(() => { ofAvisoEl.hidden = true; }, 6000);
}

async function llamarNotas(accion, extra) {
  const esLista = OF_LISTAS[accion];
  const esAgregar = OF_AGREGAR[accion];
  try {
    const j = await llamarNotasRed(accion, extra, esLista ? 20000 : esAgregar ? 30000 : 0);
    ofAvisoMostrado = false; // hubo conexión: la próxima vez que falle se vuelve a avisar
    if (esLista) ofEscribirLista(accion, { guardado: Date.now(), j });
    else if (esAgregar) ofMezclarEnCache(accion, extra);
    return j;
  } catch (e) {
    // Solo se usa el modo sin internet si de verdad es un problema de conexión y hay una sesión vigente
    if (!ofSinRed(e) || !credencialVigente()) throw e;

    if (esLista) {
      const c = ofLeerLista(accion);
      if (!c || !c.j) throw new Error("Sin internet, y esta zona todavía no se había abierto con conexión en este dispositivo.");
      const j = Object.assign({}, c.j, { offline: true });
      const clave = OF_LISTAS[accion];
      j[clave] = Array.isArray(j[clave]) ? j[clave].slice() : [];
      // Lo anotado sin internet que todavía no se sube también se ve
      const cola = ofLeerCola();
      Object.keys(OF_AGREGAR).forEach((acc) => {
        if (OF_AGREGAR[acc][0] !== accion) return;
        cola.forEach((x) => {
          if (x.accion === acc && x.payload && !j[clave].some((y) => String(y.id) === String(x.payload.id))) j[clave].push(x.payload);
        });
      });
      ofAviso("📴 Sin internet: se muestra lo último guardado en este dispositivo. Lo nuevo que anotes se subirá solo al volver la conexión.");
      return j;
    }

    if (esAgregar && extra && extra.id) {
      const cola = ofLeerCola();
      if (!cola.some((x) => x.payload && String(x.payload.id) === String(extra.id))) {
        const zona = extra.categoria === "Ventas" ? "Ventas" : esAgregar[1];
        cola.push({ zona, accion, payload: extra, creado: Date.now() });
        if (!ofGuardarCola(cola)) throw new Error("No cupo en el dispositivo para guardar esto sin internet.");
      }
      ofAviso("📴 Sin internet: guardado en este dispositivo ✓ Se subirá solo al volver la conexión.", true);
      return { ok: true, offline: true };
    }

    throw new Error("Sin internet: esto necesita conexión. Sin internet solo se pueden agregar elementos nuevos (notas, diario, ejercicio, deudas, información, comandos y bazar).");
  }
}

// ----- Botón «☁ Migrar a Drive» -----
// Aparece dentro de la edición de una nota cuyo texto todavía vive en Google Sheets. El Apps Script pasa el texto a un
// archivo .txt de la carpeta notaslargas y lo quita de la celda de la hoja (la fila se queda como índice de la página).
//  cfg.obtener()  -> el registro que se está editando (o null)
//  cfg.accion / cfg.extra -> acción del Apps Script (se manda con el id del registro); o cfg.ejecutar(it) si hace falta otra cosa
//  cfg.estado     -> elemento donde se muestra el resultado; cfg.listo(it) -> se llama al terminar bien
//  cfg.siempre    -> true si el registro no tiene un texto propio que revisar (notarios)
function montarMigrar(selDestino, cfg) {
  const campo = selDestino.closest("label");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "notas-btn notas-btn-sec btn-migrar-drive";
  btn.textContent = "☁ Migrar a Drive";
  btn.title = "Pasa el texto de Google Sheets a un archivo de Google Drive y lo quita de la hoja";
  btn.hidden = true;
  campo.insertAdjacentElement("afterend", btn);
  const aviso = (t, tipo) => {
    if (cfg.estado) setEstado(cfg.estado, t, tipo);
    else if (tipo === "error") window.alert(t);
  };
  btn.addEventListener("click", async () => {
    const it = cfg.obtener();
    if (!it) return;
    const nombre = String(it.nombre || "").trim() || "este registro";
    if (!window.confirm("¿Migrar «" + nombre + "» a Google Drive?\n\nSu texto se guardará en un archivo .txt de la carpeta notaslargas y se quitará de la hoja de Google Sheets.")) return;
    btn.disabled = true;
    btn.textContent = "Migrando…";
    try {
      if (cfg.ejecutar) await cfg.ejecutar(it);
      else await llamarNotas(cfg.accion, Object.assign({ id: it.id }, cfg.extra || {}));
      it.destino = "drive";
      selDestino.value = "drive";
      btn.hidden = true;
      if (cfg.listo) cfg.listo(it);
      aviso("Migrada a Drive ✓", "ok");
    } catch (err) {
      aviso("Error al migrar: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "☁ Migrar a Drive";
    }
  });
  return {
    // Muestra el botón solo si el registro existe, sigue en Sheets y tiene texto
    actualizar(it) {
      const hayTexto = cfg.siempre || (it && String(it.texto || it.descripcion || it.informacion || "").trim() !== "");
      btn.hidden = !(it && it.destino !== "drive" && hayTexto);
    },
  };
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
  salirModoEdicion();
  notasForm.hidden = !mostrar;
  notasNuevaBtn.hidden = mostrar;
  notasCampoTipo.hidden = false;
  notasTipo.value = "nota";
  aplicarTipoNotas();
  if (mostrar) {
    notasFecha.value = fechaActualInput();
    setEstado(notasEstado, "");
    notasNombre.focus();
    notasSnap = notasValores();
  }
}

// Vacía el formulario (deja los valores de una nota nueva)
function limpiarFormNota() {
  notasTexto.value = "";
  notasNombre.value = "";
  notasIdent.value = "";
  notasEtiqueta.selectedIndex = 0;
  notasDestino.value = "drive";
  notasTipo.value = "nota";
  aplicarTipoNotas();
  elegirColor("Blanco");
  notasFecha.value = fechaActualInput();
}

// Vuelve el formulario a su lugar normal (arriba de la lista) y a modo "Nueva nota"
function salirModoEdicion() {
  if (!notaEditando) return;
  notaEditando = null;
  notasForm.classList.remove("modo-editar");
  notasContenido.insertBefore(notasForm, notasLista);
  notasFormTitulo.textContent = "Nueva nota";
  notasGuardar.textContent = "Guardar nota";
  notasCampoTipo.hidden = false;
}

// Abre la edición de una nota: el mismo formulario, con sus datos, como ventana encima del panel
function abrirEdicionNota(n) {
  if (notaFormSucio() && !window.confirm("Tienes una nota sin guardar. ¿Descartarla para editar esta?")) return;

  salirModoEdicion();
  notaEditando = n;
  notasNombre.value = n.nombre === "Sin nombre" ? "" : n.nombre || "";
  notasEtiqueta.value = ETIQUETAS_NOTA.includes(n.etiqueta) ? n.etiqueta : "General";
  const c = String(n.color || "").trim();
  const colorValido = /^#[0-9a-fA-F]{6}$/.test(c) || COLORES_NOTA.some((x) => x.nombre === c);
  elegirColor(colorValido ? (c.startsWith("#") ? c.toLowerCase() : c) : "Blanco");
  notasFecha.value = fechaAInput(n.fecha) || fechaActualInput();
  notasIdent.value = n.identificador || "";
  notasDestino.value = n.destino === "drive" ? "drive" : "sheets";
  notasTexto.value = n.texto || "";
  notasFormTitulo.textContent = "Editar nota";
  notasTipo.value = "nota";
  notasCampoTipo.hidden = true; // al editar una nota no se cambia el tipo
  aplicarTipoNotas();
  notasGuardar.textContent = "Guardar cambios";
  setEstado(notasEstado, "");

  notasForm.hidden = false;
  notasForm.classList.add("modo-editar");
  notasCaja.appendChild(notasForm); // al final de la caja: queda por encima de la lista y del submenú
  notasForm.scrollTop = 0;
  notasSnap = notasValores();
  notasNombre.focus();
}

// Cierra la edición sin guardar
function cancelarEdicionNota() {
  limpiarFormNota();
  mostrarFormNota(false);
}

// ----- Cambios sin guardar: se pregunta antes de abandonar la edición de una nota -----
const MENSAJE_ABANDONAR = "Tienes cambios sin guardar. ¿Seguro que quieres abandonar la edición actual?";
let notasSnap = ""; // valores del formulario de Notas al abrirlo (para saber si se cambió algo)

function notasValores() {
  return JSON.stringify([
    notasNombre.value, notasEtiqueta.value, colorElegido, notasFecha.value, notasIdent.value, notasTexto.value, notasDestino.value, notasTipo.value,
  ]);
}
// El formulario de Notas está abierto y se cambió algo desde que se abrió
function notaFormSucio() {
  return !notasForm.hidden && notasValores() !== notasSnap;
}
function confirmarAbandonoNota() {
  return !notaFormSucio() || window.confirm(MENSAJE_ABANDONAR);
}
function hayEdicionSinGuardar() {
  return notaFormSucio() || zonas.some((z) => z.sucio());
}
// Pregunta si hay algo sin guardar; si se acepta, el borrador se descarta
function confirmarAbandonoEdicion() {
  if (!hayEdicionSinGuardar()) return true;
  if (!window.confirm(MENSAJE_ABANDONAR)) return false;
  if (notaFormSucio()) {
    limpiarFormNota();
    mostrarFormNota(false);
  }
  zonas.forEach((z) => {
    if (z.sucio()) z.cancelar();
  });
  return true;
}
// Cerrar o recargar la página con una nota a medias también avisa
window.addEventListener("beforeunload", (e) => {
  if (hayEdicionSinGuardar()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

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

// Clave de orden del identificador: 0 = número, 1 = palabra, 2 = sin identificador
function claveIdent(s) {
  const v = String(s || "").trim();
  if (!v) return { tipo: 2 };
  if (/^-?\d+([.,]\d+)?$/.test(v)) return { tipo: 0, num: parseFloat(v.replace(",", ".")) };
  return { tipo: 1, txt: v };
}

// Orden de las notas: primero las que tienen identificador numérico (1, 2, 3…), luego las de
// palabra (A a Z) y al final las que no tienen. Con el mismo identificador (o sin él),
// la más reciente según su fecha va primero (si la fecha es igual, la última guardada).
function notasOrdenadas() {
  const orden = notas.map((n, i) => ({ n, i, t: marcaTiempo(n.fecha), k: claveIdent(n.identificador) }));
  orden.sort((x, y) => {
    if (x.k.tipo !== y.k.tipo) return x.k.tipo - y.k.tipo;
    if (x.k.tipo === 0 && x.k.num !== y.k.num) return x.k.num - y.k.num;
    if (x.k.tipo === 1) {
      const c = x.k.txt.localeCompare(y.k.txt, "es", { sensitivity: "base", numeric: true });
      if (c) return c;
    }
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
  const meta = document.createElement("div");
  meta.className = "tarjeta-meta";
  meta.appendChild(etiqueta);
  if (n.identificador) {
    const ident = document.createElement("span");
    ident.className = "tarjeta-ident";
    ident.title = "Identificador";
    ident.textContent = "#" + n.identificador;
    meta.appendChild(ident);
  }
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
  borrar.addEventListener("click", (e) => {
    e.stopPropagation();
    borrarNota(n.id);
  });
  tarjeta.append(nombre, meta, fecha, texto, borrar);

  // Tocar la tarjeta en cualquier zona abre su edición (los botones ✎ y × siguen con su función)
  tarjeta.tabIndex = 0;
  tarjeta.setAttribute("role", "button");
  tarjeta.setAttribute("aria-label", "Editar la nota " + (n.nombre || "Sin nombre"));
  tarjeta.addEventListener("click", (e) => {
    if (e.target.closest("button, input")) return;
    if (String(window.getSelection()).length) return; // si estaba seleccionando texto, no se abre
    abrirEdicionNota(n);
  });
  tarjeta.addEventListener("keydown", (e) => {
    if (e.target === tarjeta && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      abrirEdicionNota(n);
    }
  });
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
    dibujarZonasEtiqueta(); // Actividades y Trabajo usan las mismas notas
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
  dibujarZonasEtiqueta(); // Actividades y Trabajo usan las mismas notas
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
    if (etiquetaPendiente) irAEtiquetaNotas(etiquetaPendiente);
  } catch (e) {
    etiquetaPendiente = null;
    setEstado(notasEstadoLista, "Error: " + e.message, "error");
  }
}

async function agregarNota() {
  // Tipo «Notario»: se crea un notario (nombre + descripción) en vez de una nota
  if (notasTipo.value === "notario") {
    const nuevo = await ntCrearDesdeFormulario("notas", notasNombre.value, notasTexto.value, notasDestino.value, notasGuardar, notasEstado);
    if (nuevo) {
      limpiarFormNota();
      mostrarFormNota(false);
      setEstado(notasEstadoLista, "Notario creado ✓", "ok");
      ntAbrir(nuevo); // se abre para agregarle notas de una vez
    }
    return;
  }
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
    identificador: notasIdent.value.trim(),
    destino: notasDestino.value,
  };
  notasGuardar.disabled = true;
  setEstado(notasEstado, "Guardando…");
  try {
    await llamarNotas("nota_agregar", nota);
    notas.push(nota);
    limpiarFormNota();
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

async function editarNota() {
  const n = notaEditando;
  if (!n) return;
  const texto = notasTexto.value.trim();
  if (!texto) {
    setEstado(notasEstado, "Escribe algo primero", "error");
    return;
  }
  const cambios = {
    nombre: notasNombre.value.trim() || "Sin nombre",
    fecha: inputAFecha(notasFecha.value) || n.fecha || selloFechaHora(),
    etiqueta: notasEtiqueta.value,
    texto,
    color: colorElegido,
    identificador: notasIdent.value.trim(),
    destino: notasDestino.value,
  };
  notasGuardar.disabled = true;
  setEstado(notasEstado, "Guardando…");
  try {
    await llamarNotas("nota_editar", Object.assign({ id: n.id }, cambios));
    Object.assign(n, cambios);
    limpiarFormNota();
    mostrarFormNota(false);
    dibujarNotas();
    setEstado(notasEstadoLista, "Cambios guardados ✓", "ok");
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
  actualizarPanelProyectos(); // la sesión también afecta a los paneles de Proyectos y Galería
  actualizarPanelGaleria();
  actualizarPanelEjercicio(); // y al de Ejercicio
  actualizarPanelDiario(); // y al de Diario
  actualizarPanelDeudas(); // y al de Deudas
  actualizarPanelInformacion(); // y al de Información Primordial
  actualizarPanelComandos(); // y al de Comandos
  actualizarPanelBazar(); // y al de Bazar
  actualizarPanelEmpresas(); // y al de Empresas/Proyectos
  actualizarPanelHoy(); // y al de Día de Hoy
  actualizarPanelTareas(); // y al de Tareas Obligatorias Diarias
  actualizarZonasEtiqueta(); // y a las zonas de Actividades y Trabajo
  if (typeof actualizarNotarios === "function") actualizarNotarios(); // y a los Notarios de todas las zonas
  actualizarCalendarioSesion(); // y a los datos del calendario
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

// Se llama al entrar a la página de Notas (desde mostrarSeccion)
function entrarNotas() {
  panelNotas.hidden = false;
  mostrarFormNota(false); // al abrir, primero se ve la lista de notas
  cerrarSubmenu();
  actualizarPanelNotas();
}

// Desde la barra lateral o el acceso directo: cierra la barra y cambia a la página de Notas
function abrirNotas() {
  etiquetaPendiente = null;
  cerrarLateral();
  mostrarSeccion("seccion-notas");
}

// Notas ya es una página: aquí solo se sale de la edición o del submenú (se cambia de página con el menú)
function cerrarNotas() {
  if (notaEditando) cancelarEdicionNota();
  cerrarSubmenu();
}

btnNotas.addEventListener("click", abrirNotas);
// El botón «Notas» del menú principal (data-seccion="seccion-notas") cambia de página como los demás botones
// El botón «Ejercicio» del menú principal (btn-menu-ejercicio) abre su propio calendario (más abajo)
document.getElementById("notas-cerrar").addEventListener("click", cerrarNotas);
document.getElementById("notas-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarNotas();
  else actualizarPanelNotas();
});
document.getElementById("notas-ir-login").addEventListener("click", () => {
  cerrarNotas();
  abrirLateral();
});
notasGuardar.addEventListener("click", () => (notaEditando ? editarNota() : agregarNota()));
notasNuevaBtn.addEventListener("click", () => mostrarFormNota(true));
// Al cambiar de Nota a Notario (y al revés) se ajusta el formulario y el lugar sugerido para guardar
notasTipo.addEventListener("change", () => {
  notasDestino.value = "drive";
  aplicarTipoNotas();
});
notasCancelar.addEventListener("click", () => {
  if (!confirmarAbandonoNota()) return;
  if (notaEditando) cancelarEdicionNota();
  else {
    limpiarFormNota(); // si había algo escrito y se aceptó abandonarlo, se descarta
    mostrarFormNota(false);
  }
});
notasSubVolver.addEventListener("click", cerrarSubmenu);
// Tocar el fondo oscuro (fuera de la caja) cierra el panel; Esc también
panelNotas.addEventListener("click", (e) => {
  if (e.target === panelNotas) cerrarNotas();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panelNotas.hidden) {
    // Esc cierra primero la edición, luego el submenú y, si no hay, el panel de notas
    if (notaEditando) {
      if (confirmarAbandonoNota()) cancelarEdicionNota();
    } else if (etiquetaAbierta !== null) cerrarSubmenu();
    else cerrarNotas();
  }
});

// ---------- Proyectos (hoja «Proyectos» de Google Sheets; imágenes en imgbb) ----------
const btnProyectos = document.getElementById("btn-proyectos");
const panelProyectos = document.getElementById("panel-proyectos");
const proySinSesion = document.getElementById("proy-sin-sesion");
const proyContenido = document.getElementById("proy-contenido");
const proyGrid = document.getElementById("proy-grid");
const proyEstadoLista = document.getElementById("proy-estado-lista");
const proyForm = document.getElementById("proy-form");
const proyFormTitulo = document.getElementById("proy-form-titulo");
const proyVista = document.getElementById("proy-vista");
const proyElegirImg = document.getElementById("proy-elegir-img");
const proyQuitarImg = document.getElementById("proy-quitar-img");
const proyArchivo = document.getElementById("proy-archivo");
const proyNombre = document.getElementById("proy-nombre");
const proyFecha = document.getElementById("proy-fecha");
const proyDescripcion = document.getElementById("proy-descripcion");
const proyLinks = document.getElementById("proy-links");
const proyLinksVista = document.getElementById("proy-links-vista");
const proyGuardar = document.getElementById("proy-guardar");
const proyCancelar = document.getElementById("proy-cancelar");
const proyBorrar = document.getElementById("proy-borrar");
const proyEstado = document.getElementById("proy-estado");

let proyectos = []; // [{ id, nombre, fecha, descripcion, imagen, links }]
let proyectosCargados = false;
let proyectoEditando = null; // proyecto abierto en el formulario (null = proyecto nuevo)
let proyImagenUrl = ""; // imagen actual del proyecto (URL de imgbb)
let proyImagenNueva = null; // { base64, vista } cuando se eligió una imagen que aún no se sube
const MAX_LADO_IMAGEN = 1600; // las fotos se reducen a este tamaño antes de subirlas

// Más recientes primero (según su fecha)
function proyectosOrdenados() {
  const orden = proyectos.map((p, i) => ({ p, i, t: marcaTiempo(p.fecha) }));
  orden.sort((x, y) => {
    const tx = isNaN(x.t) ? -Infinity : x.t;
    const ty = isNaN(y.t) ? -Infinity : y.t;
    return tx === ty ? y.i - x.i : ty - tx;
  });
  return orden.map((o) => o.p);
}

// ----- Links: uno por línea en la hoja y en el formulario -----
function enlacesDeTexto(t) {
  return String(t || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}
// Solo se enlazan direcciones http(s) (o dominios sin "https://"); lo demás se muestra como texto
function hrefSeguro(s) {
  if (/^https?:\/\/\S+$/i.test(s)) return s;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[^\s\/]+\.[^\s\/]{2,}(\/\S*)?$/.test(s)) return "https://" + s;
  return "";
}
function dibujarLinksProyecto() {
  proyLinksVista.innerHTML = "";
  enlacesDeTexto(proyLinks.value).forEach((l) => {
    const href = hrefSeguro(l);
    const el = document.createElement(href ? "a" : "span");
    if (href) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
    el.textContent = l;
    proyLinksVista.appendChild(el);
  });
}
proyLinks.addEventListener("input", dibujarLinksProyecto);

// ----- Imagen: se reduce en el navegador y el Apps Script la sube a imgbb -----
function leerImagenReducida(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const k = Math.min(1, MAX_LADO_IMAGEN / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k));
      const h = Math.max(1, Math.round(img.naturalHeight * k));
      const lienzo = document.createElement("canvas");
      lienzo.width = w;
      lienzo.height = h;
      const ctx = lienzo.getContext("2d");
      ctx.fillStyle = "#fff"; // las transparencias quedan en blanco al guardar como JPG
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const vista = lienzo.toDataURL("image/jpeg", 0.85);
      resolve({ vista, base64: vista.split(",")[1] });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

function imagenValida(u) {
  return /^https?:\/\/\S+$/i.test(String(u || ""));
}

function dibujarVistaImagen() {
  proyVista.innerHTML = "";
  const src = proyImagenNueva ? proyImagenNueva.vista : proyImagenUrl;
  if (src && (proyImagenNueva || imagenValida(src))) {
    const img = document.createElement("img");
    img.alt = "Imagen del proyecto";
    img.referrerPolicy = "no-referrer";
    img.src = src;
    proyVista.appendChild(img);
  } else {
    proyVista.textContent = "Sin imagen";
  }
  proyQuitarImg.hidden = !(proyImagenNueva || proyImagenUrl);
  proyElegirImg.textContent = proyImagenNueva || proyImagenUrl ? "Cambiar imagen" : "Elegir imagen";
}

proyElegirImg.addEventListener("click", () => proyArchivo.click());
proyQuitarImg.addEventListener("click", () => {
  proyImagenNueva = null;
  proyImagenUrl = "";
  proyArchivo.value = "";
  dibujarVistaImagen();
});
proyArchivo.addEventListener("change", async () => {
  const archivo = proyArchivo.files && proyArchivo.files[0];
  if (!archivo) return;
  setEstado(proyEstado, "Preparando imagen…");
  try {
    proyImagenNueva = await leerImagenReducida(archivo);
    dibujarVistaImagen();
    setEstado(proyEstado, "");
  } catch (e) {
    setEstado(proyEstado, "Error: " + e.message, "error");
  }
  proyArchivo.value = "";
});

// ----- Cuadrícula -----
function crearTileProyecto(p) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "proy-tile";
  b.setAttribute("aria-label", "Editar el proyecto " + (p.nombre || "Sin nombre"));
  const vacio = () => {
    const v = document.createElement("span");
    v.className = "proy-tile-vacio";
    v.setAttribute("aria-hidden", "true");
    v.textContent = "🖼️";
    return v;
  };
  if (imagenValida(p.imagen)) {
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = p.imagen;
    img.addEventListener("error", () => img.replaceWith(vacio()));
    b.appendChild(img);
  } else {
    b.appendChild(vacio());
  }
  const nombre = document.createElement("span");
  nombre.className = "proy-tile-nombre";
  nombre.textContent = p.nombre || "Sin nombre";
  b.appendChild(nombre);
  b.addEventListener("click", () => abrirFormProyecto(p));
  return b;
}

function dibujarProyectos() {
  proyGrid.innerHTML = "";
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "proy-tile proy-tile-nuevo";
  nuevo.setAttribute("aria-label", "Agregar un proyecto nuevo");
  nuevo.innerHTML = '<span class="proy-mas" aria-hidden="true">+</span><span>Nuevo proyecto</span>';
  nuevo.addEventListener("click", () => abrirFormProyecto(null));
  proyGrid.appendChild(nuevo);
  proyectosOrdenados().forEach((p) => proyGrid.appendChild(crearTileProyecto(p)));
}

// ----- Ventana de edición -----
function abrirFormProyecto(p) {
  proyectoEditando = p;
  proyImagenUrl = p ? p.imagen || "" : "";
  proyImagenNueva = null;
  proyFormTitulo.textContent = p ? "Editar proyecto" : "Nuevo proyecto";
  proyNombre.value = p ? (p.nombre === "Sin nombre" ? "" : p.nombre || "") : "";
  proyFecha.value = (p && fechaAInput(p.fecha)) || fechaActualInput();
  proyDescripcion.value = p ? p.descripcion || "" : "";
  proyLinks.value = p ? enlacesDeTexto(p.links).join("\n") : "";
  proyGuardar.textContent = p ? "Guardar cambios" : "Guardar proyecto";
  proyBorrar.hidden = !p;
  setEstado(proyEstado, "");
  dibujarVistaImagen();
  dibujarLinksProyecto();
  proyForm.hidden = false;
  proyForm.scrollTop = 0;
  proyNombre.focus();
}

function cerrarFormProyecto() {
  proyForm.hidden = true;
  proyectoEditando = null;
  proyImagenNueva = null;
  proyImagenUrl = "";
  proyArchivo.value = "";
}

async function guardarProyecto() {
  const nombre = proyNombre.value.trim();
  if (!nombre) {
    setEstado(proyEstado, "Escribe un nombre", "error");
    return;
  }
  proyGuardar.disabled = true;
  try {
    // 1) Si se eligió una imagen nueva, se sube a imgbb a través del Apps Script
    if (proyImagenNueva) {
      setEstado(proyEstado, "Subiendo imagen…");
      const j = await llamarNotas("proyecto_imagen", { imagen: proyImagenNueva.base64 });
      proyImagenUrl = j.url;
      proyImagenNueva = null; // si el guardado falla, no se vuelve a subir
    }
    // 2) Se guarda el proyecto en la hoja
    setEstado(proyEstado, "Guardando…");
    const datos = {
      nombre,
      fecha: inputAFecha(proyFecha.value) || (proyectoEditando && proyectoEditando.fecha) || selloFechaHora(),
      descripcion: proyDescripcion.value.trim(),
      imagen: proyImagenUrl,
      links: enlacesDeTexto(proyLinks.value).join("\n"),
    };
    if (proyectoEditando) {
      await llamarNotas("proyecto_editar", Object.assign({ id: proyectoEditando.id }, datos));
      Object.assign(proyectoEditando, datos);
    } else {
      const nuevo = Object.assign({ id: String(Date.now()) }, datos);
      await llamarNotas("proyecto_agregar", nuevo);
      proyectos.push(nuevo);
    }
    cerrarFormProyecto();
    dibujarProyectos();
    setEstado(proyEstadoLista, "Guardado ✓", "ok");
  } catch (e) {
    setEstado(proyEstado, "Error: " + e.message, "error");
  } finally {
    proyGuardar.disabled = false;
  }
}

async function borrarProyecto() {
  const p = proyectoEditando;
  if (!p || !window.confirm("¿Eliminar este proyecto? (la imagen seguirá en imgbb)")) return;
  proyBorrar.disabled = true;
  setEstado(proyEstado, "Eliminando…");
  try {
    await llamarNotas("proyecto_borrar", { id: p.id });
    proyectos = proyectos.filter((x) => x.id !== p.id);
    cerrarFormProyecto();
    dibujarProyectos();
    setEstado(proyEstadoLista, "Eliminado", "ok");
  } catch (e) {
    setEstado(proyEstado, "Error: " + e.message, "error");
  } finally {
    proyBorrar.disabled = false;
  }
}

async function cargarProyectos() {
  setEstado(proyEstadoLista, "Cargando…");
  try {
    const j = await llamarNotas("proyecto_listar");
    proyectos = Array.isArray(j.proyectos) ? j.proyectos : [];
    proyectosCargados = true;
    dibujarProyectos();
    setEstado(proyEstadoLista, "");
  } catch (e) {
    setEstado(proyEstadoLista, "Error: " + e.message, "error");
  }
}

function actualizarPanelProyectos() {
  if (panelProyectos.hidden) return;
  const dentro = sesionVigente();
  proySinSesion.hidden = dentro;
  proyContenido.hidden = !dentro;
  if (dentro) {
    if (!proyectosCargados) cargarProyectos();
  } else {
    proyectosCargados = false;
    proyectos = [];
    cerrarFormProyecto();
  }
}

function abrirProyectos() {
  cerrarLateral();
  panelProyectos.hidden = false;
  cerrarFormProyecto();
  actualizarPanelProyectos();
}
function cerrarProyectos() {
  cerrarFormProyecto();
  panelProyectos.hidden = true;
}

btnProyectos.addEventListener("click", abrirProyectos);
document.getElementById("proy-cerrar").addEventListener("click", cerrarProyectos);
document.getElementById("proy-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarProyectos();
  else actualizarPanelProyectos();
});
document.getElementById("proy-ir-login").addEventListener("click", () => {
  cerrarProyectos();
  abrirLateral();
});
proyGuardar.addEventListener("click", guardarProyecto);
proyCancelar.addEventListener("click", cerrarFormProyecto);
proyBorrar.addEventListener("click", borrarProyecto);
// Tocar el fondo oscuro (fuera de la caja) cierra el panel; Esc cierra primero la ventana de edición
panelProyectos.addEventListener("click", (e) => {
  if (e.target === panelProyectos) cerrarProyectos();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panelProyectos.hidden) {
    if (!proyForm.hidden) cerrarFormProyecto();
    else cerrarProyectos();
  }
});

// ---------- Notas: abrir el submenú de una etiqueta ----------
// Muestra el submenú con todas las notas de una etiqueta (o avisa si todavía no hay ninguna)
function irAEtiquetaNotas(etiqueta) {
  etiquetaPendiente = null;
  if (notas.some((n) => (n.etiqueta || "General") === etiqueta)) abrirSubmenu(etiqueta);
  else setEstado(notasEstadoLista, "Aún no hay notas con la etiqueta «" + etiqueta + "»");
}


// ---------- Galería (hoja «Galeria» de Google Sheets; imágenes en imgbb) ----------
const ETIQUETAS_GALERIA = ["General", "Programacion", "Contenido Digital", "Perfiles"];

const panelGaleria = document.getElementById("panel-galeria");
const galSinSesion = document.getElementById("gal-sin-sesion");
const galContenido = document.getElementById("gal-contenido");
const galFiltros = document.getElementById("gal-filtros");
const galGrid = document.getElementById("gal-grid");
const galEstadoLista = document.getElementById("gal-estado-lista");
const galForm = document.getElementById("gal-form");
const galFormTitulo = document.getElementById("gal-form-titulo");
const galVista = document.getElementById("gal-vista");
const galElegirImg = document.getElementById("gal-elegir-img");
const galArchivo = document.getElementById("gal-archivo");
const galEtiqueta = document.getElementById("gal-etiqueta");
const galDescripcion = document.getElementById("gal-descripcion");
const galGuardar = document.getElementById("gal-guardar");
const galBorrar = document.getElementById("gal-borrar");
const galEstado = document.getElementById("gal-estado");

let galeria = []; // [{ id, imagen, descripcion, etiqueta }]
let galeriaCargada = false;
let galeriaEditando = null; // imagen abierta en el formulario (null = imagen nueva)
let galImagenUrl = ""; // imagen actual (URL de imgbb)
let galImagenNueva = null; // { base64, vista } cuando se eligió una imagen que aún no se sube
let galFiltro = "Todas";

ETIQUETAS_GALERIA.forEach((e) => {
  const op = document.createElement("option");
  op.value = e;
  op.textContent = e;
  galEtiqueta.appendChild(op);
});

// Las más recientes (las últimas de la hoja) primero, y solo las de la etiqueta elegida
function galeriaVisible() {
  const lista = galeria.slice().reverse();
  return galFiltro === "Todas" ? lista : lista.filter((g) => (g.etiqueta || "General") === galFiltro);
}

function dibujarFiltrosGaleria() {
  galFiltros.innerHTML = "";
  ["Todas"].concat(ETIQUETAS_GALERIA).forEach((e) => {
    const n = e === "Todas" ? galeria.length : galeria.filter((g) => (g.etiqueta || "General") === e).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gal-chip" + (e === galFiltro ? " activo" : "");
    b.setAttribute("aria-pressed", e === galFiltro ? "true" : "false");
    b.textContent = e + " (" + n + ")";
    b.addEventListener("click", () => {
      galFiltro = e;
      dibujarGaleria();
    });
    galFiltros.appendChild(b);
  });
}

function crearTileGaleria(g) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "proy-tile";
  b.setAttribute("aria-label", "Editar la imagen " + (g.descripcion || g.etiqueta || ""));
  const vacio = () => {
    const v = document.createElement("span");
    v.className = "proy-tile-vacio";
    v.setAttribute("aria-hidden", "true");
    v.textContent = "🖼️";
    return v;
  };
  if (imagenValida(g.imagen)) {
    const img = document.createElement("img");
    img.alt = g.descripcion || "";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = g.imagen;
    img.addEventListener("error", () => img.replaceWith(vacio()));
    b.appendChild(img);
  } else {
    b.appendChild(vacio());
  }
  const pildora = document.createElement("span");
  pildora.className = "gal-pildora";
  pildora.textContent = g.etiqueta || "General";
  b.appendChild(pildora);
  if (g.descripcion) {
    const d = document.createElement("span");
    d.className = "proy-tile-nombre";
    d.textContent = g.descripcion;
    b.appendChild(d);
  }
  b.addEventListener("click", () => abrirFormGaleria(g));
  return b;
}

function dibujarGaleria() {
  dibujarFiltrosGaleria();
  galGrid.innerHTML = "";
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "proy-tile proy-tile-nuevo";
  nuevo.setAttribute("aria-label", "Agregar una imagen nueva");
  nuevo.innerHTML = '<span class="proy-mas" aria-hidden="true">+</span><span>Nueva imagen</span>';
  nuevo.addEventListener("click", () => abrirFormGaleria(null));
  galGrid.appendChild(nuevo);
  galeriaVisible().forEach((g) => galGrid.appendChild(crearTileGaleria(g)));
}

// ----- Ventana de edición -----
function dibujarVistaGaleria() {
  galVista.innerHTML = "";
  const src = galImagenNueva ? galImagenNueva.vista : galImagenUrl;
  if (src && (galImagenNueva || imagenValida(src))) {
    const img = document.createElement("img");
    img.alt = "Imagen de la galería";
    img.referrerPolicy = "no-referrer";
    img.src = src;
    galVista.appendChild(img);
  } else {
    galVista.textContent = "Sin imagen";
  }
  galElegirImg.textContent = galImagenNueva || galImagenUrl ? "Cambiar imagen" : "Elegir imagen";
}

galElegirImg.addEventListener("click", () => galArchivo.click());
galArchivo.addEventListener("change", async () => {
  const archivo = galArchivo.files && galArchivo.files[0];
  if (!archivo) return;
  setEstado(galEstado, "Preparando imagen…");
  try {
    galImagenNueva = await leerImagenReducida(archivo);
    dibujarVistaGaleria();
    setEstado(galEstado, "");
  } catch (e) {
    setEstado(galEstado, "Error: " + e.message, "error");
  }
  galArchivo.value = "";
});

function abrirFormGaleria(g) {
  galeriaEditando = g;
  galImagenUrl = g ? g.imagen || "" : "";
  galImagenNueva = null;
  galFormTitulo.textContent = g ? "Editar imagen" : "Nueva imagen";
  // Al agregar, se preselecciona la etiqueta del filtro activo
  const sugerida = g ? g.etiqueta : galFiltro;
  galEtiqueta.value = ETIQUETAS_GALERIA.includes(sugerida) ? sugerida : "General";
  galDescripcion.value = g ? g.descripcion || "" : "";
  galGuardar.textContent = g ? "Guardar cambios" : "Guardar imagen";
  galBorrar.hidden = !g;
  setEstado(galEstado, "");
  dibujarVistaGaleria();
  galForm.hidden = false;
  galForm.scrollTop = 0;
  galElegirImg.focus();
}

function cerrarFormGaleria() {
  galForm.hidden = true;
  galeriaEditando = null;
  galImagenNueva = null;
  galImagenUrl = "";
  galArchivo.value = "";
}

async function guardarGaleria() {
  if (!galImagenNueva && !galImagenUrl) {
    setEstado(galEstado, "Elige una imagen", "error");
    return;
  }
  galGuardar.disabled = true;
  try {
    if (galImagenNueva) {
      setEstado(galEstado, "Subiendo imagen…");
      const j = await llamarNotas("proyecto_imagen", { imagen: galImagenNueva.base64 });
      galImagenUrl = j.url;
      galImagenNueva = null; // si el guardado falla, no se vuelve a subir
    }
    setEstado(galEstado, "Guardando…");
    const datos = {
      imagen: galImagenUrl,
      descripcion: galDescripcion.value.trim(),
      etiqueta: galEtiqueta.value,
    };
    if (galeriaEditando) {
      await llamarNotas("galeria_editar", Object.assign({ id: galeriaEditando.id }, datos));
      Object.assign(galeriaEditando, datos);
    } else {
      const nueva = Object.assign({ id: String(Date.now()) }, datos);
      await llamarNotas("galeria_agregar", nueva);
      galeria.push(nueva);
    }
    cerrarFormGaleria();
    dibujarGaleria();
    setEstado(galEstadoLista, "Guardado ✓", "ok");
  } catch (e) {
    setEstado(galEstado, "Error: " + e.message, "error");
  } finally {
    galGuardar.disabled = false;
  }
}

async function borrarGaleria() {
  const g = galeriaEditando;
  if (!g || !window.confirm("¿Eliminar esta imagen de la galería? (seguirá en imgbb)")) return;
  galBorrar.disabled = true;
  setEstado(galEstado, "Eliminando…");
  try {
    await llamarNotas("galeria_borrar", { id: g.id });
    galeria = galeria.filter((x) => x.id !== g.id);
    cerrarFormGaleria();
    dibujarGaleria();
    setEstado(galEstadoLista, "Eliminada", "ok");
  } catch (e) {
    setEstado(galEstado, "Error: " + e.message, "error");
  } finally {
    galBorrar.disabled = false;
  }
}

async function cargarGaleria() {
  setEstado(galEstadoLista, "Cargando…");
  try {
    const j = await llamarNotas("galeria_listar");
    galeria = Array.isArray(j.galeria) ? j.galeria : [];
    galeriaCargada = true;
    dibujarGaleria();
    setEstado(galEstadoLista, "");
  } catch (e) {
    setEstado(galEstadoLista, "Error: " + e.message, "error");
  }
}

function actualizarPanelGaleria() {
  if (panelGaleria.hidden) return;
  const dentro = sesionVigente();
  galSinSesion.hidden = dentro;
  galContenido.hidden = !dentro;
  if (dentro) {
    if (!galeriaCargada) cargarGaleria();
  } else {
    galeriaCargada = false;
    galeria = [];
    cerrarFormGaleria();
  }
}

function abrirGaleria() {
  cerrarLateral();
  panelGaleria.hidden = false;
  cerrarFormGaleria();
  actualizarPanelGaleria();
}
function cerrarGaleria() {
  cerrarFormGaleria();
  panelGaleria.hidden = true;
}

document.getElementById("btn-galeria").addEventListener("click", abrirGaleria);
document.getElementById("gal-cerrar").addEventListener("click", cerrarGaleria);
document.getElementById("gal-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarGaleria();
  else actualizarPanelGaleria();
});
document.getElementById("gal-ir-login").addEventListener("click", () => {
  cerrarGaleria();
  abrirLateral();
});
galGuardar.addEventListener("click", guardarGaleria);
document.getElementById("gal-cancelar").addEventListener("click", cerrarFormGaleria);
galBorrar.addEventListener("click", borrarGaleria);
// Tocar el fondo oscuro cierra el panel; Esc cierra primero la ventana de edición
panelGaleria.addEventListener("click", (e) => {
  if (e.target === panelGaleria) cerrarGaleria();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panelGaleria.hidden) {
    if (!galForm.hidden) cerrarFormGaleria();
    else cerrarGaleria();
  }
});

// ---------- Actividad o trabajo creado desde el Diario o el Calendario ----------
// El recuerdo se queda en su zona, en su día. Además se crea una nota en la hoja «Notas» con la etiqueta
// «Actividades» o «Trabajo» y la fecha de ese día, para que aparezca en esas zonas (con su botón de
// finalizar). Su Id es el del recuerdo MÁS OFFSET_ID_ACTIVIDAD (el mismo número está en el Apps Script):
// así, al finalizar, el Apps Script encuentra el recuerdo del Diario y le agrega la fecha de término.
const OFFSET_ID_ACTIVIDAD = 7000000007;
const ETIQUETA_DE_TIPO = { actividad: "Actividades", trabajo: "Trabajo" };
function nombreCortoDeTexto(t) {
  const linea = String(t || "").split(/\r?\n/).map((x) => x.trim()).find((x) => x) || "";
  return linea.slice(0, 60) || "Sin nombre";
}
async function crearActividadDeRecuerdo({ idRecuerdo, nombre, dia, texto, tipo }) {
  const etiqueta = ETIQUETA_DE_TIPO[tipo];
  if (!etiqueta) return;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dia || "");
  const ahora = new Date();
  const fecha = m
    ? `${m[3]}/${m[2]}/${m[1]} ${dos(ahora.getHours())}:${dos(ahora.getMinutes())}`
    : selloFechaHora();
  const nota = {
    id: String(Number(idRecuerdo) + OFFSET_ID_ACTIVIDAD),
    nombre: String(nombre || "").trim().slice(0, 80) || "Sin nombre",
    fecha,
    etiqueta,
    texto,
    color: "Blanco",
    identificador: "",
    destino: "drive",
  };
  await llamarNotas("nota_agregar", nota);
  if (notasCargadas) {
    notas.push(nota);
    dibujarNotas();
  }
}

// ---------- Actividades y Trabajo (hoja «Notas» con una etiqueta fija) ----------
// Cada zona vive dentro de su sección del menú superior y tiene su propio botón de crear, con el
// mismo formulario de las notas, pero la etiqueta ya viene fija (Actividades o Trabajo).
// Usan la misma lista `notas` y la misma hoja que el panel de Notas: lo que se crea aquí también
// aparece allí, en su fila de etiqueta, y lo que se cambia en un lado se ve en el otro.
// Las etiquetas deben estar también en ETIQUETAS_NOTA (arriba) y en el Apps Script.
const ZONAS_ETIQUETA = [
  {
    seccion: "actividades", etiqueta: "Actividades", datos: "tus actividades",
    crear: "+ Crear actividad", nuevo: "Nueva actividad", editar: "Editar actividad",
    guardar: "Guardar actividad", marcador: "Escribe una actividad nueva…",
    vacio: "Aún no hay actividades. ¡Crea la primera! ✨", borrar: "¿Eliminar esta actividad?",
    cuadritos: true, // las tarjetas se ven como cuadritos (igual que en Ejercicio, Diario, etc.)
    finalizar: true, // cada tarjeta lleva el botón de finalizar (pasa al Diario y le agrega la fecha de término al recuerdo)
    elegirEtiqueta: true, // al crear se elige entre Nota, Actividad o Trabajo
  },
  {
    seccion: "trabajo", etiqueta: "Trabajo", datos: "tus trabajos",
    crear: "+ Crear trabajo", nuevo: "Nuevo trabajo", editar: "Editar trabajo",
    guardar: "Guardar trabajo", marcador: "Escribe un trabajo nuevo…",
    vacio: "Aún no hay trabajos. ¡Crea el primero! ✨", borrar: "¿Eliminar este trabajo?",
    vista: true, // al tocar una tarjeta se abre primero una nota sencilla (la tuerca abre la edición)
    finalizar: true, // cada tarjeta lleva el botón «Marcar tarea como finalizada» (pasa al Diario)
    elegirEtiqueta: true, // al crear se elige entre Nota, Actividad o Trabajo
    cuadritos: true, // las tarjetas se ven como cuadritos (igual que en Ejercicio, Diario, etc.)
  },
  {
    // Vive dentro de la página de Bazar (debajo de una división; en: «seccion-bazar»). El botón «Pedidos de Yeso» de la barra lateral abre Bazar y baja hasta aquí
    seccion: "pedidos-yeso", en: "seccion-bazar", etiqueta: "Pedidos de Yeso", datos: "tus pedidos de yeso",
    crear: "+ Crear pedido", nuevo: "Nuevo pedido", editar: "Editar pedido",
    guardar: "Guardar pedido", marcador: "Escribe un pedido nuevo…",
    vacio: "Aún no hay pedidos de yeso. ¡Crea el primero! ✨", borrar: "¿Eliminar este pedido?",
  },
];

// Arma una zona: formulario (igual al de Notas), botón de crear y lista de tarjetas de su etiqueta
function crearZonaEtiqueta(cfg) {
  const cont = document.getElementById("zona-" + cfg.seccion);
  const textoFin = cfg.etiqueta === "Actividades" ? "actividad" : "tarea"; // «Marcar … como finalizada»
  cont.innerHTML = `
    <div class="zona-sin-sesion notas-aviso-sesion" hidden>
      <p>Inicia sesión con tu cuenta de Google para ver y guardar ${cfg.datos}.</p>
      <button type="button" class="notas-btn zona-ir-login">Iniciar sesión</button>
    </div>
    <div class="zona-contenido" hidden>
      <div class="notas-barra">
        <button type="button" class="notas-btn zona-nueva-btn">${cfg.crear}</button>
        <button type="button" class="notas-btn-icono zona-actualizar"
                title="Volver a leer ${cfg.datos} de Google Sheets" aria-label="Actualizar ${cfg.datos}">&#8635;</button>
        <span class="notas-estado zona-estado-lista"></span>
      </div>
      <div class="notas-nueva zona-form" hidden>
        <h3 class="notas-form-titulo zona-form-titulo">${cfg.nuevo}</h3>
        <label class="notas-campo zona-campo-tipo">
          <span>Tipo</span>
          <select class="zona-tipo">
            <option value="nota">📝 Nota</option>
            <option value="notario">📒 Notario (varias notas dentro)</option>
          </select>
        </label>
        <div class="notas-superior">
          <label class="notas-campo notas-campo-etiqueta">
            <span>Etiqueta</span>
            ${cfg.elegirEtiqueta
              ? `<select class="zona-etiqueta-sel" aria-label="Etiqueta">
              <option value="General">📝 Nota</option>
              <option value="Actividades">🎯 Actividad</option>
              <option value="Trabajo">💼 Trabajo</option>
            </select>`
              : `<input class="zona-etiqueta-fija" type="text" value="${cfg.etiqueta}" readonly tabindex="-1" />`}
          </label>
          <div class="notas-campo notas-campo-color">
            <span>Color</span>
            <div class="notas-colores zona-colores" role="radiogroup" aria-label="Color"></div>
            <button type="button" class="notas-enlace zona-mas-colores" aria-expanded="false">Más colores ▾</button>
            <div class="notas-paleta zona-paleta" hidden>
              <div class="zona-paleta-familias"></div>
              <label class="notas-personal zona-personal">
                <input class="zona-color-personal" type="color" value="#ffffff" aria-label="Elegir cualquier color" />
                <span>Elegir cualquier otro color</span>
              </label>
            </div>
          </div>
        </div>
        <div class="notas-campos notas-campos-par">
          <label class="notas-campo">
            <span>Fecha y hora</span>
            <input class="zona-fecha" type="datetime-local" />
          </label>
          <label class="notas-campo">
            <span>Identificador (1, 2, 3… o una palabra)</span>
            <input class="zona-ident" type="text" maxlength="40" placeholder="Opcional" autocomplete="off" />
          </label>
        </div>
        <label class="notas-campo" hidden>
          <span>Guardar en</span>
          <select class="zona-destino">
            <option value="sheets">Google Sheets (en la hoja Notas)</option>
            <option value="drive">Google Drive (archivo .txt en notaslargas)</option>
          </select>
        </label>
        <label class="notas-campo notas-campo-nombre">
          <span>Nombre</span>
          <input class="zona-nombre" type="text" maxlength="80" placeholder="Nombre" autocomplete="off" />
        </label>
        <textarea class="zona-texto" rows="4" maxlength="1000000"
                  placeholder="${cfg.marcador}" aria-label="${cfg.nuevo}"></textarea>
        <div class="notas-fila">
          <button type="button" class="notas-btn zona-guardar">${cfg.guardar}</button>
          <button type="button" class="notas-btn notas-btn-sec zona-cancelar">Cancelar</button>
          <span class="notas-estado zona-estado"></span>
        </div>
      </div>
      <div class="notas-grid zona-lista"></div>
    </div>`;

  const q = (s) => cont.querySelector(s);
  const z = {
    cfg,
    seccion: document.getElementById(cfg.en || cfg.seccion),
    sinSesion: q(".zona-sin-sesion"),
    contenido: q(".zona-contenido"),
    nuevoBtn: q(".zona-nueva-btn"),
    estadoLista: q(".zona-estado-lista"),
    form: q(".zona-form"),
    titulo: q(".zona-form-titulo"),
    nombre: q(".zona-nombre"),
    colores: q(".zona-colores"),
    masColores: q(".zona-mas-colores"),
    paleta: q(".zona-paleta"),
    familias: q(".zona-paleta-familias"),
    personal: q(".zona-personal"),
    colorPersonal: q(".zona-color-personal"),
    fecha: q(".zona-fecha"),
    ident: q(".zona-ident"),
    etiquetaSel: q(".zona-etiqueta-sel"), // solo en las zonas con etiqueta elegible
    destino: q(".zona-destino"),
    tipo: q(".zona-tipo"),
    campoTipo: q(".zona-campo-tipo"),
    texto: q(".zona-texto"),
    guardarBtn: q(".zona-guardar"),
    estado: q(".zona-estado"),
    lista: q(".zona-lista"),
    editando: null, // nota que se está editando (null = nueva)
    color: "Blanco",
    snap: "", // valores del formulario al abrirlo (para saber si se cambió algo)
  };
  z.mig = montarMigrar(z.destino, {
    accion: "migrar_drive",
    extra: { zona: "nota" },
    obtener: () => z.editando,
    estado: z.estado,
    listo: () => {
      try { const a = JSON.parse(z.snap); a[5] = "drive"; z.snap = JSON.stringify(a); } catch (e) {}
      dibujarNotas();
    },
  });

  // ----- Color (igual que en Notas: pasteles, paleta completa y selector libre) -----
  function elegirColorZona(valor) {
    z.color = valor;
    const hex = hexDeColor(valor);
    z.form.style.setProperty("--fondo-nota", hex);
    aplicarContraste(z.form, hex);
    let enMuestra = false;
    z.form.querySelectorAll(".color-op").forEach((b) => {
      const activo = b.dataset.color.toLowerCase() === String(valor).toLowerCase();
      if (activo) enMuestra = true;
      b.classList.toggle("elegido", activo);
      b.setAttribute("aria-checked", activo ? "true" : "false");
    });
    z.colorPersonal.value = hex;
    z.personal.classList.toggle("elegido", !enMuestra);
  }
  function muestraColorZona(valor, hex, titulo) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "color-op";
    b.dataset.color = valor;
    b.title = titulo;
    b.setAttribute("role", "radio");
    b.setAttribute("aria-label", titulo);
    b.style.background = hex;
    b.addEventListener("click", () => elegirColorZona(valor));
    return b;
  }
  COLORES_NOTA.forEach((c) => z.colores.appendChild(muestraColorZona(c.nombre, c.hex, c.nombre)));
  PALETA_COLORES.forEach((f) => {
    const fila = document.createElement("div");
    fila.className = "paleta-fila";
    const nombre = document.createElement("span");
    nombre.className = "paleta-nombre";
    nombre.textContent = f.titulo;
    const grupo = document.createElement("div");
    grupo.className = "notas-colores";
    grupo.setAttribute("role", "radiogroup");
    grupo.setAttribute("aria-label", f.titulo);
    f.colores.forEach((hex) => grupo.appendChild(muestraColorZona(hex, hex, f.titulo + " " + hex)));
    fila.append(nombre, grupo);
    z.familias.appendChild(fila);
  });
  z.colorPersonal.addEventListener("input", () => elegirColorZona(z.colorPersonal.value.toLowerCase()));
  z.masColores.addEventListener("click", () => {
    const abrir = z.paleta.hidden;
    z.paleta.hidden = !abrir;
    z.masColores.setAttribute("aria-expanded", abrir ? "true" : "false");
    z.masColores.textContent = abrir ? "Menos colores ▴" : "Más colores ▾";
  });
  elegirColorZona("Blanco");

  // ----- Nota sencilla (solo nombre, fecha y descripción); la tuerca abre la edición -----
  let vista = null;
  if (cfg.vista) {
    vista = document.createElement("div");
    vista.className = "zona-vista";
    vista.hidden = true;
    vista.innerHTML = `
      <div class="zona-vista-caja" role="dialog" aria-modal="true">
        <div class="zona-vista-botones">
          <button type="button" class="zona-vista-btn zona-vista-cerrar" aria-label="Cerrar" title="Cerrar">&times;</button>
          <button type="button" class="zona-vista-btn zona-vista-tuerca" aria-label="Modificar" title="Modificar">&#9881;&#65039;</button>
        </div>
        <h3 class="zona-vista-nombre"></h3>
        <div class="zona-vista-fecha"></div>
        <p class="zona-vista-texto"></p>
      </div>`;
    cont.appendChild(vista);
  }
  let viendo = null;
  function cerrarVista() {
    if (!vista) return;
    vista.hidden = true;
    viendo = null;
  }
  function abrirVista(n) {
    viendo = n;
    const caja = vista.querySelector(".zona-vista-caja");
    const hex = hexDeColor(n.color);
    caja.style.setProperty("--fondo", hex);
    aplicarContraste(caja, hex);
    vista.querySelector(".zona-vista-nombre").textContent = n.nombre || "Sin nombre";
    vista.querySelector(".zona-vista-fecha").textContent = n.fecha || "";
    vista.querySelector(".zona-vista-texto").textContent = n.texto || "";
    vista.hidden = false;
    vista.querySelector(".zona-vista-cerrar").focus();
  }
  // Al tocar una tarjeta: nota sencilla (si la zona la usa) o edición directa
  function abrirTarjeta(n) {
    if (vista) abrirVista(n);
    else abrirEdicion(n);
  }
  if (vista) {
    vista.querySelector(".zona-vista-cerrar").addEventListener("click", cerrarVista);
    vista.querySelector(".zona-vista-tuerca").addEventListener("click", () => {
      const n = viendo;
      cerrarVista();
      if (n) abrirEdicion(n);
    });
    // Tocar el fondo oscuro (fuera de la nota) la cierra; Esc también
    vista.addEventListener("click", (e) => {
      if (e.target === vista) cerrarVista();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !vista.hidden) cerrarVista();
    });
  }

  // ----- Formulario -----
  function aplicarTipoZona() {
    ntAplicarTipoForm(z.form, z.tipo, z.destino, z.nombre, z.texto, z.guardarBtn, z.editando ? "Guardar cambios" : cfg.guardar);
    z.mig.actualizar(z.editando && z.tipo.value !== "notario" ? z.editando : null);
  }
  z.tipo.addEventListener("change", () => {
    z.destino.value = "drive";
    aplicarTipoZona();
  });
  function limpiarForm() {
    z.texto.value = "";
    z.nombre.value = "";
    z.ident.value = "";
    z.destino.value = "drive";
    z.tipo.value = "nota";
    if (z.etiquetaSel) {
      z.etiquetaSel.value = cfg.etiqueta;
      z.etiquetaSel.disabled = false;
    }
    aplicarTipoZona();
    elegirColorZona("Blanco");
    z.fecha.value = fechaActualInput();
  }
  // Muestra u oculta el formulario (el botón de crear hace lo contrario); siempre vuelve a modo «nuevo»
  function mostrarForm(mostrar) {
    z.editando = null;
    z.titulo.textContent = cfg.nuevo;
    z.guardarBtn.textContent = cfg.guardar;
    z.form.hidden = !mostrar;
    z.nuevoBtn.hidden = mostrar;
    z.campoTipo.hidden = false;
    z.tipo.value = "nota";
    if (z.etiquetaSel) {
      z.etiquetaSel.value = cfg.etiqueta;
      z.etiquetaSel.disabled = false;
    }
    aplicarTipoZona();
    if (mostrar) {
      z.fecha.value = fechaActualInput();
      setEstado(z.estado, "");
      z.nombre.focus();
      z.snap = z.valores();
    }
  }
  function cancelar() {
    limpiarForm();
    mostrarForm(false);
  }

  // Tocar una tarjeta: el mismo formulario, con sus datos, aquí mismo en la zona
  function abrirEdicion(n) {
    if (z.sucio() && !window.confirm("Tienes cambios sin guardar. ¿Descartarlos para editar este?")) return;
    z.editando = n;
    z.nombre.value = n.nombre === "Sin nombre" ? "" : n.nombre || "";
    const c = String(n.color || "").trim();
    const colorValido = /^#[0-9a-fA-F]{6}$/.test(c) || COLORES_NOTA.some((x) => x.nombre === c);
    elegirColorZona(colorValido ? (c.startsWith("#") ? c.toLowerCase() : c) : "Blanco");
    z.fecha.value = fechaAInput(n.fecha) || fechaActualInput();
    z.ident.value = n.identificador || "";
    z.destino.value = n.destino === "drive" ? "drive" : "sheets";
    z.texto.value = n.texto || "";
    z.titulo.textContent = cfg.editar;
    z.tipo.value = "nota";
    z.campoTipo.hidden = true; // al editar no se cambia el tipo
    if (z.etiquetaSel) {
      z.etiquetaSel.value = cfg.etiqueta; // al editar tampoco se cambia la etiqueta
      z.etiquetaSel.disabled = true;
    }
    aplicarTipoZona();
    z.guardarBtn.textContent = "Guardar cambios";
    setEstado(z.estado, "");
    z.form.hidden = false;
    z.nuevoBtn.hidden = true;
    z.form.scrollIntoView({ behavior: "smooth", block: "nearest" });
    z.snap = z.valores();
    z.nombre.focus();
  }

  // ----- Guardar (nueva o editada) y borrar -----
  async function guardar() {
    // Tipo «Notario»: se crea un notario de esta zona en vez de una nota
    if (z.tipo.value === "notario" && !z.editando) {
      const nuevo = await ntCrearDesdeFormulario(cfg.seccion, z.nombre.value, z.texto.value, z.destino.value, z.guardarBtn, z.estado);
      if (nuevo) {
        limpiarForm();
        mostrarForm(false);
        setEstado(z.estadoLista, "Notario creado ✓", "ok");
        ntAbrir(nuevo);
      }
      return;
    }
    const texto = z.texto.value.trim();
    if (!texto) {
      setEstado(z.estado, "Escribe algo primero", "error");
      return;
    }
    const n = z.editando;
    const datos = {
      nombre: z.nombre.value.trim() || "Sin nombre",
      fecha: inputAFecha(z.fecha.value) || (n && n.fecha) || selloFechaHora(),
      etiqueta: n || !z.etiquetaSel ? cfg.etiqueta : z.etiquetaSel.value, // la de la zona (o la que se eligió al crear)
      texto,
      color: z.color,
      identificador: z.ident.value.trim(),
      destino: z.destino.value,
    };
    z.guardarBtn.disabled = true;
    setEstado(z.estado, "Guardando…");
    try {
      if (n) {
        await llamarNotas("nota_editar", Object.assign({ id: n.id }, datos));
        Object.assign(n, datos);
      } else {
        const nota = Object.assign({ id: String(Date.now()) }, datos);
        await llamarNotas("nota_agregar", nota);
        notas.push(nota);
      }
      limpiarForm();
      mostrarForm(false);
      dibujarNotas(); // redibuja el panel de Notas y todas las zonas
      const destinoEtiqueta = datos.etiqueta === cfg.etiqueta ? ""
        : datos.etiqueta === "Trabajo" ? " (quedó en Trabajo)"
        : datos.etiqueta === "Actividades" ? " (quedó en Actividades)"
        : " (quedó en Notas)";
      setEstado(z.estadoLista, (n ? "Cambios guardados ✓" : "Guardada ✓") + destinoEtiqueta, "ok");
    } catch (e) {
      setEstado(z.estado, "Error: " + e.message, "error");
    } finally {
      z.guardarBtn.disabled = false;
    }
  }

  async function borrar(id) {
    if (!window.confirm(cfg.borrar)) return;
    setEstado(z.estadoLista, "Eliminando…");
    try {
      await llamarNotas("nota_borrar", { id });
      notas = notas.filter((n) => n.id !== id);
      if (z.editando && z.editando.id === id) cancelar();
      dibujarNotas();
      setEstado(z.estadoLista, "Eliminada", "ok");
    } catch (e) {
      setEstado(z.estadoLista, "Error: " + e.message, "error");
    }
  }

  // ----- Finalizar un trabajo: sale de Notas y entra al Diario, en el día de hoy -----
  async function finalizar(n, botonSi) {
    const ahora = new Date();
    const fecha = claveFecha(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    botonSi.disabled = true;
    setEstado(z.estadoLista, "Finalizando…");
    try {
      const j = await llamarNotas("actividad_finalizar", { id: n.id, fecha });
      notas = notas.filter((x) => x.id !== n.id);
      if (z.editando && z.editando.id === n.id) cancelar();
      dibujarNotas(); // desaparece de su zona y de la lista de Notas
      // Si la actividad nació en el Diario, a ese recuerdo se le agregó la fecha de término
      if (diCargados && j && j.memoria) {
        diarios = diarios.map((x) => (x.id === j.memoria.id ? Object.assign({}, x, { descripcion: j.memoria.descripcion }) : x));
      }
      // La copia del día de hoy (con la fecha de inicio y la de término en su descripción)
      registrarTerminadoEnDiario(Object.assign(
        { id: n.id, nombre: n.nombre || "Sin nombre", fecha, descripcion: n.texto || "" },
        (j && j.copia) || {},
        { terminado: true }
      ));
      setEstado(z.estadoLista, (cfg.etiqueta === "Actividades" ? "Actividad finalizada" : "Trabajo finalizado") + " ✓ (ya está en el Diario)", "ok");
    } catch (e) {
      botonSi.disabled = false;
      setEstado(z.estadoLista, "Error: " + e.message, "error");
    }
  }

  // ----- Cuadrito (misma apariencia que los cuadros de Ejercicio / Diario, con el color de la nota) -----
  function crearCuadrito(n) {
    const hex = hexDeColor(n.color);
    const c = document.createElement("div");
    c.className = "ej-chip ej-chip-resumen zona-cuadrito";
    c.style.setProperty("--fondo", hex);
    aplicarContraste(c, hex);
    c.title = n.nombre || "Sin nombre";
    const nombre = document.createElement("span");
    nombre.className = "ej-chip-nombre";
    nombre.textContent = n.nombre || "Sin nombre";
    c.appendChild(nombre);
    if (n.fecha) {
      const f = document.createElement("span");
      f.className = "ej-chip-fecha";
      f.textContent = String(n.fecha).split(" ")[0];
      c.appendChild(f);
    }
    const desc = document.createElement("span");
    desc.className = "ej-chip-desc";
    desc.textContent = n.texto || "";
    c.appendChild(desc);

    const x = document.createElement("button");
    x.type = "button";
    x.className = "tarjeta-borrar";
    x.setAttribute("aria-label", "Eliminar");
    x.title = "Eliminar";
    x.textContent = "×";
    x.addEventListener("click", (e) => {
      e.stopPropagation();
      borrar(n.id);
    });
    c.appendChild(x);

    if (cfg.finalizar) {
      const fin = document.createElement("button");
      fin.type = "button";
      fin.className = "zona-cuadrito-fin";
      fin.setAttribute("aria-label", "Marcar " + textoFin + " como finalizada");
      fin.title = "Marcar " + textoFin + " como finalizada";
      fin.textContent = "✔";
      fin.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.confirm("¿Marcar como finalizada? Se quitará de " + cfg.etiqueta + " y pasará al Diario con la fecha de hoy.")) {
          finalizar(n, fin);
        }
      });
      c.appendChild(fin);
    }

    c.tabIndex = 0;
    c.setAttribute("role", "button");
    c.setAttribute("aria-label", (vista ? "Ver " : "Editar ") + (n.nombre || "Sin nombre"));
    c.addEventListener("click", (e) => {
      if (e.target.closest("button, input")) return;
      abrirTarjeta(n);
    });
    c.addEventListener("keydown", (e) => {
      if (e.target === c && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        abrirTarjeta(n);
      }
    });
    return c;
  }

  // ----- Lista de tarjetas (solo las de esta etiqueta) -----
  function crearTarjeta(n) {
    if (cfg.cuadritos) return crearCuadrito(n);
    const hex = hexDeColor(n.color);
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-nota";
    tarjeta.style.setProperty("--fondo", hex);
    aplicarContraste(tarjeta, hex);
    const nombre = document.createElement("div");
    nombre.className = "tarjeta-nombre";
    nombre.textContent = n.nombre || "Sin nombre";
    tarjeta.appendChild(nombre);
    if (n.identificador) {
      const meta = document.createElement("div");
      meta.className = "tarjeta-meta";
      const ident = document.createElement("span");
      ident.className = "tarjeta-ident";
      ident.title = "Identificador";
      ident.textContent = "#" + n.identificador;
      meta.appendChild(ident);
      tarjeta.appendChild(meta);
    }
    const fecha = document.createElement("div");
    fecha.className = "tarjeta-fecha";
    fecha.textContent = n.fecha;
    const texto = document.createElement("p");
    texto.className = "tarjeta-texto";
    texto.textContent = n.texto;
    const x = document.createElement("button");
    x.type = "button";
    x.className = "tarjeta-borrar";
    x.setAttribute("aria-label", "Eliminar");
    x.textContent = "×";
    x.addEventListener("click", (e) => {
      e.stopPropagation();
      borrar(n.id);
    });
    tarjeta.append(fecha, texto, x);

    // Botón «Marcar tarea como finalizada»: pide confirmación y pasa el trabajo al Diario
    if (cfg.finalizar) {
      const fin = document.createElement("div");
      fin.className = "tarjeta-finalizar";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tarjeta-fin-btn";
      btn.textContent = "✔ Marcar " + textoFin + " como finalizada";
      const conf = document.createElement("div");
      conf.className = "tarjeta-fin-conf";
      conf.hidden = true;
      const aviso = document.createElement("p");
      aviso.className = "tarjeta-fin-aviso";
      aviso.textContent = "¿Seguro? Se quitará de " + cfg.etiqueta + " y pasará al Diario con la fecha de hoy.";
      const si = document.createElement("button");
      si.type = "button";
      si.className = "tarjeta-fin-si";
      si.textContent = "Sí, finalizar";
      const no = document.createElement("button");
      no.type = "button";
      no.className = "tarjeta-fin-no";
      no.textContent = "Cancelar";
      conf.append(aviso, si, no);
      btn.addEventListener("click", () => {
        btn.hidden = true;
        conf.hidden = false;
      });
      no.addEventListener("click", () => {
        conf.hidden = true;
        btn.hidden = false;
      });
      si.addEventListener("click", () => finalizar(n, si));
      // Tocar esta zona no abre la nota
      fin.addEventListener("click", (e) => e.stopPropagation());
      fin.append(btn, conf);
      tarjeta.appendChild(fin);
    }

    // Tocar la tarjeta en cualquier zona abre su edición (la × sigue con su función)
    tarjeta.tabIndex = 0;
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("aria-label", (vista ? "Ver " : "Editar ") + (n.nombre || "Sin nombre"));
    tarjeta.addEventListener("click", (e) => {
      if (e.target.closest("button, input")) return;
      if (String(window.getSelection()).length) return; // si estaba seleccionando texto, no se abre
      abrirTarjeta(n);
    });
    tarjeta.addEventListener("keydown", (e) => {
      if (e.target === tarjeta && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        abrirTarjeta(n);
      }
    });
    return tarjeta;
  }

  z.dibujar = function () {
    z.lista.classList.toggle("zona-lista-cuadritos", !!cfg.cuadritos);
    z.lista.innerHTML = "";
    const lista = notasOrdenadas().filter((n) => (n.etiqueta || "General") === cfg.etiqueta);
    if (!lista.length) {
      const p = document.createElement("p");
      p.className = "notas-vacio";
      p.textContent = cfg.vacio;
      z.lista.appendChild(p);
      return;
    }
    lista.forEach((n) => z.lista.appendChild(crearTarjeta(n)));
  };

  // Aviso de inicio de sesión o contenido, según la sesión (devuelve si hay sesión)
  z.actualizar = function () {
    const dentro = sesionVigente();
    z.sinSesion.hidden = dentro;
    z.contenido.hidden = !dentro;
    if (!dentro) {
      cerrarVista();
      cancelar();
    }
    return dentro;
  };

  z.valores = () => JSON.stringify([z.nombre.value, z.color, z.fecha.value, z.ident.value, z.texto.value, z.destino.value, z.tipo.value]);
  z.sucio = () => !z.form.hidden && z.valores() !== z.snap;
  z.cancelar = cancelar;
  const cancelarConAviso = () => {
    if (!z.sucio() || window.confirm(MENSAJE_ABANDONAR)) cancelar();
  };

  z.nuevoBtn.addEventListener("click", () => mostrarForm(true));
  z.guardarBtn.addEventListener("click", guardar);
  z.form.querySelector(".zona-cancelar").addEventListener("click", cancelarConAviso);
  z.form.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cancelarConAviso();
  });
  q(".zona-actualizar").addEventListener("click", () => {
    if (sesionVigente()) cargarNotasZonas();
    else z.actualizar();
  });
  q(".zona-ir-login").addEventListener("click", abrirLateral);
  return z;
}

const zonas = ZONAS_ETIQUETA.map(crearZonaEtiqueta);
let cargandoZonas = false;

// Lee las notas de la hoja (las mismas que usa el panel de Notas) y redibuja todo
async function cargarNotasZonas() {
  if (cargandoZonas) return;
  cargandoZonas = true;
  zonas.forEach((z) => setEstado(z.estadoLista, "Cargando…"));
  try {
    const j = await llamarNotas("nota_listar");
    notas = Array.isArray(j.notas) ? j.notas : [];
    notasCargadas = true;
    dibujarNotas();
    zonas.forEach((z) => setEstado(z.estadoLista, ""));
  } catch (e) {
    zonas.forEach((z) => setEstado(z.estadoLista, "Error: " + e.message, "error"));
  } finally {
    cargandoZonas = false;
  }
}

function dibujarZonasEtiqueta() {
  zonas.forEach((z) => z.dibujar());
}

// Se llama cuando cambia la sesión (desde actualizarPanelNotas)
function actualizarZonasEtiqueta() {
  const dentro = sesionVigente();
  zonas.forEach((z) => z.actualizar());
  if (!dentro) {
    notasCargadas = false;
    notas = [];
    dibujarZonasEtiqueta();
  } else if (!notasCargadas && zonas.some((z) => !z.seccion.hidden)) {
    cargarNotasZonas();
  }
}

// Botón «Pedidos de Yeso» de la barra lateral: abre su propia sección (aparte de Notas)
document.getElementById("btn-yeso").addEventListener("click", () => {
  cerrarLateral();
  mostrarSeccion("pedidos-yeso");
  const z = zonas.find((x) => x.cfg.seccion === "pedidos-yeso");
  if (z.actualizar() && !notasCargadas) cargarNotasZonas();
  else z.dibujar();
  // Baja hasta la división «Pedidos de Yeso» dentro de Bazar
  const div = document.getElementById("bazar-division-yeso");
  if (div) div.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Al abrir una de estas secciones se muestra su zona (y se leen las notas si aún no se han leído)
botonesMenu.forEach((b) =>
  b.addEventListener("click", () => {
    const z = zonas.find((x) => (x.cfg.en || x.cfg.seccion) === b.dataset.seccion);
    if (!z) return;
    if (z.actualizar() && !notasCargadas) cargarNotasZonas();
    else z.dibujar();
  })
);

// ---------- Color del día (recuadro del calendario y fondo del panel) ----------
// Usa los mismos colores que las notas. El color de cada día se guarda en la hoja «Colores».
const popColores = document.getElementById("pop-colores");
const popMasColores = document.getElementById("pop-mas-colores");
const popPaleta = document.getElementById("pop-paleta");
const popPaletaFamilias = document.getElementById("pop-paleta-familias");
const popPersonal = document.getElementById("pop-personal");
const popColorPersonal = document.getElementById("pop-color-personal");
const popColorQuitar = document.getElementById("pop-color-quitar");
const popColorEstado = document.getElementById("pop-color-estado");

// Pinta el panel con el color del día (sin color = negro de siempre) y marca la muestra elegida
function pintarPanelDia(valor) {
  const c = String(valor || "").trim();
  const hex = c ? hexDeColor(c) : "";
  if (hex) {
    const oscuro = esColorOscuro(hex);
    popover.style.setProperty("--pop-fondo", hex);
    popover.style.setProperty("--pop-titulo", oscuro ? "#ffffff" : "#2b2140");
    popover.style.setProperty("--pop-cierre", oscuro ? "#f0eafc" : "#4a3f66");
  } else {
    ["--pop-fondo", "--pop-titulo", "--pop-cierre"].forEach((p) => popover.style.removeProperty(p));
  }
  let enMuestra = false;
  document.querySelectorAll("#pop-color .color-op").forEach((b) => {
    const activo = !!c && b.dataset.color.toLowerCase() === c.toLowerCase();
    if (activo) enMuestra = true;
    b.classList.toggle("elegido", activo);
    b.setAttribute("aria-checked", activo ? "true" : "false");
  });
  popColorPersonal.value = hex || "#ffffff";
  popPersonal.classList.toggle("elegido", !!c && !enMuestra);
  popColorQuitar.hidden = !c;
}

function plegarPaletaDia() {
  popPaleta.hidden = true;
  popMasColores.setAttribute("aria-expanded", "false");
  popMasColores.textContent = "Más colores ▾";
}

// Guarda el color de un día en la hoja «Colores» (color vacío = quitarlo)
async function guardarColorDia(fecha, color) {
  if (!configurado()) throw new Error("Falta configurar config.js");
  const idToken = credencialVigente();
  if (!idToken) {
    abrirLateral();
    throw new Error("Inicia sesión con Google para guardar");
  }
  // text/plain evita el "preflight" de CORS con Apps Script
  const r = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: CONFIG.TOKEN, idToken, accion: "calendario_color", fecha, color }),
  });
  const j = await leerJsonRespuesta(r);
  sesionRechazada(j);
  if (!j.ok) throw new Error(j.error || "Error al guardar");
}

let secuenciaColorDia = 0;
// Cambia el color del día: se ve al instante y, si no se puede guardar, vuelve al anterior
async function cambiarColorDia(fecha, valor) {
  const anterior = String((datos[fecha] || {}).color || "");
  const orden = ++secuenciaColorDia;
  datos[fecha] = datos[fecha] || {};
  datos[fecha].color = valor;
  pintarPanelDia(valor);
  dibujarCalendario();
  setEstado(popColorEstado, "Guardando…");
  try {
    await guardarColorDia(fecha, valor);
    if (orden === secuenciaColorDia) setEstado(popColorEstado, "Guardado ✓", "ok");
  } catch (e) {
    if (orden !== secuenciaColorDia) return;
    datos[fecha] = datos[fecha] || {};
    datos[fecha].color = anterior;
    if (seleccion === fecha) pintarPanelDia(anterior);
    dibujarCalendario();
    setEstado(popColorEstado, "Error: " + e.message, "error");
  }
}

function muestraColorDia(valor, hex, titulo) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "color-op";
  b.dataset.color = valor;
  b.title = titulo;
  b.setAttribute("role", "radio");
  b.setAttribute("aria-label", titulo);
  b.style.background = hex;
  b.addEventListener("click", () => {
    if (seleccion) cambiarColorDia(seleccion, valor);
  });
  return b;
}
COLORES_NOTA.forEach((c) => popColores.appendChild(muestraColorDia(c.nombre, c.hex, c.nombre)));
PALETA_COLORES.forEach((f) => {
  const fila = document.createElement("div");
  fila.className = "paleta-fila";
  const nombre = document.createElement("span");
  nombre.className = "paleta-nombre";
  nombre.textContent = f.titulo;
  const grupo = document.createElement("div");
  grupo.className = "notas-colores";
  grupo.setAttribute("role", "radiogroup");
  grupo.setAttribute("aria-label", f.titulo);
  f.colores.forEach((hex) => grupo.appendChild(muestraColorDia(hex, hex, f.titulo + " " + hex)));
  fila.append(nombre, grupo);
  popPaletaFamilias.appendChild(fila);
});
// Selector libre: mientras se arrastra solo se ve; el color se guarda al soltar
popColorPersonal.addEventListener("input", () => pintarPanelDia(popColorPersonal.value.toLowerCase()));
popColorPersonal.addEventListener("change", () => {
  if (seleccion) cambiarColorDia(seleccion, popColorPersonal.value.toLowerCase());
});
popColorQuitar.addEventListener("click", () => {
  if (seleccion) cambiarColorDia(seleccion, "");
});
popMasColores.addEventListener("click", () => {
  const abrir = popPaleta.hidden;
  popPaleta.hidden = !abrir;
  popMasColores.setAttribute("aria-expanded", abrir ? "true" : "false");
  popMasColores.textContent = abrir ? "Menos colores ▴" : "Más colores ▾";
});

// ---------- Ejercicio (hoja «Ejercicio» de Google Sheets) ----------
// Calendario aparte del principal: cada día guarda los ejercicios que hiciste (Nombre | Fecha | Descripcion | Id).
const ejEl = (id) => document.getElementById(id);
const panelEj = ejEl("panel-ejercicio");
const ejSinSesion = ejEl("ej-sin-sesion");
const ejContenido = ejEl("ej-contenido");
const ejEstado = ejEl("ej-estado");
const ejSelMes = ejEl("ej-mes");
const ejSelAnio = ejEl("ej-anio");
const ejAnterior = ejEl("ej-anterior");
const ejSiguiente = ejEl("ej-siguiente");
const ejCuad = ejEl("ej-cuadricula");
const ejDiaPanel = ejEl("ej-dia");
const ejDiaTitulo = ejEl("ej-dia-titulo");
const ejDiaEstado = ejEl("ej-dia-estado");
const ejChips = ejEl("ej-chips");
const ejForm = ejEl("ej-form");
const ejFormTitulo = ejEl("ej-form-titulo");
const ejNombre = ejEl("ej-nombre");
const ejDescripcion = ejEl("ej-descripcion");
const ejDestino = ejEl("ej-destino");
const ejGuardar = ejEl("ej-guardar");
const ejBorrar = ejEl("ej-borrar");
const ejFormEstado = ejEl("ej-form-estado");

let ejercicios = []; // [{ id, nombre, fecha: "AAAA-MM-DD", descripcion }]
let ejCargados = false;
let ejMes = new Date().getMonth();
let ejAnio = new Date().getFullYear();
let ejDia = null; // día abierto en el submenú
let ejEditando = null; // ejercicio abierto en la ventana (null = ejercicio nuevo)

MESES.forEach((n, i) => ejSelMes.add(new Option(n, i)));
for (let a = ANIO_MIN; a <= ANIO_MAX; a++) ejSelAnio.add(new Option(a, a));

const ejDeDia = (fecha) => ejercicios.filter((e) => e.fecha === fecha);

// ----- Calendario de ejercicio (igual al principal, pero con sus propios datos) -----
function dibujarCalendarioEj() {
  ejSelMes.value = ejMes;
  ejSelAnio.value = ejAnio;
  ejAnterior.disabled = ejAnio === ANIO_MIN && ejMes === 0;
  ejSiguiente.disabled = ejAnio === ANIO_MAX && ejMes === 11;
  ejCuad.innerHTML = "";
  DIAS.forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-dia-semana";
    el.textContent = d;
    ejCuad.appendChild(el);
  });
  const ahora = new Date();
  const primerDia = (new Date(ejAnio, ejMes, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(ejAnio, ejMes + 1, 0).getDate();
  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement("div");
    vacio.className = "cal-dia vacio";
    ejCuad.appendChild(vacio);
  }
  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = claveFecha(ejAnio, ejMes, d);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cal-dia";
    el.textContent = d;
    el.dataset.fecha = fecha;
    if ((primerDia + d - 1) % 7 >= 5) el.classList.add("finde");
    if (d === ahora.getDate() && ejMes === ahora.getMonth() && ejAnio === ahora.getFullYear()) el.classList.add("hoy");
    if (fecha === ejDia) el.classList.add("seleccionado");
    if (ejDeDia(fecha).length) el.classList.add("con-datos");
    el.addEventListener("click", () => abrirDiaEj(fecha));
    ejCuad.appendChild(el);
  }
}

function ejCambiarMes(delta) {
  ejMes += delta;
  if (ejMes < 0) { ejMes = 11; ejAnio--; }
  if (ejMes > 11) { ejMes = 0; ejAnio++; }
  ejAnio = Math.max(ANIO_MIN, Math.min(ANIO_MAX, ejAnio));
  dibujarCalendarioEj();
}

// ----- Submenú del día: un botón cuadrado por ejercicio + un "+" para añadir -----
function dibujarChipsEj() {
  ejChips.innerHTML = "";
  ejDeDia(ejDia).forEach((e) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip";
    b.title = e.nombre;
    b.setAttribute("aria-label", "Ver o editar el ejercicio " + e.nombre);
    b.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">💪</span><span class="ej-chip-nombre"></span>';
    b.querySelector(".ej-chip-nombre").textContent = e.nombre;
    b.addEventListener("click", () => abrirFormEj(e));
    ejChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir un ejercicio");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormEj(null));
  ejChips.appendChild(nuevo);
}

function abrirDiaEj(fecha) {
  ejDia = fecha;
  ejDiaTitulo.textContent = textoFecha(fecha);
  setEstado(ejDiaEstado, "");
  dibujarChipsEj();
  ejDiaPanel.hidden = false;
  dibujarCalendarioEj();
}
function cerrarDiaEj() {
  cerrarFormEj();
  ejDiaPanel.hidden = true;
  ejDia = null;
  dibujarCalendarioEj();
}

// ----- Ventana para añadir / editar -----
const migEj = montarMigrar(ejDestino, {
  accion: "migrar_drive",
  extra: { zona: "ejercicio" },
  obtener: () => ejEditando,
  estado: ejFormEstado,
});
function abrirFormEj(e) {
  ejEditando = e;
  ejFormTitulo.textContent = e ? "Editar ejercicio" : "Nuevo ejercicio";
  ejNombre.value = e ? e.nombre : "";
  ejDescripcion.value = e ? e.descripcion : "";
  ejDestino.value = (e && e.destino !== "drive") ? "sheets" : "drive";
  migEj.actualizar(e);
  ejBorrar.hidden = !e;
  setEstado(ejFormEstado, "");
  ejForm.hidden = false;
  ejNombre.focus();
}
function cerrarFormEj() {
  ejForm.hidden = true;
  ejEditando = null;
}

async function guardarEj() {
  const nombre = ejNombre.value.trim();
  if (!nombre) {
    setEstado(ejFormEstado, "Escribe el nombre del ejercicio", "error");
    return;
  }
  const editando = ejEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const e = { id, nombre, fecha: editando ? editando.fecha : ejDia, descripcion: ejDescripcion.value.trim(), destino: ejDestino.value };
  ejGuardar.disabled = true;
  setEstado(ejFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "ejercicio_editar" : "ejercicio_agregar", e);
    if (editando) ejercicios = ejercicios.map((x) => (x.id === id ? e : x));
    else ejercicios.push(e);
    cerrarFormEj();
    dibujarChipsEj();
    dibujarCalendarioEj();
  } catch (err) {
    setEstado(ejFormEstado, "Error: " + err.message, "error");
  } finally {
    ejGuardar.disabled = false;
  }
}

async function borrarEj() {
  const e = ejEditando;
  if (!e || !window.confirm("¿Eliminar el ejercicio «" + e.nombre + "»?")) return;
  ejBorrar.disabled = true;
  setEstado(ejFormEstado, "Eliminando…");
  try {
    await llamarNotas("ejercicio_borrar", { id: e.id });
    ejercicios = ejercicios.filter((x) => x.id !== e.id);
    cerrarFormEj();
    dibujarChipsEj();
    dibujarCalendarioEj();
  } catch (err) {
    setEstado(ejFormEstado, "Error: " + err.message, "error");
  } finally {
    ejBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarEjercicios() {
  setEstado(ejEstado, "Cargando…");
  try {
    const j = await llamarNotas("ejercicio_listar");
    ejercicios = Array.isArray(j.ejercicios) ? j.ejercicios : [];
    ejCargados = true;
    setEstado(ejEstado, "");
    dibujarCalendarioEj();
    if (ejDia) dibujarChipsEj();
    // El Diario también muestra los ejercicios hechos cada día
    dibujarCalendarioDi();
    if (diDia) dibujarChipsDi();
  } catch (err) {
    setEstado(ejEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelEjercicio() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla (el Diario también usa estos ejercicios)
    ejCargados = false;
    ejercicios = [];
  }
  if (panelEj.hidden) return;
  const dentro = sesionVigente();
  ejSinSesion.hidden = dentro;
  ejContenido.hidden = !dentro;
  if (dentro) {
    if (!ejCargados) cargarEjercicios();
  } else {
    ejCargados = false;
    ejercicios = [];
    cerrarDiaEj();
  }
}

// Se llama al entrar a la página de Ejercicio (desde mostrarSeccion)
function entrarEjercicio() {
  const ahora = new Date();
  ejMes = ahora.getMonth(); // siempre abre en el mes actual
  ejAnio = ahora.getFullYear();
  ejDia = null;
  ejDiaPanel.hidden = true;
  cerrarFormEj();
  panelEj.hidden = false;
  dibujarCalendarioEj();
  actualizarPanelEjercicio();
}
// Ejercicio ya es una página: aquí solo se cierran el formulario y el submenú del día
function cerrarEjercicio() {
  cerrarFormEj();
  ejDiaPanel.hidden = true;
  ejDia = null;
}

ejEl("ej-cerrar").addEventListener("click", cerrarEjercicio);
ejEl("ej-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarEjercicios();
  else actualizarPanelEjercicio();
});
ejEl("ej-ir-login").addEventListener("click", () => {
  cerrarEjercicio();
  abrirLateral();
});
ejAnterior.addEventListener("click", () => ejCambiarMes(-1));
ejSiguiente.addEventListener("click", () => ejCambiarMes(1));
ejEl("ej-hoy").addEventListener("click", () => {
  const ahora = new Date();
  ejMes = ahora.getMonth();
  ejAnio = ahora.getFullYear();
  dibujarCalendarioEj();
});
ejSelMes.addEventListener("change", () => { ejMes = Number(ejSelMes.value); dibujarCalendarioEj(); });
ejSelAnio.addEventListener("change", () => { ejAnio = Number(ejSelAnio.value); dibujarCalendarioEj(); });
ejEl("ej-dia-volver").addEventListener("click", cerrarDiaEj);
ejGuardar.addEventListener("click", guardarEj);
ejEl("ej-cancelar").addEventListener("click", cerrarFormEj);
ejBorrar.addEventListener("click", borrarEj);
// Esc cierra primero la ventana y luego el submenú del día
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelEj.hidden) return;
  if (!ejForm.hidden) cerrarFormEj();
  else if (!ejDiaPanel.hidden) cerrarDiaEj();
});

// ---------- Diario (hoja «Diario» de Google Sheets) ----------
// Calendario aparte del principal: cada día guarda los diarios que hiciste (Nombre | Fecha | Descripcion | Id).
const diEl = (id) => document.getElementById(id);
const panelDi = diEl("panel-diario");
const diSinSesion = diEl("di-sin-sesion");
const diContenido = diEl("di-contenido");
const diEstado = diEl("di-estado");
const diSelMes = diEl("di-mes");
const diSelAnio = diEl("di-anio");
const diAnterior = diEl("di-anterior");
const diSiguiente = diEl("di-siguiente");
const diCuad = diEl("di-cuadricula");
const diDiaPanel = diEl("di-dia");
const diDiaTitulo = diEl("di-dia-titulo");
const diDiaEstado = diEl("di-dia-estado");
const diChips = diEl("di-chips");
const diForm = diEl("di-form");
const diFormTitulo = diEl("di-form-titulo");
const diNombre = diEl("di-nombre");
const diDescripcion = diEl("di-descripcion");
const diDestino = diEl("di-destino");
const diTipoCampo = diEl("di-tipo-campo");
const diTipo = diEl("di-tipo");
const diGuardar = diEl("di-guardar");
const diBorrar = diEl("di-borrar");
const diFormEstado = diEl("di-form-estado");
const diEjSub = diEl("di-ejercicios");
const diEjTitulo = diEl("di-ej-titulo");
const diEjChips = diEl("di-ej-chips");
const diEjDetalle = diEl("di-ej-detalle");

let diarios = []; // [{ id, nombre, fecha: "AAAA-MM-DD", descripcion }]
let diCargados = false;
let diMes = new Date().getMonth();
let diAnio = new Date().getFullYear();
let diDia = null; // día abierto en el submenú
let diEditando = null; // anotación abierto en la ventana (null = anotación nuevo)

// El Diario solo se puede explorar del 2 de febrero de 1999 al 2 de febrero de 2099
const DI_FECHA_MIN = "1999-02-02";
const DI_FECHA_MAX = "2099-02-02";
const DI_ANIO_MIN = Number(DI_FECHA_MIN.slice(0, 4));
const DI_ANIO_MAX = Number(DI_FECHA_MAX.slice(0, 4));

MESES.forEach((n, i) => diSelMes.add(new Option(n, i)));
for (let a = DI_ANIO_MIN; a <= DI_ANIO_MAX; a++) diSelAnio.add(new Option(a, a));

const diFechaValida = (fecha) => fecha >= DI_FECHA_MIN && fecha <= DI_FECHA_MAX;
// Un mes se puede ver si al menos uno de sus días está dentro del rango
function diMesValido(a, m) {
  const ultimo = new Date(a, m + 1, 0).getDate();
  return claveFecha(a, m, ultimo) >= DI_FECHA_MIN && claveFecha(a, m, 1) <= DI_FECHA_MAX;
}
// Si el mes/año elegido queda fuera del rango, se lleva al más cercano permitido
function ajustarMesDi() {
  if (claveFecha(diAnio, diMes, 1) > DI_FECHA_MAX) {
    diAnio = DI_ANIO_MAX;
    diMes = Number(DI_FECHA_MAX.slice(5, 7)) - 1;
  } else if (!diMesValido(diAnio, diMes)) {
    diAnio = DI_ANIO_MIN;
    diMes = Number(DI_FECHA_MIN.slice(5, 7)) - 1;
  }
}

const diDeDia = (fecha) => diarios.filter((e) => e.fecha === fecha);

// Un trabajo recién finalizado aparece en el Diario sin tener que recargar
// (si el Diario aún no se ha leído, se leerá completo al abrirlo)
function registrarTerminadoEnDiario(e) {
  if (!diCargados) return;
  if (!diarios.some((x) => x.id === e.id)) diarios.push(e);
  dibujarCalendarioDi();
  if (diDia) dibujarChipsDi();
}

// ----- Calendario de anotación (igual al principal, pero con sus propios datos) -----
function dibujarCalendarioDi() {
  ajustarMesDi();
  diSelMes.value = diMes;
  diSelAnio.value = diAnio;
  // Los meses que quedan fuera del rango (en 1999 y 2099) no se pueden elegir
  Array.from(diSelMes.options).forEach((o) => { o.disabled = !diMesValido(diAnio, Number(o.value)); });
  const mAnt = diMes === 0 ? 11 : diMes - 1;
  const aAnt = diMes === 0 ? diAnio - 1 : diAnio;
  const mSig = diMes === 11 ? 0 : diMes + 1;
  const aSig = diMes === 11 ? diAnio + 1 : diAnio;
  diAnterior.disabled = !diMesValido(aAnt, mAnt);
  diSiguiente.disabled = !diMesValido(aSig, mSig);
  diCuad.innerHTML = "";
  DIAS.forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-dia-semana";
    el.textContent = d;
    diCuad.appendChild(el);
  });
  const ahora = new Date();
  const primerDia = (new Date(diAnio, diMes, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(diAnio, diMes + 1, 0).getDate();
  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement("div");
    vacio.className = "cal-dia vacio";
    diCuad.appendChild(vacio);
  }
  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = claveFecha(diAnio, diMes, d);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cal-dia";
    el.textContent = d;
    el.dataset.fecha = fecha;
    if ((primerDia + d - 1) % 7 >= 5) el.classList.add("finde");
    if (d === ahora.getDate() && diMes === ahora.getMonth() && diAnio === ahora.getFullYear()) el.classList.add("hoy");
    if (fecha === diDia) el.classList.add("seleccionado");
    if (diDeDia(fecha).length || ejDeDia(fecha).length) el.classList.add("con-datos");
    if (!diFechaValida(fecha)) {
      // Fuera del rango permitido (antes del 2/2/1999 o después del 2/2/2099)
      el.disabled = true;
      el.classList.add("fuera-rango");
    } else el.addEventListener("click", () => abrirDiaDi(fecha));
    diCuad.appendChild(el);
  }
}

function diCambiarMes(delta) {
  diMes += delta;
  if (diMes < 0) { diMes = 11; diAnio--; }
  if (diMes > 11) { diMes = 0; diAnio++; }
  dibujarCalendarioDi(); // aquí mismo se ajusta al rango permitido
}

// ----- Submenú del día: un botón cuadrado por anotación + un "+" para añadir -----
function dibujarChipsDi() {
  diChips.innerHTML = "";
  // Si ese día hiciste ejercicio, aparece un cuadro «Ejercicio» (al tocarlo se ven los ejercicios hechos)
  const hechos = ejDeDia(diDia);
  if (hechos.length) {
    const ej = document.createElement("button");
    ej.type = "button";
    ej.className = "ej-chip ej-chip-ejercicio";
    ej.title = "Ejercicio hecho este día";
    ej.setAttribute("aria-label", "Ver los " + hechos.length + " ejercicios hechos este día");
    ej.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">💪</span><span class="ej-chip-nombre"></span>';
    ej.querySelector(".ej-chip-nombre").textContent = "Ejercicio (" + hechos.length + ")";
    ej.addEventListener("click", abrirEjerciciosDi);
    diChips.appendChild(ej);
  }
  diDeDia(diDia).forEach((e) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip";
    b.title = e.nombre;
    b.setAttribute("aria-label", "Ver o editar la anotación " + e.nombre);
    b.innerHTML = '<span class="ej-chip-icono" aria-hidden="true"></span><span class="ej-chip-nombre"></span>';
    b.querySelector(".ej-chip-icono").textContent = e.terminado ? "✅" : "📓";
    if (e.terminado) b.title = e.nombre + (e.marca === "Actividad finalizada" ? " (actividad terminada)" : " (trabajo terminado)");
    if (e.marca === "Tarea finalizada") {
      b.classList.add("ej-chip-finalizada");
      b.title = e.nombre + " (Anotación de Tarea Finalizada)";
    }
    b.querySelector(".ej-chip-nombre").textContent = e.nombre;
    b.addEventListener("click", () => abrirFormDi(e));
    diChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir una anotación");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormDi(null));
  diChips.appendChild(nuevo);
}

function abrirDiaDi(fecha) {
  diDia = fecha;
  diDiaTitulo.textContent = textoFecha(fecha);
  setEstado(diDiaEstado, "");
  dibujarChipsDi();
  diDiaPanel.hidden = false;
  dibujarCalendarioDi();
}
// ----- Ejercicios hechos ese día (se leen de la hoja «Ejercicio»): mini cuadros con descripción breve -----
function resumenCorto(t, max) {
  const x = String(t || "").replace(/\s+/g, " ").trim();
  if (!x) return "Sin descripción";
  return x.length > max ? x.slice(0, max).trimEnd() + "…" : x;
}

function dibujarEjerciciosDi() {
  diEjChips.innerHTML = "";
  ejDeDia(diDia).forEach((e) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chip-resumen";
    b.setAttribute("aria-label", "Ver todo el ejercicio " + e.nombre);
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = e.nombre;
    const d = document.createElement("span");
    d.className = "ej-chip-desc";
    d.textContent = resumenCorto(e.descripcion, 70);
    b.append(n, d);
    b.addEventListener("click", () => abrirDetalleEjDi(e));
    diEjChips.appendChild(b);
  });
}

function abrirEjerciciosDi() {
  if (!diDia) return;
  diEjTitulo.textContent = "💪 Ejercicio · " + textoFecha(diDia);
  dibujarEjerciciosDi();
  diEjSub.hidden = false;
}

function abrirDetalleEjDi(e) {
  diEl("di-ej-detalle-nombre").textContent = e.nombre || "Sin nombre";
  diEl("di-ej-detalle-fecha").textContent = textoFecha(e.fecha);
  diEl("di-ej-detalle-texto").textContent = e.descripcion || "Sin descripción";
  diEjDetalle.hidden = false;
  diEl("di-ej-detalle-cerrar").focus();
}
function cerrarDetalleEjDi() {
  diEjDetalle.hidden = true;
}
function cerrarEjerciciosDi() {
  cerrarDetalleEjDi();
  diEjSub.hidden = true;
}

function cerrarDiaDi() {
  cerrarEjerciciosDi();
  cerrarFormDi();
  diDiaPanel.hidden = true;
  diDia = null;
  dibujarCalendarioDi();
}

// ----- Ventana para añadir / editar -----
const migDi = montarMigrar(diDestino, {
  accion: "migrar_drive",
  extra: { zona: "diario" },
  obtener: () => diEditando,
  estado: diFormEstado,
});
function abrirFormDi(e) {
  diEditando = e;
  diFormTitulo.textContent = e
    ? e.marca === "Tarea finalizada"
      ? "Anotación de Tarea Finalizada ✅"
      : e.marca === "Actividad finalizada"
      ? "Editar actividad terminada ✅"
      : e.terminado
      ? "Editar trabajo terminado ✅"
      : "Editar anotación"
    : "Nueva anotación";
  diNombre.value = e ? e.nombre : "";
  diDescripcion.value = e ? e.descripcion : "";
  diDestino.value = (e && e.destino !== "drive") ? "sheets" : "drive";
  migDi.actualizar(e);
  diBorrar.hidden = !e;
  diTipoCampo.hidden = !!e; // «Guardar como» solo al crear
  diTipo.value = "nota";
  setEstado(diFormEstado, "");
  diForm.hidden = false;
  diNombre.focus();
}
function cerrarFormDi() {
  diForm.hidden = true;
  diEditando = null;
}

async function guardarDi() {
  const nombre = diNombre.value.trim();
  if (!nombre) {
    setEstado(diFormEstado, "Escribe el nombre de la anotación", "error");
    return;
  }
  const editando = diEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const e = {
    id,
    nombre,
    fecha: editando ? editando.fecha : diDia,
    descripcion: diDescripcion.value.trim(),
    destino: diDestino.value,
    terminado: editando ? !!editando.terminado : false, // solo informativo: el Apps Script no toca la columna D
  };
  const tipo = editando ? "nota" : diTipo.value; // nota | actividad | trabajo
  if (tipo !== "nota" && !e.descripcion) {
    setEstado(diFormEstado, "Escribe la descripción para guardarla como " + (tipo === "trabajo" ? "trabajo" : "actividad"), "error");
    return;
  }
  diGuardar.disabled = true;
  setEstado(diFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "diario_editar" : "diario_agregar", e);
    if (editando) diarios = diarios.map((x) => (x.id === id ? e : x));
    else diarios.push(e);
    // Actividad o trabajo: el recuerdo se queda en este día y además se crea en Actividades / Trabajo
    let aviso = "";
    if (tipo !== "nota") {
      try {
        await crearActividadDeRecuerdo({ idRecuerdo: id, nombre, dia: e.fecha, texto: e.descripcion, tipo });
      } catch (err2) {
        aviso = "El recuerdo se guardó, pero no se pudo crear en " + (tipo === "trabajo" ? "Trabajo" : "Actividades") + ": " + err2.message;
      }
    }
    cerrarFormDi();
    dibujarChipsDi();
    dibujarCalendarioDi();
    if (tipo !== "nota") {
      setEstado(diDiaEstado, aviso || "Guardado ✓ (también está en " + (tipo === "trabajo" ? "Trabajo" : "Actividades") + ")", aviso ? "error" : "ok");
    }
  } catch (err) {
    setEstado(diFormEstado, "Error: " + err.message, "error");
  } finally {
    diGuardar.disabled = false;
  }
}

async function borrarDi() {
  const e = diEditando;
  if (!e || !window.confirm("¿Eliminar la anotación «" + e.nombre + "»?")) return;
  diBorrar.disabled = true;
  setEstado(diFormEstado, "Eliminando…");
  try {
    await llamarNotas("diario_borrar", { id: e.id });
    diarios = diarios.filter((x) => x.id !== e.id);
    cerrarFormDi();
    dibujarChipsDi();
    dibujarCalendarioDi();
  } catch (err) {
    setEstado(diFormEstado, "Error: " + err.message, "error");
  } finally {
    diBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarDiarios() {
  setEstado(diEstado, "Cargando…");
  try {
    const j = await llamarNotas("diario_listar");
    diarios = Array.isArray(j.diarios) ? j.diarios : [];
    diCargados = true;
    setEstado(diEstado, "");
    dibujarCalendarioDi();
    if (diDia) dibujarChipsDi();
  } catch (err) {
    setEstado(diEstado, "Error: " + err.message, "error");
  }
}

// El Diario también muestra los ejercicios hechos: si aún no se han leído, se leen aquí
let ejCargando = false;
async function cargarEjerciciosParaDiario() {
  if (ejCargados || ejCargando || !sesionVigente()) return;
  ejCargando = true;
  try {
    await cargarEjercicios();
  } finally {
    ejCargando = false;
  }
}

function actualizarPanelDiario() {
  if (panelDi.hidden) return;
  const dentro = sesionVigente();
  diSinSesion.hidden = dentro;
  diContenido.hidden = !dentro;
  if (dentro) {
    if (!diCargados) cargarDiarios();
    cargarEjerciciosParaDiario();
  } else {
    diCargados = false;
    diarios = [];
    cerrarDiaDi();
  }
}

// Se llama al entrar a la página de Diario (desde mostrarSeccion)
function entrarDiario() {
  const ahora = new Date();
  diMes = ahora.getMonth(); // siempre abre en el mes actual
  diAnio = ahora.getFullYear();
  diDia = null;
  diDiaPanel.hidden = true;
  cerrarFormDi();
  panelDi.hidden = false;
  dibujarCalendarioDi();
  actualizarPanelDiario();
}
// Diario ya es una página: aquí solo se cierran el formulario y el submenú del día
function cerrarDiario() {
  cerrarEjerciciosDi();
  cerrarFormDi();
  diDiaPanel.hidden = true;
  diDia = null;
}

diEl("di-cerrar").addEventListener("click", cerrarDiario);
diEl("di-actualizar").addEventListener("click", () => {
  if (sesionVigente()) {
    cargarDiarios();
    cargarEjercicios(); // también vuelve a leer los ejercicios
  } else actualizarPanelDiario();
});
diEl("di-ir-login").addEventListener("click", () => {
  cerrarDiario();
  abrirLateral();
});
diAnterior.addEventListener("click", () => diCambiarMes(-1));
diSiguiente.addEventListener("click", () => diCambiarMes(1));
diEl("di-hoy").addEventListener("click", () => {
  const ahora = new Date();
  diMes = ahora.getMonth();
  diAnio = ahora.getFullYear();
  dibujarCalendarioDi();
});
diSelMes.addEventListener("change", () => { diMes = Number(diSelMes.value); dibujarCalendarioDi(); });
diSelAnio.addEventListener("change", () => { diAnio = Number(diSelAnio.value); dibujarCalendarioDi(); });
diEl("di-dia-volver").addEventListener("click", cerrarDiaDi);
diGuardar.addEventListener("click", guardarDi);
diEl("di-cancelar").addEventListener("click", cerrarFormDi);
diBorrar.addEventListener("click", borrarDi);
diEl("di-ej-volver").addEventListener("click", cerrarEjerciciosDi);
diEl("di-ej-detalle-cerrar").addEventListener("click", cerrarDetalleEjDi);
// Tocar el fondo oscuro (fuera de la ventana) cierra la información del ejercicio
diEjDetalle.addEventListener("click", (e) => {
  if (e.target === diEjDetalle) cerrarDetalleEjDi();
});
// Esc cierra primero la información del ejercicio, luego sus cuadros, la ventana y por último el submenú del día
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelDi.hidden) return;
  if (!diEjDetalle.hidden) cerrarDetalleEjDi();
  else if (!diEjSub.hidden) cerrarEjerciciosDi();
  else if (!diForm.hidden) cerrarFormDi();
  else if (!diDiaPanel.hidden) cerrarDiaDi();
});

// ---------- Deudas (hoja «Diario», columnas H a K) ----------
// Notas aparte (independientes de las anotaciones del Diario, columnas A a E): cada una guarda
// Nombre | Fecha (de creación) | Descripcion | Id en las columnas H, I, J y K de la hoja «Diario».
// Al marcar una deuda como finalizada se quita de aquí y pasa al Diario con la fecha de ese día.
const deEl = (id) => document.getElementById(id);
const panelDe = deEl("panel-deudas");
const deSinSesion = deEl("de-sin-sesion");
const deContenido = deEl("de-contenido");
const deEstado = deEl("de-estado");
const deChips = deEl("de-chips");
const deForm = deEl("de-form");
const deFormTitulo = deEl("de-form-titulo");
const deNombre = deEl("de-nombre");
const deCreada = deEl("de-creada");
const deFinalizar = deEl("de-finalizar");
const deDescripcion = deEl("de-descripcion");
const deDestino = deEl("de-destino");
const deGuardar = deEl("de-guardar");
const deBorrar = deEl("de-borrar");
const deFormEstado = deEl("de-form-estado");

let deudas = []; // [{ id, nombre, fecha, descripcion, destino }]  (fecha = día de creación, aaaa-mm-dd)
let deCargadas = false;
let deEditando = null; // deuda abierta en la ventana (null = deuda nueva)

function dibujarChipsDe() {
  deChips.innerHTML = "";
  deudas.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chip-resumen";
    b.title = d.nombre;
    b.setAttribute("aria-label", "Ver o editar la deuda " + d.nombre);
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = "💸 " + d.nombre;
    const t = document.createElement("span");
    t.className = "ej-chip-desc";
    t.textContent = resumenCorto(d.descripcion, 70);
    if (d.fecha) {
      // ipFechaCorta («aaaa-mm-dd» -> «dd/mm/aaaa») está definida más abajo, en Información Primordial
      b.title = d.nombre + " (creada el " + ipFechaCorta(d.fecha) + ")";
      const f = document.createElement("span");
      f.className = "ej-chip-fecha";
      f.textContent = ipFechaCorta(d.fecha);
      b.append(n, f, t);
    } else {
      b.append(n, t);
    }
    b.addEventListener("click", () => abrirFormDe(d));
    deChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir una deuda");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormDe(null));
  deChips.appendChild(nuevo);
}

// ----- Ventana para añadir / editar -----
const migDe = montarMigrar(deDestino, {
  accion: "migrar_drive",
  extra: { zona: "deuda" },
  obtener: () => deEditando,
  estado: deFormEstado,
});
function abrirFormDe(d) {
  deEditando = d;
  deFormTitulo.textContent = d ? "Editar deuda" : "Nueva deuda";
  deNombre.value = d ? d.nombre : "";
  deDescripcion.value = d ? d.descripcion : "";
  deDestino.value = (d && d.destino !== "drive") ? "sheets" : "drive";
  migDe.actualizar(d);
  // La fecha de creación se anota sola al guardar una deuda nueva y no se cambia al editarla
  deCreada.hidden = !(d && d.fecha);
  deCreada.textContent = d && d.fecha ? "Creada el " + ipFechaCorta(d.fecha) : "";
  deBorrar.hidden = !d;
  deFinalizar.hidden = !d; // solo una deuda ya guardada se puede dar por finalizada
  deFinalizar.disabled = false;
  setEstado(deFormEstado, "");
  deForm.hidden = false;
  deNombre.focus();
}
function cerrarFormDe() {
  deForm.hidden = true;
  deEditando = null;
}

async function guardarDe() {
  const nombre = deNombre.value.trim();
  if (!nombre) {
    setEstado(deFormEstado, "Escribe el nombre de la deuda", "error");
    return;
  }
  const editando = deEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  // Deuda nueva: se anota el día de hoy como fecha de creación. Al editar se conserva la que ya tenía.
  const fecha = editando ? editando.fecha || "" : ipHoy();
  const d = { id, nombre, fecha, descripcion: deDescripcion.value.trim(), destino: deDestino.value };
  deGuardar.disabled = true;
  setEstado(deFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "deuda_editar" : "deuda_agregar", d);
    if (editando) deudas = deudas.map((x) => (x.id === id ? d : x));
    else deudas.push(d);
    cerrarFormDe();
    dibujarChipsDe();
  } catch (err) {
    setEstado(deFormEstado, "Error: " + err.message, "error");
  } finally {
    deGuardar.disabled = false;
  }
}

async function borrarDe() {
  const d = deEditando;
  if (!d || !window.confirm("¿Eliminar la deuda «" + d.nombre + "»?")) return;
  deBorrar.disabled = true;
  setEstado(deFormEstado, "Eliminando…");
  try {
    await llamarNotas("deuda_borrar", { id: d.id });
    deudas = deudas.filter((x) => x.id !== d.id);
    cerrarFormDe();
    dibujarChipsDe();
  } catch (err) {
    setEstado(deFormEstado, "Error: " + err.message, "error");
  } finally {
    deBorrar.disabled = false;
  }
}

// «Marcar tarea como finalizada»: la deuda se quita de Deudas y pasa al Diario como «Tarea finalizada»,
// con la fecha de HOY (el día en que se presiona el botón). Primero se agrega al Diario y después se quita
// de Deudas; si algo falla a medias se puede volver a intentar sin que quede repetida en el Diario.
async function finalizarDe() {
  const d = deEditando;
  if (!d) return;
  if (!window.confirm("¿Dar por finalizada la deuda «" + d.nombre + "»? Se quitará de Deudas y pasará al Diario con la fecha de hoy.")) return;
  deFinalizar.disabled = true;
  setEstado(deFormEstado, "Finalizando…");
  try {
    await llamarNotas("deuda_finalizar", { id: d.id, fecha: ipHoy() });
    deudas = deudas.filter((x) => x.id !== d.id);
    diCargados = false; // el Diario se vuelve a leer al entrar y ya trae la nueva anotación
    cerrarFormDe();
    dibujarChipsDe();
    setEstado(deEstado, "Deuda finalizada ✓ (ya está en el Diario)", "ok");
  } catch (err) {
    deFinalizar.disabled = false;
    setEstado(deFormEstado, "Error: " + err.message + " — puedes volver a intentarlo", "error");
  }
}

// ----- Carga y sesión -----
async function cargarDeudas() {
  setEstado(deEstado, "Cargando…");
  try {
    const j = await llamarNotas("deuda_listar");
    deudas = Array.isArray(j.deudas) ? j.deudas : [];
    deCargadas = true;
    setEstado(deEstado, "");
    dibujarChipsDe();
  } catch (err) {
    setEstado(deEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelDeudas() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    deCargadas = false;
    deudas = [];
  }
  if (panelDe.hidden) return;
  const dentro = sesionVigente();
  deSinSesion.hidden = dentro;
  deContenido.hidden = !dentro;
  if (dentro) {
    if (!deCargadas) cargarDeudas();
    else dibujarChipsDe();
  } else {
    cerrarFormDe();
    dibujarChipsDe();
  }
}

// Se llama al entrar a la página de Deudas (desde mostrarSeccion)
function entrarDeudas() {
  cerrarFormDe();
  panelDe.hidden = false;
  dibujarChipsDe();
  actualizarPanelDeudas();
}
// Deudas es una página: aquí solo se cierra la ventana
function cerrarDeudas() {
  cerrarFormDe();
}

deEl("de-cerrar").addEventListener("click", cerrarDeudas);
deEl("de-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarDeudas();
  else actualizarPanelDeudas();
});
deEl("de-ir-login").addEventListener("click", () => {
  cerrarDeudas();
  abrirLateral();
});
deGuardar.addEventListener("click", guardarDe);
deFinalizar.addEventListener("click", finalizarDe);
deEl("de-cancelar").addEventListener("click", cerrarFormDe);
deBorrar.addEventListener("click", borrarDe);
// Esc cierra la ventana de la deuda
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelDe.hidden) return;
  if (!deForm.hidden) cerrarFormDe();
});

// ---------- Información Primordial (hoja «Informacion Primordial») ----------
// Notas con Nombre | Fecha | Descripcion | Id (la Id de la columna D se llena sola).
const ipEl = (id) => document.getElementById(id);
const panelIp = ipEl("panel-informacion");
const ipSinSesion = ipEl("ip-sin-sesion");
const ipContenido = ipEl("ip-contenido");
const ipEstado = ipEl("ip-estado");
const ipChips = ipEl("ip-chips");
const ipForm = ipEl("ip-form");
const ipFormTitulo = ipEl("ip-form-titulo");
const ipNombre = ipEl("ip-nombre");
const ipFecha = ipEl("ip-fecha");
const ipDescripcion = ipEl("ip-descripcion");
const ipDestino = ipEl("ip-destino");
const ipContador = ipEl("ip-contador");
const IP_LIMITE = 1000000; // tope de caracteres por texto (igual a LIMITE_TEXTO_LARGO del Apps Script; los largos van a Drive)
// Contador de caracteres de la descripción; avisa cuando queda poco espacio
function ipActualizarContador() {
  const largo = ipDescripcion.value.length;
  const resta = Math.max(0, IP_LIMITE - largo);
  ipContador.textContent = largo.toLocaleString("es-MX") + " / " + IP_LIMITE.toLocaleString("es-MX") + " caracteres" +
    (largo >= IP_LIMITE * 0.9 ? (resta === 0 ? " — límite alcanzado" : " — queda poco espacio (" + resta.toLocaleString("es-MX") + ")") : "");
  ipContador.className = "nt-contador" + (largo >= IP_LIMITE * 0.98 ? " nt-contador-error" : largo >= IP_LIMITE * 0.9 ? " nt-contador-aviso" : "");
}
ipDescripcion.addEventListener("input", ipActualizarContador);
const ipGuardar = ipEl("ip-guardar");
const ipBorrar = ipEl("ip-borrar");
const ipFormEstado = ipEl("ip-form-estado");

let informaciones = []; // [{ id, nombre, fecha, descripcion }]
let ipCargadas = false;
let ipEditando = null; // nota abierta en la ventana (null = nota nueva)

// Fecha de hoy como "aaaa-mm-dd" (formato del campo de fecha y de la hoja)
function ipHoy() {
  const n = new Date();
  return `${n.getFullYear()}-${dos(n.getMonth() + 1)}-${dos(n.getDate())}`;
}
// "aaaa-mm-dd" -> "dd/mm/aaaa" para mostrarla
function ipFechaCorta(f) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function dibujarChipsIp() {
  ipChips.innerHTML = "";
  informaciones.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chip-resumen";
    b.title = d.nombre + (d.fecha ? " (" + ipFechaCorta(d.fecha) + ")" : "");
    b.setAttribute("aria-label", "Ver o editar la información " + d.nombre);
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = "⭐ " + d.nombre;
    const f = document.createElement("span");
    f.className = "ej-chip-fecha";
    f.textContent = ipFechaCorta(d.fecha);
    const t = document.createElement("span");
    t.className = "ej-chip-desc";
    t.textContent = resumenCorto(d.descripcion, 70);
    b.append(n, f, t);
    b.addEventListener("click", () => abrirFormIp(d));
    ipChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir información primordial");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormIp(null));
  ipChips.appendChild(nuevo);
}

// ----- Ventana para añadir / editar -----
const migIp = montarMigrar(ipDestino, {
  accion: "migrar_drive",
  extra: { zona: "informacion" },
  obtener: () => ipEditando,
  estado: ipFormEstado,
});
function abrirFormIp(d) {
  ipEditando = d;
  ipFormTitulo.textContent = d ? "Editar información" : "Nueva información";
  ipNombre.value = d ? d.nombre : "";
  ipFecha.value = d && d.fecha ? d.fecha : ipHoy(); // si es nueva, empieza con la fecha de hoy
  ipDescripcion.value = d ? d.descripcion : "";
  ipDestino.value = (d && d.destino !== "drive") ? "sheets" : "drive";
  migIp.actualizar(d);
  ipActualizarContador();
  ipBorrar.hidden = !d;
  setEstado(ipFormEstado, "");
  ipForm.hidden = false;
  ipNombre.focus();
}
function cerrarFormIp() {
  ipForm.hidden = true;
  ipEditando = null;
}

async function guardarIp() {
  const nombre = ipNombre.value.trim();
  if (!nombre) {
    setEstado(ipFormEstado, "Escribe el nombre", "error");
    return;
  }
  const fecha = ipFecha.value || ipHoy();
  const editando = ipEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const d = { id, nombre, fecha, descripcion: ipDescripcion.value.trim(), destino: ipDestino.value };
  ipGuardar.disabled = true;
  setEstado(ipFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "informacion_editar" : "informacion_agregar", d);
    if (editando) informaciones = informaciones.map((x) => (x.id === id ? d : x));
    else informaciones.push(d);
    cerrarFormIp();
    dibujarChipsIp();
  } catch (err) {
    setEstado(ipFormEstado, "Error: " + err.message, "error");
  } finally {
    ipGuardar.disabled = false;
  }
}

async function borrarIp() {
  const d = ipEditando;
  if (!d || !window.confirm("¿Eliminar «" + d.nombre + "»?")) return;
  ipBorrar.disabled = true;
  setEstado(ipFormEstado, "Eliminando…");
  try {
    await llamarNotas("informacion_borrar", { id: d.id });
    informaciones = informaciones.filter((x) => x.id !== d.id);
    cerrarFormIp();
    dibujarChipsIp();
  } catch (err) {
    setEstado(ipFormEstado, "Error: " + err.message, "error");
  } finally {
    ipBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarInformaciones() {
  setEstado(ipEstado, "Cargando…");
  try {
    const j = await llamarNotas("informacion_listar");
    informaciones = Array.isArray(j.informaciones) ? j.informaciones : [];
    ipCargadas = true;
    setEstado(ipEstado, "");
    dibujarChipsIp();
  } catch (err) {
    setEstado(ipEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelInformacion() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    ipCargadas = false;
    informaciones = [];
  }
  if (panelIp.hidden) return;
  const dentro = sesionVigente();
  ipSinSesion.hidden = dentro;
  ipContenido.hidden = !dentro;
  if (dentro) {
    if (!ipCargadas) cargarInformaciones();
    else dibujarChipsIp();
  } else {
    cerrarFormIp();
    dibujarChipsIp();
  }
}

// Se llama al entrar a la página de Información Primordial (desde mostrarSeccion)
function entrarInformacion() {
  cerrarFormIp();
  panelIp.hidden = false;
  dibujarChipsIp();
  actualizarPanelInformacion();
}
// Información Primordial es una página: aquí solo se cierra la ventana
function cerrarInformacion() {
  cerrarFormIp();
}

ipEl("ip-cerrar").addEventListener("click", cerrarInformacion);
ipEl("ip-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarInformaciones();
  else actualizarPanelInformacion();
});
ipEl("ip-ir-login").addEventListener("click", () => {
  cerrarInformacion();
  abrirLateral();
});
ipGuardar.addEventListener("click", guardarIp);
ipEl("ip-cancelar").addEventListener("click", cerrarFormIp);
ipBorrar.addEventListener("click", borrarIp);
// Esc cierra la ventana
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelIp.hidden) return;
  if (!ipForm.hidden) cerrarFormIp();
});

// ---------- Comandos (hoja «comandos») ----------
// Notas con Nombre | Fecha | Descripcion | Id (la Id de la columna D se llena sola).
const cmEl = (id) => document.getElementById(id);
const panelCm = cmEl("panel-comandos");
const cmSinSesion = cmEl("cm-sin-sesion");
const cmContenido = cmEl("cm-contenido");
const cmEstado = cmEl("cm-estado");
const cmChips = cmEl("cm-chips");
const cmForm = cmEl("cm-form");
const cmFormTitulo = cmEl("cm-form-titulo");
const cmNombre = cmEl("cm-nombre");
const cmFecha = cmEl("cm-fecha");
const cmDescripcion = cmEl("cm-descripcion");
const cmDestino = cmEl("cm-destino");
const cmGuardar = cmEl("cm-guardar");
const cmBorrar = cmEl("cm-borrar");
const cmFormEstado = cmEl("cm-form-estado");

let comandosLista = []; // [{ id, nombre, fecha, descripcion }]
let cmCargadas = false;
let cmEditando = null; // nota abierta en la ventana (null = nota nueva)

// Fecha de hoy como "aaaa-mm-dd" (formato del campo de fecha y de la hoja)
function cmHoy() {
  const n = new Date();
  return `${n.getFullYear()}-${dos(n.getMonth() + 1)}-${dos(n.getDate())}`;
}
// "aaaa-mm-dd" -> "dd/mm/aaaa" para mostrarla
function cmFechaCorta(f) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function dibujarChipsCm() {
  cmChips.innerHTML = "";
  comandosLista.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chcm-resumen";
    b.title = d.nombre + (d.fecha ? " (" + cmFechaCorta(d.fecha) + ")" : "");
    b.setAttribute("aria-label", "Ver o editar el comando " + d.nombre);
    const n = document.createElement("span");
    n.className = "ej-chcm-nombre";
    n.textContent = "🎙️ " + d.nombre;
    const f = document.createElement("span");
    f.className = "ej-chcm-fecha";
    f.textContent = cmFechaCorta(d.fecha);
    const t = document.createElement("span");
    t.className = "ej-chcm-desc";
    t.textContent = resumenCorto(d.descripcion, 70);
    b.append(n, f, t);
    b.addEventListener("click", () => abrirFormCm(d));
    cmChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chcm-nuevo";
  nuevo.setAttribute("aria-label", "Añadir un comando");
  nuevo.innerHTML = '<span class="ej-chcm-icono" aria-hidden="true">+</span><span class="ej-chcm-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormCm(null));
  cmChips.appendChild(nuevo);
}

// ----- Ventana para añadir / editar -----
const migCm = montarMigrar(cmDestino, {
  accion: "migrar_drive",
  extra: { zona: "comando" },
  obtener: () => cmEditando,
  estado: cmFormEstado,
});
function abrirFormCm(d) {
  cmEditando = d;
  cmFormTitulo.textContent = d ? "Editar comando" : "Nuevo comando";
  cmNombre.value = d ? d.nombre : "";
  cmFecha.value = d && d.fecha ? d.fecha : cmHoy(); // si es nueva, empieza con la fecha de hoy
  cmDescripcion.value = d ? d.descripcion : "";
  cmDestino.value = (d && d.destino !== "drive") ? "sheets" : "drive";
  migCm.actualizar(d);
  cmBorrar.hidden = !d;
  setEstado(cmFormEstado, "");
  cmForm.hidden = false;
  cmNombre.focus();
}
function cerrarFormCm() {
  cmForm.hidden = true;
  cmEditando = null;
}

async function guardarCm() {
  const nombre = cmNombre.value.trim();
  if (!nombre) {
    setEstado(cmFormEstado, "Escribe el nombre", "error");
    return;
  }
  const fecha = cmFecha.value || cmHoy();
  const editando = cmEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const d = { id, nombre, fecha, descripcion: cmDescripcion.value.trim(), destino: cmDestino.value };
  cmGuardar.disabled = true;
  setEstado(cmFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "comando_editar" : "comando_agregar", d);
    if (editando) comandosLista = comandosLista.map((x) => (x.id === id ? d : x));
    else comandosLista.push(d);
    cerrarFormCm();
    dibujarChipsCm();
  } catch (err) {
    setEstado(cmFormEstado, "Error: " + err.message, "error");
  } finally {
    cmGuardar.disabled = false;
  }
}

async function borrarCm() {
  const d = cmEditando;
  if (!d || !window.confirm("¿Eliminar «" + d.nombre + "»?")) return;
  cmBorrar.disabled = true;
  setEstado(cmFormEstado, "Eliminando…");
  try {
    await llamarNotas("comando_borrar", { id: d.id });
    comandosLista = comandosLista.filter((x) => x.id !== d.id);
    cerrarFormCm();
    dibujarChipsCm();
  } catch (err) {
    setEstado(cmFormEstado, "Error: " + err.message, "error");
  } finally {
    cmBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarComandos() {
  setEstado(cmEstado, "Cargando…");
  try {
    const j = await llamarNotas("comando_listar");
    comandosLista = Array.isArray(j.comandosLista) ? j.comandosLista : [];
    cmCargadas = true;
    setEstado(cmEstado, "");
    dibujarChipsCm();
  } catch (err) {
    setEstado(cmEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelComandos() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    cmCargadas = false;
    comandosLista = [];
  }
  if (panelCm.hidden) return;
  const dentro = sesionVigente();
  cmSinSesion.hidden = dentro;
  cmContenido.hidden = !dentro;
  if (dentro) {
    if (!cmCargadas) cargarComandos();
    else dibujarChipsCm();
  } else {
    cerrarFormCm();
    dibujarChipsCm();
  }
}

// Se llama al entrar a la página de Comandos (desde mostrarSeccion)
function entrarComandos() {
  cerrarFormCm();
  panelCm.hidden = false;
  dibujarChipsCm();
  actualizarPanelComandos();
}
// Comandos es una página: aquí solo se cierra la ventana
function cerrarComandos() {
  cerrarFormCm();
}

cmEl("cm-cerrar").addEventListener("click", cerrarComandos);
cmEl("cm-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarComandos();
  else actualizarPanelComandos();
});
cmEl("cm-ir-login").addEventListener("click", () => {
  cerrarComandos();
  abrirLateral();
});
cmGuardar.addEventListener("click", guardarCm);
cmEl("cm-cancelar").addEventListener("click", cerrarFormCm);
cmBorrar.addEventListener("click", borrarCm);
// Esc cierra la ventana
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelCm.hidden) return;
  if (!cmForm.hidden) cerrarFormCm();
});

// ---------- Bazar (hoja «Bazar») ----------
// Registros con Nombre | Informacion | Categoria | Id (la Id de la columna D se llena sola).
// La categoría puede ser Bazar, Pedidos de Yeso o Ventas y decide en qué zona de la página se ve el registro:
// «Bazar» (arriba), «Pedidos de Yeso» (solo aparece si hay registros) o «Ventas» (zona nueva, al final).
const BZ_CATEGORIAS = ["Bazar", "Pedidos de Yeso", "Ventas"];
const bzEl = (id) => document.getElementById(id);
const panelBz = bzEl("panel-bazar");
const bzSinSesion = bzEl("bz-sin-sesion");
const bzContenido = bzEl("bz-contenido");
const bzEstado = bzEl("bz-estado");
const bzChips = bzEl("bz-chips");
const bzChipsYeso = bzEl("bz-chips-yeso");
const bzChipsVentas = bzEl("bz-chips-ventas");
const bzZonaYeso = bzEl("bz-zona-yeso");
const bzZonaVentas = bzEl("bz-zona-ventas");
const bzForm = bzEl("bz-form");
const bzFormTitulo = bzEl("bz-form-titulo");
const bzNombre = bzEl("bz-nombre");
const bzCategoria = bzEl("bz-categoria");
const bzInformacion = bzEl("bz-informacion");
const bzDestino = bzEl("bz-destino");
const bzGuardar = bzEl("bz-guardar");
const bzBorrar = bzEl("bz-borrar");
const bzFormEstado = bzEl("bz-form-estado");

let bazarLista = []; // [{ id, nombre, informacion, categoria }]
let bzCargadas = false;
let bzEditando = null; // registro abierto en la ventana (null = registro nuevo)

// Categoría válida de un registro (los que no traen una, o traen otra cosa, cuentan como «Bazar»)
function categoriaBz(d) {
  return d && BZ_CATEGORIAS.indexOf(d.categoria) !== -1 ? d.categoria : "Bazar";
}

// Dibuja en un contenedor los registros de una categoría. conAnadir: agrega el cuadro «+ Añadir»
// (que abre la ventana con esa categoría ya elegida).
function dibujarChipsBzEn(cont, categoria, conAnadir) {
  cont.innerHTML = "";
  bazarLista.filter((d) => categoriaBz(d) === categoria).forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chip-resumen";
    b.title = d.nombre;
    b.setAttribute("aria-label", "Ver o editar el registro " + d.nombre);
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = d.nombre;
    const t = document.createElement("span");
    t.className = "ej-chip-desc";
    t.textContent = resumenCorto(d.informacion, 70);
    b.append(n, t);
    b.addEventListener("click", () => abrirFormBz(d));
    cont.appendChild(b);
  });
  if (!conAnadir) return;
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir un registro a " + categoria);
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormBz(null, categoria));
  cont.appendChild(nuevo);
}

function dibujarChipsBz() {
  dibujarChipsBzEn(bzChips, "Bazar", true);
  dibujarChipsBzEn(bzChipsVentas, "Ventas", true);
  dibujarChipsBzEn(bzChipsYeso, "Pedidos de Yeso", false);
  const dentro = sesionVigente();
  // Ventas se ve siempre que haya sesión; la de Pedidos de Yeso solo si ya hay registros con esa categoría
  bzZonaVentas.hidden = !dentro;
  bzZonaYeso.hidden = !dentro || !bazarLista.some((d) => categoriaBz(d) === "Pedidos de Yeso");
}

// ----- Ventana para añadir / editar -----
// categoriaInicial: la categoría que aparece elegida en un registro nuevo (por defecto «Bazar»)
const migBz = montarMigrar(bzDestino, {
  accion: "migrar_drive",
  extra: { zona: "bazar" },
  obtener: () => bzEditando,
  estado: bzFormEstado,
});
function abrirFormBz(d, categoriaInicial) {
  bzEditando = d;
  bzFormTitulo.textContent = d ? "Editar registro" : "Nuevo registro";
  bzNombre.value = d ? d.nombre : "";
  bzCategoria.value = d ? categoriaBz(d) : BZ_CATEGORIAS.indexOf(categoriaInicial) !== -1 ? categoriaInicial : "Bazar";
  bzInformacion.value = d ? d.informacion : "";
  bzDestino.value = (d && d.destino !== "drive") ? "sheets" : "drive";
  migBz.actualizar(d);
  bzBorrar.hidden = !d;
  setEstado(bzFormEstado, "");
  bzForm.hidden = false;
  // El formulario vive en la parte de arriba (zona Bazar): si se abrió desde Ventas, se baja/sube hasta él
  bzForm.scrollIntoView({ behavior: "smooth", block: "center" });
  bzNombre.focus({ preventScroll: true });
}
function cerrarFormBz() {
  bzForm.hidden = true;
  bzEditando = null;
}

async function guardarBz() {
  const nombre = bzNombre.value.trim();
  if (!nombre) {
    setEstado(bzFormEstado, "Escribe el nombre", "error");
    return;
  }
  const editando = bzEditando;
  const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  const categoria = BZ_CATEGORIAS.indexOf(bzCategoria.value) !== -1 ? bzCategoria.value : "Bazar";
  const d = { id, nombre, informacion: bzInformacion.value.trim(), categoria, destino: bzDestino.value };
  bzGuardar.disabled = true;
  setEstado(bzFormEstado, "Guardando…");
  try {
    await llamarNotas(editando ? "bazar_editar" : "bazar_agregar", d);
    if (editando) bazarLista = bazarLista.map((x) => (x.id === id ? d : x));
    else bazarLista.push(d);
    cerrarFormBz();
    dibujarChipsBz();
  } catch (err) {
    setEstado(bzFormEstado, "Error: " + err.message, "error");
  } finally {
    bzGuardar.disabled = false;
  }
}

async function borrarBz() {
  const d = bzEditando;
  if (!d || !window.confirm("¿Eliminar «" + d.nombre + "»?")) return;
  bzBorrar.disabled = true;
  setEstado(bzFormEstado, "Eliminando…");
  try {
    await llamarNotas("bazar_borrar", { id: d.id });
    bazarLista = bazarLista.filter((x) => x.id !== d.id);
    cerrarFormBz();
    dibujarChipsBz();
  } catch (err) {
    setEstado(bzFormEstado, "Error: " + err.message, "error");
  } finally {
    bzBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarBazar() {
  setEstado(bzEstado, "Cargando…");
  try {
    const j = await llamarNotas("bazar_listar");
    bazarLista = Array.isArray(j.bazarLista) ? j.bazarLista : [];
    bzCargadas = true;
    setEstado(bzEstado, "");
    dibujarChipsBz();
  } catch (err) {
    setEstado(bzEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelBazar() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    bzCargadas = false;
    bazarLista = [];
  }
  if (panelBz.hidden) return;
  const dentro = sesionVigente();
  bzSinSesion.hidden = dentro;
  bzContenido.hidden = !dentro;
  if (dentro) {
    if (!bzCargadas) cargarBazar();
    else dibujarChipsBz();
  } else {
    cerrarFormBz();
    dibujarChipsBz();
  }
}

// Se llama al entrar a la página de Bazar (desde mostrarSeccion)
function entrarBazar() {
  cerrarFormBz();
  panelBz.hidden = false;
  dibujarChipsBz();
  actualizarPanelBazar();
}
// Bazar es una página: aquí solo se cierra la ventana
function cerrarBazar() {
  cerrarFormBz();
}

bzEl("bz-cerrar").addEventListener("click", cerrarBazar);
bzEl("bz-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarBazar();
  else actualizarPanelBazar();
});
bzEl("bz-ir-login").addEventListener("click", () => {
  cerrarBazar();
  abrirLateral();
});
bzGuardar.addEventListener("click", guardarBz);
bzEl("bz-cancelar").addEventListener("click", cerrarFormBz);
bzBorrar.addEventListener("click", borrarBz);
// Esc cierra la ventana
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelBz.hidden) return;
  if (!bzForm.hidden) cerrarFormBz();
});

// ---------- Empresas/Proyectos (hoja «Empresas Proyectos», columnas A a H) ----------
// Mini notas con Nombre | Fecha | Link | Imagen | Descripcion/Nota | zona de links | Id | Notas (A a H).
// La imagen se sube a imgbb (igual que en Proyectos) y la zona de links lleva un link por línea.
// La columna H «Notas» guarda las notas personales de cada empresa o proyecto (se agregan desde su vista).
const emEl = (id) => document.getElementById(id);
const panelEm = emEl("panel-empresas");
const emSinSesion = emEl("em-sin-sesion");
const emContenido = emEl("em-contenido");
const emEstado = emEl("em-estado");
const emChips = emEl("em-chips");
const emForm = emEl("em-form");
const emFormTitulo = emEl("em-form-titulo");
const emVista = emEl("em-vista");
const emElegirImg = emEl("em-elegir-img");
const emQuitarImg = emEl("em-quitar-img");
const emArchivo = emEl("em-archivo");
const emNombre = emEl("em-nombre");
const emFecha = emEl("em-fecha");
const emLink = emEl("em-link");
const emLinkVista = emEl("em-link-vista");
const emDescripcion = emEl("em-descripcion");
const emLinks = emEl("em-links");
const emLinksVista = emEl("em-links-vista");
const emGuardar = emEl("em-guardar");
const emBorrar = emEl("em-borrar");
const emFormEstado = emEl("em-form-estado");

let empresas = []; // [{ id, nombre, fecha, link, imagen, descripcion, links, notas: [{ id, fecha, texto }] }]
let emCargadas = false;
let emEditando = null; // empresa abierta en la ventana (null = nueva)
let emImagenUrl = ""; // imagen actual (URL de imgbb)
let emImagenNueva = null; // { base64, vista } cuando se eligió una imagen que aún no se sube

// Dibuja uno o varios links (como enlaces si son direcciones web) dentro de un contenedor
function emDibujarEnlaces(contenedor, lista) {
  contenedor.innerHTML = "";
  lista.forEach((l) => {
    const href = hrefSeguro(l);
    const el = document.createElement(href ? "a" : "span");
    if (href) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
    el.textContent = l;
    contenedor.appendChild(el);
  });
}
emLink.addEventListener("input", () => emDibujarEnlaces(emLinkVista, enlacesDeTexto(emLink.value.slice(0, 2000)).slice(0, 1)));
emLinks.addEventListener("input", () => emDibujarEnlaces(emLinksVista, enlacesDeTexto(emLinks.value)));

// ----- Imagen -----
function emDibujarVistaImagen() {
  emVista.innerHTML = "";
  const src = emImagenNueva ? emImagenNueva.vista : emImagenUrl;
  if (src && (emImagenNueva || imagenValida(src))) {
    const img = document.createElement("img");
    img.alt = "Imagen de la empresa o proyecto";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      emVista.textContent = "No se pudo cargar la imagen. Revisa el link.";
    });
    img.src = src;
    emVista.appendChild(img);
  } else {
    emVista.textContent = "Sin imagen";
  }
  emQuitarImg.hidden = !(emImagenNueva || emImagenUrl);
  emElegirImg.textContent = emImagenNueva || emImagenUrl ? "Cambiar imagen" : "Elegir imagen";
}
emElegirImg.addEventListener("click", () => emArchivo.click());

// Poner la imagen pegando su link (por ejemplo el «Enlace directo» de imgbb): no se sube nada, solo se usa la dirección
const emUrlImg = emEl("em-url-img");
const emUsarUrl = emEl("em-usar-url");
function emUsarLinkImagen() {
  const u = emUrlImg.value.trim();
  if (!u) {
    setEstado(emFormEstado, "Pega primero el link de la imagen", "error");
    return false;
  }
  if (!imagenValida(u) || u.length > 2000) {
    setEstado(emFormEstado, "El link debe empezar con http:// o https://", "error");
    return false;
  }
  if (/^https?:\/\/(www\.)?ibb\.co\//i.test(u)) {
    setEstado(emFormEstado, "Ese es el link de la página de imgbb. Copia el «Enlace directo» (empieza con https://i.ibb.co/…)", "error");
    return false;
  }
  emImagenUrl = u;
  emImagenNueva = null; // el link reemplaza a cualquier archivo elegido antes
  emArchivo.value = "";
  emUrlImg.value = "";
  emDibujarVistaImagen();
  setEstado(emFormEstado, "");
  return true;
}
emUsarUrl.addEventListener("click", emUsarLinkImagen);
emUrlImg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    emUsarLinkImagen();
  }
});

emQuitarImg.addEventListener("click", () => {
  emImagenNueva = null;
  emImagenUrl = "";
  emArchivo.value = "";
  emDibujarVistaImagen();
});
emArchivo.addEventListener("change", async () => {
  const archivo = emArchivo.files && emArchivo.files[0];
  if (!archivo) return;
  setEstado(emFormEstado, "Preparando imagen…");
  try {
    emImagenNueva = await leerImagenReducida(archivo);
    emDibujarVistaImagen();
    setEstado(emFormEstado, "");
  } catch (err) {
    setEstado(emFormEstado, "Error: " + err.message, "error");
  }
  emArchivo.value = "";
});

// ----- Vista del proyecto (al tocar un recuadro): imagen, nombre y fecha, descripción y botones de redes -----
const emDetalle = emEl("em-detalle");
const emDetImagen = emEl("em-det-imagen");
const emDetNombre = emEl("em-det-nombre");
const emDetFecha = emEl("em-det-fecha");
const emDetDesc = emEl("em-det-desc");
const emDetLinksZona = emEl("em-det-links-zona");
const emDetLinks = emEl("em-det-links");
let emDetActual = null; // empresa o proyecto que se está viendo (null = ninguno)

// Redes conocidas: se reconocen por el dominio del link. Lo que no esté aquí sale como «Enlace».
const REDES_EM = [
  { id: "youtube", nombre: "YouTube", glifo: "▶", hosts: ["youtube.com", "youtu.be", "youtube-nocookie.com"] },
  { id: "facebook", nombre: "Facebook", glifo: "f", hosts: ["facebook.com", "fb.com", "fb.me", "fb.watch"] },
  { id: "x", nombre: "X (Twitter)", glifo: "X", hosts: ["twitter.com", "x.com", "t.co"] },
  { id: "instagram", nombre: "Instagram", glifo: "◎", hosts: ["instagram.com", "instagr.am"] },
  { id: "threads", nombre: "Threads", glifo: "@", hosts: ["threads.net", "threads.com"] },
  { id: "tiktok", nombre: "TikTok", glifo: "♪", hosts: ["tiktok.com"] },
  { id: "whatsapp", nombre: "WhatsApp", glifo: "✆", hosts: ["whatsapp.com", "wa.me"] },
  { id: "telegram", nombre: "Telegram", glifo: "➤", hosts: ["t.me", "telegram.me", "telegram.org"] },
  { id: "linkedin", nombre: "LinkedIn", glifo: "in", hosts: ["linkedin.com"] },
  { id: "github", nombre: "GitHub", glifo: "</>", hosts: ["github.com", "github.io"] },
  { id: "twitch", nombre: "Twitch", glifo: "T", hosts: ["twitch.tv"] },
  { id: "spotify", nombre: "Spotify", glifo: "♫", hosts: ["spotify.com", "spotify.link"] },
  { id: "pinterest", nombre: "Pinterest", glifo: "P", hosts: ["pinterest.com", "pin.it"] },
  { id: "reddit", nombre: "Reddit", glifo: "r/", hosts: ["reddit.com", "redd.it"] },
  { id: "discord", nombre: "Discord", glifo: "D", hosts: ["discord.com", "discord.gg"] },
  { id: "drive", nombre: "Google Drive", glifo: "▲", hosts: ["drive.google.com", "docs.google.com"] },
];

// Iconos de las redes (SVG propios y sencillos; usan el color del texto). Si una red no tiene icono se usa el glifo de texto.
const EM_SVG_BASE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
const EM_TXT = (t, tam) => '<text x="12" y="17.5" text-anchor="middle" font-size="' + tam + '" font-weight="800" fill="currentColor" stroke="none" font-family="Arial,sans-serif">' + t + '</text>';
const EM_ICONOS_SVG = {
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14.2 8H16.5V4.8h-2.7c-2.6 0-3.8 1.6-3.8 3.9V10H7.7v3.2H10V20h3.3v-6.8h2.5l.5-3.2h-3v-1c0-.7.3-1 .9-1z" fill="currentColor" stroke="none"/>',
  x: '<path d="M5 4l14 16M19 4L5 20"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>',
  threads: EM_TXT("@", 17),
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.3 2 3.8 4.5 4"/>',
  whatsapp: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 18.7z"/><path d="M9.3 8.6c0 3.3 2.8 6.1 6.1 6.1l1-1.4-2-1-.9.8c-1-.4-1.9-1.3-2.3-2.3l.8-.9-1-2z" fill="currentColor" stroke="none"/>',
  telegram: '<path d="M21 4L3 11l6 2 2 6 3-4 4 3z" stroke-width="1.8"/><path d="M9 13l12-9"/>',
  linkedin: EM_TXT("in", 14),
  github: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12"/>',
  twitch: '<path d="M5 3h15v10l-4 4h-4l-3 3v-3H5z"/><path d="M11 7v4M15 7v4"/>',
  spotify: '<circle cx="12" cy="12" r="9"/><path d="M7 9.5c3.5-1 7-.7 10 1M7.5 12.5c3-.8 6-.5 8.5 1M8 15.3c2.5-.6 5-.4 7 .8"/>',
  pinterest: EM_TXT("P", 17),
  reddit: EM_TXT("r/", 13),
  discord: '<path d="M5 7.5c2-1.3 4-2 7-2s5 .7 7 2c1 2.5 1.6 5.5 1.5 9-1.5 1.2-3 1.8-4.5 2l-1-2c-1 .3-2 .4-3 .4s-2-.1-3-.4l-1 2c-1.5-.2-3-.8-4.5-2-.1-3.5.5-6.5 1.5-9z" stroke-width="1.8"/><circle cx="9.2" cy="12.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.8" cy="12.5" r="1.2" fill="currentColor" stroke="none"/>',
  drive: '<path d="M9 4h6l6 10-3 5H6l-3-5z" stroke-width="1.8"/><path d="M9 4l6 10h6M15 4L9 14H3M6 19l3-5h9"/>',
  enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
// Devuelve el icono de una red como elemento <span>; si no hay SVG, usa el glifo de texto
function emIconoRed(redId, glifo) {
  const span = document.createElement("span");
  span.className = "em-red-ico";
  span.setAttribute("aria-hidden", "true");
  if (EM_ICONOS_SVG[redId]) span.innerHTML = EM_SVG_BASE + EM_ICONOS_SVG[redId] + "</svg>"; // contenido fijo del código, sin datos del usuario
  else span.textContent = glifo;
  return span;
}

// Devuelve la red de un link (o una «Enlace» genérico) y un texto corto para mostrar debajo del nombre
function emRedDeLink(href) {
  let host = "";
  let resto = "";
  try {
    const u = new URL(href);
    host = u.hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");
    resto = (u.pathname + u.search).replace(/\/$/, "");
  } catch (e) {}
  const red = REDES_EM.find((r) => r.hosts.some((h) => host === h || host.endsWith("." + h)));
  let corto = host + (resto && resto !== "/" ? resto : "");
  if (corto.length > 38) corto = corto.slice(0, 37) + "…";
  return {
    id: red ? red.id : "enlace",
    nombre: red ? red.nombre : "Enlace",
    glifo: red ? red.glifo : "🔗",
    corto: corto || href,
  };
}

function emFechaLarga(f) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || "");
  if (!m) return "";
  try {
    return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  } catch (e) {
    return ipFechaCorta(f);
  }
}

function dibujarDetalleEm() {
  const d = emDetActual;
  if (!d) return;
  // Imagen
  emDetImagen.innerHTML = "";
  const vacio = () => {
    emDetImagen.innerHTML = "";
    const v = document.createElement("span");
    v.className = "em-det-hero-vacio";
    v.setAttribute("aria-hidden", "true");
    v.textContent = "🏢";
    emDetImagen.appendChild(v);
  };
  if (imagenValida(d.imagen)) {
    const img = document.createElement("img");
    img.alt = "Imagen de " + d.nombre;
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", vacio);
    img.src = d.imagen;
    emDetImagen.appendChild(img);
  } else {
    vacio();
  }
  // Nombre y fecha (en la misma línea)
  emDetNombre.textContent = d.nombre;
  emDetFecha.textContent = emFechaLarga(d.fecha);
  // Descripción
  const desc = String(d.descripcion || "").trim();
  emDetDesc.textContent = desc || "Sin descripción todavía. Puedes añadirla desde los ajustes (⚙).";
  emDetDesc.classList.toggle("vacia", !desc);
  // Botones de enlaces: el link principal y los de la zona de links, sin repetir
  const lista = [];
  [d.link].concat(enlacesDeTexto(d.links)).forEach((l) => {
    const t = String(l || "").trim();
    if (t && !lista.includes(t)) lista.push(t);
  });
  emDetLinks.innerHTML = "";
  lista.forEach((l) => {
    const href = hrefSeguro(l);
    const red = href ? emRedDeLink(href) : { id: "enlace", nombre: "Texto", glifo: "✎", corto: l.length > 38 ? l.slice(0, 37) + "…" : l };
    // Cada recuadro es un botón: al presionarlo se abre el submenú de esa red (el enlace se abre desde ahí)
    const el = document.createElement("button");
    el.type = "button";
    el.className = "em-red" + (href ? "" : " em-red-texto");
    el.dataset.red = red.id;
    el.title = href || l;
    el.setAttribute("aria-label", "Abrir el submenú de " + red.nombre);
    el.setAttribute("aria-haspopup", "dialog");
    const txt = document.createElement("span");
    txt.className = "em-red-txt";
    const b = document.createElement("b");
    b.textContent = red.nombre;
    const sm = document.createElement("small");
    sm.textContent = red.corto;
    txt.append(b, sm);
    el.append(emIconoRed(red.id, red.glifo), txt);
    el.addEventListener("click", () => abrirSubRed(red, href, l, el));
    emDetLinks.appendChild(el);
  });
  emDetLinksZona.hidden = lista.length === 0;
  dibujarNotasEm();
}

// ----- Submenú de una red (se abre al presionar un recuadro de enlace). De momento está vacío: aquí irán sus opciones -----
const emRedSub = emEl("em-red-sub");
const emRedSubCab = emEl("em-red-sub-cab");
const emRedSubIco = emEl("em-red-sub-ico");
const emRedSubNombre = emEl("em-red-sub-nombre");
const emRedSubLink = emEl("em-red-sub-link");
const emRedSubAbrir = emEl("em-red-sub-abrir");
const emRedSubCuerpo = emEl("em-red-sub-cuerpo"); // zona libre para el contenido futuro
let emSubActual = null; // { red, href, texto, empresa } del submenú abierto (null = cerrado)
let emSubBoton = null; // recuadro que lo abrió (para devolver el foco al cerrar)

function abrirSubRed(red, href, texto, boton) {
  emSubActual = { red, href, texto, empresa: emDetActual };
  emSubBoton = boton || null;
  // Mismo color de fondo que tenía el recuadro
  const fondo = boton ? getComputedStyle(boton).getPropertyValue("--red-fondo").trim() : "";
  if (fondo) emRedSubCab.style.setProperty("--red-fondo", fondo);
  else emRedSubCab.style.removeProperty("--red-fondo");
  emRedSubCab.dataset.red = red.id;
  emRedSubIco.innerHTML = "";
  emRedSubIco.appendChild(emIconoRed(red.id, red.glifo));
  emRedSubNombre.textContent = red.nombre;
  emRedSubLink.textContent = href || texto;
  if (href) {
    emRedSubAbrir.href = href;
    emRedSubAbrir.hidden = false;
  } else {
    emRedSubAbrir.removeAttribute("href");
    emRedSubAbrir.hidden = true;
  }
  emRedSub.hidden = false;
  emRedSub.scrollTop = 0;
  emEl("em-red-sub-volver").focus();
}
function cerrarSubRed() {
  if (emRedSub.hidden) return;
  emRedSub.hidden = true;
  emSubActual = null;
  if (emSubBoton && document.contains(emSubBoton)) emSubBoton.focus();
  emSubBoton = null;
}
emEl("em-red-sub-volver").addEventListener("click", cerrarSubRed);

function abrirDetalleEm(d) {
  emRedSub.hidden = true;
  emSubActual = null;
  emDetActual = d;
  emNotaReiniciarForm();
  setEstado(emNotaEstado, "");
  dibujarDetalleEm();
  emDetalle.hidden = false;
  emDetalle.scrollTop = 0;
  emEl("em-det-volver").focus();
}
function cerrarDetalleEm() {
  emRedSub.hidden = true;
  emSubActual = null;
  emSubBoton = null;
  emDetalle.hidden = true;
  emHoja.hidden = true;
  const nesp = document.getElementById("em-nesp");
  if (nesp) nesp.hidden = true;
  const canal = document.getElementById("em-canal");
  if (canal) canal.hidden = true;
  emDetActual = null;
}
emEl("em-det-volver").addEventListener("click", cerrarDetalleEm);
// El engrane abre la zona de ajustes (el formulario de editar) de este proyecto
emEl("em-det-ajustes").addEventListener("click", () => {
  if (emDetActual) abrirFormEm(emDetActual);
});

// ----- Hoja de redes: UNA sola hoja con celdas de texto, parecida a Google Sheets -----
// Vive en la pestaña «Hoja Redes» del libro de Google Sheets (Nombre | Fecha | Youtube | Aviso | Facebook | Aviso | …).
// Se lee completa al abrirla y se guarda completa (sola, un momento después de escribir, y al cerrar).
const HOJA_COLUMNAS = ["Nombre", "Fecha", "Youtube", "Aviso", "Facebook", "Aviso", "Instagram", "Aviso", "TikTok", "Aviso", "Threads", "Aviso", "X", "Aviso", "Whatsapp Community"];
const HOJA_ANCHOS = [400, 240, 360, 260, 360, 260, 360, 260, 360, 260, 360, 260, 320, 260, 400];
const HOJA_ANCHO_MIN = 60;
const HOJA_ANCHO_MAX = 1200;
const HOJA_CLAVE_ANCHOS = "polo-hoja-redes-anchos"; // los anchos que eliges se recuerdan en este dispositivo (la hoja 2 usa su propia clave)
let hojaNumero = 1; // 1 = hoja principal, 2 = hoja secundaria (misma estructura)
let hojaEmpresa = null; // empresa o proyecto dueño de la hoja abierta (cada proyecto tiene sus propias hojas)
// Los anchos se recuerdan por proyecto; si ese proyecto aún no tiene los suyos se usan los de antes (clave sin proyecto)
const hojaClaveAnchosViejos = () => HOJA_CLAVE_ANCHOS + (hojaNumero === 2 ? "-2" : "");
const hojaClaveAnchos = () => HOJA_CLAVE_ANCHOS + (hojaEmpresa ? "-p" + hojaEmpresa.id : "") + (hojaNumero === 2 ? "-2" : "");
const HOJA_COL_MAX = 60; // igual a MAX_COL_REDES del Apps Script
const HOJA_NOMBRE_COL_MAX = 60; // igual a MAX_NOMBRE_COL_REDES del Apps Script
const HOJA_ANCHO_NUEVA = 260; // ancho de una columna nueva (px)
const HOJA_FILAS_MIN = 25;
const HOJA_FILAS_MAX = 2000; // igual a MAX_FILAS_REDES del Apps Script
const HOJA_CELDA_MAX = 5000; // igual a MAX_CELDA_REDES del Apps Script
const HOJA_ESPERA = 1500; // ms sin escribir antes de guardar sola
const emHoja = emEl("em-hoja");
const emHojaEstado = emEl("em-hoja-estado");
const emHojaTabla = emEl("em-hoja-tabla");
const emHojaGuardar = emEl("em-hoja-guardar");
const emHojaTitulo = emEl("em-hoja-titulo");
let hojaColumnas = HOJA_COLUMNAS.slice(); // nombres de las columnas en el orden actual (se pueden agregar y mover)
let hojaDinamico = false; // true si el Apps Script publicado sabe guardar columnas nuevas o movidas
let hojaFilas = []; // [[texto × número de columnas], …]
let hojaCargada = false; // sin una lectura buena no se guarda nada (así nunca se borra la hoja por error)
let hojaCambios = 0; // número de ediciones hechas
let hojaGuardado = 0; // número de ediciones ya guardadas
let hojaTemporizador = null;
let hojaGuardando = null;
let hojaFilaActiva = -1;
const hojaSucia = () => hojaCambios !== hojaGuardado;

// Ancho de origen de la columna i: el de la lista original si sigue siendo la misma columna; si no, el de una columna nueva
function hojaAnchoDefecto(i) {
  return i < HOJA_ANCHOS.length && HOJA_COLUMNAS[i] === hojaColumnas[i] ? HOJA_ANCHOS[i] : HOJA_ANCHO_NUEVA;
}
function hojaLeerAnchos() {
  try {
    const a = JSON.parse(localStorage.getItem(hojaClaveAnchos()) || localStorage.getItem(hojaClaveAnchosViejos()));
    if (Array.isArray(a) && a.length === hojaColumnas.length && a.every((w) => typeof w === "number" && w >= HOJA_ANCHO_MIN && w <= HOJA_ANCHO_MAX)) return a;
  } catch (e) {}
  return hojaColumnas.map((_, i) => hojaAnchoDefecto(i));
}
let hojaAnchos = hojaLeerAnchos(); // ancho actual de cada columna (px)
function hojaGuardarAnchos() {
  try { localStorage.setItem(hojaClaveAnchos(), JSON.stringify(hojaAnchos)); } catch (e) {}
}

// Aplica los anchos a la tabla (la tabla tiene el ancho exacto de la suma, así cada columna mide lo que decidas)
function hojaAplicarAnchos() {
  const cols = emHojaTabla.querySelectorAll("colgroup col");
  hojaAnchos.forEach((w, i) => { if (cols[i + 1]) cols[i + 1].style.width = w + "px"; });
  emHojaTabla.style.width = 46 + hojaAnchos.reduce((a, b) => a + b, 0) + "px";
}

// Asa para estirar o encoger una columna: arrastra el borde derecho de su encabezado (doble toque = tamaño original)
function hojaAgregarAsa(th, c) {
  const asa = document.createElement("span");
  asa.className = "em-hoja-resize";
  asa.title = "Arrastra para cambiar el ancho · doble toque: tamaño original";
  asa.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    asa.setPointerCapture(e.pointerId);
    asa.classList.add("activo");
    const x0 = e.clientX;
    const w0 = hojaAnchos[c];
    const mover = (ev) => {
      hojaAnchos[c] = Math.max(HOJA_ANCHO_MIN, Math.min(HOJA_ANCHO_MAX, Math.round(w0 + ev.clientX - x0)));
      hojaAplicarAnchos();
    };
    const soltar = () => {
      asa.classList.remove("activo");
      asa.removeEventListener("pointermove", mover);
      asa.removeEventListener("pointerup", soltar);
      asa.removeEventListener("pointercancel", soltar);
      hojaGuardarAnchos();
    };
    asa.addEventListener("pointermove", mover);
    asa.addEventListener("pointerup", soltar);
    asa.addEventListener("pointercancel", soltar);
  });
  asa.addEventListener("dblclick", () => {
    hojaAnchos[c] = hojaAnchoDefecto(c);
    hojaAplicarAnchos();
    hojaGuardarAnchos();
  });
  th.appendChild(asa);
}
const hojaFilaVacia = () => hojaColumnas.map(() => "");

// Letra de la columna: A, B, … Z, AA, AB, …
function hojaLetra(i) {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

function hojaDibujar() {
  if (hojaSel && (hojaSel.r2 >= hojaFilas.length || hojaSel.c2 >= hojaColumnas.length)) hojaSel = null;
  hojaSelPintadas = [];
  emHojaTabla.innerHTML = "";
  const grupo = document.createElement("colgroup");
  [46].concat(hojaAnchos).forEach((w) => {
    const col = document.createElement("col");
    col.style.width = w + "px";
    grupo.appendChild(col);
  });
  const cabeza = document.createElement("thead");
  const letras = document.createElement("tr");
  letras.className = "em-hoja-letras";
  letras.appendChild(document.createElement("th"));
  hojaColumnas.forEach((_, i) => {
    const th = document.createElement("th");
    th.textContent = hojaLetra(i);
    hojaAgregarAsa(th, i);
    letras.appendChild(th);
  });
  const nombres = document.createElement("tr");
  nombres.className = "em-hoja-nombres";
  const uno = document.createElement("th");
  uno.textContent = "0"; // la fila 0 son los nombres de las columnas; los datos empiezan en la fila 1
  nombres.appendChild(uno);
  hojaColumnas.forEach((t, i) => {
    const th = document.createElement("th");
    th.textContent = t;
    th.title = t;
    hojaAgregarAsa(th, i);
    nombres.appendChild(th);
  });
  cabeza.append(letras, nombres);
  const cuerpo = document.createElement("tbody");
  hojaFilas.forEach((_, r) => cuerpo.appendChild(hojaCrearFila(r)));
  emHojaTabla.append(grupo, cabeza, cuerpo);
  hojaAplicarAnchos();
  hojaFilaActiva = -1;
  if (hojaSel) hojaSelPintar();
}

// Link pulsable: si el texto de la celda es una dirección web, aparece un botón ↗ que la abre en otra pestaña
function hojaLinkDe(texto) {
  const t = String(texto || "").trim();
  if (!t || /\s/.test(t)) return "";
  if (/^https?:\/\/\S+$/i.test(t)) return t;
  if (/^www\.\S+\.\S+$/i.test(t)) return "https://" + t;
  return "";
}

// Id del video si el link es de YouTube (watch, youtu.be, shorts, embed, live); si es de canal o lista, no hay miniatura
function hojaIdYoutube(texto) {
  const url = hojaLinkDe(texto);
  if (!url) return "";
  let u;
  try { u = new URL(url); } catch (e) { return ""; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  let id = "";
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v") || "";
    else {
      const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
      if (m) id = m[1];
    }
  }
  return /^[\w-]{11}$/.test(id) ? id : "";
}

// Video de Facebook o Instagram (reel, video, post con video); devuelve { red, url } o null. Perfiles y páginas no cuentan.
function hojaVideoSocial(texto) {
  const url = hojaLinkDe(texto);
  if (!url) return null;
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|web|mbasic)\./, "");
  if (host === "fb.watch" && u.pathname.length > 1) return { red: "facebook", url };
  if (host === "facebook.com" && /^\/(reel|reels|watch|video\.php|share\/[vr]|[^/]+\/videos)(\/|$)/.test(u.pathname)) return { red: "facebook", url };
  if (host === "instagram.com" && /^\/(?:[^/]+\/)?(reel|reels|p|tv)\/[\w-]+/.test(u.pathname)) return { red: "instagram", url };
  return null;
}

// Miniaturas de Facebook/Instagram: las pide el Apps Script («miniatura_link») y se recuerdan en este dispositivo unas horas
const HOJA_CLAVE_MINIS = "polo-hoja-redes-minis";
const HOJA_MINIS_TTL = 10 * 3600 * 1000;
const HOJA_MINIS_MAX = 80;
const HOJA_MINIS_REINTENTO = 5 * 60 * 1000; // si una miniatura no se pudo, no se vuelve a pedir en 5 minutos
let hojaMinisCache = null;
const hojaMinisFallos = {};
const hojaMinisPend = {};
const hojaMinisCola = [];
let hojaMinisActivas = 0;
function hojaMinisLeer() {
  if (!hojaMinisCache) {
    try { hojaMinisCache = JSON.parse(localStorage.getItem(HOJA_CLAVE_MINIS)) || {}; } catch (e) { hojaMinisCache = {}; }
  }
  return hojaMinisCache;
}
function hojaMinisGuardar() {
  const c = hojaMinisLeer();
  const claves = Object.keys(c).sort((x, y) => c[y].t - c[x].t);
  claves.slice(HOJA_MINIS_MAX).forEach((k) => delete c[k]);
  try { localStorage.setItem(HOJA_CLAVE_MINIS, JSON.stringify(c)); } catch (e) {}
}
function hojaPedirMiniSocial(url, forzar, cb) {
  const c = hojaMinisLeer();
  if (!forzar && c[url] && Date.now() - c[url].t < HOJA_MINIS_TTL) { cb(c[url].src); return; }
  if (forzar) delete c[url];
  else if (hojaMinisFallos[url] && Date.now() - hojaMinisFallos[url] < HOJA_MINIS_REINTENTO) return;
  if (hojaMinisPend[url]) { hojaMinisPend[url].push(cb); return; }
  hojaMinisPend[url] = [cb];
  hojaMinisCola.push({ url, forzar: !!forzar });
  hojaMinisSiguiente();
}
function hojaMinisSiguiente() {
  while (hojaMinisActivas < 2 && hojaMinisCola.length) {
    const t = hojaMinisCola.shift();
    hojaMinisActivas++;
    llamarNotas("miniatura_link", { url: t.url, forzar: t.forzar })
      .then((j) => {
        if (!j || !j.imagen) { hojaMinisFallos[t.url] = Date.now(); return; }
        hojaMinisLeer()[t.url] = { src: j.imagen, t: Date.now() };
        hojaMinisGuardar();
        (hojaMinisPend[t.url] || []).forEach((cb) => cb(j.imagen));
      })
      .catch(() => { hojaMinisFallos[t.url] = Date.now(); })
      .finally(() => {
        delete hojaMinisPend[t.url];
        hojaMinisActivas--;
        hojaMinisSiguiente();
      });
  }
}

// Recuadro de un video de Facebook/Instagram: primero un fondo de color con el logo; al llegar la miniatura se muestra encima
function hojaMiniSocial(td, m, s) {
  if (!m) {
    m = document.createElement("a");
    m.className = "em-hoja-mini em-hoja-mini-red em-hoja-mini-" + s.red;
    m.dataset.tipo = s.red;
    m.dataset.etq = s.red === "facebook" ? "FB" : "IG";
    m.target = "_blank";
    m.rel = "noopener noreferrer";
    const ins = document.createElement("span");
    ins.className = "em-hoja-mini-ins";
    ins.textContent = "\u25B6";
    const img = document.createElement("img");
    img.alt = "Miniatura del video";
    img.hidden = true;
    img.referrerPolicy = "no-referrer";
    img.addEventListener("load", () => { img.hidden = false; });
    img.addEventListener("error", () => {
      img.hidden = true;
      img.removeAttribute("src");
      // La dirección de la imagen pudo caducar: se pide una nueva una sola vez
      if (m.dataset.reint) return;
      m.dataset.reint = "1";
      const url = m.dataset.url;
      hojaPedirMiniSocial(url, true, (src) => { if (m.dataset.url === url) img.src = src; });
    });
    m.append(img, ins);
    td.appendChild(m);
  }
  m.title = s.red === "facebook" ? "Abrir el video de Facebook" : "Abrir el video de Instagram";
  m.href = s.url;
  if (m.dataset.url !== s.url) {
    m.dataset.url = s.url;
    delete m.dataset.reint;
    const img = m.querySelector("img");
    img.hidden = true;
    img.removeAttribute("src");
    // Un momento de espera por si todavía se está escribiendo el link
    clearTimeout(m._espera);
    m._espera = setTimeout(() => {
      if (m.dataset.url !== s.url) return;
      hojaPedirMiniSocial(s.url, false, (src) => { if (m.dataset.url === s.url) img.src = src; });
    }, 700);
  }
}

// Miniatura dentro de cualquier celda cuyo contenido sea un link de video: YouTube (al tocarla se abre el reproductor),
// Facebook o Instagram (al tocarla se abre el video en otra pestaña)
function hojaActualizarMiniatura(td, inp, texto) {
  const id = hojaIdYoutube(texto);
  const social = id ? null : hojaVideoSocial(texto);
  const tipo = id ? "youtube" : social ? social.red : "";
  let m = td.querySelector(".em-hoja-mini");
  if (m && m.dataset.tipo !== tipo) { m.remove(); m = null; }
  inp.classList.toggle("em-hoja-celda-mini", !!tipo);
  if (!tipo) return;
  if (social) { hojaMiniSocial(td, m, social); return; }
  if (!m) {
    m = document.createElement("a");
    m.className = "em-hoja-mini";
    m.dataset.tipo = "youtube";
    m.target = "_blank";
    m.rel = "noopener noreferrer";
    m.title = "Abrir el video";
    const img = document.createElement("img");
    img.alt = "Miniatura del video";
    img.loading = "lazy";
    img.addEventListener("error", () => {
      m.remove();
      inp.classList.remove("em-hoja-celda-mini");
    });
    m.appendChild(img);
    td.appendChild(m);
  }
  m.href = hojaLinkDe(texto);
  const img = m.firstChild;
  const src = "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
  if (img.getAttribute("src") !== src) img.src = src;
}

function hojaActualizarLink(td, texto) {
  const inp = td.querySelector(".em-hoja-celda");
  let a = td.querySelector(".em-hoja-link");
  const url = hojaLinkDe(texto);
  if (inp) {
    inp.classList.toggle("em-hoja-celda-link", !!url);
    hojaActualizarMiniatura(td, inp, texto);
  }
  if (!url) {
    if (a) a.remove();
    return;
  }
  if (!a) {
    a = document.createElement("a");
    a.className = "em-hoja-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "\u2197";
    a.title = "Abrir el link";
    a.setAttribute("aria-label", "Abrir el link de esta celda");
    td.appendChild(a);
  }
  a.href = url;
}

function hojaCrearFila(r) {
  const tr = document.createElement("tr");
  const num = document.createElement("th");
  num.className = "em-hoja-num";
  num.textContent = String(r + 1); // la fila 0 es el encabezado (nombres de las columnas)
  num.title = "Seleccionar esta fila";
  num.addEventListener("click", () => {
    hojaActivarFila(r);
    hojaEnfocar(r, 0);
  });
  tr.appendChild(num);
  hojaColumnas.forEach((nombre, c) => {
    const td = document.createElement("td");
    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "em-hoja-celda";
    inp.maxLength = HOJA_CELDA_MAX;
    inp.value = hojaFilas[r][c];
    inp.dataset.r = String(r);
    inp.dataset.c = String(c);
    inp.autocomplete = "off";
    inp.spellcheck = false;
    inp.setAttribute("aria-label", nombre + ", fila " + (r + 1));
    td.appendChild(inp);
    hojaActualizarLink(td, inp.value);
    tr.appendChild(td);
  });
  return tr;
}

function hojaActivarFila(r) {
  if (r === hojaFilaActiva) return;
  const filas = emHojaTabla.tBodies[0] ? emHojaTabla.tBodies[0].rows : [];
  if (filas[hojaFilaActiva]) filas[hojaFilaActiva].classList.remove("em-hoja-fila-activa");
  hojaFilaActiva = r;
  if (filas[r]) filas[r].classList.add("em-hoja-fila-activa");
}

function hojaEnfocar(r, c) {
  const el = emHojaTabla.querySelector('input[data-r="' + r + '"][data-c="' + c + '"]');
  if (!el) return false;
  el.focus();
  el.select();
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
  return true;
}

function hojaAgregarFilas(n) {
  const cuerpo = emHojaTabla.tBodies[0];
  if (!cuerpo) return false;
  if (hojaFilas.length + n > HOJA_FILAS_MAX) {
    setEstado(emHojaEstado, "Máximo " + HOJA_FILAS_MAX + " filas", "error");
    return false;
  }
  for (let i = 0; i < n; i++) {
    hojaFilas.push(hojaFilaVacia());
    cuerpo.appendChild(hojaCrearFila(hojaFilas.length - 1));
  }
  return true;
}

let hojaTocada = false; // se editó algo desde que se abrió la hoja (el perfil del canal vuelve a leer los videos al regresar)
function hojaMarcarCambio() {
  hojaCambios++;
  hojaTocada = true;
  setEstado(emHojaEstado, "Sin guardar…");
  clearTimeout(hojaTemporizador);
  hojaTemporizador = setTimeout(guardarHoja, HOJA_ESPERA);
}

// Guarda la hoja completa. Devuelve true si quedó guardada.
async function guardarHoja() {
  clearTimeout(hojaTemporizador);
  hojaTemporizador = null;
  if (!hojaCargada) return false;
  while (hojaGuardando) await hojaGuardando.catch(() => {}); // si ya hay un guardado en curso, se espera
  if (!hojaSucia()) return true;
  const marca = hojaCambios;
  const filas = hojaFilas.map((f) => f.slice());
  while (filas.length && filas[filas.length - 1].every((x) => !String(x).trim())) filas.pop(); // sin filas vacías al final
  setEstado(emHojaEstado, "Guardando…");
  emHojaGuardar.disabled = true;
  const emp = hojaEmpresa;
  hojaGuardando = llamarNotas("hoja_redes_guardar", { hoja: hojaNumero, empresa: emp.id, empresaNombre: emp.nombre, filas, columnas: hojaColumnas.slice() });
  try {
    await hojaGuardando;
    hojaGuardado = marca;
    if (hojaSucia()) {
      // se siguió escribiendo mientras se guardaba
      setEstado(emHojaEstado, "Sin guardar…");
      hojaTemporizador = setTimeout(guardarHoja, HOJA_ESPERA);
    } else {
      const n = new Date();
      setEstado(emHojaEstado, "Guardado ✓ " + dos(n.getHours()) + ":" + dos(n.getMinutes()), "ok");
    }
    return true;
  } catch (err) {
    setEstado(emHojaEstado, "No se pudo guardar: " + err.message + " (se reintenta)", "error");
    hojaTemporizador = setTimeout(guardarHoja, 8000);
    return false;
  } finally {
    hojaGuardando = null;
    emHojaGuardar.disabled = !hojaCargada;
  }
}

async function cargarHoja() {
  hojaCargada = false;
  hojaSel = null;
  hojaSelAncla = null;
  clearTimeout(hojaTemporizador);
  hojaTemporizador = null;
  emHojaGuardar.disabled = true;
  emHojaTabla.innerHTML = "";
  setEstado(emHojaEstado, "Cargando…");
  try {
    const j = await llamarNotas("hoja_redes_listar", { hoja: hojaNumero, empresa: hojaEmpresa.id, empresaNombre: hojaEmpresa.nombre });
    // Un Apps Script viejo no sabe de hojas por proyecto y devolvería la hoja de todos: se rechaza para no mezclar ni guardar encima
    if (j.empresa !== hojaEmpresa.id) throw new Error("hay que publicar la nueva versión del Apps Script (cada proyecto tiene su propia hoja)");
    // Un Apps Script viejo no sabe de la hoja 2 y devolvería la hoja 1: se rechaza para no mezclarlas ni guardar encima
    if (hojaNumero === 2 && j.hoja !== 2) throw new Error("para usar la hoja secundaria hay que publicar la nueva versión del Apps Script");
    hojaDinamico = j.dinamico === true;
    const nombres = Array.isArray(j.columnas) ? j.columnas.map((x) => (x === undefined || x === null ? "" : String(x))) : [];
    hojaColumnas = nombres.length ? nombres : HOJA_COLUMNAS.slice();
    hojaAnchos = hojaLeerAnchos();
    const filas = Array.isArray(j.filas) ? j.filas : [];
    hojaFilas = filas.map((f) => hojaColumnas.map((_, c) => (f && f[c] !== undefined && f[c] !== null ? String(f[c]) : "")));
    while (hojaFilas.length < HOJA_FILAS_MIN) hojaFilas.push(hojaFilaVacia());
    hojaCargada = true;
    hojaCambios = 0;
    hojaGuardado = 0;
    hojaDibujar();
    emHojaGuardar.disabled = false;
    setEstado(emHojaEstado, "");
    return true;
  } catch (err) {
    hojaAviso("Error: " + err.message + " · usa ↻ para reintentar", "error");
    return false;
  }
}

// Marca en el selector 1 / 2 cuál hoja está abierta
function hojaPintarSelector() {
  emHoja.querySelectorAll(".em-hoja-sel-btn").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.hoja === hojaNumero)));
  const nom = hojaEmpresa && hojaEmpresa.nombre ? String(hojaEmpresa.nombre) : "";
  emHojaTitulo.textContent = "\u{1F4CA} Hoja de redes" + (nom ? " · " + (nom.length > 22 ? nom.slice(0, 21) + "…" : nom) : "");
  emHojaTitulo.title = nom;
}

async function abrirHoja(n) {
  if (!emDetActual) return;
  hojaEmpresa = emDetActual; // la hoja es de ESTE proyecto
  hojaNumero = n === 2 ? 2 : 1;
  hojaTocada = false;
  hojaPintarSelector();
  emHoja.hidden = false;
  await cargarHoja();
}

// Cambia entre la hoja 1 y la 2 (antes guarda la que estaba abierta)
let hojaCambiando = false;
async function hojaCambiar(n) {
  if (n === hojaNumero || hojaCambiando) return;
  hojaCambiando = true;
  emHoja.querySelectorAll(".em-hoja-sel-btn").forEach((b) => { b.disabled = true; });
  try {
    hojaCerrarVideo();
    if (hojaCargada && hojaSucia()) {
      const ok = await guardarHoja();
      if (!ok && !window.confirm("No se pudo guardar esta hoja. ¿Cambiar de todos modos y perder los últimos cambios?")) return;
    }
    clearTimeout(hojaTemporizador);
    hojaTemporizador = null;
    hojaNumero = n;
    hojaPintarSelector();
    await cargarHoja();
  } finally {
    hojaCambiando = false;
    emHoja.querySelectorAll(".em-hoja-sel-btn").forEach((b) => { b.disabled = false; });
  }
}

// Al cerrar se guarda antes; si no se puede, se pregunta
async function cerrarHoja() {
  if (hojaCargada && hojaSucia()) {
    const ok = await guardarHoja();
    if (!ok && !window.confirm("No se pudo guardar la hoja. ¿Cerrar de todos modos y perder los últimos cambios?")) return;
  }
  hojaCerrarVideo();
  emHoja.hidden = true;
  canalAlVolverDeHoja(hojaTocada || hojaGuardado > 0);
}

// «Hoja principal» y «Hoja secundaria» abren primero el perfil del canal; la hoja de redes se abre con su engrane
emEl("em-hoja-abrir").addEventListener("click", () => abrirCanal(1));
emEl("em-hoja-abrir-2").addEventListener("click", () => abrirCanal(2));
emHoja.querySelectorAll(".em-hoja-sel-btn").forEach((b) => b.addEventListener("click", () => hojaCambiar(+b.dataset.hoja)));
emEl("em-hoja-volver").addEventListener("click", cerrarHoja);
emHojaGuardar.addEventListener("click", guardarHoja);
emEl("em-hoja-recargar").addEventListener("click", async () => {
  if (hojaCargada && hojaSucia() && !window.confirm("Hay cambios sin guardar que se perderán al volver a leer la hoja. ¿Continuar?")) return;
  await cargarHoja();
});
emEl("em-hoja-fila-mas").addEventListener("click", () => {
  if (!hojaCargada) return;
  if (hojaAgregarFilas(1)) hojaEnfocar(hojaFilas.length - 1, 0);
});
emEl("em-hoja-filas-mas").addEventListener("click", () => {
  if (!hojaCargada) return;
  hojaAgregarFilas(10);
});
emEl("em-hoja-fila-quitar").addEventListener("click", () => {
  if (!hojaCargada) return;
  if (hojaFilaActiva < 0 || hojaFilaActiva >= hojaFilas.length) {
    setEstado(emHojaEstado, "Toca una celda de la fila que quieres quitar", "error");
    return;
  }
  const r = hojaFilaActiva;
  if (hojaFilas[r].some((x) => String(x).trim()) && !window.confirm("¿Quitar la fila " + (r + 1) + " con todo lo que tiene escrito?")) return;
  hojaSel = null;
  hojaFilas.splice(r, 1);
  while (hojaFilas.length < HOJA_FILAS_MIN) hojaFilas.push(hojaFilaVacia());
  hojaDibujar();
  hojaMarcarCambio();
});

// Escribir en una celda
emHojaTabla.addEventListener("input", (e) => {
  const t = e.target;
  if (!t.classList || !t.classList.contains("em-hoja-celda")) return;
  hojaFilas[+t.dataset.r][+t.dataset.c] = t.value;
  hojaActualizarLink(t.parentElement, t.value);
  hojaMarcarCambio();
});
emHojaTabla.addEventListener("focusin", (e) => {
  const t = e.target;
  if (t.classList && t.classList.contains("em-hoja-celda")) {
    hojaActivarFila(+t.dataset.r);
    if (hojaSel) hojaSelLimpiar();
    hojaSelAncla = { r: +t.dataset.r, c: +t.dataset.c };
  }
});

// Moverse con el teclado como en una hoja de cálculo: Enter baja, Shift+Enter sube, flechas arriba/abajo,
// y las flechas izquierda/derecha saltan de celda cuando el cursor está en el borde del texto
emHojaTabla.addEventListener("keydown", (e) => {
  const t = e.target;
  if (!t.classList || !t.classList.contains("em-hoja-celda") || e.isComposing) return;
  const r = +t.dataset.r;
  const c = +t.dataset.c;
  const ultimaCol = hojaColumnas.length - 1;
  const alInicio = t.selectionStart === 0 && t.selectionEnd === 0;
  const alFinal = t.selectionStart === t.value.length && t.selectionEnd === t.value.length;
  if (e.key === "Enter" || e.key === "ArrowDown") {
    e.preventDefault();
    if (e.shiftKey && e.key === "Enter") {
      if (r > 0) hojaEnfocar(r - 1, c);
    } else {
      if (r + 1 >= hojaFilas.length) hojaAgregarFilas(1);
      hojaEnfocar(r + 1, c);
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (r > 0) hojaEnfocar(r - 1, c);
  } else if (e.key === "ArrowLeft" && alInicio && c > 0) {
    e.preventDefault();
    hojaEnfocar(r, c - 1);
  } else if (e.key === "ArrowRight" && alFinal && c < ultimaCol) {
    e.preventDefault();
    hojaEnfocar(r, c + 1);
  }
});

// Pegar varias celdas copiadas de Google Sheets o Excel (vienen separadas por tabulaciones y saltos de línea)
emHojaTabla.addEventListener("paste", (e) => {
  const t = e.target;
  if (!t.classList || !t.classList.contains("em-hoja-celda")) return;
  const texto = String((e.clipboardData || window.clipboardData).getData("text") || "").replace(/\r\n?/g, "\n").replace(/\n$/, "");
  if (texto.indexOf("\t") === -1 && texto.indexOf("\n") === -1) return; // un solo valor: pegado normal
  e.preventDefault();
  const bloque = texto.split("\n").map((l) => l.split("\t"));
  const r0 = +t.dataset.r;
  const c0 = +t.dataset.c;
  if (r0 + bloque.length > HOJA_FILAS_MAX) {
    setEstado(emHojaEstado, "No cabe: el máximo es " + HOJA_FILAS_MAX + " filas", "error");
    return;
  }
  while (hojaFilas.length < r0 + bloque.length) hojaFilas.push(hojaFilaVacia());
  bloque.forEach((fila, i) =>
    fila.forEach((v, j) => {
      if (c0 + j < hojaColumnas.length) hojaFilas[r0 + i][c0 + j] = v.slice(0, HOJA_CELDA_MAX);
    })
  );
  hojaDibujar();
  hojaEnfocar(r0, c0);
  hojaMarcarCambio();
});

// ----- Seleccionar celdas con el mouse, copiar/pegar, mover y agregar columnas -----
// · Arrastra sobre las celdas (o Shift+clic) para seleccionar un rango; toca la letra de una columna para seleccionarla entera
//   (arrastra sobre las letras para varias, Shift+clic para extender; la esquina de la izquierda selecciona todo).
// · Ctrl+C copia el rango como celdas (con tabulaciones, igual que Google Sheets), Ctrl+X corta, Supr borra y Ctrl+V pega con la
//   esquina de arriba a la izquierda del texto copiado en la primera celda seleccionada.
// · Arrastra el nombre de una columna (o su letra, si ya está seleccionada) para moverla; si hay varias seleccionadas, se mueven juntas.
// · «+ Columna» agrega una columna al final con el nombre que escribas.
let hojaSel = null; // { r1, c1, r2, c2, cols } rango seleccionado (cols = columnas enteras)
let hojaSelAncla = null; // { r, c } celda donde empezó la selección
let hojaSelPintadas = [];
const emHojaScroll = emEl("em-hoja-scroll");
// Cuadro de texto escondido: con varias celdas seleccionadas recibe el foco para que Ctrl+C, Ctrl+X y Ctrl+V funcionen
const emHojaPortapapeles = document.createElement("textarea");
emHojaPortapapeles.className = "em-hoja-portapapeles";
emHojaPortapapeles.tabIndex = -1;
emHojaPortapapeles.setAttribute("inputmode", "none");
emHojaPortapapeles.setAttribute("aria-label", "Celdas seleccionadas");
emHoja.appendChild(emHojaPortapapeles);

function hojaSelPintar() {
  hojaSelPintadas.forEach((el) => el.classList.remove("em-hoja-sel"));
  hojaSelPintadas = [];
  emHojaTabla.querySelectorAll(".em-hoja-th-sel").forEach((el) => el.classList.remove("em-hoja-th-sel"));
  if (!hojaSel || !emHojaTabla.tBodies[0]) return;
  const filas = emHojaTabla.tBodies[0].rows;
  for (let r = hojaSel.r1; r <= hojaSel.r2; r++) {
    const tr = filas[r];
    if (!tr) continue;
    for (let c = hojaSel.c1; c <= hojaSel.c2; c++) {
      const td = tr.cells[c + 1];
      if (td) {
        td.classList.add("em-hoja-sel");
        hojaSelPintadas.push(td);
      }
    }
  }
  if (emHojaTabla.tHead) {
    Array.prototype.forEach.call(emHojaTabla.tHead.rows, (tr) => {
      for (let c = hojaSel.c1; c <= hojaSel.c2; c++) if (tr.cells[c + 1]) tr.cells[c + 1].classList.add("em-hoja-th-sel");
    });
  }
}

// a y b son { r, c }: dos esquinas del rango (en cualquier orden)
function hojaSelMarcar(a, b, cols) {
  const nuevo = { r1: Math.min(a.r, b.r), c1: Math.min(a.c, b.c), r2: Math.max(a.r, b.r), c2: Math.max(a.c, b.c), cols: !!cols };
  if (hojaSel && Object.keys(nuevo).every((k) => hojaSel[k] === nuevo[k])) return;
  hojaSel = nuevo;
  hojaSelPintar();
}

function hojaSelLimpiar() {
  hojaSel = null;
  hojaSelPintar();
  emHojaPortapapeles.value = "";
}

// Texto del rango, con tabulaciones entre columnas y saltos de línea entre filas (así lo entiende Google Sheets)
function hojaSelTexto() {
  if (!hojaSel) return "";
  const { r1, c1, c2, cols } = hojaSel;
  let r2 = hojaSel.r2;
  if (cols) while (r2 > r1 && hojaFilas[r2].slice(c1, c2 + 1).every((x) => !String(x).trim())) r2--; // sin filas vacías al final
  const lineas = [];
  for (let r = r1; r <= r2; r++) {
    lineas.push(hojaFilas[r].slice(c1, c2 + 1).map((v) => String(v).replace(/[\t\r\n]+/g, " ")).join("\t"));
  }
  return lineas.join("\n");
}

// Termina la selección: el cuadro escondido se llena con las celdas y toma el foco
function hojaSelTerminar() {
  if (!hojaSel) return;
  emHojaPortapapeles.value = hojaSelTexto();
  emHojaPortapapeles.focus({ preventScroll: true });
  emHojaPortapapeles.select();
}

function hojaSelBorrar() {
  if (!hojaSel) return;
  for (let r = hojaSel.r1; r <= hojaSel.r2; r++) {
    for (let c = hojaSel.c1; c <= hojaSel.c2; c++) hojaFilas[r][c] = "";
  }
  hojaDibujar();
  hojaMarcarCambio();
  hojaSelTerminar();
}

emHojaPortapapeles.addEventListener("copy", (e) => {
  if (!hojaSel) return;
  e.preventDefault();
  e.clipboardData.setData("text/plain", hojaSelTexto());
});
emHojaPortapapeles.addEventListener("cut", (e) => {
  if (!hojaSel) return;
  e.preventDefault();
  e.clipboardData.setData("text/plain", hojaSelTexto());
  hojaSelBorrar();
});
// Pegar con varias celdas seleccionadas: el texto copiado entra desde la primera celda del rango (un solo valor llena todo el rango)
emHojaPortapapeles.addEventListener("paste", (e) => {
  if (!hojaSel) return;
  e.preventDefault();
  const texto = String((e.clipboardData || window.clipboardData).getData("text") || "").replace(/\r\n?/g, "\n").replace(/\n$/, "");
  let bloque = texto.split("\n").map((l) => l.split("\t"));
  const { r1, c1, r2, c2 } = hojaSel;
  if (bloque.length === 1 && bloque[0].length === 1 && (r2 > r1 || c2 > c1)) {
    bloque = Array.from({ length: r2 - r1 + 1 }, () => Array(c2 - c1 + 1).fill(bloque[0][0]));
  }
  if (r1 + bloque.length > HOJA_FILAS_MAX) {
    setEstado(emHojaEstado, "No cabe: el máximo es " + HOJA_FILAS_MAX + " filas", "error");
    return;
  }
  while (hojaFilas.length < r1 + bloque.length) hojaFilas.push(hojaFilaVacia());
  let anchoMax = 1;
  bloque.forEach((fila, i) => {
    anchoMax = Math.max(anchoMax, fila.length);
    fila.forEach((v, j) => {
      if (c1 + j < hojaColumnas.length) hojaFilas[r1 + i][c1 + j] = v.slice(0, HOJA_CELDA_MAX);
    });
  });
  hojaDibujar();
  hojaMarcarCambio();
  hojaSelAncla = { r: r1, c: c1 };
  hojaSelMarcar({ r: r1, c: c1 }, { r: r1 + bloque.length - 1, c: Math.min(c1 + anchoMax - 1, hojaColumnas.length - 1) }, false);
  hojaSelTerminar();
});
emHojaPortapapeles.addEventListener("keydown", (e) => {
  if (!hojaSel || e.isComposing) return;
  if (e.key === "Escape") {
    e.preventDefault();
    hojaSelLimpiar();
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    hojaSelBorrar();
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Empezar a escribir: la letra cae en la primera celda del rango
    const el = emHojaTabla.querySelector('input[data-r="' + hojaSel.r1 + '"][data-c="' + hojaSel.c1 + '"]');
    hojaSelLimpiar();
    if (el) {
      el.focus();
      el.select();
    }
  }
});
emHojaTabla.addEventListener("selectstart", (e) => {
  if (emHojaTabla.classList.contains("em-hoja-seleccionando") || emHojaTabla.classList.contains("em-hoja-moviendo")) e.preventDefault();
});

// Celda que está bajo el puntero (o null)
function hojaCeldaBajo(e) {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const td = el && el.closest ? el.closest("td") : null;
  const inp = td && emHojaTabla.contains(td) ? td.querySelector(".em-hoja-celda") : null;
  return inp ? { r: +inp.dataset.r, c: +inp.dataset.c } : null;
}

// Columna sobre la que está el puntero, según su posición horizontal
function hojaColumnaEnX(clientX) {
  let x = clientX - emHojaScroll.getBoundingClientRect().left + emHojaScroll.scrollLeft - 46;
  for (let i = 0; i < hojaAnchos.length; i++) {
    if (x < hojaAnchos[i]) return i;
    x -= hojaAnchos[i];
  }
  return hojaAnchos.length - 1;
}

// Borde entre columnas más cercano al puntero: 0 = antes de la primera, n = después de la última
function hojaBordeEnX(clientX) {
  let x = clientX - emHojaScroll.getBoundingClientRect().left + emHojaScroll.scrollLeft - 46;
  for (let i = 0; i < hojaAnchos.length; i++) {
    if (x < hojaAnchos[i] / 2) return i;
    x -= hojaAnchos[i];
  }
  return hojaAnchos.length;
}

// Si arrastras cerca de un borde de la hoja, se desplaza sola
function hojaAutoDesplazar(e) {
  const rc = emHojaScroll.getBoundingClientRect();
  if (e.clientX > rc.right - 30) emHojaScroll.scrollLeft += 20;
  else if (e.clientX < rc.left + 76) emHojaScroll.scrollLeft -= 20;
  if (e.clientY > rc.bottom - 30) emHojaScroll.scrollTop += 20;
  else if (e.clientY < rc.top + 82) emHojaScroll.scrollTop -= 20;
}

// Selecciona un rango arrastrando el mouse desde la celda ini
function hojaArrastrarCeldas(ini) {
  let activo = false;
  const mover = (e) => {
    const p = hojaCeldaBajo(e);
    if (!p) return;
    if (!activo) {
      if (p.r === ini.r && p.c === ini.c) return; // sigue dentro de la misma celda: es texto normal
      activo = true;
      emHojaTabla.classList.add("em-hoja-seleccionando");
      const f = document.activeElement;
      if (f && f.blur) f.blur();
      const sel = window.getSelection && window.getSelection();
      if (sel) sel.removeAllRanges();
    }
    hojaAutoDesplazar(e);
    hojaSelMarcar(ini, p, false);
  };
  const fin = () => {
    document.removeEventListener("pointermove", mover);
    document.removeEventListener("pointerup", fin);
    document.removeEventListener("pointercancel", fin);
    emHojaTabla.classList.remove("em-hoja-seleccionando");
    if (activo) hojaSelTerminar();
  };
  document.addEventListener("pointermove", mover);
  document.addEventListener("pointerup", fin);
  document.addEventListener("pointercancel", fin);
}

// Selecciona columnas enteras arrastrando sobre sus letras
function hojaArrastrarSeleccionColumnas(ancla) {
  const u = hojaFilas.length - 1;
  hojaSelAncla = { r: 0, c: ancla };
  hojaSelMarcar({ r: 0, c: ancla }, { r: u, c: ancla }, true);
  const mover = (e) => {
    hojaAutoDesplazar(e);
    hojaSelMarcar({ r: 0, c: ancla }, { r: u, c: hojaColumnaEnX(e.clientX) }, true);
  };
  const fin = () => {
    document.removeEventListener("pointermove", mover);
    document.removeEventListener("pointerup", fin);
    document.removeEventListener("pointercancel", fin);
    hojaSelTerminar();
  };
  document.addEventListener("pointermove", mover);
  document.addEventListener("pointerup", fin);
  document.addEventListener("pointercancel", fin);
}

// Mueve las columnas a..b (con sus datos y su ancho) para que queden antes de la columna «destino» (0..n, contando como estaban antes).
// Devuelve la posición nueva de la primera columna, o -1 si quedaría igual.
function hojaMoverColumnas(a, b, destino) {
  if (destino >= a && destino <= b + 1) return -1;
  const n = b - a + 1;
  const nuevo = destino > b ? destino - n : destino;
  const mover = (arr) => {
    const bloque = arr.splice(a, n);
    arr.splice(nuevo, 0, ...bloque);
  };
  mover(hojaColumnas);
  mover(hojaAnchos);
  hojaFilas.forEach(mover);
  hojaGuardarAnchos();
  hojaDibujar();
  hojaMarcarCambio();
  return nuevo;
}

// Arrastra una columna (o el grupo seleccionado) para cambiarla de lugar; un toque sin arrastrar solo la selecciona
function hojaArrastrarColumnas(e0, idx, bloque) {
  const x0 = e0.clientX;
  const y0 = e0.clientY;
  const u = hojaFilas.length - 1;
  let activo = false;
  let bloqueado = false;
  let destino = -1;
  const guia = document.createElement("div");
  guia.className = "em-hoja-guia";
  const mover = (e) => {
    if (!activo) {
      if (Math.abs(e.clientX - x0) < 6 && Math.abs(e.clientY - y0) < 6) return;
      activo = true;
      if (!hojaDinamico) {
        bloqueado = true;
        hojaAviso("Para mover columnas hay que publicar la nueva versión del Apps Script", "error");
        return;
      }
      hojaSelAncla = { r: 0, c: bloque[0] };
      hojaSelMarcar({ r: 0, c: bloque[0] }, { r: u, c: bloque[1] }, true);
      emHojaScroll.appendChild(guia);
      emHojaTabla.classList.add("em-hoja-moviendo");
    }
    if (bloqueado) return;
    hojaAutoDesplazar(e);
    destino = hojaBordeEnX(e.clientX);
    let x = 46;
    for (let i = 0; i < destino; i++) x += hojaAnchos[i];
    guia.style.left = x + "px";
    guia.style.height = emHojaTabla.offsetHeight + "px";
  };
  const fin = (e) => {
    document.removeEventListener("pointermove", mover);
    document.removeEventListener("pointerup", fin);
    document.removeEventListener("pointercancel", fin);
    guia.remove();
    emHojaTabla.classList.remove("em-hoja-moviendo");
    if (!activo) {
      hojaSelAncla = { r: 0, c: idx };
      hojaSelMarcar({ r: 0, c: idx }, { r: u, c: idx }, true);
      hojaSelTerminar();
      return;
    }
    if (bloqueado || destino < 0 || e.type === "pointercancel") return;
    const nuevo = hojaMoverColumnas(bloque[0], bloque[1], destino);
    if (nuevo >= 0) {
      hojaSelAncla = { r: 0, c: nuevo };
      hojaSelMarcar({ r: 0, c: nuevo }, { r: u, c: nuevo + bloque[1] - bloque[0] }, true);
    }
    hojaSelTerminar();
  };
  document.addEventListener("pointermove", mover);
  document.addEventListener("pointerup", fin);
  document.addEventListener("pointercancel", fin);
}

// Clic en las filas de encabezado: letras = seleccionar columnas; nombres = arrastrar para mover
function hojaCabeceraAbajo(e, th) {
  e.preventDefault();
  const enLetras = th.parentElement.classList.contains("em-hoja-letras");
  const idx = th.cellIndex - 1; // -1 = la esquina de la izquierda
  const u = hojaFilas.length - 1;
  if (idx < 0) {
    if (enLetras) {
      hojaSelAncla = { r: 0, c: 0 };
      hojaSelMarcar({ r: 0, c: 0 }, { r: u, c: hojaColumnas.length - 1 }, true);
      hojaSelTerminar();
    }
    return;
  }
  if (e.shiftKey && hojaSelAncla) {
    hojaSelMarcar({ r: 0, c: hojaSelAncla.c }, { r: u, c: idx }, true);
    hojaSelTerminar();
    return;
  }
  const dentro = !!hojaSel && hojaSel.cols && idx >= hojaSel.c1 && idx <= hojaSel.c2;
  if (enLetras && !dentro) hojaArrastrarSeleccionColumnas(idx);
  else hojaArrastrarColumnas(e, idx, dentro ? [hojaSel.c1, hojaSel.c2] : [idx, idx]);
}

emHojaTabla.addEventListener("pointerdown", (e) => {
  if (e.button !== 0 || !e.target.closest) return;
  const th = e.target.closest("thead th");
  if (th) {
    hojaCabeceraAbajo(e, th);
    return;
  }
  // Seleccionar celdas con el mouse (con el dedo la hoja se desplaza como siempre)
  if (e.pointerType !== "mouse" || !e.target.classList.contains("em-hoja-celda")) return;
  const r = +e.target.dataset.r;
  const c = +e.target.dataset.c;
  if (e.shiftKey && hojaSelAncla) {
    e.preventDefault();
    hojaSelMarcar(hojaSelAncla, { r, c }, false);
    hojaSelTerminar();
    return;
  }
  hojaSelAncla = { r, c };
  hojaArrastrarCeldas({ r, c });
});

// Aviso visible dentro de la hoja (la barra de estado de arriba se queda sin espacio en el celular)
let hojaAvisoTimer = null;
function hojaAviso(texto, tipo) {
  setEstado(emHojaEstado, texto, tipo);
  let el = emHoja.querySelector(".em-hoja-aviso");
  if (!el) {
    el = document.createElement("div");
    el.className = "em-hoja-aviso";
    el.setAttribute("role", "alert");
    emHoja.appendChild(el);
  }
  el.textContent = texto;
  el.classList.toggle("error", tipo === "error");
  el.hidden = false;
  clearTimeout(hojaAvisoTimer);
  hojaAvisoTimer = setTimeout(() => { el.hidden = true; }, 6000);
}

// Pide un nombre con un cuadro propio (window.prompt no funciona en la app instalada ni en varios navegadores del celular)
function hojaPedirNombre(titulo, ayuda) {
  return new Promise((resolve) => {
    const fondo = document.createElement("div");
    fondo.className = "em-hoja-dialogo";
    const caja = document.createElement("form");
    caja.className = "em-hoja-dialogo-caja";
    const h = document.createElement("strong");
    h.textContent = titulo;
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = HOJA_NOMBRE_COL_MAX;
    input.autocomplete = "off";
    input.placeholder = ayuda || "";
    const fila = document.createElement("div");
    fila.className = "em-hoja-dialogo-botones";
    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "em-hoja-herr-btn";
    cancelar.textContent = "Cancelar";
    const ok = document.createElement("button");
    ok.type = "submit";
    ok.className = "em-hoja-guardar";
    ok.textContent = "Agregar";
    fila.append(cancelar, ok);
    caja.append(h, input, fila);
    fondo.appendChild(caja);
    emHoja.appendChild(fondo);
    const cerrar = (valor) => { fondo.remove(); resolve(valor); };
    caja.addEventListener("submit", (e) => { e.preventDefault(); cerrar(input.value.trim().slice(0, HOJA_NOMBRE_COL_MAX)); });
    cancelar.addEventListener("click", () => cerrar(""));
    fondo.addEventListener("pointerdown", (e) => { if (e.target === fondo) cerrar(""); });
    setTimeout(() => input.focus(), 30);
  });
}

const emHojaColMas = emEl("em-hoja-col-mas");
if (emHojaColMas) {
  emHojaColMas.addEventListener("click", async () => {
    if (!hojaCargada) {
      hojaAviso("La hoja todavía no carga: espera a que termine o usa ↻", "error");
      return;
    }
    if (!hojaDinamico) {
      hojaAviso("Para agregar columnas hay que publicar la nueva versión del Apps Script (Implementar → Administrar implementaciones → Nueva versión)", "error");
      return;
    }
    if (hojaColumnas.length >= HOJA_COL_MAX) {
      hojaAviso("Máximo " + HOJA_COL_MAX + " columnas", "error");
      return;
    }
    const nombre = await hojaPedirNombre("Nombre de la nueva columna", "Ej. Pinterest");
    if (!nombre) return;
    hojaColumnas.push(nombre);
    hojaAnchos.push(HOJA_ANCHO_NUEVA);
    hojaFilas.forEach((f) => f.push(""));
    hojaGuardarAnchos();
    hojaDibujar();
    hojaMarcarCambio();
    emHojaScroll.scrollLeft = emHojaScroll.scrollWidth;
    hojaEnfocar(0, hojaColumnas.length - 1);
  });
}

// ----- Reproductor de YouTube dentro de la hoja -----
// Al tocar una miniatura (o el botón ↗) de un link de YouTube se abre un cuadro con el video PAUSADO:
// hay que darle play. Al cerrarlo se quita el reproductor, así el video se detiene.
function hojaAbrirVideo(id, enlace, padre) {
  hojaCerrarVideo();
  const fondo = document.createElement("div");
  fondo.className = "em-hoja-dialogo em-hoja-video-fondo";
  const caja = document.createElement("div");
  caja.className = "em-hoja-video-caja";
  caja.setAttribute("role", "dialog");
  caja.setAttribute("aria-modal", "true");
  caja.setAttribute("aria-label", "Reproductor de video");
  const barra = document.createElement("div");
  barra.className = "em-hoja-video-barra";
  const abrir = document.createElement("a");
  abrir.href = enlace;
  abrir.target = "_blank";
  abrir.rel = "noopener noreferrer";
  abrir.textContent = "Abrir en YouTube ↗";
  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "em-hoja-icono";
  cerrar.setAttribute("aria-label", "Cerrar el video");
  cerrar.textContent = "×";
  barra.append(abrir, cerrar);
  const marco = document.createElement("div");
  marco.className = "em-hoja-video-marco";
  const iframe = document.createElement("iframe");
  // Sin autoplay: el video aparece pausado y se inicia con el botón de play
  iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=0&rel=0&playsinline=1";
  iframe.title = "Video de YouTube";
  iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  marco.appendChild(iframe);
  caja.append(barra, marco);
  fondo.appendChild(caja);
  (padre || emHoja).appendChild(fondo);
  cerrar.addEventListener("click", hojaCerrarVideo);
  fondo.addEventListener("pointerdown", (e) => { if (e.target === fondo) hojaCerrarVideo(); });
  cerrar.focus();
}
function hojaCerrarVideo() {
  const f = document.querySelector(".em-hoja-video-fondo");
  if (f) f.remove();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.querySelector(".em-hoja-video-fondo")) {
    e.stopPropagation();
    hojaCerrarVideo();
  }
}, true);
emHojaTabla.addEventListener("click", (e) => {
  const a = e.target.closest ? e.target.closest(".em-hoja-mini, .em-hoja-link") : null;
  if (!a) return;
  const id = hojaIdYoutube(a.getAttribute("href"));
  if (!id) return; // otros links se abren como siempre
  e.preventDefault();
  hojaAbrirVideo(id, a.getAttribute("href"));
});

// Cerrar o recargar la pestaña con cambios sin guardar
window.addEventListener("beforeunload", (e) => {
  if (!emHoja.hidden && hojaCargada && hojaSucia()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ----- Notas personales de la empresa o proyecto abierto (columna H «Notas» de la hoja) -----
// Cada nota tiene nombre, fecha de creación, fecha de la última modificación y dónde se guarda su texto:
//  · Google Sheets: el texto vive en la celda H de la empresa (50,000 caracteres en total entre las notas de Sheets);
//  · Google Drive: el texto vive en su propio .txt (hasta 1,000,000 de caracteres por nota).
const EM_LIM_SHEETS = 50000; // igual a LIMITE_NOTARIO_SHEETS del Apps Script
const EM_LIM_DRIVE = 1000000; // igual a LIMITE_NOTARIO del Apps Script
const EM_SEP_LARGO = 9; // largo del separador entre notas dentro de la celda
const EM_ENCABEZADO = 70; // largo aproximado del encabezado de una nota en la celda (sin el nombre)
// La nota especial (redes + descripciones y hashtags) se guarda como una nota del proyecto con este nombre reservado.
// «Mis notas» no la muestra: se abre con el botón ⭐ de la hoja de redes.
const NESP_NOMBRE = "⭐ Nota especial";
const emNotaForm = emEl("em-nota-form");
const emNotaFormTitulo = emEl("em-nota-form-titulo");
const emNotaNombre = emEl("em-nota-nombre");
const emNotaFecha = emEl("em-nota-fecha");
const emNotaDestino = emEl("em-nota-destino");
const emNotaTexto = emEl("em-nota-texto");
const emNotaContador = emEl("em-nota-contador");
const emNotaAgregar = emEl("em-nota-agregar");
const emNotaCancelar = emEl("em-nota-cancelar");
const emNotaEstado = emEl("em-nota-estado");
const emNotaNueva = emEl("em-nota-nueva"); // botón «Crear nota»: el formulario está escondido hasta que se presiona
const emNotasLista = emEl("em-notas-lista");
const emNotasTitulo = emEl("em-notas-titulo");
let emNotaEditandoId = null; // id de la nota que se está editando (null = nota nueva)
const emMigrar = montarMigrar(emNotaDestino, {
  obtener: () => {
    const d = emDetActual;
    return d && emNotaEditandoId ? (d.notas || []).find((n) => n.id === emNotaEditandoId) || null : null;
  },
  estado: emNotaEstado,
  ejecutar: async (n) => {
    const d = emDetActual;
    const j = await llamarNotas("empresa_nota_guardar", {
      id: d.id,
      notaId: n.id,
      nombre: n.nombre,
      fecha: n.fecha,
      modificada: n.modificada || "",
      destino: "drive",
      texto: n.texto,
    });
    n.largo = typeof j.notaLargo === "number" ? j.notaLargo : n.largo;
    if (typeof j.largo === "number") d.notasLargo = j.largo;
  },
  listo: () => {
    emActualizarContador();
    dibujarNotasEm();
  },
});

// Deja el formulario como «Nueva nota»
function emNotaReiniciarForm() {
  emNotaEditandoId = null;
  emNotaNombre.value = "";
  emNotaFecha.value = fechaActualInput();
  emNotaDestino.value = "drive";
  emNotaTexto.value = "";
  emNotaFormTitulo.textContent = "Nueva nota";
  emNotaAgregar.textContent = "Agregar nota";
  emNotaCancelar.hidden = true;
  emNotaForm.hidden = true; // el formulario se esconde; vuelve a salir con «Crear nota» o al editar una nota
  emNotaNueva.hidden = false;
  emMigrar.actualizar(null);
  emActualizarContador();
}
// Muestra el formulario (para una nota nueva o para editar una)
function emNotaMostrarForm() {
  emNotaForm.hidden = false;
  emNotaNueva.hidden = true;
  emNotaCancelar.hidden = false; // «Cancelar» siempre sale con el formulario: lo vuelve a esconder
}
emNotaNueva.addEventListener("click", () => {
  emNotaReiniciarForm();
  setEstado(emNotaEstado, "");
  emNotaMostrarForm();
  emNotaForm.scrollIntoView({ behavior: "smooth", block: "center" });
  emNotaNombre.focus();
});

// Caracteres que aún caben en la celda de Sheets para el texto de una nota (descontando lo ocupado por las demás)
function emEspacioSheets(d, editando) {
  const notas = Array.isArray(d.notas) ? d.notas : [];
  let usado = d.notasLargo || 0;
  let quedan = notas.length;
  if (editando) {
    usado -= editando.largo || 0;
    quedan -= 1;
    if (quedan > 0) usado -= EM_SEP_LARGO;
  }
  if (quedan > 0) usado += EM_SEP_LARGO;
  return Math.max(0, EM_LIM_SHEETS - usado - EM_ENCABEZADO - emNotaNombre.value.length);
}

// Contador de lo que se escribe: cuánto lleva y cuánto cabe en el lugar elegido
function emActualizarContador() {
  const d = emDetActual;
  if (!d) {
    emNotaContador.textContent = "";
    return;
  }
  const editando = emNotaEditandoId ? (d.notas || []).find((n) => n.id === emNotaEditandoId) : null;
  const largo = emNotaTexto.value.length;
  const drive = emNotaDestino.value === "drive";
  const tope = drive ? EM_LIM_DRIVE : emEspacioSheets(d, editando);
  const sobran = largo - tope;
  emNotaContador.textContent = drive
    ? ntFmt(largo) + " / " + ntFmt(EM_LIM_DRIVE) + " caracteres (Google Drive)"
    : ntFmt(largo) + " / " + ntFmt(tope) + " caracteres libres en Google Sheets para esta empresa";
  emNotaContador.className = "em-nota-contador" + (sobran > 0 ? " em-nota-contador-error" : "");
  if (sobran > 0) {
    emNotaContador.textContent += " · te pasas por " + ntFmt(sobran) + (drive ? "" : ". Acórtala o guárdala en Google Drive");
  }
  emNotaAgregar.disabled = sobran > 0;
}
[emNotaTexto, emNotaNombre].forEach((el) => el.addEventListener("input", emActualizarContador));
emNotaDestino.addEventListener("change", emActualizarContador);

function dibujarNotasEm() {
  const d = emDetActual;
  if (!d) return;
  const lista = (Array.isArray(d.notas) ? d.notas : []).filter((n) => n.nombre !== NESP_NOMBRE);
  emNotasTitulo.textContent = lista.length ? "📝 Mis notas (" + lista.length + ")" : "📝 Mis notas";
  emNotasLista.innerHTML = "";
  if (!lista.length) {
    const p = document.createElement("p");
    p.className = "em-nota-vacia";
    p.textContent = "Aún no hay notas aquí. Escribe la primera arriba ✨";
    emNotasLista.appendChild(p);
  } else {
    lista
      .slice()
      .reverse()
      .forEach((nota) => emNotasLista.appendChild(emCrearNota(d, nota)));
  }
  emActualizarContador();
}

function emCrearNota(d, nota) {
  const caja = document.createElement("div");
  caja.className = "em-nota" + (emNotaEditandoId === nota.id ? " em-nota-editando" : "");
  const cab = document.createElement("div");
  cab.className = "em-nota-cab";
  const nombre = document.createElement("b");
  nombre.className = "em-nota-nombre";
  nombre.textContent = nota.nombre || "Sin nombre";
  const lugar = document.createElement("span");
  lugar.className = "em-nota-lugar";
  lugar.textContent = nota.destino === "drive" ? "☁ Drive" : "▦ Sheets";
  cab.append(nombre, lugar);
  const fechas = document.createElement("div");
  fechas.className = "em-nota-fecha";
  fechas.textContent =
    "Creada: " + (nota.fecha || "—") + (nota.modificada ? " · Modificada: " + nota.modificada : "");
  const texto = document.createElement("p");
  texto.className = "em-nota-cuerpo";
  texto.textContent = nota.texto;
  const larga = String(nota.texto || "").length > 600;
  if (larga) texto.classList.add("em-nota-colapsada");
  const botones = document.createElement("div");
  botones.className = "em-nota-botones";
  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "em-nota-btn";
  editar.title = "Editar nota";
  editar.setAttribute("aria-label", "Editar nota");
  editar.textContent = "✎";
  editar.addEventListener("click", () => emNotaEditar(nota));
  const borrar = document.createElement("button");
  borrar.type = "button";
  borrar.className = "em-nota-btn";
  borrar.title = "Eliminar nota";
  borrar.setAttribute("aria-label", "Eliminar nota");
  borrar.textContent = "×";
  borrar.addEventListener("click", async () => {
    if (!window.confirm("¿Eliminar la nota «" + (nota.nombre || "Sin nombre") + "»?")) return;
    setEstado(emNotaEstado, "Eliminando…");
    try {
      const j = await llamarNotas("empresa_nota_borrar", { id: d.id, notaId: nota.id });
      d.notas = d.notas.filter((x) => x.id !== nota.id);
      if (typeof j.largo === "number") d.notasLargo = j.largo;
      if (emNotaEditandoId === nota.id) emNotaReiniciarForm();
      setEstado(emNotaEstado, "Nota eliminada", "ok");
      dibujarNotasEm();
    } catch (e) {
      setEstado(emNotaEstado, "Error: " + e.message, "error");
    }
  });
  botones.append(editar, borrar);
  caja.append(cab, fechas, texto);
  if (larga) {
    const mas = document.createElement("button");
    mas.type = "button";
    mas.className = "em-nota-mas";
    mas.textContent = "Ver todo";
    mas.addEventListener("click", () => {
      const abierta = texto.classList.toggle("em-nota-colapsada");
      mas.textContent = abierta ? "Ver todo" : "Ver menos";
    });
    caja.appendChild(mas);
  }
  caja.appendChild(botones);
  return caja;
}

// Carga una nota en el formulario de arriba para modificarla
function emNotaEditar(nota) {
  emNotaEditandoId = nota.id;
  emNotaNombre.value = nota.nombre || "";
  emNotaFecha.value = fechaAInput(nota.fecha) || fechaActualInput();
  emNotaDestino.value = nota.destino === "drive" ? "drive" : "sheets";
  emNotaTexto.value = nota.texto || "";
  emNotaFormTitulo.textContent = "Editar nota";
  emNotaAgregar.textContent = "Guardar cambios";
  emNotaMostrarForm();
  emMigrar.actualizar(nota);
  setEstado(emNotaEstado, "");
  dibujarNotasEm();
  emNotaForm.scrollIntoView({ behavior: "smooth", block: "center" });
  emNotaNombre.focus();
}
emNotaCancelar.addEventListener("click", () => {
  emNotaReiniciarForm();
  setEstado(emNotaEstado, "");
  dibujarNotasEm();
});

async function emGuardarNota() {
  const d = emDetActual;
  if (!d) return;
  const texto = ntLimpiar(emNotaTexto.value);
  if (!texto) {
    setEstado(emNotaEstado, "Escribe algo primero", "error");
    return;
  }
  const actuales = Array.isArray(d.notas) ? d.notas : [];
  const editando = emNotaEditandoId ? actuales.find((n) => n.id === emNotaEditandoId) : null;
  const nombre = emNotaNombre.value.replace(/[|\r\n]+/g, " ").trim().slice(0, 80);
  const destino = emNotaDestino.value === "drive" ? "drive" : "sheets";
  const fecha = inputAFecha(emNotaFecha.value) || (editando && editando.fecha) || selloFechaHora();
  if (editando && editando.nombre === nombre && editando.fecha === fecha && editando.destino === destino && editando.texto === texto) {
    emNotaReiniciarForm();
    setEstado(emNotaEstado, "Sin cambios");
    dibujarNotasEm();
    return;
  }
  const nota = {
    id: editando ? editando.id : ntNuevoId(),
    nombre,
    fecha,
    modificada: editando ? selloFechaHora() : "", // al modificar queda anotado cuándo
    destino,
    texto,
  };
  emNotaAgregar.disabled = true;
  setEstado(emNotaEstado, "Guardando…");
  try {
    const j = await llamarNotas("empresa_nota_guardar", {
      id: d.id,
      notaId: nota.id,
      nombre: nota.nombre,
      fecha: nota.fecha,
      modificada: nota.modificada,
      destino: nota.destino,
      texto: nota.texto,
    });
    nota.largo = typeof j.notaLargo === "number" ? j.notaLargo : 0;
    if (typeof j.largo === "number") d.notasLargo = j.largo;
    d.notas = editando ? actuales.map((n) => (n.id === nota.id ? nota : n)) : actuales.concat([nota]);
    const eraEdicion = !!editando;
    emNotaReiniciarForm();
    setEstado(emNotaEstado, eraEdicion ? "Cambios guardados ✓" : "Nota agregada ✓", "ok");
    dibujarNotasEm();
  } catch (e) {
    setEstado(emNotaEstado, "Error: " + e.message, "error");
  } finally {
    emActualizarContador();
  }
}
emNotaAgregar.addEventListener("click", emGuardarNota);

// ----- Nota especial: redes del proyecto + descripción y hashtags para YouTube, Facebook, Instagram y TikTok -----
// Se guarda como una nota más del proyecto (en Drive) con el nombre NESP_NOMBRE, así no hace falta cambiar el Apps Script.
const NESP_ESPERA = 1500; // ms sin escribir antes de guardar sola
const NESP_MAX = 5000; // caracteres por campo
const NESP_PLATAFORMAS = [
  { id: "YT", nombre: "YouTube", icono: "\u25B6\uFE0F" },
  { id: "FB", nombre: "Facebook", icono: "\u{1F4D8}" },
  { id: "IG", nombre: "Instagram", icono: "\u{1F4F8}" },
  { id: "TT", nombre: "TikTok", icono: "\u{1F3B5}" },
];
const emNesp = emEl("em-nesp");
const nespCuerpo = emEl("em-nesp-cuerpo");
const nespEstado = emEl("em-nesp-estado");
const nespBtnGuardar = emEl("em-nesp-guardar");
const nespTitulo = emEl("em-nesp-titulo");
let nespProyecto = null; // proyecto dueño de la nota especial abierta
let nespValores = {}; // { REDES, YT_DESC, YT_TAGS, FB_DESC, … }
let nespCambios = 0;
let nespGuardado = 0;
let nespTemporizador = null;
let nespGuardando = null;
const nespSucio = () => nespCambios !== nespGuardado;

const nespBuscar = (d) => (Array.isArray(d.notas) ? d.notas : []).find((n) => n.nombre === NESP_NOMBRE) || null;

function nespClaves() {
  const k = [];
  if (nespValores.REDES && nespValores.REDES.trim()) k.push("REDES"); // texto de antes, cuando las redes se escribían aquí
  k.push("CORREO", "TEXTO_LINKS", "COC_NOMBRE", "COC_LINK", "COC_TH", "COC_PRECIO"); // referencia de correo y cuenta de Clash of Clans
  // _DESC y _TAGS = videos; _SDESC y _STAGS = shorts
  NESP_PLATAFORMAS.forEach((p) => k.push(p.id + "_DESC", p.id + "_TAGS", p.id + "_SDESC", p.id + "_STAGS"));
  return k;
}

// Texto de la nota: «##CLAVE##» y debajo lo escrito en ese campo
function nespSerializar() {
  return nespClaves()
    .map((k) => "##" + k + "##\n" + String(nespValores[k] || "").replace(/^(#)(#[A-Z_]+##)/gm, "$1 $2").replace(/\s+$/, ""))
    .join("\n\n");
}
function nespParsear(texto) {
  const v = {};
  const partes = String(texto || "").split(/^##([A-Z_]+)##[ \t]*\r?\n?/m);
  for (let i = 1; i < partes.length; i += 2) v[partes[i]] = (partes[i + 1] || "").replace(/\s+$/, "");
  return v;
}

function nespAvisoBoton(boton, msg) {
  if (!boton.dataset.texto) boton.dataset.texto = boton.textContent;
  boton.textContent = msg;
  clearTimeout(boton._t);
  boton._t = setTimeout(() => { boton.textContent = boton.dataset.texto; }, 1500);
}
async function nespCopiar(texto, boton) {
  if (!String(texto || "").trim()) { nespAvisoBoton(boton, "Vacío"); return; }
  let ok = false;
  try {
    await navigator.clipboard.writeText(texto);
    ok = true;
  } catch (e) {
    const t = document.createElement("textarea");
    t.value = texto;
    t.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(t);
    t.select();
    try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
    t.remove();
  }
  nespAvisoBoton(boton, ok ? "¡Copiado!" : "No se pudo");
}

// Un campo con su botón «Copiar». linea = true: una sola línea (input); si no, un cuadro de texto (textarea)
function nespCrearCampo(clave, etiqueta, aria, filas, ph, linea) {
  const campo = document.createElement("div");
  campo.className = "em-nesp-campo";
  const cab = document.createElement("div");
  cab.className = "em-nesp-campo-cab";
  const et = document.createElement("span");
  et.textContent = etiqueta;
  const copiar = document.createElement("button");
  copiar.type = "button";
  copiar.className = "em-nesp-copiar";
  copiar.textContent = "Copiar";
  cab.append(et, copiar);
  let ta;
  if (linea) {
    ta = document.createElement("input");
    ta.type = "text";
    ta.maxLength = 500;
    ta.autocomplete = "off";
  } else {
    ta = document.createElement("textarea");
    ta.rows = filas;
    ta.maxLength = NESP_MAX;
  }
  ta.placeholder = ph || "";
  ta.value = nespValores[clave] || "";
  ta.setAttribute("aria-label", aria);
  ta.addEventListener("input", () => { nespValores[clave] = ta.value; nespActualizarMarcas(); nespMarcarCambio(); });
  copiar.addEventListener("click", () => nespCopiar(ta.value, copiar));
  campo.append(cab, ta);
  return campo;
}

// Pone un punto ● en los apartados cerrados que ya tienen algo escrito
function nespActualizarMarcas() {
  nespCuerpo.querySelectorAll("[data-claves]").forEach((el) => {
    el.classList.toggle("con-datos", el.dataset.claves.split(",").some((k) => nespValores[k] && nespValores[k].trim()));
  });
}

// Links del proyecto: el «Link» y la «Zona de links» de ⚙ Ajustes (sin repetir)
function nespEnlacesDe(d) {
  const lista = [];
  [d.link].concat(enlacesDeTexto(d.links)).forEach((l) => {
    const t = String(l || "").trim();
    if (t && !lista.includes(t)) lista.push(t);
  });
  return lista;
}

// ----- Zona de texto con links: solo se crea un cuadro de color donde se detecta un link (no uno por línea) -----
const NESP_TEXTO_MAX = 20000; // esta zona admite más texto que los demás campos
// Busca links dentro de un texto libre: direcciones http(s) y dominios de redes conocidas escritos sin «https://»
function nespLinksDeTexto(texto) {
  const lista = [];
  const hostsConocidos = REDES_EM.reduce((a, r) => a.concat(r.hosts), []);
  String(texto || "").split(/\s+/).forEach((tok) => {
    const t = tok.replace(/^[(\[{<"'\u201C\u2018]+/, "").replace(/[.,;:!?)\]}>"'\u201D\u2019\u2026]+$/, "");
    if (!t || t.charAt(0) === "#") return;
    let href = "";
    if (/^https?:\/\/\S+$/i.test(t)) {
      href = t;
    } else {
      const m = /^(?:www\.)?([^\s\/?#@]+)(?:[\/?#]\S*)?$/i.exec(t);
      if (m) {
        const h = m[1].toLowerCase();
        if (hostsConocidos.some((x) => h === x || h.endsWith("." + x))) href = "https://" + t;
      }
    }
    if (href && !lista.some((x) => x.href === href)) lista.push({ href, texto: t });
  });
  return lista;
}

// Dibuja los cuadros (con el color de cada red) de los links que haya en el texto; tocar un cuadro copia su link
function nespPintarLinks(contenedor, texto) {
  contenedor.innerHTML = "";
  const links = nespLinksDeTexto(texto);
  contenedor.hidden = links.length === 0;
  links.forEach((l) => {
    const red = emRedDeLink(l.href);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "em-red";
    el.dataset.red = red.id;
    el.title = "Copiar: " + l.href;
    el.setAttribute("aria-label", "Copiar el link de " + red.nombre);
    const txt = document.createElement("span");
    txt.className = "em-red-txt";
    const b = document.createElement("b");
    b.textContent = red.nombre;
    const sm = document.createElement("small");
    sm.textContent = red.corto;
    txt.append(b, sm);
    el.append(emIconoRed(red.id, red.glifo), txt);
    el.addEventListener("click", () => nespCopiar(l.href, sm));
    contenedor.appendChild(el);
  });
}

// Zona de texto libre (justo debajo de las redes): aquí van los links completos y los demás datos para copiar a las descripciones
function nespCrearTextoLinks(d) {
  // La primera vez se llena con los links del proyecto; después es solo tuyo
  if (nespValores.TEXTO_LINKS === undefined) nespValores.TEXTO_LINKS = nespEnlacesDe(d).join("\n");
  const t = document.createElement("section");
  t.className = "em-nesp-tarjeta";
  const h = document.createElement("h4");
  h.textContent = "\u{1F4DD} Texto y links para las descripciones";
  const ayuda = document.createElement("p");
  ayuda.className = "em-nesp-ayuda-chica";
  ayuda.textContent = "Escribe aquí los links completos y los demás datos que copias a tus videos. Abajo aparece un cuadro solo por cada link detectado.";
  const campo = nespCrearCampo("TEXTO_LINKS", "Texto completo", "Texto con links y datos", 10, "https://…\nOtros datos útiles para tus descripciones…");
  const ta = campo.querySelector("textarea");
  ta.maxLength = NESP_TEXTO_MAX;
  const traer = document.createElement("button");
  traer.type = "button";
  traer.className = "em-nesp-copiar em-nesp-copiar-todo";
  traer.textContent = "Traer links del proyecto";
  const vista = document.createElement("div");
  vista.className = "em-det-links em-nesp-links-detectados";
  const pintar = () => nespPintarLinks(vista, ta.value);
  ta.addEventListener("input", pintar);
  traer.addEventListener("click", () => {
    const faltan = nespEnlacesDe(d).filter((l) => !ta.value.includes(l));
    if (!faltan.length) { nespAvisoBoton(traer, "Ya están todos"); return; }
    ta.value = (ta.value.replace(/\s+$/, "") + "\n" + faltan.join("\n")).replace(/^\n/, "");
    ta.dispatchEvent(new Event("input")); // actualiza la nota, el guardado y los cuadros
    nespAvisoBoton(traer, "Agregados ✓");
  });
  pintar();
  t.append(h, ayuda, campo, traer, vista);
  return t;
}

// Una sección desplegable (videos o shorts) de una red: su descripción, sus hashtags y el botón de copiar todo
function nespCrearSeccion(p, titulo, cuando, kDesc, kTags) {
  const sec = document.createElement("details");
  sec.className = "em-nesp-sec";
  sec.dataset.claves = kDesc + "," + kTags;
  const sum = document.createElement("summary");
  const tit = document.createElement("span");
  tit.textContent = titulo;
  const punto = document.createElement("span");
  punto.className = "em-nesp-punto";
  punto.textContent = "●";
  sum.append(tit, punto);
  const cuerpo = document.createElement("div");
  cuerpo.className = "em-nesp-sec-cuerpo";
  const todo = document.createElement("button");
  todo.type = "button";
  todo.className = "em-nesp-copiar em-nesp-copiar-todo";
  todo.textContent = "Copiar descripción + hashtags";
  todo.addEventListener("click", () =>
    nespCopiar([nespValores[kDesc], nespValores[kTags]].filter((x) => x && x.trim()).join("\n\n"), todo));
  cuerpo.append(
    nespCrearCampo(kDesc, "Descripción", p.nombre + " " + cuando + ": descripción", 6, "Descripción que usas en tus " + cuando + " de " + p.nombre + "…"),
    nespCrearCampo(kTags, "Hashtags", p.nombre + " " + cuando + ": hashtags", 2, "#hashtag1 #hashtag2 #hashtag3"),
    todo
  );
  sec.append(sum, cuerpo);
  return sec;
}

// Referencia de correo + cuenta de Clash of Clans (los recuadros salen al presionar «Cuenta de COC»)
function nespCrearCorreo() {
  const t = document.createElement("section");
  t.className = "em-nesp-tarjeta";
  const h = document.createElement("h4");
  h.textContent = "\u{1F4E7} Referencia de correo";
  t.append(h, nespCrearCampo("CORREO", "Texto para recordar el correo de este proyecto", "Referencia de correo", 2, "Ej.: correo principal del canal…"));

  const claves = ["COC_NOMBRE", "COC_LINK", "COC_TH", "COC_PRECIO"];
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "em-nesp-coc-btn";
  btn.dataset.claves = claves.join(",");
  btn.setAttribute("aria-expanded", "false");
  const txt = document.createElement("span");
  txt.textContent = "Cuenta de COC";
  const punto = document.createElement("span");
  punto.className = "em-nesp-punto";
  punto.textContent = "●";
  const flecha = document.createElement("span");
  flecha.className = "em-nesp-flecha";
  flecha.setAttribute("aria-hidden", "true");
  flecha.textContent = "▾";
  btn.append(txt, punto, flecha);

  const caja = document.createElement("div");
  caja.className = "em-nesp-coc";
  caja.hidden = true;
  caja.append(
    nespCrearCampo("COC_NOMBRE", "Nombre", "Cuenta de COC: nombre", 1, "", true),
    nespCrearCampo("COC_LINK", "Link", "Cuenta de COC: link", 1, "https://…", true),
    nespCrearCampo("COC_TH", "TH", "Cuenta de COC: nivel de ayuntamiento (TH)", 1, "", true),
    nespCrearCampo("COC_PRECIO", "Precio de venta", "Cuenta de COC: precio de venta", 1, "", true)
  );
  btn.addEventListener("click", () => {
    caja.hidden = !caja.hidden;
    btn.setAttribute("aria-expanded", String(!caja.hidden));
    btn.classList.toggle("abierto", !caja.hidden);
  });
  t.append(btn, caja);
  return t;
}

function nespConstruir() {
  nespCuerpo.innerHTML = "";
  const ayuda = document.createElement("p");
  ayuda.className = "em-nesp-ayuda";
  ayuda.textContent = "Se guarda sola al escribir. Con «Copiar» pegas el texto directo en cada red.";
  nespCuerpo.appendChild(ayuda);

  // Lo primero que se puede modificar es la referencia de correo (con la cuenta de COC); después, el texto con links
  nespCuerpo.appendChild(nespCrearCorreo());
  nespCuerpo.appendChild(nespCrearTextoLinks(nespProyecto));

  // Redes que se habían escrito a mano antes de enlazarlas con los ajustes: se conservan hasta que las borres
  if (nespValores.REDES && nespValores.REDES.trim()) {
    const viejo = document.createElement("section");
    viejo.className = "em-nesp-tarjeta";
    const h = document.createElement("h4");
    h.textContent = "\u{1F4DD} Redes escritas antes";
    viejo.append(h, nespCrearCampo("REDES", "Ya no se usa; borra el texto cuando quieras", "Redes escritas antes", 4, ""));
    nespCuerpo.appendChild(viejo);
  }

  // Cada red es un recuadro de su color que se despliega; adentro, Videos y Shorts también se despliegan
  NESP_PLATAFORMAS.forEach((p) => {
    const t = document.createElement("details");
    t.className = "em-nesp-tarjeta em-nesp-plat";
    t.dataset.plat = p.id;
    t.dataset.claves = [p.id + "_DESC", p.id + "_TAGS", p.id + "_SDESC", p.id + "_STAGS"].join(",");
    const sum = document.createElement("summary");
    const nom = document.createElement("span");
    nom.className = "em-nesp-nombre";
    nom.textContent = p.icono + " " + p.nombre;
    const punto = document.createElement("span");
    punto.className = "em-nesp-punto";
    punto.textContent = "●";
    sum.append(nom, punto);
    const cuerpo = document.createElement("div");
    cuerpo.className = "em-nesp-plat-cuerpo";
    cuerpo.append(
      nespCrearSeccion(p, "\u{1F3AC} Videos", "videos", p.id + "_DESC", p.id + "_TAGS"),
      nespCrearSeccion(p, "\u26A1 Shorts", "shorts", p.id + "_SDESC", p.id + "_STAGS")
    );
    t.append(sum, cuerpo);
    nespCuerpo.appendChild(t);
  });
  nespActualizarMarcas();
}

function nespMarcarCambio() {
  nespCambios++;
  setEstado(nespEstado, "Sin guardar…");
  clearTimeout(nespTemporizador);
  nespTemporizador = setTimeout(nespGuardar, NESP_ESPERA);
}

// Guarda la nota especial. Devuelve true si quedó guardada.
async function nespGuardar() {
  clearTimeout(nespTemporizador);
  nespTemporizador = null;
  const d = nespProyecto;
  if (!d) return false;
  while (nespGuardando) await nespGuardando.catch(() => {});
  if (!nespSucio()) return true;
  const marca = nespCambios;
  const previa = nespBuscar(d);
  const nota = {
    id: previa ? previa.id : ntNuevoId(),
    nombre: NESP_NOMBRE,
    fecha: previa && previa.fecha ? previa.fecha : selloFechaHora(),
    modificada: previa ? selloFechaHora() : "",
    destino: "drive",
    texto: ntLimpiar(nespSerializar()),
  };
  setEstado(nespEstado, "Guardando…");
  nespBtnGuardar.disabled = true;
  nespGuardando = llamarNotas("empresa_nota_guardar", {
    id: d.id,
    notaId: nota.id,
    nombre: nota.nombre,
    fecha: nota.fecha,
    modificada: nota.modificada,
    destino: "drive",
    texto: nota.texto,
  });
  try {
    const j = await nespGuardando;
    nota.largo = typeof j.notaLargo === "number" ? j.notaLargo : 0;
    if (typeof j.largo === "number") d.notasLargo = j.largo;
    const lista = Array.isArray(d.notas) ? d.notas : [];
    d.notas = previa ? lista.map((n) => (n.id === nota.id ? nota : n)) : lista.concat([nota]);
    nespGuardado = marca;
    if (nespSucio()) {
      setEstado(nespEstado, "Sin guardar…");
      nespTemporizador = setTimeout(nespGuardar, NESP_ESPERA);
    } else {
      const n = new Date();
      setEstado(nespEstado, "Guardado ✓ " + dos(n.getHours()) + ":" + dos(n.getMinutes()), "ok");
    }
    return true;
  } catch (err) {
    setEstado(nespEstado, "No se pudo guardar: " + err.message + " (se reintenta)", "error");
    nespTemporizador = setTimeout(nespGuardar, 8000);
    return false;
  } finally {
    nespGuardando = null;
    nespBtnGuardar.disabled = false;
  }
}

function nespAbrir() {
  const d = hojaEmpresa || emDetActual;
  if (!d) return;
  hojaCerrarVideo();
  nespProyecto = d;
  const previa = nespBuscar(d);
  nespValores = previa ? nespParsear(previa.texto) : {};
  nespCambios = 0;
  nespGuardado = 0;
  const nom = String(d.nombre || "");
  nespTitulo.textContent = "\u2B50 Nota especial" + (nom ? " · " + (nom.length > 22 ? nom.slice(0, 21) + "…" : nom) : "");
  nespTitulo.title = nom;
  nespConstruir();
  setEstado(nespEstado, "");
  emNesp.hidden = false;
  nespCuerpo.scrollTop = 0;
}

async function nespCerrar() {
  if (nespSucio()) {
    const ok = await nespGuardar();
    if (!ok) {
      if (!window.confirm("No se pudo guardar la nota especial. ¿Cerrar de todos modos y perder los últimos cambios?")) return;
      clearTimeout(nespTemporizador);
      nespTemporizador = null;
    }
  }
  emNesp.hidden = true;
}

emEl("em-hoja-nota-esp").addEventListener("click", nespAbrir);
emEl("em-nesp-volver").addEventListener("click", nespCerrar);
nespBtnGuardar.addEventListener("click", () => {
  if (nespSucio()) nespGuardar();
  else setEstado(nespEstado, "Todo guardado ✓", "ok");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !emNesp.hidden) {
    e.stopPropagation();
    nespCerrar();
  }
}, true);

// ----- Perfil del canal: se parece al perfil de un canal de YouTube. Hoja principal = Videos, hoja secundaria = Shorts -----
// Lee las filas de la hoja de redes (columna «Youtube», con el «Nombre» como título) y muestra las miniaturas en 4 columnas,
// 32 por página; si hay más se crean más páginas. El engrane abre la hoja de redes (donde se agrega la información).
const CANAL_POR_PAGINA = 32;
const emCanal = emEl("em-canal");
const canalScroll = emEl("em-canal-scroll"); // lo que se desplaza; el reproductor se abre sobre emCanal para no moverse con el scroll
const canalBanner = emEl("em-canal-banner");
const canalAvatar = emEl("em-canal-avatar");
const canalNombre = emEl("em-canal-nombre");
const canalMeta = emEl("em-canal-meta");
const canalDesc = emEl("em-canal-desc");
const canalVer = emEl("em-canal-ver");
const canalTabsEl = emEl("em-canal-tabs");
const canalEstado = emEl("em-canal-estado");
const canalGrid = emEl("em-canal-grid");
const canalPags = emEl("em-canal-pags");
let canalProyecto = null;
let canalTab = 1; // 1 = Videos (hoja principal), 2 = Shorts (hoja secundaria)
let canalPagina = 1;
let canalDatos = { 1: null, 2: null }; // [{ id, enlace, nombre }] de cada hoja, ya leídos

function canalFilasDeHoja(j) {
  const cols = (Array.isArray(j.columnas) ? j.columnas : []).map((x) => String(x === undefined || x === null ? "" : x).trim().toLowerCase());
  const ci = cols.indexOf("youtube");
  if (ci === -1) throw new Error("no encontré la columna «Youtube» en la hoja");
  const ni = cols.indexOf("nombre");
  const lista = [];
  (Array.isArray(j.filas) ? j.filas : []).forEach((f) => {
    if (!f) return;
    const id = hojaIdYoutube(f[ci]);
    if (!id) return; // sin link de un video de YouTube no hay miniatura
    lista.push({ id, enlace: hojaLinkDe(f[ci]), nombre: ni >= 0 && f[ni] !== undefined && f[ni] !== null ? String(f[ni]).trim() : "" });
  });
  return lista;
}

async function canalLeer(n) {
  const d = canalProyecto;
  const j = await llamarNotas("hoja_redes_listar", { hoja: n, empresa: d.id, empresaNombre: d.nombre });
  // Un Apps Script viejo no sabe de hojas por proyecto ni de la hoja 2: se rechaza para no mostrar videos de otra hoja
  if (j.empresa !== d.id) throw new Error("hay que publicar la nueva versión del Apps Script (cada proyecto tiene su propia hoja)");
  if (n === 2 && j.hoja !== 2) throw new Error("para usar la hoja secundaria hay que publicar la nueva versión del Apps Script");
  return canalFilasDeHoja(j);
}

function canalPintarTabs() {
  canalTabsEl.querySelectorAll(".em-canal-tab").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.hoja === canalTab)));
}

function canalPintarMeta() {
  const d = canalProyecto;
  if (!d) return;
  const cuenta = (n, uno, varios) => (canalDatos[n] ? canalDatos[n].length + " " + (canalDatos[n].length === 1 ? uno : varios) : "… " + varios);
  const partes = [];
  const yt = nespEnlacesDe(d).map(hrefSeguro).filter(Boolean).find((h) => emRedDeLink(h).id === "youtube");
  if (yt) {
    try {
      const m = new URL(yt).pathname.match(/^\/(@[^/]+)/);
      if (m) partes.push(decodeURIComponent(m[1]));
    } catch (e) {}
  }
  partes.push(cuenta(1, "video", "videos"), cuenta(2, "short", "shorts"));
  canalMeta.textContent = partes.join(" · ");
}

function canalPintarCabecera() {
  const d = canalProyecto;
  canalBanner.innerHTML = "";
  canalAvatar.innerHTML = "";
  if (imagenValida(d.imagen)) {
    const fondo = document.createElement("img");
    fondo.alt = "";
    fondo.referrerPolicy = "no-referrer";
    fondo.addEventListener("error", () => fondo.remove());
    fondo.src = d.imagen;
    canalBanner.appendChild(fondo);
    const foto = document.createElement("img");
    foto.alt = "Imagen de " + d.nombre;
    foto.referrerPolicy = "no-referrer";
    foto.addEventListener("error", () => { canalAvatar.textContent = "\u{1F3E2}"; });
    foto.src = d.imagen;
    canalAvatar.appendChild(foto);
  } else {
    canalAvatar.textContent = "\u{1F3E2}";
  }
  canalNombre.textContent = d.nombre;
  const desc = String(d.descripcion || "").trim();
  canalDesc.textContent = desc;
  canalDesc.hidden = !desc;
  const yt = nespEnlacesDe(d).map(hrefSeguro).filter(Boolean).find((h) => emRedDeLink(h).id === "youtube");
  canalVer.hidden = !yt;
  if (yt) canalVer.href = yt;
  canalPintarMeta();
}

function canalCrearFicha(v) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "em-canal-ficha";
  b.title = v.nombre || "Abrir el video";
  b.setAttribute("aria-label", "Abrir el video" + (v.nombre ? ": " + v.nombre : ""));
  const mini = document.createElement("span");
  mini.className = "em-canal-mini";
  const img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  // Los shorts son verticales: su miniatura se recorta al centro
  img.src = "https://i.ytimg.com/vi/" + v.id + (canalTab === 2 ? "/hqdefault.jpg" : "/mqdefault.jpg");
  img.addEventListener("error", () => { img.remove(); mini.textContent = "\u25B6"; });
  mini.appendChild(img);
  b.appendChild(mini);
  if (v.nombre) {
    const t = document.createElement("span");
    t.className = "em-canal-titulo";
    t.textContent = v.nombre;
    b.appendChild(t);
  }
  b.addEventListener("click", () => hojaAbrirVideo(v.id, v.enlace || "https://www.youtube.com/watch?v=" + v.id, emCanal));
  return b;
}

function canalDibujarPags(total) {
  canalPags.innerHTML = "";
  canalPags.hidden = total <= 1;
  if (total <= 1) return;
  const boton = (txt, pagina, extra) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "em-canal-pag" + (extra ? " " + extra : "");
    b.textContent = txt;
    if (pagina === canalPagina && !extra) b.setAttribute("aria-current", "page");
    if (!pagina || pagina < 1 || pagina > total || (pagina === canalPagina && extra)) b.disabled = true;
    else b.addEventListener("click", () => canalIrAPagina(pagina));
    return b;
  };
  canalPags.appendChild(boton("‹", canalPagina - 1, "em-canal-pag-flecha"));
  const nums = [...new Set([1, total, canalPagina - 1, canalPagina, canalPagina + 1])].filter((n) => n >= 1 && n <= total).sort((x, y) => x - y);
  let ultimo = 0;
  nums.forEach((n) => {
    if (n - ultimo > 1) {
      const p = document.createElement("span");
      p.className = "em-canal-pag-puntos";
      p.textContent = "…";
      canalPags.appendChild(p);
    }
    canalPags.appendChild(boton(String(n), n));
    ultimo = n;
  });
  canalPags.appendChild(boton("›", canalPagina + 1, "em-canal-pag-flecha"));
}

function canalIrAPagina(n) {
  canalPagina = n;
  canalDibujar();
  canalScroll.scrollTo({ top: Math.max(0, canalTabsEl.offsetTop - 70), behavior: "smooth" });
}

function canalDibujar() {
  const lista = canalDatos[canalTab] || [];
  const paginas = Math.max(1, Math.ceil(lista.length / CANAL_POR_PAGINA));
  if (canalPagina > paginas) canalPagina = paginas;
  canalGrid.innerHTML = "";
  canalGrid.classList.toggle("em-canal-grid-shorts", canalTab === 2);
  if (!lista.length) {
    const p = document.createElement("p");
    p.className = "em-canal-vacio";
    p.textContent = canalTab === 1
      ? "Aún no hay links de videos de YouTube en la hoja principal. Agrégalos con el engrane ⚙."
      : "Aún no hay links de shorts de YouTube en la hoja secundaria. Agrégalos con el engrane ⚙.";
    canalGrid.appendChild(p);
    canalDibujarPags(1);
    return;
  }
  lista.slice((canalPagina - 1) * CANAL_POR_PAGINA, canalPagina * CANAL_POR_PAGINA).forEach((v) => canalGrid.appendChild(canalCrearFicha(v)));
  canalDibujarPags(paginas);
}

// Muestra Videos (1) o Shorts (2): lee esa hoja si todavía no se había leído
async function canalMostrar(n) {
  const d = canalProyecto;
  if (!d) return;
  canalTab = n === 2 ? 2 : 1;
  canalPagina = 1;
  canalPintarTabs();
  hojaCerrarVideo();
  if (canalDatos[canalTab]) {
    setEstado(canalEstado, "");
    canalDibujar();
    return;
  }
  const leyendo = canalTab;
  setEstado(canalEstado, "Cargando…");
  canalGrid.innerHTML = "";
  canalPags.hidden = true;
  try {
    const lista = await canalLeer(leyendo);
    if (canalProyecto !== d) return;
    canalDatos[leyendo] = lista;
  } catch (err) {
    if (canalProyecto === d && canalTab === leyendo) setEstado(canalEstado, "Error: " + err.message + " · usa ↻ para reintentar", "error");
    return;
  }
  canalPintarMeta();
  if (canalTab === leyendo) {
    setEstado(canalEstado, "");
    canalDibujar();
  }
  // La otra hoja se lee en segundo plano, solo para poner cuántos hay de cada uno
  const otra = leyendo === 1 ? 2 : 1;
  if (!canalDatos[otra]) {
    canalLeer(otra).then((l) => {
      if (canalProyecto !== d) return;
      canalDatos[otra] = l;
      canalPintarMeta();
    }).catch(() => {});
  }
}

function abrirCanal(n) {
  if (!emDetActual) return;
  hojaCerrarVideo();
  canalProyecto = emDetActual;
  canalDatos = { 1: null, 2: null };
  canalPintarCabecera();
  emCanal.hidden = false;
  canalScroll.scrollTop = 0;
  canalMostrar(n);
}

function cerrarCanal() {
  hojaCerrarVideo();
  emCanal.hidden = true;
  canalProyecto = null;
}

// Al cerrar la hoja de redes (que se abre con el engrane) el perfil sigue abierto: si se editó algo, vuelve a leer los videos
function canalAlVolverDeHoja(huboCambios) {
  if (emCanal.hidden || !canalProyecto) return;
  if (huboCambios) canalDatos = { 1: null, 2: null };
  canalMostrar(hojaNumero);
}

canalTabsEl.querySelectorAll(".em-canal-tab").forEach((b) => b.addEventListener("click", () => canalMostrar(+b.dataset.hoja)));
emEl("em-canal-volver").addEventListener("click", cerrarCanal);
emEl("em-canal-ajustes").addEventListener("click", () => abrirHoja(canalTab));
emEl("em-canal-recargar").addEventListener("click", () => {
  canalDatos = { 1: null, 2: null };
  canalPintarMeta();
  canalMostrar(canalTab);
});

// ----- Mini notas cuadradas -----
function dibujarChipsEm() {
  emChips.innerHTML = "";
  empresas.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    const conImg = imagenValida(d.imagen);
    b.className = "ej-chip ej-chip-resumen" + (conImg ? " emp-chip-con-img" : "");
    b.title = d.nombre + (d.fecha ? " (" + ipFechaCorta(d.fecha) + ")" : "");
    b.setAttribute("aria-label", "Abrir " + d.nombre);
    if (conImg) {
      const img = document.createElement("img");
      img.className = "emp-chip-img";
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.src = d.imagen;
      img.addEventListener("error", () => img.remove());
      b.appendChild(img);
    }
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = (conImg ? "" : "🏢 ") + d.nombre;
    const f = document.createElement("span");
    f.className = "ej-chip-fecha";
    f.textContent = ipFechaCorta(d.fecha);
    const t = document.createElement("span");
    t.className = "ej-chip-desc";
    t.textContent = resumenCorto(d.descripcion, 70);
    if (conImg) b.append(n, f); // con imagen: la foto ocupa el cuadro y no se muestra la vista previa del texto
    else b.append(n, f, t);
    b.addEventListener("click", () => abrirDetalleEm(d));
    emChips.appendChild(b);
  });
  const nuevo = document.createElement("button");
  nuevo.type = "button";
  nuevo.className = "ej-chip ej-chip-nuevo";
  nuevo.setAttribute("aria-label", "Añadir empresa o proyecto");
  nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
  nuevo.addEventListener("click", () => abrirFormEm(null));
  emChips.appendChild(nuevo);
}

// ----- Ventana para añadir / editar -----
function abrirFormEm(d) {
  emEditando = d;
  emImagenUrl = d ? d.imagen || "" : "";
  emImagenNueva = null;
  emEl("em-url-img").value = ""; // el link pegado en una nota nunca pasa a la siguiente
  emFormTitulo.textContent = d ? "Editar empresa / proyecto" : "Nueva empresa / proyecto";
  emNombre.value = d ? d.nombre : "";
  emFecha.value = d && d.fecha ? d.fecha : ipHoy(); // si es nueva, empieza con la fecha de hoy
  emLink.value = d ? d.link || "" : "";
  emDescripcion.value = d ? d.descripcion || "" : "";
  emLinks.value = d ? enlacesDeTexto(d.links).join("\n") : "";
  emBorrar.hidden = !d;
  setEstado(emFormEstado, "");
  emDibujarVistaImagen();
  emDibujarEnlaces(emLinkVista, enlacesDeTexto(emLink.value).slice(0, 1));
  emDibujarEnlaces(emLinksVista, enlacesDeTexto(emLinks.value));
  emForm.hidden = false;
  emForm.scrollTop = 0;
  emNombre.focus();
}
function cerrarFormEm() {
  emForm.hidden = true;
  emEditando = null;
  emImagenNueva = null;
  emImagenUrl = "";
  emArchivo.value = "";
  emEl("em-url-img").value = "";
}

async function guardarEm() {
  const nombre = emNombre.value.trim();
  if (!nombre) {
    setEstado(emFormEstado, "Escribe el nombre", "error");
    return;
  }
  // Si pegó un link y no presionó «Usar link», se aplica ahora a ESTA nota
  if (emEl("em-url-img").value.trim() && !emUsarLinkImagen()) return;
  emGuardar.disabled = true;
  try {
    // 1) Si se eligió una imagen nueva, se sube a imgbb a través del Apps Script
    if (emImagenNueva) {
      setEstado(emFormEstado, "Subiendo imagen…");
      const j = await llamarNotas("proyecto_imagen", { imagen: emImagenNueva.base64 });
      emImagenUrl = j.url;
      emImagenNueva = null; // si el guardado falla, no se vuelve a subir
    }
    // 2) Se guarda en la hoja «Empresas Proyectos» (columnas A a G)
    setEstado(emFormEstado, "Guardando…");
    const editando = emEditando;
    const id = editando ? editando.id : String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
    const d = {
      id,
      nombre,
      fecha: emFecha.value || ipHoy(),
      link: emLink.value.trim(),
      imagen: emImagenUrl,
      descripcion: emDescripcion.value.trim(),
      links: enlacesDeTexto(emLinks.value).join("\n"),
      notas: editando && Array.isArray(editando.notas) ? editando.notas : [], // las notas se guardan aparte (columna H)
      notasLargo: editando ? editando.notasLargo || 0 : 0,
    };
    await llamarNotas(editando ? "empresa_editar" : "empresa_agregar", d);
    // Se reemplaza solo ESA nota (por posición, no por Id) y luego se vuelve a leer la hoja para mostrar lo que quedó guardado
    const pos = editando ? empresas.indexOf(editando) : -1;
    if (pos !== -1) empresas[pos] = d;
    else empresas.push(d);
    cerrarFormEm();
    dibujarChipsEm();
    if (editando && emDetActual) {
      emDetActual = d;
      dibujarDetalleEm();
    }
    setEstado(emEstado, "Guardado ✓", "ok");
    cargarEmpresas().then(() => setEstado(emEstado, "Guardado ✓", "ok"));
  } catch (err) {
    setEstado(emFormEstado, "Error: " + err.message, "error");
  } finally {
    emGuardar.disabled = false;
  }
}

async function borrarEm() {
  const d = emEditando;
  if (!d || !window.confirm("¿Eliminar «" + d.nombre + "»? (la imagen seguirá en imgbb)")) return;
  emBorrar.disabled = true;
  setEstado(emFormEstado, "Eliminando…");
  try {
    await llamarNotas("empresa_borrar", { id: d.id });
    empresas = empresas.filter((x) => x !== d);
    cerrarFormEm();
    cerrarDetalleEm();
    dibujarChipsEm();
    setEstado(emEstado, "Eliminado", "ok");
    cargarEmpresas().then(() => setEstado(emEstado, "Eliminado", "ok"));
  } catch (err) {
    setEstado(emFormEstado, "Error: " + err.message, "error");
  } finally {
    emBorrar.disabled = false;
  }
}

// ----- Carga y sesión -----
async function cargarEmpresas() {
  setEstado(emEstado, "Cargando…");
  try {
    const j = await llamarNotas("empresa_listar");
    empresas = Array.isArray(j.empresas) ? j.empresas : [];
    emCargadas = true;
    setEstado(emEstado, "");
    dibujarChipsEm();
    if (emDetActual) {
      const nueva = empresas.find((x) => x.id === emDetActual.id);
      if (nueva) {
        emDetActual = nueva;
        dibujarDetalleEm();
      } else {
        cerrarDetalleEm();
      }
    }
  } catch (err) {
    setEstado(emEstado, "Error: " + err.message, "error");
  }
}

function actualizarPanelEmpresas() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    emCargadas = false;
    empresas = [];
  }
  if (panelEm.hidden) return;
  const dentro = sesionVigente();
  emSinSesion.hidden = dentro;
  emContenido.hidden = !dentro;
  if (dentro) {
    if (!emCargadas) cargarEmpresas();
    else dibujarChipsEm();
  } else {
    cerrarFormEm();
    cerrarDetalleEm();
    dibujarChipsEm();
  }
}

// Se llama al entrar a la página de Empresas/Proyectos (desde mostrarSeccion)
function entrarEmpresas() {
  cerrarFormEm();
  cerrarDetalleEm();
  panelEm.hidden = false;
  dibujarChipsEm();
  actualizarPanelEmpresas();
}
// Empresas/Proyectos es una página: aquí solo se cierra la ventana
function cerrarEmpresas() {
  cerrarFormEm();
  cerrarDetalleEm();
}

emEl("em-cerrar").addEventListener("click", cerrarEmpresas);
emEl("em-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarEmpresas();
  else actualizarPanelEmpresas();
});
emEl("em-ir-login").addEventListener("click", () => {
  cerrarEmpresas();
  abrirLateral();
});
emGuardar.addEventListener("click", guardarEm);
emEl("em-cancelar").addEventListener("click", cerrarFormEm);
emBorrar.addEventListener("click", borrarEm);
// Esc cierra la ventana
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || panelEm.hidden) return;
  if (!emRedSub.hidden) cerrarSubRed();
  else if (!emHoja.hidden) cerrarHoja();
  else if (!emCanal.hidden) cerrarCanal();
  else if (!emForm.hidden) cerrarFormEm();
  else if (!emDetalle.hidden) cerrarDetalleEm();
});

// ---------- Día de Hoy ----------
// No tiene hoja propia: junta lo que tenga la fecha de hoy en las demás zonas (Calendario, Notas, Ejercicio,
// Actividades, Trabajo, Diario, Información Primordial, Comandos, Deudas (por su día de creación), Empresas/Proyectos
// y Pedidos de Yeso). Bazar no guarda fecha, así que no aparece aquí.
// En el grupo del Diario (donde caen las tareas completadas) hay un recuadro «+ Añadir» para escribir notas de hoy.
const hyEl = (id) => document.getElementById(id);
const seccionHy = hyEl("seccion-hoy");
const panelHy = hyEl("panel-hoy");
const hySinSesion = hyEl("hy-sin-sesion");
const hyContenido = hyEl("hy-contenido");
const hyEstado = hyEl("hy-estado");
const hyFecha = hyEl("hy-fecha");
const hyGruposEl = hyEl("hy-grupos");
const hyDetalle = hyEl("hy-detalle");
const hyDetalleIr = hyEl("hy-detalle-ir");

// Zonas que se revisan, en el orden del menú; «seccion» es la página que se abre desde el detalle
const HY_ZONAS = [
  { id: "calendario", icono: "📅", titulo: "Calendario", seccion: "calendario" },
  { id: "notas", icono: "📝", titulo: "Notas", seccion: "seccion-notas" },
  { id: "ejercicio", icono: "💪", titulo: "Ejercicio", seccion: "seccion-ejercicio" },
  { id: "actividades", icono: "🎯", titulo: "Actividades", seccion: "actividades" },
  { id: "trabajo", icono: "💼", titulo: "Trabajo", seccion: "trabajo" },
  { id: "diario", icono: "📓", titulo: "Diario", seccion: "seccion-diario" },
  { id: "informacion", icono: "⭐", titulo: "Información Primordial", seccion: "seccion-informacion" },
  { id: "comandos", icono: "🎙️", titulo: "Comandos", seccion: "seccion-comandos" },
  { id: "deudas", icono: "💸", titulo: "Deudas", seccion: "seccion-deudas" },
  { id: "empresas", icono: "🏢", titulo: "Empresas / Proyectos", seccion: "seccion-empresas" },
  { id: "yeso", icono: "📦", titulo: "Pedidos de Yeso", seccion: "pedidos-yeso" },
];

let hyGrupos = []; // [{ zona, items: [{ nombre, hora, texto, extra }] }]
let hyCargadas = false;
let hyCargando = false;
let hyPeticion = 0; // sirve para ignorar respuestas viejas si se vuelve a pedir
let hyAbierta = null; // zona del recuadro que está abierto en el detalle
let hyItemAbierto = null; // recuadro que está abierto en el detalle

// Día de hoy como "aaaa-mm-dd" (misma forma en que lo guardan Ejercicio, Diario, Información y Comandos)
function hyClaveHoy() {
  const n = new Date();
  return `${n.getFullYear()}-${dos(n.getMonth() + 1)}-${dos(n.getDate())}`;
}
function hyFechaLarga() {
  const t = new Date().toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
// Fecha de una nota «dd/mm/aaaa hh:mm» -> { dia: "aaaa-mm-dd", hora: "hh:mm" } (o null si no se entiende)
function hyDeNota(s) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2}))?/.exec(String(s || "").trim());
  if (!m) return null;
  return { dia: `${m[3]}-${dos(m[2])}-${dos(m[1])}`, hora: m[4] ? `${dos(m[4])}:${m[5]}` : "" };
}
// Los textos del calendario empiezan con una línea «dd/mm/aaaa hh:mm»: se separa la hora del texto
function hySinSello(t) {
  const m = /^\d{1,2}\/\d{1,2}\/\d{4} (\d{1,2}:\d{2})[ \t]*\r?\n([\s\S]*)$/.exec(String(t || "").trim());
  return m ? { hora: m[1].padStart(5, "0"), texto: m[2].trim() } : { hora: "", texto: String(t || "").trim() };
}

// Arma los grupos con lo que tenga la fecha de hoy. Si una zona no se pudo leer llega null y se salta.
function hyArmar(clave, f) {
  const por = {};
  HY_ZONAS.forEach((z) => (por[z.id] = []));

  // Calendario: Descripción (una sola), Actividades y Anotaciones (cada recuadro por separado)
  const dia = f.calendario ? f.calendario[clave] : null;
  if (dia) {
    CAMPOS.forEach((campo) => {
      const crudo = dia[campo.clave];
      const elementos = parsearElementos(crudo)
        .map((t, i) => Object.assign(hySinSello(t), { i }))
        .filter((e) => e.texto);
      if (!elementos.length) return;
      if (campo.clave === "descripcion") {
        por.calendario.push({
          nombre: campo.etiqueta,
          hora: elementos[0].hora,
          texto: elementos.map((e) => e.texto).join("\n\n"),
          origen: { tipo: "calendario", fecha: clave, campo: campo.clave, todo: true },
        });
      } else {
        elementos.forEach((e) =>
          por.calendario.push({
            nombre: campo.etiqueta,
            hora: e.hora,
            texto: e.texto,
            origen: { tipo: "calendario", fecha: clave, campo: campo.clave, indice: e.i, crudo },
          })
        );
      }
    });
  }

  // Notas: según su etiqueta pertenecen a Actividades, Trabajo, Pedidos de Yeso o a Notas
  (f.notas || []).forEach((n) => {
    const fn = hyDeNota(n.fecha);
    if (!fn || fn.dia !== clave) return;
    const zona = n.etiqueta === "Actividades" ? "actividades"
      : n.etiqueta === "Trabajo" ? "trabajo"
      : n.etiqueta === "Pedidos de Yeso" ? "yeso"
      : "notas";
    por[zona].push({
      nombre: n.nombre || "Sin nombre",
      hora: fn.hora,
      texto: n.texto,
      extra: zona === "notas" ? n.etiqueta : "",
      origen: { tipo: "nota", id: n.id },
    });
  });

  (f.ejercicios || []).forEach((e) => {
    if (e.fecha === clave) {
      por.ejercicio.push({ nombre: e.nombre, hora: "", texto: e.descripcion, origen: { tipo: "ejercicio", id: e.id } });
    }
  });
  (f.diarios || []).forEach((d) => {
    if (d.fecha === clave) {
      // Las tareas obligatorias completadas llevan su hora en la descripción: así salen ordenadas y con su hora
      const hf = d.marca === "Tarea finalizada" ? /\ba las (\d{1,2}:\d{2})/.exec(d.descripcion || "") : null;
      por.diario.push({
        nombre: d.nombre,
        hora: hf ? hf[1].padStart(5, "0") : "",
        marca: d.marca === "Tarea finalizada" ? "✅ Tarea finalizada" : d.terminado ? "✅ Terminado" : "",
        texto: d.descripcion,
        extra: d.marca === "Tarea finalizada" ? "Anotación de Tarea Finalizada" : d.marca === "Actividad finalizada" ? "Actividad terminada" : d.terminado ? "Trabajo terminado" : "",
        finalizada: d.marca === "Tarea finalizada",
      });
    }
  });
  (f.informaciones || []).forEach((i) => {
    if (i.fecha === clave) {
      por.informacion.push({ nombre: i.nombre, hora: "", texto: i.descripcion, origen: { tipo: "informacion", id: i.id } });
    }
  });
  (f.comandos || []).forEach((c) => {
    if (c.fecha === clave) {
      por.comandos.push({ nombre: c.nombre, hora: "", texto: c.descripcion, origen: { tipo: "comando", id: c.id } });
    }
  });

  (f.deudas || []).forEach((d) => {
    if (d.fecha === clave) por.deudas.push({ nombre: d.nombre, hora: "", texto: d.descripcion, extra: "Creada hoy" });
  });
  (f.empresas || []).forEach((e) => {
    if (e.fecha === clave) por.empresas.push({ nombre: e.nombre, hora: "", texto: e.descripcion, extra: "" });
  });

  return HY_ZONAS.map((zona) => {
    // Los que tienen hora van por hora; los demás se quedan en el orden de la hoja
    const items = por[zona.id].sort((x, y) => (x.hora || "99:99").localeCompare(y.hora || "99:99"));
    return { zona, items };
  });
}

// Un grupo de recuadros (título de la zona + sus recuadros)
function hyCrearGrupo(g) {
  const sec = document.createElement("section");
  sec.className = "hoy-grupo";
  const titulo = document.createElement("h3");
  titulo.className = "notas-grupo-titulo";
  titulo.textContent = g.zona.icono + " " + g.zona.titulo;
  const cuenta = document.createElement("span");
  cuenta.className = "notas-grupo-cuenta";
  cuenta.textContent = String(g.items.length);
  titulo.appendChild(cuenta);
  const chips = document.createElement("div");
  chips.className = "ej-chips";
  g.items.forEach((it) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ej-chip ej-chip-resumen" + (it.finalizada ? " ej-chip-finalizada" : "");
    b.title = it.nombre + (it.hora ? " (" + it.hora + ")" : "");
    b.setAttribute("aria-label", "Ver " + it.nombre + " de " + g.zona.titulo);
    const n = document.createElement("span");
    n.className = "ej-chip-nombre";
    n.textContent = it.nombre;
    const t = document.createElement("span");
    t.className = "ej-chip-desc";
    t.textContent = resumenCorto(it.texto, 70);
    if (it.hora || it.marca) {
      const f = document.createElement("span");
      f.className = "ej-chip-fecha";
      f.textContent = it.finalizada && it.hora ? "✅ " + it.hora : it.hora || it.marca;
      b.append(n, f, t);
    } else {
      b.append(n, t);
    }
    b.addEventListener("click", () => abrirDetalleHy(g.zona, it));
    chips.appendChild(b);
  });
  if (g.zona.id === "diario") {
    const nuevo = document.createElement("button");
    nuevo.type = "button";
    nuevo.className = "ej-chip ej-chip-nuevo";
    nuevo.setAttribute("aria-label", "Añadir una nota de hoy al Diario");
    nuevo.innerHTML = '<span class="ej-chip-icono" aria-hidden="true">+</span><span class="ej-chip-nombre">Añadir</span>';
    nuevo.addEventListener("click", hyAbrirNuevaNota);
    chips.appendChild(nuevo);
  }
  sec.append(titulo, chips);
  return sec;
}

function dibujarHoy() {
  hyFecha.textContent = hyFechaLarga();
  hyGruposEl.innerHTML = "";
  if (!hyCargadas) return;
  const conAlgo = hyGrupos.filter((g) => g.items.length);
  if (!conAlgo.length) {
    const p = document.createElement("p");
    p.className = "notas-vacio";
    p.textContent = "No hay nada registrado con la fecha de hoy.";
    hyGruposEl.appendChild(p);
  }
  // El Diario va aparte: primero las demás zonas, y debajo de una línea los recuadros del Diario.
  // Se muestra siempre (aunque esté vacío) porque ahí está el recuadro «+ Añadir» para escribir notas de hoy.
  conAlgo.filter((g) => g.zona.id !== "diario").forEach((g) => hyGruposEl.appendChild(hyCrearGrupo(g)));
  const diario = hyGrupos.find((g) => g.zona.id === "diario") || { zona: HY_ZONAS.find((z) => z.id === "diario"), items: [] };
  const linea = document.createElement("hr");
  linea.className = "hoy-separador";
  hyGruposEl.append(linea, hyCrearGrupo(diario));
}

// ----- «+ Añadir»: escribir una nota de hoy en el Diario desde Día de Hoy -----
function hyAbrirNuevaNota() {
  const fondo = document.createElement("div");
  fondo.className = "td-dialogo";
  const caja = document.createElement("div");
  caja.className = "td-dialogo-caja";
  caja.setAttribute("role", "dialog");
  caja.setAttribute("aria-modal", "true");
  const titulo = document.createElement("h3");
  titulo.textContent = "📓 Nueva nota de hoy";
  const campo = (rotulo, el) => {
    const l = document.createElement("label");
    l.textContent = rotulo;
    l.appendChild(el);
    return l;
  };
  const iNombre = document.createElement("input");
  iNombre.type = "text";
  iNombre.maxLength = 80;
  iNombre.autocomplete = "off";
  const iDesc = document.createElement("textarea");
  iDesc.rows = 6;
  iDesc.maxLength = 1000000;
  const msg = document.createElement("p");
  msg.className = "notas-estado";
  const fila = document.createElement("div");
  fila.className = "td-dialogo-botones";
  const cancelar = document.createElement("button");
  cancelar.type = "button";
  cancelar.className = "notas-btn td-btn-sec";
  cancelar.textContent = "Cancelar";
  const guardar = document.createElement("button");
  guardar.type = "button";
  guardar.className = "notas-btn";
  guardar.textContent = "Guardar";
  fila.append(cancelar, guardar);
  caja.append(titulo, campo("Nombre", iNombre), campo("Nota", iDesc), msg, fila);
  fondo.appendChild(caja);
  document.body.appendChild(fondo);
  iNombre.focus();
  const cerrar = () => { fondo.remove(); document.removeEventListener("keydown", alEscape, true); };
  const alEscape = (e) => { if (e.key === "Escape") { e.stopPropagation(); cerrar(); } };
  document.addEventListener("keydown", alEscape, true);
  cancelar.addEventListener("click", cerrar);
  fondo.addEventListener("click", (e) => { if (e.target === fondo) cerrar(); });
  guardar.addEventListener("click", async () => {
    const nombre = iNombre.value.trim().slice(0, 80);
    const descripcion = iDesc.value.trim();
    if (!nombre) { setEstado(msg, "Escribe el nombre de la nota", "error"); return; }
    guardar.disabled = true;
    setEstado(msg, "Guardando…");
    try {
      const id = String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
      await llamarNotas("diario_agregar", { id, nombre, fecha: hyClaveHoy(), descripcion, destino: "drive", terminado: "" });
      diCargados = false; // el Diario se vuelve a leer al entrar y ya trae la nota nueva
      let gd = hyGrupos.find((g) => g.zona.id === "diario");
      if (!gd) {
        gd = { zona: HY_ZONAS.find((z) => z.id === "diario"), items: [] };
        hyGrupos.push(gd);
      }
      gd.items.push({ nombre, hora: "", marca: "", texto: descripcion, extra: "", finalizada: false });
      cerrar();
      dibujarHoy();
      setEstado(hyEstado, "Nota añadida al Diario de hoy ✓", "ok");
    } catch (e) {
      guardar.disabled = false;
      setEstado(msg, "Error: " + e.message, "error");
    }
  });
}

// ----- Detalle de un recuadro (solo lectura) -----
function abrirDetalleHy(zona, it) {
  hyAbierta = zona;
  hyItemAbierto = it;
  hyEl("hy-detalle-fin").hidden = !it.origen; // lo del Diario ya está en el Diario
  hyEl("hy-detalle-fin").disabled = false;
  setEstado(hyEl("hy-detalle-estado"), "");
  hyEl("hy-detalle-nombre").textContent = it.nombre;
  hyEl("hy-detalle-origen").textContent =
    zona.icono + " " + zona.titulo + (it.extra ? " · " + it.extra : "") + (it.hora ? " · " + it.hora : "");
  hyEl("hy-detalle-texto").textContent = it.texto || "Sin descripción";
  hyDetalleIr.textContent = "Abrir " + zona.titulo;
  hyDetalle.hidden = false;
}
function cerrarDetalleHy() {
  hyDetalle.hidden = true;
  hyAbierta = null;
  hyItemAbierto = null;
}

// Nombre para el Diario cuando lo que se finaliza viene del Calendario (su recuadro solo se llama «Actividades», etc.)
function hyNombreDeTexto(texto, respaldo) {
  const linea = String(texto || "").split(/\r?\n/).map((x) => x.trim()).find((x) => x) || respaldo || "Tarea finalizada";
  return linea.length > 70 ? linea.slice(0, 69) + "…" : linea;
}

// «Dar por finalizado»: la nota se quita de donde estaba y pasa al Diario (con la fecha de hoy) como
// «Anotación de Tarea Finalizada». Primero se agrega al Diario y después se quita del origen; si algo falla
// a medias se puede volver a intentar sin que quede repetida (el Diario no repite un mismo Id).
async function finalizarHy() {
  const zona = hyAbierta;
  const it = hyItemAbierto;
  if (!zona || !it || !it.origen) return;
  const o = it.origen;
  const esCal = o.tipo === "calendario";
  const nombre = (esCal ? hyNombreDeTexto(it.texto, it.nombre) : it.nombre || "Sin nombre").slice(0, 80);
  if (!window.confirm("¿Dar por finalizado «" + nombre + "»? Se quitará de " + zona.titulo + " y pasará al Diario con la fecha de hoy.")) return;
  const boton = hyEl("hy-detalle-fin");
  const estado = hyEl("hy-detalle-estado");
  boton.disabled = true;
  setEstado(estado, "Finalizando…");
  const hoyClave = hyClaveHoy();
  const id = o.id || it.finId || (it.finId = String(Date.now() * 1000 + Math.floor(Math.random() * 1000)));
  const descripcion = String(it.texto || "").slice(0, 1000000);
  try {
    // 1) Agregarla al Diario como tarea finalizada
    await llamarNotas("diario_agregar", { id, nombre, fecha: hoyClave, descripcion, terminado: "Tarea finalizada" });
    // 2) Quitarla de donde estaba
    if (o.tipo === "nota") {
      await llamarNotas("nota_borrar", { id: o.id });
      notas = notas.filter((n) => n.id !== o.id);
      if (notasCargadas) dibujarNotas();
    } else if (o.tipo === "ejercicio") {
      await llamarNotas("ejercicio_borrar", { id: o.id });
      ejCargados = false; // se vuelve a leer al entrar
    } else if (o.tipo === "informacion") {
      await llamarNotas("informacion_borrar", { id: o.id });
      ipCargadas = false;
    } else if (o.tipo === "comando") {
      await llamarNotas("comando_borrar", { id: o.id });
      cmCargadas = false;
    } else if (esCal) {
      let nuevo = "";
      if (!o.todo) {
        const elementos = parsearElementos(o.crudo);
        elementos.splice(o.indice, 1);
        nuevo = serializarElementos(elementos);
      }
      await guardarCampo(o.fecha, o.campo, nuevo);
      if (calendarioCargado) dibujarCalendario();
    }
    diCargados = false; // el Diario se vuelve a leer al entrar y ya trae la nueva anotación
    // 3) Actualizar esta página: sale de su grupo y aparece en el Diario, en verde
    const grupo = hyGrupos.find((g) => g.zona.id === zona.id);
    if (grupo) grupo.items = grupo.items.filter((x) => x !== it);
    let gd = hyGrupos.find((g) => g.zona.id === "diario");
    if (!gd) {
      gd = { zona: HY_ZONAS.find((z) => z.id === "diario"), items: [] };
      hyGrupos.push(gd);
    }
    gd.items.push({
      nombre,
      hora: "",
      marca: "✅ Tarea finalizada",
      texto: descripcion,
      extra: "Anotación de Tarea Finalizada",
      finalizada: true,
    });
    cerrarDetalleHy();
    dibujarHoy();
    setEstado(hyEstado, "Tarea finalizada ✓ (ya está en el Diario)", "ok");
  } catch (e) {
    boton.disabled = false;
    setEstado(estado, "Error: " + e.message + " — puedes volver a intentarlo", "error");
  }
}
// Lleva a la zona de donde viene el recuadro (para verlo completo o modificarlo)
function irAZonaHy() {
  const zona = hyAbierta;
  if (!zona) return;
  cerrarDetalleHy();
  mostrarSeccion(zona.seccion);
  // Actividades, Trabajo y Pedidos de Yeso arman su zona con las notas: se prepara igual que desde su botón
  const z = zonas.find((x) => x.cfg.seccion === zona.seccion);
  if (z) {
    if (z.actualizar() && !notasCargadas) cargarNotasZonas();
    else z.dibujar();
  }
}

// ----- Carga y sesión -----
// Pide a la vez los datos de todas las zonas con fecha; si alguna falla, se muestran las demás y se avisa cuál.
async function cargarHoy() {
  const peticion = ++hyPeticion;
  hyCargando = true;
  setEstado(hyEstado, "Cargando…");
  const clave = hyClaveHoy();
  const pedidos = [
    ["Calendario", "calendario_listar"],
    ["Notas", "nota_listar"],
    ["Ejercicio", "ejercicio_listar"],
    ["Diario", "diario_listar"],
    ["Información Primordial", "informacion_listar"],
    ["Comandos", "comando_listar"],
    ["Deudas", "deuda_listar"],
    ["Empresas / Proyectos", "empresa_listar"],
  ];
  const resultados = await Promise.allSettled(pedidos.map((p) => llamarNotas(p[1])));
  if (peticion !== hyPeticion) return; // llegó otra petición más nueva: esta ya no sirve
  hyCargando = false;
  if (!sesionVigente()) return; // se cerró la sesión mientras cargaba
  const fallaron = [];
  const dato = (i) => {
    const r = resultados[i];
    if (r.status === "fulfilled") return r.value;
    fallaron.push(pedidos[i][0]);
    return null;
  };
  const cal = dato(0), nts = dato(1), ejs = dato(2), dis = dato(3), ips = dato(4), cms = dato(5), deu = dato(6), emp = dato(7);
  hyGrupos = hyArmar(clave, {
    calendario: cal ? cal.datos : null,
    notas: nts ? nts.notas : null,
    ejercicios: ejs ? ejs.ejercicios : null,
    diarios: dis ? dis.diarios : null,
    informaciones: ips ? ips.informaciones : null,
    comandos: cms ? cms.comandosLista : null,
    deudas: deu ? deu.deudas : null,
    empresas: emp ? emp.empresas : null,
  });
  hyCargadas = true;
  if (fallaron.length) setEstado(hyEstado, "No se pudo leer: " + fallaron.join(", "), "error");
  else setEstado(hyEstado, "");
  dibujarHoy();
}

function actualizarPanelHoy() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    hyCargadas = false;
    hyGrupos = [];
  }
  if (panelHy.hidden || seccionHy.hidden) return;
  const dentro = sesionVigente();
  hySinSesion.hidden = dentro;
  hyContenido.hidden = !dentro;
  if (dentro) {
    if (!hyCargadas && !hyCargando) cargarHoy();
    else dibujarHoy();
  } else {
    cerrarDetalleHy();
    dibujarHoy();
  }
}

// Se llama al entrar a la página (desde mostrarSeccion): siempre vuelve a leer, porque «hoy» puede haber cambiado
function entrarHoy() {
  cerrarDetalleHy();
  panelHy.hidden = false;
  hyCargadas = false;
  dibujarHoy();
  actualizarPanelHoy();
}
// Día de Hoy es una página: aquí solo se cierra la ventana de detalle
function cerrarHoy() {
  cerrarDetalleHy();
}

hyEl("hy-cerrar").addEventListener("click", cerrarHoy);
hyEl("hy-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarHoy();
  else actualizarPanelHoy();
});
hyEl("hy-ir-login").addEventListener("click", () => {
  cerrarHoy();
  abrirLateral();
});
hyEl("hy-detalle-cerrar").addEventListener("click", cerrarDetalleHy);
hyDetalleIr.addEventListener("click", irAZonaHy);
hyEl("hy-detalle-fin").addEventListener("click", finalizarHy);
hyDetalle.addEventListener("click", (e) => {
  if (e.target === hyDetalle) cerrarDetalleHy(); // tocar fuera de la ventana la cierra
});
// Esc cierra el detalle
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || hyDetalle.hidden) return;
  cerrarDetalleHy();
});

// ---------- App de Android (Capacitor): inicio de sesión nativo y alarmas reales del sistema ----------
// La página se abre dentro de la app «Polo AI» (carpeta android del proyecto). Allí existe window.Capacitor y se pueden
// llamar los plugins nativos directamente. En un navegador normal nada de esto se activa (esAppNativa() es false).
function esAppNativa() {
  try { return !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform() && Capacitor.nativePromise); } catch (e) { return false; }
}
function nativo(plugin, metodo, opciones) {
  return Capacitor.nativePromise(plugin, metodo, opciones || {});
}
function nativoMensaje(e) {
  return (e && (e.message || e.errorMessage || e.code)) || String(e);
}

// Inicio de sesión con Google del sistema (el token tiene como audiencia el mismo GOOGLE_CLIENT_ID de config.js,
// así que el Apps Script lo valida igual que el de la web)
async function loginGoogleNativo() {
  googleAviso.hidden = true;
  try {
    await nativo("SocialLogin", "initialize", { google: { webClientId: CONFIG.GOOGLE_CLIENT_ID } });
    const r = await nativo("SocialLogin", "login", { provider: "google", options: { scopes: ["email", "profile"] } });
    const idToken = r && r.result && r.result.idToken;
    if (!idToken) throw new Error("Google no entregó el token de sesión");
    await respuestaGoogle({ credential: idToken });
  } catch (e) {
    googleAviso.textContent = "No se pudo iniciar sesión con Google: " + nativoMensaje(e);
    googleAviso.hidden = false;
  }
}

// Alarmas de las tareas diarias como notificaciones programadas del sistema: suenan con la app cerrada y con la
// pantalla apagada, todos los días a su hora, y se vuelven a programar solas al reiniciar el celular.
const NATIVO_CANAL = "polo-alarmas-v1"; // el sonido de un canal no se puede cambiar después: si lo cambias, usa otro nombre
const NATIVO_CLAVE_FIRMA = "polo-nativo-firma"; // resumen de lo último que se programó (evita reprogramar sin necesidad)
function nativoIdNumerico(idTexto) {
  let h = 7;
  const t = String(idTexto);
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 2147483000;
  return h + 1;
}
let nativoOcupado = false;
async function nativoPermisoNotif() {
  let p = await nativo("LocalNotifications", "checkPermissions");
  if (p.display !== "granted" && p.display !== "denied") p = await nativo("LocalNotifications", "requestPermissions");
  return p.display;
}
async function nativoCancelarPendientes() {
  const p = await nativo("LocalNotifications", "getPending");
  if (p && p.notifications && p.notifications.length) {
    await nativo("LocalNotifications", "cancel", { notifications: p.notifications.map((n) => ({ id: n.id })) });
  }
}
async function tdNativasSync(forzar) {
  if (!esAppNativa() || nativoOcupado || !tdCargadas || !sesionVigente()) return;
  const deseadas = tareasDiarias.filter((t) => TD_HORA_OK.test(t.hora || "") && (t.alarma === "celular" || t.alarma === "ambos"));
  const firma = JSON.stringify(deseadas.map((t) => [t.id, t.hora, t.texto]).sort());
  let guardada = "";
  try { guardada = localStorage.getItem(NATIVO_CLAVE_FIRMA) || ""; } catch (e) {}
  if (!forzar && firma === guardada) return;
  nativoOcupado = true;
  try {
    if ((await nativoPermisoNotif()) !== "granted") return; // sin permiso no se programa nada (se reintenta después)
    await nativo("LocalNotifications", "createChannel", {
      id: NATIVO_CANAL, name: "Alarmas de tareas", description: "Alarmas diarias de Polo AI",
      importance: 5, visibility: 1, sound: "alarma.wav", vibration: true, lights: true, lightColor: "#7A44D6",
    });
    await nativoCancelarPendientes();
    if (deseadas.length) {
      await nativo("LocalNotifications", "schedule", {
        notifications: deseadas.map((t) => {
          const p = t.hora.split(":").map(Number);
          return {
            id: nativoIdNumerico(t.id),
            title: "⏰ " + t.hora + " · Polo AI",
            body: t.texto.slice(0, 200),
            channelId: NATIVO_CANAL,
            sound: "alarma.wav",
            smallIcon: "ic_stat_polo",
            iconColor: "#4A2685",
            autoCancel: true,
            schedule: { on: { hour: p[0], minute: p[1] }, allowWhileIdle: true },
            extra: { tarea: t.id },
          };
        }),
      });
    }
    try { localStorage.setItem(NATIVO_CLAVE_FIRMA, firma); } catch (e) {}
  } catch (e) {
    console.warn("No se pudieron programar las alarmas del sistema:", nativoMensaje(e));
  } finally {
    nativoOcupado = false;
  }
}
function nativoAlCerrarSesion() {
  if (!esAppNativa()) return;
  try { localStorage.removeItem(NATIVO_CLAVE_FIRMA); } catch (e) {}
  nativoCancelarPendientes().catch(() => {});
  nativo("SocialLogin", "logout", { provider: "google" }).catch(() => {});
}

// ---------- Tareas Obligatorias Diarias ----------
// Mini notas cuadradas que se quedan para siempre (hoja «Tareas Diarias»). Cada una puede tener un horario y una
// alarma. «Completar» agrega una «Tarea finalizada» al Diario con el día de hoy y la hora; la tarea NO se quita.
// ALARMAS: suenan solo mientras la app está abierta en el dispositivo (una página web no puede despertar al celular
// con la pantalla apagada). Cada tarea elige dónde suena: celular Android, PC o ambos.
const panelTd = document.getElementById("panel-tareas");
const tdSinSesion = document.getElementById("td-sin-sesion");
const tdContenido = document.getElementById("td-contenido");
const tdEstado = document.getElementById("td-estado");
const tdGrid = document.getElementById("td-grid");
const tdNuevo = document.getElementById("td-nuevo");
const tdHoraNueva = document.getElementById("td-hora-nueva");
const tdAlarmaNueva = document.getElementById("td-alarma-nueva");
const tdAgregar = document.getElementById("td-agregar");
const tdInfo = document.getElementById("td-alarmas-info");
const CLAVE_TD_HECHAS = "polo-tareas-diarias-hechas"; // { idTarea: "AAAA-MM-DD HH:MM" } solo para mostrar «✓ Hoy»
const CLAVE_TD_SONADAS = "polo-tareas-diarias-sonadas"; // { idTarea: "AAAA-MM-DD" } ya sonó hoy en este dispositivo
const CLAVE_TD_PANTALLA = "polo-tareas-diarias-pantalla"; // "1" si se quiere mantener la pantalla encendida
const TD_ES_ANDROID = /Android/i.test(navigator.userAgent);
const TD_HORA_OK = /^([01]\d|2[0-3]):[0-5]\d$/;
const TD_ALARMAS = [
  ["", "🔕 Sin alarma"],
  ["celular", "📱 Alarma en el celular (Android)"],
  ["pc", "💻 Alarma en la PC"],
  ["ambos", "📱💻 En celular y PC"],
];
let tareasDiarias = [];
let tdCargadas = false;
let tdCargando = false;

function tdLeer(clave) {
  try { return JSON.parse(localStorage.getItem(clave)) || {}; } catch (e) { return {}; }
}
function tdEscribir(clave, id, valor) {
  try {
    const h = tdLeer(clave);
    h[id] = valor;
    localStorage.setItem(clave, JSON.stringify(h));
  } catch (e) {}
}
const tdLeerHechas = () => tdLeer(CLAVE_TD_HECHAS);
const tdGuardarHecha = (id, marca) => tdEscribir(CLAVE_TD_HECHAS, id, marca);
const tdNuevoId = () => String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
const tdHoyClave = () => { const n = new Date(); return claveFecha(n.getFullYear(), n.getMonth(), n.getDate()); };

function tdLlenarSelectAlarma(sel, valor) {
  sel.innerHTML = "";
  TD_ALARMAS.forEach((o) => sel.add(new Option(o[1], o[0])));
  sel.value = valor;
}
tdLlenarSelectAlarma(tdAlarmaNueva, "celular");

// ¿Esta alarma debe sonar en ESTE dispositivo? («celular» = solo Android; «pc» = cualquier otro)
function tdSuenaAqui(t) {
  if (!t.hora || !TD_HORA_OK.test(t.hora)) return false;
  return t.alarma === "ambos" || (t.alarma === "celular" && TD_ES_ANDROID) || (t.alarma === "pc" && !TD_ES_ANDROID);
}

function tdOrdenadas() {
  return tareasDiarias.slice().sort((a, b) => {
    const ha = TD_HORA_OK.test(a.hora || "") ? a.hora : "99:99";
    const hb = TD_HORA_OK.test(b.hora || "") ? b.hora : "99:99";
    return ha < hb ? -1 : ha > hb ? 1 : 0;
  });
}

function dibujarTareasDiarias() {
  tdGrid.innerHTML = "";
  if (!sesionVigente()) return;
  if (!tareasDiarias.length) {
    const p = document.createElement("p");
    p.className = "td-vacio";
    p.textContent = tdCargadas ? "Aún no hay tareas. ¡Agrega la primera! ✨" : "";
    tdGrid.appendChild(p);
    return;
  }
  const hoyClave = tdHoyClave();
  const hechas = tdLeerHechas();
  tdOrdenadas().forEach((t) => {
    const marca = hechas[t.id] && hechas[t.id].slice(0, 10) === hoyClave ? hechas[t.id] : "";
    const d = document.createElement("div");
    d.className = "td-tile" + (marca ? " td-hecha" : "");
    const txt = document.createElement("p");
    txt.className = "td-texto";
    txt.textContent = t.texto;
    txt.title = t.texto;
    const horario = document.createElement("div");
    horario.className = "td-horario";
    const conHora = TD_HORA_OK.test(t.hora || "");
    const icono = t.alarma === "ambos" ? "📱💻" : t.alarma === "celular" ? "📱" : t.alarma === "pc" ? "💻" : "";
    horario.textContent = conHora ? "🕗 " + t.hora + (icono ? " · 🔔 " + icono : "") : "";
    const hora = document.createElement("div");
    hora.className = "td-hora";
    hora.textContent = marca ? "✓ Hoy a las " + marca.slice(11, 16) : "";
    const acc = document.createElement("div");
    acc.className = "td-acciones";
    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "td-ok";
    ok.textContent = "✅ Completar";
    ok.addEventListener("click", () => completarTareaDiaria(t, ok));
    const sec = document.createElement("div");
    sec.className = "td-acciones";
    const ed = document.createElement("button");
    ed.type = "button";
    ed.className = "td-sec";
    ed.textContent = "✏️";
    ed.title = "Editar";
    ed.setAttribute("aria-label", "Editar tarea");
    ed.addEventListener("click", () => tdAbrirEdicion(t));
    const bo = document.createElement("button");
    bo.type = "button";
    bo.className = "td-sec";
    bo.textContent = "🗑";
    bo.title = "Eliminar";
    bo.setAttribute("aria-label", "Eliminar tarea");
    bo.addEventListener("click", () => borrarTareaDiaria(t));
    sec.append(ed, bo);
    if (TD_ES_ANDROID && conHora) {
      const rl = document.createElement("button");
      rl.type = "button";
      rl.className = "td-sec";
      rl.textContent = "⏰";
      rl.title = "Poner una alarma real en el Reloj del celular (una sola vez)";
      rl.setAttribute("aria-label", "Poner alarma en el Reloj del celular");
      rl.addEventListener("click", () => tdPonerEnReloj(t));
      sec.appendChild(rl);
    }
    d.append(txt, horario, hora, ok, sec);
    tdGrid.appendChild(d);
  });
}

async function cargarTareasDiarias() {
  if (tdCargando) return;
  tdCargando = true;
  try {
    const j = await llamarNotas("tarea_diaria_listar");
    tareasDiarias = (j.tareas || []).map((t) => ({
      id: t.id,
      texto: t.texto,
      hora: TD_HORA_OK.test(t.hora || "") ? t.hora : "",
      alarma: ["celular", "pc", "ambos"].indexOf(t.alarma) !== -1 ? t.alarma : "",
    }));
    tdCargadas = true;
    if (!panelTd.hidden) setEstado(tdEstado, "");
  } catch (e) {
    if (!panelTd.hidden) setEstado(tdEstado, "No se pudieron cargar las tareas: " + e.message, "error");
  }
  tdCargando = false;
  if (!panelTd.hidden) dibujarTareasDiarias();
  tdRevisarAlarmas();
}

async function agregarTareaDiaria() {
  const texto = tdNuevo.value.trim().slice(0, 300);
  if (!texto) { setEstado(tdEstado, "Escribe la tarea primero", "error"); return; }
  const hora = tdHoraNueva.value || "";
  if (hora && !TD_HORA_OK.test(hora)) { setEstado(tdEstado, "El horario no es válido", "error"); return; }
  const alarma = hora ? tdAlarmaNueva.value : "";
  const id = tdNuevoId();
  tdAgregar.disabled = true;
  setEstado(tdEstado, "Guardando…");
  try {
    await llamarNotas("tarea_diaria_agregar", { id, texto, hora, alarma });
    tareasDiarias.push({ id, texto, hora, alarma });
    tdNuevo.value = "";
    tdHoraNueva.value = "";
    setEstado(tdEstado, "Tarea agregada ✓", "ok");
    dibujarTareasDiarias();
  } catch (e) {
    setEstado(tdEstado, "Error: " + e.message, "error");
  }
  tdAgregar.disabled = false;
}

// Ventana para editar una tarea (texto, horario y alarma)
function tdAbrirEdicion(t) {
  const fondo = document.createElement("div");
  fondo.className = "td-dialogo";
  const caja = document.createElement("div");
  caja.className = "td-dialogo-caja";
  caja.setAttribute("role", "dialog");
  caja.setAttribute("aria-modal", "true");
  const titulo = document.createElement("h3");
  titulo.textContent = "Editar tarea";
  const campo = (rotulo, el) => {
    const l = document.createElement("label");
    l.textContent = rotulo;
    l.appendChild(el);
    return l;
  };
  const iTexto = document.createElement("input");
  iTexto.type = "text";
  iTexto.maxLength = 300;
  iTexto.value = t.texto;
  const iHora = document.createElement("input");
  iHora.type = "time";
  iHora.value = t.hora || "";
  const iAlarma = document.createElement("select");
  tdLlenarSelectAlarma(iAlarma, t.alarma || "");
  const msg = document.createElement("p");
  msg.className = "notas-estado";
  const fila = document.createElement("div");
  fila.className = "td-dialogo-botones";
  const cancelar = document.createElement("button");
  cancelar.type = "button";
  cancelar.className = "notas-btn td-btn-sec";
  cancelar.textContent = "Cancelar";
  const guardar = document.createElement("button");
  guardar.type = "button";
  guardar.className = "notas-btn";
  guardar.textContent = "Guardar";
  fila.append(cancelar, guardar);
  caja.append(titulo, campo("Tarea", iTexto), campo("Horario (opcional)", iHora), campo("Alarma", iAlarma), msg, fila);
  fondo.appendChild(caja);
  document.body.appendChild(fondo);
  iTexto.focus();
  const cerrar = () => fondo.remove();
  cancelar.addEventListener("click", cerrar);
  fondo.addEventListener("click", (e) => { if (e.target === fondo) cerrar(); });
  guardar.addEventListener("click", async () => {
    const texto = iTexto.value.trim().slice(0, 300);
    const hora = iHora.value || "";
    if (!texto) { setEstado(msg, "Escribe la tarea", "error"); return; }
    if (hora && !TD_HORA_OK.test(hora)) { setEstado(msg, "El horario no es válido", "error"); return; }
    const alarma = hora ? iAlarma.value : "";
    guardar.disabled = true;
    setEstado(msg, "Guardando…");
    try {
      await llamarNotas("tarea_diaria_editar", { id: t.id, texto, hora, alarma });
      t.texto = texto;
      t.hora = hora;
      t.alarma = alarma;
      // Si cambió el horario, la alarma de hoy puede volver a sonar
      tdEscribir(CLAVE_TD_SONADAS, t.id, "");
      cerrar();
      setEstado(tdEstado, "Tarea actualizada ✓", "ok");
      dibujarTareasDiarias();
      tdRevisarAlarmas();
    } catch (e) {
      guardar.disabled = false;
      setEstado(msg, "Error: " + e.message, "error");
    }
  });
}

async function borrarTareaDiaria(t) {
  if (!window.confirm("¿Eliminar para siempre la tarea «" + t.texto + "»? (Lo ya anotado en el Diario se queda.)")) return;
  setEstado(tdEstado, "Eliminando…");
  try {
    await llamarNotas("tarea_diaria_borrar", { id: t.id });
    tareasDiarias = tareasDiarias.filter((x) => x.id !== t.id);
    setEstado(tdEstado, "Tarea eliminada", "ok");
    dibujarTareasDiarias();
  } catch (e) {
    setEstado(tdEstado, "Error: " + e.message, "error");
  }
}

// «Completar»: agrega al Diario una «Tarea finalizada» con la fecha de hoy y la hora en la descripción.
// Cada vez lleva un Id nuevo (el Diario no repite Ids), así la tarea se puede completar todos los días.
async function completarTareaDiaria(t, boton) {
  const ahora = new Date();
  const fecha = claveFecha(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const hora = dos(ahora.getHours()) + ":" + dos(ahora.getMinutes());
  const nombre = t.texto.length > 80 ? t.texto.slice(0, 79) + "…" : t.texto;
  const descripcion =
    "Tarea obligatoria diaria completada el " + dos(ahora.getDate()) + "/" + dos(ahora.getMonth() + 1) + "/" +
    ahora.getFullYear() + " a las " + hora + ".\n\n" + t.texto;
  boton.disabled = true;
  setEstado(tdEstado, "Anotando en el Diario…");
  try {
    await llamarNotas("diario_agregar", { id: tdNuevoId(), nombre, fecha, descripcion, terminado: "Tarea finalizada" });
    tdGuardarHecha(t.id, fecha + " " + hora);
    diCargados = false; // el Diario se vuelve a leer al entrar y ya trae la nueva anotación
    if (tdSonando && tdSonando.id === t.id) tdParar();
    setEstado(tdEstado, "Completada ✓ (ya está en el Diario, hoy a las " + hora + ")", "ok");
    dibujarTareasDiarias();
  } catch (e) {
    boton.disabled = false;
    setEstado(tdEstado, "Error: " + e.message + " — puedes volver a intentarlo", "error");
  }
}

// ----- Alarma real del Reloj de Android (solo se puede crear de una vez; no se repite sola cada día) -----
function tdPonerEnReloj(t) {
  const p = t.hora.split(":").map(Number);
  window.location.href =
    "intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=" + p[0] +
    ";i.android.intent.extra.alarm.MINUTES=" + p[1] +
    ";S.android.intent.extra.alarm.MESSAGE=" + encodeURIComponent(t.texto.slice(0, 60)) +
    ";B.android.intent.extra.alarm.SKIP_UI=true;end";
  setEstado(tdEstado, "Se pidió la alarma al Reloj del celular. Revisa en la app Reloj que haya quedado (suena solo una vez).", "ok");
}

// ----- Alarma dentro de la app (suena mientras la app esté abierta) -----
let tdAudio = null;
let tdSonando = null; // la tarea que está sonando
let tdTimerSonido = null;
let tdTimerAviso = null;
let tdPospuestas = {}; // idTarea -> momento (ms) en que vuelve a sonar
let tdWake = null;

// Los navegadores solo dejan sonar después de que la persona toca la pantalla al menos una vez
function tdDesbloquearAudio() {
  try {
    if (!tdAudio) tdAudio = new (window.AudioContext || window.webkitAudioContext)();
    if (tdAudio.state === "suspended") tdAudio.resume();
  } catch (e) {}
}
["pointerdown", "touchstart", "keydown"].forEach((ev) => document.addEventListener(ev, tdDesbloquearAudio, { passive: true }));

function tdPitido() {
  if (!tdAudio || tdAudio.state !== "running") return;
  const t0 = tdAudio.currentTime;
  for (let i = 0; i < 3; i++) {
    const o = tdAudio.createOscillator();
    const g = tdAudio.createGain();
    const ini = t0 + i * 0.22;
    o.type = "square";
    o.frequency.value = i % 2 ? 988 : 880;
    g.gain.setValueAtTime(0.0001, ini);
    g.gain.exponentialRampToValueAtTime(0.6, ini + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ini + 0.18);
    o.connect(g);
    g.connect(tdAudio.destination);
    o.start(ini);
    o.stop(ini + 0.2);
  }
}

function tdVibrar() {
  try { if (navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 300]); } catch (e) {}
}

// Aviso del sistema (cuando la app está en segundo plano). En Android hay que mostrarlo desde el service worker.
async function tdNotificar(t) {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted" || !navigator.serviceWorker) return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    await reg.showNotification("⏰ " + t.hora + " · " + t.texto, {
      body: "Toca para abrir la app y desactivar la alarma",
      tag: "polo-alarma-" + t.id,
      renotify: true,
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500],
    });
  } catch (e) {}
}
async function tdQuitarNotificaciones() {
  if (esAppNativa()) nativo("LocalNotifications", "removeAllDeliveredNotifications").catch(() => {});
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    (await reg.getNotifications()).forEach((n) => { if (n.tag && n.tag.indexOf("polo-alarma-") === 0) n.close(); });
  } catch (e) {}
}

function tdVentanaAlarma() {
  let v = document.getElementById("td-alarma");
  if (v) return v;
  v = document.createElement("div");
  v.id = "td-alarma";
  v.className = "td-alarma";
  v.setAttribute("role", "alertdialog");
  v.setAttribute("aria-modal", "true");
  const caja = document.createElement("div");
  caja.className = "td-alarma-caja";
  const ic = document.createElement("div");
  ic.className = "td-alarma-icono";
  ic.textContent = "⏰";
  const h = document.createElement("h3");
  h.id = "td-alarma-hora";
  const p = document.createElement("p");
  p.id = "td-alarma-texto";
  const aviso = document.createElement("p");
  aviso.id = "td-alarma-aviso";
  aviso.className = "td-alarma-aviso";
  aviso.textContent = "🔇 El navegador bloqueó el sonido: toca cualquier parte de la pantalla para activarlo.";
  aviso.hidden = true;
  const parar = document.createElement("button");
  parar.type = "button";
  parar.className = "td-alarma-parar";
  parar.textContent = "⏹ Desactivar";
  parar.addEventListener("click", tdParar);
  const pos = document.createElement("button");
  pos.type = "button";
  pos.textContent = "💤 Posponer 5 min";
  pos.addEventListener("click", tdPosponer);
  const ok = document.createElement("button");
  ok.type = "button";
  ok.id = "td-alarma-ok";
  ok.textContent = "✅ Completar";
  ok.addEventListener("click", () => { if (tdSonando) completarTareaDiaria(tdSonando, ok); });
  caja.append(ic, h, p, aviso, parar, pos, ok);
  v.appendChild(caja);
  document.body.appendChild(v);
  return v;
}

function tdSonar(t) {
  if (tdSonando) return;
  tdSonando = t;
  tdEscribir(CLAVE_TD_SONADAS, t.id, tdHoyClave());
  const v = tdVentanaAlarma();
  document.getElementById("td-alarma-hora").textContent = t.hora;
  document.getElementById("td-alarma-texto").textContent = t.texto;
  document.getElementById("td-alarma-ok").disabled = false;
  v.hidden = false;
  try { if (window.poloEscritorio) window.poloEscritorio.alarmaSonando(t.hora + " · " + t.texto); } catch (e) {} // app de Windows: trae la ventana al frente
  const ciclo = () => {
    tdPitido();
    tdVibrar();
    document.getElementById("td-alarma-aviso").hidden = !!tdAudio && tdAudio.state === "running";
  };
  ciclo();
  tdTimerSonido = setInterval(ciclo, 1100);
  tdNotificar(t);
  tdTimerAviso = setInterval(() => { if (document.hidden) tdNotificar(t); }, 20000); // si sigue sin atenderse, se vuelve a avisar
}

function tdParar() {
  clearInterval(tdTimerSonido);
  clearInterval(tdTimerAviso);
  tdTimerSonido = tdTimerAviso = null;
  try { if (navigator.vibrate) navigator.vibrate(0); } catch (e) {}
  const v = document.getElementById("td-alarma");
  if (v) v.hidden = true;
  tdSonando = null;
  try { if (window.poloEscritorio) window.poloEscritorio.alarmaTerminada(); } catch (e) {}
  tdQuitarNotificaciones();
}
function tdPosponer() {
  if (!tdSonando) return;
  tdPospuestas[tdSonando.id] = Date.now() + 5 * 60 * 1000;
  tdParar();
  setEstado(tdEstado, "Alarma pospuesta 5 minutos 💤", "ok");
}

// Revisa si toca alguna alarma: la de hoy que no haya sonado ni esté completada (se acepta hasta 15 minutos de retraso)
function tdRevisarAlarmas() {
  tdNativasSync(); // app de Android: mantiene las alarmas del sistema al día con la lista de tareas
  if (!sesionVigente() || tdSonando) return;
  const ahora = new Date();
  const hoy = tdHoyClave();
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const sonadas = tdLeer(CLAVE_TD_SONADAS);
  const hechas = tdLeerHechas();
  const ordenadas = tdOrdenadas();
  for (let i = 0; i < ordenadas.length; i++) {
    const t = ordenadas[i];
    if (!tdSuenaAqui(t)) continue;
    if (hechas[t.id] && hechas[t.id].slice(0, 10) === hoy) continue;
    if (tdPospuestas[t.id]) {
      if (Date.now() >= tdPospuestas[t.id]) { delete tdPospuestas[t.id]; tdSonar(t); return; }
      continue;
    }
    if (sonadas[t.id] === hoy) continue;
    const p = t.hora.split(":").map(Number);
    const tmin = p[0] * 60 + p[1];
    if (min >= tmin && min <= tmin + 15) { tdSonar(t); return; }
  }
}
setInterval(tdRevisarAlarmas, 15000);

// Mantener la pantalla encendida mientras la app está abierta (opcional; gasta batería)
async function tdAplicarPantalla() {
  try {
    if (!("wakeLock" in navigator)) return;
    const quiere = localStorage.getItem(CLAVE_TD_PANTALLA) === "1";
    if (quiere && !tdWake && document.visibilityState === "visible") {
      tdWake = await navigator.wakeLock.request("screen");
      tdWake.addEventListener("release", () => { tdWake = null; });
    } else if (!quiere && tdWake) {
      await tdWake.release();
      tdWake = null;
    }
  } catch (e) {}
}
document.addEventListener("visibilitychange", () => {
  tdAplicarPantalla();
  if (document.visibilityState === "visible") tdRevisarAlarmas();
});

// Botón «Activar alarmas en este dispositivo»: desbloquea el sonido y pide permiso para avisos
document.getElementById("td-activar").addEventListener("click", async () => {
  tdDesbloquearAudio();
  tdPitido();
  tdVibrar();
  let permiso = "no disponible";
  try { if ("Notification" in window) permiso = await Notification.requestPermission(); } catch (e) {}
  if (esAppNativa()) {
    try { permiso = await nativoPermisoNotif(); } catch (e) {}
    await tdNativasSync(true);
  }
  tdInfo.textContent = esAppNativa()
    ? (permiso === "granted"
      ? "🔔 Alarmas programadas en el sistema: suenan todos los días a su hora aunque la app esté cerrada o la pantalla apagada. Si alguna no suena, en Ajustes del celular → Apps → Polo AI → Batería, elige «Sin restricciones»."
      : "⚠️ Falta el permiso de notificaciones: actívalo en Ajustes del celular → Apps → Polo AI → Notificaciones.")
    :
    "🔔 Alarmas listas en este " + (TD_ES_ANDROID ? "celular Android" : "dispositivo") + ". Avisos en segundo plano: " +
    (permiso === "granted" ? "permitidos" : "no permitidos (" + permiso + ")") +
    ". Deja la app abierta: con la pantalla apagada o la app cerrada el celular no la deja sonar.";
});
const tdPantalla = document.getElementById("td-pantalla");
tdPantalla.checked = localStorage.getItem(CLAVE_TD_PANTALLA) === "1";
tdPantalla.addEventListener("change", () => {
  try { localStorage.setItem(CLAVE_TD_PANTALLA, tdPantalla.checked ? "1" : "0"); } catch (e) {}
  tdAplicarPantalla();
});
tdAplicarPantalla();

function actualizarPanelTareas() {
  if (!sesionVigente()) {
    // Sin sesión no se guardan datos en pantalla
    tdCargadas = false;
    tareasDiarias = [];
    if (tdSonando) tdParar();
  } else if (!tdCargadas && !tdCargando) {
    cargarTareasDiarias(); // también en segundo plano, para que las alarmas funcionen sin abrir esta página
  }
  if (panelTd.hidden) return;
  const dentro = sesionVigente();
  tdSinSesion.hidden = dentro;
  tdContenido.hidden = !dentro;
  dibujarTareasDiarias();
}

// Se llama al entrar a la página (desde mostrarSeccion); siempre vuelve a leer por si cambió en otro dispositivo
function entrarTareas() {
  panelTd.hidden = false;
  tdCargadas = false;
  dibujarTareasDiarias();
  actualizarPanelTareas();
  if (sesionVigente() && !tdCargando) cargarTareasDiarias();
}

// Las tareas se vuelven a leer cada 10 minutos (por si se cambiaron desde otro dispositivo)
setInterval(() => { if (sesionVigente() && !tdCargando && !tdSonando) cargarTareasDiarias(); }, 10 * 60 * 1000);

tdAgregar.addEventListener("click", agregarTareaDiaria);
tdNuevo.addEventListener("keydown", (e) => { if (e.key === "Enter") agregarTareaDiaria(); });
document.getElementById("td-actualizar").addEventListener("click", () => {
  if (sesionVigente()) cargarTareasDiarias().then(() => dibujarTareasDiarias());
  else actualizarPanelTareas();
});
document.getElementById("td-ir-login").addEventListener("click", abrirLateral);

// ---------- Notario: una zona de notas dentro de una zona de notas ----------
// Un Notario tiene nombre y descripción, y guarda varias notas por separado dentro de UN archivo .txt de
// Google Drive (carpeta «notaslargas»; la hoja «Notarios» solo guarda su link). Así ya no pesa el límite de
// 50,000 caracteres de una celda de Google Sheets. Cada Notario muestra un medidor y avisa cuando queda poco
// espacio; al llegar al tope ya no deja agregar más (debe ser igual a LIMITE_NOTARIO del Apps Script).
// Se puede crear desde cualquiera de estas zonas (la clave debe estar también en ZONAS_NOTARIO del Apps Script).
// El formato de la celda y las reglas de limpieza deben ser iguales a los del Apps Script.
const NT_LIMITE = 1000000; // tope de caracteres por notario guardado en Drive (igual a LIMITE_NOTARIO del Apps Script)
const NT_LIMITE_SHEETS = 50000; // tope de un notario guardado en Google Sheets (una celda; igual a LIMITE_NOTARIO_SHEETS)
const NT_AVISO = 900000; // desde aquí: «queda poco espacio» (90 %)
const NT_CRITICO = 980000; // desde aquí: «casi lleno» (98 %)
const NT_SEPARADOR = "\n~~~✂~~~\n";
const NT_MARCA = "~~~✂~~~";

var NT = { lista: [], cargados: false, cargando: false, montajes: [], abierto: null, zonaNueva: null, editandoNota: null };

const ntFmt = (n) => Number(n).toLocaleString("es-MX");
const ntLimpiar = (t) => String(t || "").split(NT_MARCA).join("~~✂~~").trim();
const ntNuevoId = () => String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
// Largo EXACTO que tendrá la celda (con encabezados y separadores), tal como lo calcula el Apps Script
function ntLargo(notas) {
  return notas.map((n) => "#" + n.id + "|" + n.fecha + "\n" + n.texto).join(NT_SEPARADOR).length;
}
// Tope de un notario: depende de dónde se guarda (Sheets: una celda; Drive: archivo .txt)
const ntLimiteDe = (n) => (n && n.limite) || (n && n.destino === "sheets" ? NT_LIMITE_SHEETS : NT_LIMITE);
function ntNivel(largo, limite) {
  const tope = limite || NT_LIMITE;
  return largo >= tope * 0.98 ? "critico" : largo >= tope * 0.9 ? "aviso" : "ok";
}
const ntNombreDestino = (n) => (n && n.destino === "sheets" ? "Google Sheets" : "Google Drive");
const ntPorId = (id) => NT.lista.find((n) => n.id === id) || null;

// ----- Ventana del notario (una sola, compartida por todas las zonas) -----
const ntModal = document.createElement("div");
ntModal.className = "nt-modal";
ntModal.hidden = true;
ntModal.innerHTML = `
  <div class="nt-caja" role="dialog" aria-modal="true" aria-labelledby="nt-titulo">
    <div class="nt-cab">
      <h3 id="nt-titulo" class="nt-titulo">Nuevo notario</h3>
      <button type="button" class="nt-cerrar" aria-label="Cerrar" title="Cerrar">&times;</button>
    </div>
    <div class="nt-datos">
      <label class="nt-campo">
        <span>Nombre</span>
        <input class="nt-nombre" type="text" maxlength="80" placeholder="Nombre del notario" autocomplete="off" />
      </label>
      <label class="nt-campo">
        <span>Descripción</span>
        <textarea class="nt-desc" rows="3" maxlength="5000" placeholder="¿Para qué es este notario?"></textarea>
      </label>
      <label class="nt-campo nt-campo-destino" hidden>
        <span>Guardar en</span>
        <select class="nt-destino">
          <option value="sheets">Google Sheets (hoja Notarios · hasta 50,000 caracteres)</option>
          <option value="drive">Google Drive (archivo .txt en notaslargas · hasta 1,000,000)</option>
        </select>
      </label>
      <div class="nt-fila">
        <button type="button" class="notas-btn nt-guardar-datos">Crear notario</button>
        <button type="button" class="notas-btn nt-borrar-notario" hidden>Eliminar notario</button>
        <span class="notas-estado nt-estado-datos"></span>
      </div>
    </div>
    <div class="nt-notas" hidden>
      <div class="nt-medidor nt-ok">
        <div class="nt-medidor-texto">
          <strong class="nt-uso"></strong>
          <span class="nt-resta"></span>
        </div>
        <div class="nt-medidor-barra"><i></i></div>
        <p class="nt-mensaje" hidden></p>
      </div>
      <div class="nt-nueva">
        <textarea class="nt-texto" rows="4" placeholder="Escribe una nota nueva…" aria-label="Nueva nota del notario"></textarea>
        <div class="nt-fila">
          <button type="button" class="notas-btn nt-agregar">Agregar nota</button>
          <span class="nt-contador"></span>
        </div>
        <span class="notas-estado nt-estado-nota"></span>
      </div>
      <h4 class="nt-lista-titulo"></h4>
      <div class="nt-lista"></div>
    </div>
  </div>`;
document.body.appendChild(ntModal);

const ntq = (s) => ntModal.querySelector(s);
const ntEl = {
  titulo: ntq(".nt-titulo"),
  nombre: ntq(".nt-nombre"),
  desc: ntq(".nt-desc"),
  destino: ntq(".nt-destino"),
  guardarDatos: ntq(".nt-guardar-datos"),
  borrarNotario: ntq(".nt-borrar-notario"),
  estadoDatos: ntq(".nt-estado-datos"),
  notas: ntq(".nt-notas"),
  medidor: ntq(".nt-medidor"),
  uso: ntq(".nt-uso"),
  resta: ntq(".nt-resta"),
  barra: ntq(".nt-medidor-barra i"),
  aviso: ntq(".nt-mensaje"),
  texto: ntq(".nt-texto"),
  agregar: ntq(".nt-agregar"),
  contador: ntq(".nt-contador"),
  estadoNota: ntq(".nt-estado-nota"),
  listaTitulo: ntq(".nt-lista-titulo"),
  lista: ntq(".nt-lista"),
};

const migNt = montarMigrar(ntEl.destino, {
  accion: "notario_migrar",
  obtener: () => ntPorId(NT.abierto),
  estado: ntEl.estadoDatos,
  siempre: true,
  listo: (n) => {
    n.limite = NT_LIMITE;
    ntDibujarMedidor(n);
    ntDibujarTodo();
  },
});

// Medidor de caracteres del notario abierto (con el aviso de poco espacio)
function ntDibujarMedidor(n) {
  const largo = ntLargo(n.notas);
  const lim = ntLimiteDe(n);
  const resta = Math.max(0, lim - largo);
  const nivel = ntNivel(largo, lim);
  ntEl.medidor.className = "nt-medidor nt-" + nivel;
  ntEl.uso.textContent = ntFmt(largo) + " / " + ntFmt(lim) + " caracteres · " + ntNombreDestino(n);
  ntEl.resta.textContent = "quedan " + ntFmt(resta);
  ntEl.barra.style.width = Math.min(100, (largo / lim) * 100).toFixed(1) + "%";
  if (nivel === "ok") {
    ntEl.aviso.hidden = true;
  } else {
    ntEl.aviso.hidden = false;
    ntEl.aviso.textContent =
      resta === 0
        ? "🚫 Este notario está lleno. Ya no caben más notas: elimina o acorta alguna, o crea otro notario."
        : nivel === "critico"
        ? "🚫 Casi lleno: solo quedan " + ntFmt(resta) + " caracteres. Crea otro notario para seguir anotando."
        : "⚠️ Queda poco espacio: solo quedan " + ntFmt(resta) + " caracteres en este notario.";
  }
}

// Contador de la nota que se está escribiendo: cuánto ocupará y si cabe
function ntActualizarContador() {
  const n = ntPorId(NT.abierto);
  if (!n) return;
  const texto = ntLimpiar(ntEl.texto.value);
  if (!texto) {
    ntEl.contador.textContent = "";
    ntEl.contador.className = "nt-contador";
    ntEl.agregar.disabled = false;
    return;
  }
  const total = ntLargo(n.notas.concat([{ id: "0000000000000000", fecha: selloFechaHora(), texto }]));
  const lim = ntLimiteDe(n);
  const sobran = total - lim;
  if (sobran > 0) {
    ntEl.contador.textContent = "No cabe: te pasas por " + ntFmt(sobran) + " caracteres";
    ntEl.contador.className = "nt-contador nt-contador-error";
    ntEl.agregar.disabled = true;
  } else {
    ntEl.contador.textContent = "Con esta nota: " + ntFmt(total) + " / " + ntFmt(lim);
    ntEl.contador.className = "nt-contador" + (ntNivel(total, lim) === "ok" ? "" : " nt-contador-aviso");
    ntEl.agregar.disabled = false;
  }
}

// Lista de notas del notario abierto (la más reciente arriba)
function ntDibujarNotas() {
  const n = ntPorId(NT.abierto);
  if (!n) return;
  ntDibujarMedidor(n);
  ntActualizarContador();
  ntEl.listaTitulo.textContent = n.notas.length ? "Notas (" + n.notas.length + ")" : "";
  ntEl.lista.innerHTML = "";
  if (!n.notas.length) {
    const p = document.createElement("p");
    p.className = "notas-vacio";
    p.textContent = "Aún no hay notas en este notario. ¡Agrega la primera! ✨";
    ntEl.lista.appendChild(p);
    return;
  }
  n.notas
    .slice()
    .reverse()
    .forEach((nota) => ntEl.lista.appendChild(ntCrearNota(n, nota)));
}

function ntCrearNota(n, nota) {
  const caja = document.createElement("div");
  caja.className = "nt-nota";
  const fecha = document.createElement("div");
  fecha.className = "nt-nota-fecha";
  fecha.textContent = nota.fecha || "";

  if (NT.editandoNota === nota.id) {
    const ta = document.createElement("textarea");
    ta.className = "nt-nota-edit";
    ta.rows = 4;
    ta.value = nota.texto;
    const estado = document.createElement("span");
    estado.className = "notas-estado";
    const fila = document.createElement("div");
    fila.className = "nt-fila";
    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "notas-btn";
    ok.textContent = "Guardar cambios";
    const no = document.createElement("button");
    no.type = "button";
    no.className = "notas-btn notas-btn-sec";
    no.textContent = "Cancelar";
    fila.append(ok, no, estado);
    const contador = document.createElement("div");
    contador.className = "nt-contador";
    const revisar = () => {
      const t = ntLimpiar(ta.value);
      const otras = n.notas.map((x) => (x.id === nota.id ? { id: x.id, fecha: x.fecha, texto: t } : x));
      const sobran = ntLargo(otras) - ntLimiteDe(n);
      ok.disabled = !t || sobran > 0;
      contador.textContent = sobran > 0 ? "No cabe: te pasas por " + ntFmt(sobran) + " caracteres" : "";
      contador.className = "nt-contador" + (sobran > 0 ? " nt-contador-error" : "");
    };
    ta.addEventListener("input", revisar);
    no.addEventListener("click", () => {
      NT.editandoNota = null;
      ntDibujarNotas();
    });
    ok.addEventListener("click", async () => {
      const t = ntLimpiar(ta.value);
      if (!t) return;
      ok.disabled = true;
      setEstado(estado, "Guardando…");
      try {
        await llamarNotas("notario_nota_guardar", { id: n.id, notaId: nota.id, fecha: nota.fecha, texto: t });
        nota.texto = t;
        NT.editandoNota = null;
        ntDibujarNotas();
        ntDibujarTodo();
      } catch (e) {
        setEstado(estado, "Error: " + e.message, "error");
        ok.disabled = false;
      }
    });
    caja.append(fecha, ta, contador, fila);
    setTimeout(() => ta.focus(), 0);
    return caja;
  }

  const texto = document.createElement("p");
  texto.className = "nt-nota-texto";
  texto.textContent = nota.texto;
  const botones = document.createElement("div");
  botones.className = "nt-nota-botones";
  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "nt-nota-btn";
  editar.title = "Editar nota";
  editar.setAttribute("aria-label", "Editar nota");
  editar.textContent = "✎";
  editar.addEventListener("click", () => {
    NT.editandoNota = nota.id;
    ntDibujarNotas();
  });
  const borrar = document.createElement("button");
  borrar.type = "button";
  borrar.className = "nt-nota-btn";
  borrar.title = "Eliminar nota";
  borrar.setAttribute("aria-label", "Eliminar nota");
  borrar.textContent = "×";
  borrar.addEventListener("click", async () => {
    if (!window.confirm("¿Eliminar esta nota del notario?")) return;
    setEstado(ntEl.estadoNota, "Eliminando…");
    try {
      await llamarNotas("notario_nota_borrar", { id: n.id, notaId: nota.id });
      n.notas = n.notas.filter((x) => x.id !== nota.id);
      setEstado(ntEl.estadoNota, "Nota eliminada", "ok");
      ntDibujarNotas();
      ntDibujarTodo();
    } catch (e) {
      setEstado(ntEl.estadoNota, "Error: " + e.message, "error");
    }
  });
  botones.append(editar, borrar);
  caja.append(fecha, texto, botones);
  return caja;
}

// ----- Abrir / cerrar la ventana -----
function ntAbrirNuevo(zona) {
  NT.abierto = null;
  NT.zonaNueva = zona;
  NT.editandoNota = null;
  ntEl.titulo.textContent = "Nuevo notario";
  ntEl.nombre.value = "";
  ntEl.desc.value = "";
  ntEl.destino.value = "drive";
  ntEl.destino.disabled = false;
  migNt.actualizar(null);
  ntEl.guardarDatos.textContent = "Crear notario";
  ntEl.borrarNotario.hidden = true;
  ntEl.notas.hidden = true;
  setEstado(ntEl.estadoDatos, "");
  ntModal.hidden = false;
  ntEl.nombre.focus();
}
function ntAbrir(n) {
  NT.abierto = n.id;
  NT.zonaNueva = null;
  NT.editandoNota = null;
  ntEl.titulo.textContent = "📒 Notario";
  ntEl.nombre.value = n.nombre === "Sin nombre" ? "" : n.nombre;
  ntEl.desc.value = n.descripcion || "";
  ntEl.destino.value = n.destino === "sheets" ? "sheets" : "drive";
  ntEl.destino.disabled = true; // el lugar se elige al crear el notario
  migNt.actualizar(n);
  ntEl.guardarDatos.textContent = "Guardar nombre y descripción";
  ntEl.borrarNotario.hidden = false;
  ntEl.notas.hidden = false;
  ntEl.texto.value = "";
  setEstado(ntEl.estadoDatos, "");
  setEstado(ntEl.estadoNota, "");
  ntModal.hidden = false;
  ntDibujarNotas();
  if (!n.notas.length) ntEl.texto.focus();
}
function ntCerrar(forzar) {
  if (ntModal.hidden) return;
  if (!forzar && ntEl.texto.value.trim() && !window.confirm("Tienes una nota sin agregar. ¿Cerrar y descartarla?")) return;
  ntModal.hidden = true;
  NT.abierto = null;
  NT.zonaNueva = null;
  NT.editandoNota = null;
  ntEl.texto.value = "";
}

// ----- Crear el notario / cambiar nombre y descripción -----
async function ntGuardarDatos() {
  const nombre = ntEl.nombre.value.trim();
  const descripcion = ntEl.desc.value.trim();
  if (!nombre) {
    setEstado(ntEl.estadoDatos, "Ponle un nombre al notario", "error");
    ntEl.nombre.focus();
    return;
  }
  ntEl.guardarDatos.disabled = true;
  setEstado(ntEl.estadoDatos, "Guardando…");
  try {
    const existente = ntPorId(NT.abierto);
    if (existente) {
      await llamarNotas("notario_editar", { id: existente.id, nombre, descripcion });
      existente.nombre = nombre;
      existente.descripcion = descripcion;
      setEstado(ntEl.estadoDatos, "Guardado ✓", "ok");
    } else {
      const destino = "drive"; // todo se guarda en Drive
      const nuevo = { id: ntNuevoId(), zona: NT.zonaNueva, nombre, descripcion, fecha: selloFechaHora(), destino, limite: destino === "sheets" ? NT_LIMITE_SHEETS : NT_LIMITE, notas: [] };
      await llamarNotas("notario_agregar", { id: nuevo.id, zona: nuevo.zona, nombre, descripcion, fecha: nuevo.fecha, destino });
      NT.lista.push(nuevo);
      ntAbrir(nuevo); // ya creado: ahora se pueden agregar notas dentro
      setEstado(ntEl.estadoDatos, "Notario creado ✓", "ok");
    }
    ntDibujarTodo();
  } catch (e) {
    setEstado(ntEl.estadoDatos, "Error: " + e.message, "error");
  } finally {
    ntEl.guardarDatos.disabled = false;
  }
}

async function ntBorrarNotario() {
  const n = ntPorId(NT.abierto);
  if (!n) return;
  const cuantas = n.notas.length;
  const aviso =
    "¿Eliminar el notario «" + n.nombre + "»" +
    (cuantas ? " junto con sus " + cuantas + (cuantas === 1 ? " nota" : " notas") : "") +
    "? No se puede deshacer.";
  if (!window.confirm(aviso)) return;
  ntEl.borrarNotario.disabled = true;
  setEstado(ntEl.estadoDatos, "Eliminando…");
  try {
    await llamarNotas("notario_borrar", { id: n.id });
    NT.lista = NT.lista.filter((x) => x.id !== n.id);
    ntCerrar(true);
    ntDibujarTodo();
  } catch (e) {
    setEstado(ntEl.estadoDatos, "Error: " + e.message, "error");
  } finally {
    ntEl.borrarNotario.disabled = false;
  }
}

// ----- Agregar una nota dentro del notario abierto -----
async function ntAgregarNota() {
  const n = ntPorId(NT.abierto);
  if (!n) return;
  const texto = ntLimpiar(ntEl.texto.value);
  if (!texto) {
    setEstado(ntEl.estadoNota, "Escribe algo primero", "error");
    return;
  }
  const nota = { id: ntNuevoId(), fecha: selloFechaHora(), texto };
  const sobran = ntLargo(n.notas.concat([nota])) - ntLimiteDe(n);
  if (sobran > 0) {
    setEstado(ntEl.estadoNota, "No cabe: te pasas por " + ntFmt(sobran) + " caracteres", "error");
    return;
  }
  ntEl.agregar.disabled = true;
  setEstado(ntEl.estadoNota, "Guardando…");
  try {
    await llamarNotas("notario_nota_guardar", { id: n.id, notaId: nota.id, fecha: nota.fecha, texto: nota.texto });
    n.notas.push(nota);
    ntEl.texto.value = "";
    ntDibujarNotas();
    ntDibujarTodo();
    const restan = ntLimiteDe(n) - ntLargo(n.notas);
    setEstado(
      ntEl.estadoNota,
      ntNivel(ntLargo(n.notas), ntLimiteDe(n)) === "ok" ? "Nota agregada ✓" : "Nota agregada ✓ — ¡queda poco espacio! (" + ntFmt(restan) + " caracteres)",
      "ok"
    );
  } catch (e) {
    setEstado(ntEl.estadoNota, "Error: " + e.message, "error");
  } finally {
    ntEl.agregar.disabled = false;
    ntActualizarContador();
  }
}

ntq(".nt-cerrar").addEventListener("click", () => ntCerrar(false));
ntModal.addEventListener("click", (e) => {
  if (e.target === ntModal) ntCerrar(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !ntModal.hidden) ntCerrar(false);
});
ntEl.guardarDatos.addEventListener("click", ntGuardarDatos);
ntEl.borrarNotario.addEventListener("click", ntBorrarNotario);
ntEl.agregar.addEventListener("click", ntAgregarNota);
ntEl.texto.addEventListener("input", ntActualizarContador);
ntEl.nombre.addEventListener("keydown", (e) => {
  if (e.key === "Enter") ntGuardarDatos();
});

// ----- Crear un notario desde el formulario de «Nueva nota» (opción Nota / Notario) -----
// Devuelve el notario creado (o null si falló o faltó el nombre). Lo escrito en el área de texto es su descripción.
async function ntCrearDesdeFormulario(zona, nombreCrudo, descripcionCruda, destinoCrudo, boton, estadoEl) {
  const nombre = String(nombreCrudo || "").trim();
  const descripcion = String(descripcionCruda || "").trim();
  if (!nombre) {
    setEstado(estadoEl, "Ponle un nombre al notario", "error");
    return null;
  }
  if (descripcion.length > 5000) {
    setEstado(estadoEl, "La descripción del notario admite hasta 5,000 caracteres (llevas " + ntFmt(descripcion.length) + ")", "error");
    return null;
  }
  const destino = "drive"; // todo se guarda en Drive
  const nuevo = { id: ntNuevoId(), zona, nombre, descripcion, fecha: selloFechaHora(), destino, limite: destino === "sheets" ? NT_LIMITE_SHEETS : NT_LIMITE, notas: [] };
  boton.disabled = true;
  setEstado(estadoEl, "Creando notario…");
  try {
    await llamarNotas("notario_agregar", { id: nuevo.id, zona, nombre, descripcion, fecha: nuevo.fecha, destino });
    NT.lista.push(nuevo);
    ntDibujarTodo();
    setEstado(estadoEl, "");
    return nuevo;
  } catch (e) {
    setEstado(estadoEl, "Error: " + e.message, "error");
    return null;
  } finally {
    boton.disabled = false;
  }
}

// Ajusta un formulario de nota según el tipo elegido (nota o notario): oculta lo que un notario no usa
function ntAplicarTipoForm(form, tipoSel, destinoSel, nombreInp, textoTa, guardarBtn, textoGuardarNota) {
  const esNotario = tipoSel.value === "notario";
  form.querySelectorAll(".notas-superior, .notas-campos-par").forEach((el) => (el.hidden = esNotario));
  nombreInp.placeholder = esNotario ? "Nombre del notario" : "Nombre de la nota";
  textoTa.placeholder = esNotario ? "Descripción del notario (¿para qué es?)…" : "Escribe una nota nueva…";
  guardarBtn.textContent = esNotario ? "Crear notario" : textoGuardarNota;
  const op = destinoSel.options;
  if (op.length >= 2) {
    op[0].textContent = esNotario ? "Google Sheets (hoja Notarios · hasta 50,000 caracteres)" : "Google Sheets (en la hoja Notas)";
    op[1].textContent = esNotario ? "Google Drive (archivo .txt en notaslargas · hasta 1,000,000)" : "Google Drive (archivo .txt en notaslargas)";
  }
}

// ----- Botón «Notario» y cuadritos de cada zona -----
function montarNotario(zona, destino, antes) {
  const caja = document.createElement("div");
  caja.className = "nt-zona";
  caja.innerHTML = `
    <div class="nt-barra">
      <button type="button" class="notas-btn nt-nuevo">📒 + Notario</button>
      <span class="notas-estado nt-estado"></span>
    </div>
    <div class="nt-grid"></div>`;
  destino.insertBefore(caja, antes || null);
  const m = { zona, caja, grid: caja.querySelector(".nt-grid"), estado: caja.querySelector(".nt-estado") };
  caja.querySelector(".nt-nuevo").addEventListener("click", () => ntAbrirNuevo(zona));
  NT.montajes.push(m);
  return m;
}

function ntCrearCuadro(n) {
  const largo = ntLargo(n.notas);
  const lim = ntLimiteDe(n);
  const b = document.createElement("button");
  b.type = "button";
  b.className = "nt-cuadro nt-" + ntNivel(largo, lim);
  b.setAttribute("aria-label", "Abrir el notario " + n.nombre);
  const nombre = document.createElement("span");
  nombre.className = "nt-cuadro-nombre";
  nombre.textContent = "📒 " + n.nombre;
  const desc = document.createElement("span");
  desc.className = "nt-cuadro-desc";
  desc.textContent = n.descripcion ? resumenCorto(n.descripcion, 70) : "Sin descripción";
  const meta = document.createElement("span");
  meta.className = "nt-cuadro-meta";
  const k = n.notas.length;
  meta.textContent =
    k + (k === 1 ? " nota" : " notas") + " · " + ntFmt(largo) + " / " + ntFmt(lim) +
    (n.destino === "sheets" ? " · Sheets" : " · Drive") +
    (ntNivel(largo, lim) !== "ok" ? " ⚠️" : "");
  const barra = document.createElement("span");
  barra.className = "nt-cuadro-barra";
  const relleno = document.createElement("i");
  relleno.style.width = Math.min(100, (largo / lim) * 100).toFixed(1) + "%";
  barra.appendChild(relleno);
  b.append(nombre, desc, meta, barra);
  b.addEventListener("click", () => ntAbrir(n));
  return b;
}

function ntDibujarTodo() {
  NT.montajes.forEach((m) => {
    m.grid.innerHTML = "";
    NT.lista.filter((n) => n.zona === m.zona).forEach((n) => m.grid.appendChild(ntCrearCuadro(n)));
  });
  const n = ntPorId(NT.abierto);
  if (n && !ntModal.hidden && NT.editandoNota === null) ntDibujarNotas();
}

async function ntCargar() {
  if (NT.cargando) return;
  NT.cargando = true;
  NT.montajes.forEach((m) => setEstado(m.estado, "Cargando notarios…"));
  try {
    const j = await llamarNotas("notario_listar");
    NT.lista = (Array.isArray(j.notarios) ? j.notarios : []).map((n) =>
      Object.assign({}, n, { notas: Array.isArray(n.notas) ? n.notas : [] })
    );
    NT.cargados = true;
    NT.montajes.forEach((m) => setEstado(m.estado, ""));
    ntDibujarTodo();
  } catch (e) {
    NT.montajes.forEach((m) => setEstado(m.estado, "Error: " + e.message, "error"));
  } finally {
    NT.cargando = false;
  }
}

// Se llama cuando cambia la sesión o se cambia de página: lee los notarios la primera vez que se ve una zona
function actualizarNotarios() {
  if (typeof NT === "undefined" || !NT || !NT.montajes) return;
  if (!sesionVigente()) {
    NT.cargados = false;
    NT.lista = [];
    ntCerrar(true);
    ntDibujarTodo();
    return;
  }
  if (!NT.cargados && !NT.cargando && NT.montajes.some((m) => m.caja.offsetParent !== null)) ntCargar();
  else ntDibujarTodo();
}

// El botón ↻ de cada zona también vuelve a leer los notarios
function ntRecargarSiHaySesion() {
  if (sesionVigente()) {
    NT.cargados = false;
    ntCargar();
  }
}

// Dónde aparece el botón «+ Notario» en cada zona
(function montarNotariosEnZonas() {
  const zonaEt = (clave) => zonas.find((z) => z.cfg.seccion === clave);
  montarNotario("notas", document.getElementById("notas-contenido"), document.getElementById("notas-lista"));
  ["actividades", "trabajo", "pedidos-yeso"].forEach((clave) => {
    const z = zonaEt(clave);
    montarNotario(clave, z.contenido, z.lista);
  });
  [
    ["ejercicio", "ej-contenido"],
    ["diario", "di-contenido"],
    ["deudas", "de-contenido"],
    ["informacion", "ip-contenido"],
    ["comandos", "cm-contenido"],
    ["bazar", "bz-contenido"],
  ].forEach(([clave, id]) => montarNotario(clave, document.getElementById(id), null));
  ["notas-actualizar", "ej-actualizar", "di-actualizar", "de-actualizar", "ip-actualizar", "cm-actualizar", "bz-actualizar"].forEach((id) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener("click", ntRecargarSiHaySesion);
  });
  document.querySelectorAll(".zona-actualizar").forEach((b) => b.addEventListener("click", ntRecargarSiHaySesion));
})();

dibujarCuenta();
programarCaducidad();
iniciarGoogle();
renovarSesionDispositivo(); // al abrir la página se renueva el pase de este dispositivo

// ---------- Inicio ----------
// Al abrir o recargar la página (F5) el calendario ya aparece en la fecha actual
mostrarSeccion("calendario");
cargarDatos();


// ---------- Instalar en la pantalla de inicio (PWA) ----------
// Chrome/Edge/Android avisan con «beforeinstallprompt»; en iPhone (Safari) no existe ese aviso y se instala a mano desde «Compartir».
(function instalarApp() {
  const boton = document.getElementById("btn-instalar");
  const ayuda = document.getElementById("instalar-ayuda");
  if (!boton || !ayuda) return;

  const yaInstalada = () =>
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (yaInstalada()) return; // dentro de la app instalada el botón no hace falta

  let evento = null;
  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  boton.hidden = false;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    evento = e;
  });
  window.addEventListener("appinstalled", () => {
    evento = null;
    boton.hidden = true;
    ayuda.hidden = true;
  });

  boton.addEventListener("click", async () => {
    if (evento) {
      evento.prompt();
      try { await evento.userChoice; } catch (e) {}
      evento = null;
      return;
    }
    ayuda.textContent = esIOS
      ? "En iPhone/iPad: abre esta página en Safari, toca el botón Compartir (el cuadro con la flecha hacia arriba) y elige «Añadir a pantalla de inicio»."
      : "Abre el menú del navegador (⋮ o ⋯) y elige «Instalar app» o «Añadir a pantalla de inicio». Si no aparece, recarga la página una vez y vuelve a intentarlo.";
    ayuda.hidden = !ayuda.hidden;
  });

  // El service worker es lo que permite que el navegador ofrezca instalar la app
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();


// ---------- Notas hechas sin internet: se suben solas al volver la conexión ----------
// La versión «Sin internet» (sin-internet.html) guarda las notas en este dispositivo (cola «polo-offline-cola»).
// Aquí, con la app principal abierta y con sesión, se suben una por una a Google Drive/Sheets. Una nota solo se quita
// de la cola cuando el Apps Script confirma que ya quedó guardada. El «bloqueo» evita que la página sin internet
// y esta suban lo mismo a la vez.
(function subirPendientesSinInternet() {
  const CLAVE_COLA = "polo-offline-cola";
  const CLAVE_BLOQUEO = "polo-offline-bloqueo";
  let subiendo = false;

  const leer = () => {
    try { return JSON.parse(localStorage.getItem(CLAVE_COLA)) || []; } catch (e) { return []; }
  };
  const guardar = (c) => {
    try { localStorage.setItem(CLAVE_COLA, JSON.stringify(c)); } catch (e) {}
  };
  const bloqueoLibre = () => Date.now() - (+localStorage.getItem(CLAVE_BLOQUEO) || 0) > 90000;
  const marcarBloqueo = () => { try { localStorage.setItem(CLAVE_BLOQUEO, String(Date.now())); } catch (e) {} };
  const soltarBloqueo = () => { try { localStorage.removeItem(CLAVE_BLOQUEO); } catch (e) {} };

  let aviso = null;
  let avisoTimer = null;
  function decir(texto, tipo) {
    if (!aviso) {
      aviso = document.createElement("div");
      aviso.className = "aviso-flotante";
      aviso.setAttribute("role", "status");
      document.body.appendChild(aviso);
    }
    aviso.textContent = texto;
    aviso.classList.toggle("error", tipo === "error");
    aviso.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { aviso.hidden = true; }, 7000);
  }

  async function subir() {
    if (subiendo || !navigator.onLine) return;
    if (!leer().some((x) => !x.error)) return;
    if (!credencialVigente()) return; // sin sesión no se puede subir; se intentará cuando haya
    if (!bloqueoLibre()) return;
    subiendo = true;
    marcarBloqueo();
    let subidas = 0;
    let conError = 0;
    try {
      while (true) {
        const it = leer().find((x) => !x.error);
        if (!it) break;
        decir("Subiendo notas hechas sin internet… (" + (subidas + 1) + ")");
        try {
          await llamarNotasRed(it.accion, it.payload, 30000);
          ofMezclarEnCache(it.accion, it.payload);
          guardar(leer().filter((x) => x.payload.id !== it.payload.id));
          subidas++;
          marcarBloqueo();
        } catch (e) {
          if (!credencialVigente()) break; // la sesión se cerró: las notas se quedan guardadas
          if (e instanceof TypeError || (e && e.name === "AbortError")) break; // se cortó la conexión: se reintenta después
          const c = leer();
          const pos = c.findIndex((x) => x.payload.id === it.payload.id);
          if (pos !== -1) { c[pos].error = e.message || "Error desconocido"; guardar(c); }
          conError++;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
    } finally {
      subiendo = false;
      soltarBloqueo();
    }
    if (subidas) {
      decir("✓ " + subidas + (subidas === 1 ? " nota hecha sin internet ya quedó guardada" : " notas hechas sin internet ya quedaron guardadas") +
        (conError ? " · " + conError + " con error (siguen en la versión sin internet)" : "") + ". Vuelve a abrir la zona para verla.");
    } else if (conError) {
      decir(conError + " nota(s) no se pudieron subir; siguen guardadas en «Sin internet».", "error");
    }
  }

  window.addEventListener("online", () => setTimeout(subir, 1500));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) subir(); });
  setInterval(subir, 60000);
  setTimeout(subir, 3000);
})();
