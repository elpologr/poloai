// Pega este código en tu hoja de Google: Extensiones > Apps Script.
// Primera hoja (calendario), fila 1: A Fecha | B Actividades | C Descripcion | D Anotaciones
// Hoja "Colores" (color de cada día del calendario), fila 1: A Fecha | B Color
// (Color: el nombre de un color pastel o un código "#rrggbb"; se crea sola, no hace falta tocarla)
// Hoja "Notas", fila 1: A Nombre | B Fecha | C Etiqueta | D Nota | E Color | F Id | G Identificador | H Favorito
// (la columna H "Favorito" dice "Sí" en las notas marcadas con la ⭐; es independiente de la etiqueta y se llena sola)
// (Color: el nombre de un color pastel, o un código "#rrggbb" para cualquier otro color)
// (la columna F "Id" la usa la página para poder borrar o editar cada nota;
//  se llena sola, no la borres)
// (la columna G "Identificador" es un número o palabra que tú pones: la página ordena
//  las notas con ella, 1, 2, 3… y luego las palabras de la A a la Z)
// Hoja "Proyectos", fila 1: A Nombre | B Fecha | C Descripcion | D Imagen | E Links | F Id
// (Links: uno por línea dentro de la misma celda; Imagen: la dirección que devuelve imgbb;
//  la columna F "Id" se llena sola, no la borres)
// Hoja "Ejercicio", fila 1: A Nombre | B Fecha | C Descripcion | D Id
// (Fecha: AAAA-MM-DD, el día en que hiciste el ejercicio; la columna D "Id" se llena sola, no la borres)
// Hoja "Diario", fila 1: A Nombre | B Fecha | C Descripcion | D Trabajos terminados | E Id
// (F "Creada" = fecha y hora en que se escribió | G "Modificaciones" = un registro por día en que se editó,
//  separados por " | " | L "Favorito" = "Sí" si tiene la ⭐. Se llenan solas; las H a K son de las deudas.)
// (Fecha: AAAA-MM-DD, el día de la anotación; la columna D dice "Sí" en los trabajos que se
//  marcaron como finalizados; la columna E "Id" se llena sola, no la borres)
// (La columna D también dice "Tarea finalizada" en lo que se dio por finalizado desde el botón Día de Hoy.)
// En esa misma hoja "Diario", columnas H a K, viven las DEUDAS (independientes del Diario, columnas A a E):
//  H Nombre | I Fecha | J Descripcion | K Id  (las columnas F y G quedan libres)
//  (Fecha: AAAA-MM-DD, el día en que se CREÓ la deuda; se anota sola. La K "Id" se llena sola, no la borres.)
//  (Al finalizar una deuda se quita de H-K y pasa al Diario, columnas A-E, con la fecha del día en que se
//   presionó el botón y "Tarea finalizada" en la columna D.)
// En su PROPIA hoja, llamada "Empresas Proyectos" (también vale "Empresas/Proyectos"), columnas A a G, viven las
// EMPRESAS/PROYECTOS (antes estaban en la primera hoja, columnas H a N; se mueven solas a la hoja nueva):
//  A Nombre Empresa/Proyecto | B Fecha Empresa/Proyecto | C Link Empresa/Proyecto | D Imagen Empresa/Proyecto |
//  E Descripcion/Nota Empresa/Proyecto | F zona de links Empresa/Proyecto | G Id Empresa/Proyecto | H Notas
//  (H Notas: las notas personales de cada empresa o proyecto, todas dentro de la misma celda. Cada nota lleva
//   nombre, fecha de creación, fecha de modificación y su destino: "sheets" = el texto vive en esa celda (la celda
//   admite 50,000 caracteres en total) o "drive" = el texto vive en su propio .txt de Drive (hasta 1,000,000
//   caracteres por nota) y en la celda solo queda una marca ☁DRIVE:<Id del archivo>)
//  (Fecha: AAAA-MM-DD; Imagen: la dirección que devuelve imgbb; zona de links: un link por línea dentro de la
//   misma celda; la G "Id" se llena sola, no la borres. Si algún encabezado falta, se escribe solo.)
// Hoja "Informacion Primordial", fila 1: A Nombre | B Fecha | C Descripcion | D Id
// (Fecha: AAAA-MM-DD; la columna D "Id" se llena sola, no la borres)
// Hoja "comandos", fila 1: A Nombre | B Fecha | C Descripcion | D Id
// (Fecha: AAAA-MM-DD; la columna D "Id" se llena sola, no la borres)
// Hoja "Bazar", fila 1: A Nombre | B Informacion | C Categoria | D Id
// (Categoria: solo "Bazar", "Pedidos de Yeso" o "Ventas"; la columna D "Id" se llena sola, no la borres;
//  la hoja se crea sola si no existe. Si tu hoja era de la versión anterior, con la Id en la C, el
//  Apps Script pasa solo las Id a la D y pone "Bazar" en la C de los registros que ya tenías)
// Hoja "Galeria", fila 1: A Imagen | B Descripcion | C Etiqueta | D Id
// (Imagen: la dirección que devuelve imgbb; Descripcion es opcional; la columna D "Id" se llena sola)
// Hoja "Moldes", fila 1: A Imagen | B Descripcion | C Zonas | D Lista | E Id
// (Imagen: link de imgbb; Zonas: una o varias separadas por coma, de Figuras, Religioso, Bases, Macetas, Halloween, Navidad;
//  Lista: todos, tiene-polo, tiene-madre, tiene-fer, dueno-polo, dueno-madre o dueno-fer; la columna E "Id" se llena sola)
// Hoja "Productos Confirmados", fila 1: A Imagen | B Descripcion | C Zonas | D Lista | E Id  (misma estructura que "Moldes"; se crea sola)
// Hojas "Hoja Redes" (hoja 1, principal) y "Hoja Redes 2" (hoja 2, secundaria): misma estructura; se crean solas, fila 1:
//  A Nombre | B Fecha | C Youtube | D Aviso | E Facebook | F Aviso | G Instagram | H Aviso | I TikTok | J Aviso |
//  K Threads | L Aviso | M X | N Aviso | O Whatsapp Community
//  (todo es texto libre; la página la lee y la guarda completa. Si escribes aquí a mano, se ve en la página.)
//  La página puede agregar columnas nuevas (a la derecha de la O, hasta 60) y cambiar las columnas de lugar: la fila 1 guarda
//  los nombres en el orden actual. En la página los nombres salen en una «fila 0» y los datos empiezan en la fila 1.
// TODO EL TEXTO VA A GOOGLE DRIVE: las notas nuevas de todas las zonas guardan su texto en un .txt de la carpeta
//  "notaslargas" y en la celda solo queda la marca ☁DRIVE:<Id>. La fila (nombre, fecha, etiqueta, Id…) sigue en
//  la hoja porque la página la usa como índice. La acción "migrar_drive" pasa a Drive las notas antiguas.
// Hoja "Notarios", fila 1: A Zona | B Nombre | C Descripcion | D Fecha | E Notas | F Id | G Archivo | H Destino
// (H Destino: "sheets" = las notas viven en la celda E (máx. 50,000 caracteres); "drive" = en un .txt de Drive)
// (cada Notario es una fila; sus notas viven en un archivo .txt dentro de la carpeta "notaslargas" de
//  Google Drive: la columna E trae el link y la G el Id del archivo; la hoja se crea sola y las columnas
//  F "Id" y G "Archivo" se llenan solas, no las borres)

// Marca para comprobar que esta versión es la que está publicada
// (abre la URL /exec con ?token=TU_CLAVE y debe aparecer "version").
const VERSION = "drive-y-hoja-redes-7-zonas-miniaturas-subgrupos-orden-notas-favoritas-diario-fechas";

// Cambia este texto por una clave larga que solo tú conozcas.
// Debe ser igual al TOKEN de config.js
const TOKEN = "polodulce";

// Única cuenta de Google que puede MODIFICAR la hoja (guardar o borrar).
const CORREO_AUTORIZADO = "dulceprincesa086@gmail.com";

// ID de cliente de Google de la página (el mismo GOOGLE_CLIENT_ID de config.js).
// Sirve para comprobar que el inicio de sesión se hizo en TU página y no en otra.
const CLIENT_ID = "76727611900-lv1baflcpv7fni9a3op4drbctjnjbkad.apps.googleusercontent.com";

// Clave (API key) de imgbb para subir las imágenes de Proyectos (https://api.imgbb.com/).
// Queda aquí en el Apps Script: la página nunca la ve.
const IMGBB_API_KEY = "6de741b47a17508a336206cd813cf6f5";

const COLUMNAS = { actividades: 2, descripcion: 3, anotaciones: 4 };

// El color de cada día del calendario vive en la hoja "Colores" (si no existe, se crea sola):
// Fecha (AAAA-MM-DD), Color
const NOMBRE_HOJA_COLORES = "Colores";
const ENCABEZADOS_COLORES = ["Fecha", "Color"];

// Las notas viven en su propia hoja, llamada "Notas" (si no existe, se crea sola),
// a partir de la columna A (1), 7 columnas: Nombre, Fecha, Etiqueta, Nota, Color, Id, Identificador
const NOMBRE_HOJA_NOTAS = "Notas";
const COL_NOTAS = 1;
const N_COL_NOTAS = 8;
const ENCABEZADOS_NOTAS = ["Nombre", "Fecha", "Etiqueta", "Nota", "Color", "Id", "Identificador", "Favorito"];

// Los proyectos viven en la hoja "Proyectos" (si no existe, se crea sola):
// Nombre, Fecha, Descripcion, Imagen, Links, Id
const NOMBRE_HOJA_PROYECTOS = "Proyectos";
const N_COL_PROYECTOS = 6;
const ENCABEZADOS_PROYECTOS = ["Nombre", "Fecha", "Descripcion", "Imagen", "Links", "Id"];

// La galería vive en la hoja "Galeria" (si no existe, se crea sola): Imagen, Descripcion, Etiqueta, Id
const NOMBRE_HOJA_GALERIA = "Galeria";
const N_COL_GALERIA = 4;
const ENCABEZADOS_GALERIA = ["Imagen", "Descripcion", "Etiqueta", "Id"];
const ETIQUETAS_GALERIA = ["General", "Programacion", "Contenido Digital", "Perfiles"];

// Etiquetas y colores permitidos (son los mismos que ofrece la página)
const ETIQUETAS_NOTA = [
  "General",
  "Tarea/Actividad",
  "Conjunto de Datos",
  "Sueños",
  "Pendiente Importante",
  "Pedidos de Yeso",
  "Actividades",
  "Trabajo",
  "Nota Importante",
  "Largo Plazo",
];
const COLORES_NOTA = ["Blanco", "Azul", "Rosa", "Menta", "Lila", "Durazno", "Amarillo", "Turquesa"];

// Un color es válido si es uno de los pasteles con nombre o un código "#rrggbb"
function colorValido_(c) {
  return COLORES_NOTA.indexOf(c) !== -1 || /^#[0-9a-fA-F]{6}$/.test(c);
}

// Ejecuta esta función UNA sola vez desde el editor (botón "Ejecutar") para darle al
// script el permiso de conectarse a Google y poder verificar el inicio de sesión.
function autorizarPermisos() {
  UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=prueba", {
    muteHttpExceptions: true,
  });
}

// Comprueba con Google que el token de inicio de sesión es auténtico, vigente,
// fue emitido para esta página y pertenece al correo autorizado.
function verificarGoogle_(idToken) {
  if (!idToken) {
    return { ok: false, error: "Inicia sesión con Google para guardar" };
  }
  let r;
  try {
    r = UrlFetchApp.fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken),
      { muteHttpExceptions: true }
    );
  } catch (err) {
    return { ok: false, error: "No se pudo verificar la sesión de Google" };
  }
  if (r.getResponseCode() !== 200) {
    return { ok: false, error: "Sesión de Google inválida o caducada. Inicia sesión de nuevo" };
  }
  let t;
  try {
    t = JSON.parse(r.getContentText());
  } catch (err) {
    return { ok: false, error: "Respuesta de Google no válida" };
  }
  if (t.aud !== CLIENT_ID) return { ok: false, error: "No autorizado" };
  if (t.iss !== "accounts.google.com" && t.iss !== "https://accounts.google.com") {
    return { ok: false, error: "No autorizado" };
  }
  if (Number(t.exp) * 1000 < Date.now()) {
    return { ok: false, error: "Sesión caducada. Inicia sesión de nuevo" };
  }
  if (String(t.email_verified) !== "true") return { ok: false, error: "No autorizado" };
  if (String(t.email).toLowerCase() !== CORREO_AUTORIZADO.toLowerCase()) {
    return { ok: false, error: "Esta cuenta de Google no tiene permiso para modificar" };
  }
  return { ok: true };
}

// ---------- Sesiones de dispositivo (para que la sesión no se cierre cada hora) ----------
// El token de Google dura solo ~1 hora. Al iniciar sesión con Google, la página pide aquí (acción
// "sesion_crear") un pase propio para ESE dispositivo, que dura VIDA_SESION_DIAS días y se renueva solo
// cada vez que lo usas (si pasan más de RENOVAR_SESION_HORAS horas desde la última renovación). Así,
// mientras uses el dispositivo de vez en cuando, la sesión casi nunca se cierra.
//  - Crear un pase nuevo SIEMPRE exige un inicio de sesión de Google reciente (cuenta autorizada).
//  - En el Apps Script solo se guarda un hash (SHA-256) del pase, nunca el pase mismo (propiedades del
//    script, claves "SES_<hash>"). Se pueden ver y cerrar desde la barra lateral de la página.
//  - Si se pierde un dispositivo: ciérralo desde otro (barra lateral > Dispositivos) o borra las
//    propiedades "SES_..." del script (Configuración del proyecto > Propiedades del script).
const PREFIJO_SESION = "polo_s1.";
const CLAVE_SESION_PROP = "SES_";
const VIDA_SESION_DIAS = 365;
const RENOVAR_SESION_HORAS = 12;
const MAX_SESIONES = 20;

function hashSesion_(token) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8)
    .map(function (b) {
      return ("0" + (b & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

// Verifica el pase de un dispositivo; si sirve, también lo renueva cuando toca
function verificarSesion_(token) {
  const malo = {
    ok: false,
    sesionInvalida: true,
    error: "La sesión de este dispositivo ya no es válida. Inicia sesión de nuevo",
  };
  const props = PropertiesService.getScriptProperties();
  const hash = hashSesion_(token);
  const clave = CLAVE_SESION_PROP + hash;
  const raw = props.getProperty(clave);
  if (!raw) return malo;
  let ses;
  try {
    ses = JSON.parse(raw);
  } catch (err) {
    props.deleteProperty(clave);
    return malo;
  }
  const ahora = Date.now();
  if (
    !ses ||
    Number(ses.exp) < ahora ||
    String(ses.correo).toLowerCase() !== CORREO_AUTORIZADO.toLowerCase()
  ) {
    props.deleteProperty(clave);
    return malo;
  }
  if (ahora - Number(ses.ultimo) > RENOVAR_SESION_HORAS * 3600 * 1000) {
    ses.ultimo = ahora;
    ses.exp = ahora + VIDA_SESION_DIAS * 86400 * 1000;
    props.setProperty(clave, JSON.stringify(ses));
  }
  return { ok: true, tipo: "dispositivo", hash: hash, exp: ses.exp };
}

// Acepta el pase de un dispositivo o, si no lo es, un token de Google
function verificarCredencial_(cred) {
  const t = String(cred || "");
  if (t.indexOf(PREFIJO_SESION) === 0) return verificarSesion_(t);
  const v = verificarGoogle_(t);
  if (v.ok) v.tipo = "google";
  return v;
}

// Quita los pases vencidos y, si hay demasiados, los más antiguos sin uso
function sesionesLimpiar_(props) {
  const todas = props.getProperties();
  const ahora = Date.now();
  const vivas = [];
  Object.keys(todas).forEach(function (k) {
    if (k.indexOf(CLAVE_SESION_PROP) !== 0) return;
    let s = null;
    try {
      s = JSON.parse(todas[k]);
    } catch (err) {}
    if (!s || Number(s.exp) < ahora) props.deleteProperty(k);
    else vivas.push({ clave: k, ultimo: Number(s.ultimo) || 0 });
  });
  vivas.sort(function (a, b) {
    return a.ultimo - b.ultimo;
  });
  while (vivas.length >= MAX_SESIONES) props.deleteProperty(vivas.shift().clave);
}

function sesionCrear_(p, verificacion) {
  // Un pase nuevo solo se entrega a quien acaba de iniciar sesión con Google (no a otro pase)
  if (verificacion.tipo !== "google") {
    return responder_({ ok: false, error: "Para crear la sesión de este dispositivo inicia sesión con Google" });
  }
  const dispositivo = String(p.dispositivo || "Dispositivo").replace(/[\r\n]+/g, " ").trim().slice(0, 60) || "Dispositivo";
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    sesionesLimpiar_(props);
    const token =
      PREFIJO_SESION + (Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, "");
    const ahora = Date.now();
    const exp = ahora + VIDA_SESION_DIAS * 86400 * 1000;
    props.setProperty(
      CLAVE_SESION_PROP + hashSesion_(token),
      JSON.stringify({
        correo: CORREO_AUTORIZADO,
        dispositivo: dispositivo,
        creado: ahora,
        ultimo: ahora,
        exp: exp,
      })
    );
    return responder_({ ok: true, token: token, exp: Math.floor(exp / 1000) });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Renueva YA el pase del dispositivo que hace la petición y devuelve su nuevo vencimiento
function sesionRenovar_(verificacion) {
  if (verificacion.tipo !== "dispositivo") return responder_({ ok: true, tipo: "google" });
  const props = PropertiesService.getScriptProperties();
  const clave = CLAVE_SESION_PROP + verificacion.hash;
  try {
    const ses = JSON.parse(props.getProperty(clave));
    const ahora = Date.now();
    ses.ultimo = ahora;
    ses.exp = ahora + VIDA_SESION_DIAS * 86400 * 1000;
    props.setProperty(clave, JSON.stringify(ses));
    return responder_({ ok: true, tipo: "dispositivo", exp: Math.floor(ses.exp / 1000) });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  }
}

function sesionListar_(verificacion) {
  const props = PropertiesService.getScriptProperties();
  const todas = props.getProperties();
  const ahora = Date.now();
  const lista = [];
  Object.keys(todas).forEach(function (k) {
    if (k.indexOf(CLAVE_SESION_PROP) !== 0) return;
    try {
      const s = JSON.parse(todas[k]);
      if (Number(s.exp) < ahora) return;
      const hash = k.slice(CLAVE_SESION_PROP.length);
      lista.push({
        id: hash.slice(0, 16),
        dispositivo: String(s.dispositivo || "Dispositivo"),
        creado: Number(s.creado) || 0,
        ultimo: Number(s.ultimo) || 0,
        actual: verificacion.tipo === "dispositivo" && hash === verificacion.hash,
      });
    } catch (err) {}
  });
  lista.sort(function (a, b) {
    return b.ultimo - a.ultimo;
  });
  return responder_({ ok: true, sesiones: lista });
}

// Cierra el pase del dispositivo que hace la petición
function sesionCerrar_(verificacion) {
  if (verificacion.tipo === "dispositivo") {
    PropertiesService.getScriptProperties().deleteProperty(CLAVE_SESION_PROP + verificacion.hash);
  }
  return responder_({ ok: true });
}

// Cierra un dispositivo por su id (los primeros 16 caracteres del hash) o todos (p.todas = true)
function sesionRevocar_(p) {
  const props = PropertiesService.getScriptProperties();
  const todas = props.getProperties();
  const id = String(p.id || "");
  if (!p.todas && !/^[0-9a-f]{16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de dispositivo)" });
  }
  let n = 0;
  Object.keys(todas).forEach(function (k) {
    if (k.indexOf(CLAVE_SESION_PROP) !== 0) return;
    if (p.todas || k.slice(CLAVE_SESION_PROP.length).indexOf(id) === 0) {
      props.deleteProperty(k);
      n++;
    }
  });
  return responder_({ ok: true, cerradas: n });
}

function hoja_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// Última fila que tiene algo escrito dentro de un grupo de columnas (ignora las demás).
function ultimaFilaEn_(h, col, ncols) {
  const ultima = h.getLastRow();
  if (ultima < 1) return 0;
  const v = h.getRange(1, col, ultima, ncols).getValues();
  for (let i = v.length - 1; i >= 0; i--) {
    for (let j = 0; j < ncols; j++) {
      if (String(v[i][j]).trim() !== "") return i + 1;
    }
  }
  return 0;
}

// Nombre en minúsculas y sin acentos, para comparar nombres de hojas
function nombreNormalizado_(s) {
  // También se tratan igual "/", "-" y "_" que el espacio ("Empresas/Proyectos" = "Empresas Proyectos")
  return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\/_\-]+/g, " ").replace(/\s+/g, " ").trim();
}

// Devuelve la hoja con ese nombre (si no existe, se crea) asegurando que existan las columnas
// necesarias y que la fila 1 tenga los encabezados (solo se completan los que falten).
function hojaTabla_(nombreHoja, encabezados) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(nombreHoja);
  if (!h) {
    // También se acepta el nombre escrito distinto (por ejemplo "galeria" o "Galería")
    const buscado = nombreNormalizado_(nombreHoja);
    const hojas = ss.getSheets();
    for (let i = 0; i < hojas.length; i++) {
      if (nombreNormalizado_(hojas[i].getName()) === buscado) {
        h = hojas[i];
        break;
      }
    }
  }
  if (!h) h = ss.insertSheet(nombreHoja);
  const n = encabezados.length;
  if (h.getMaxColumns() < n) {
    h.insertColumnsAfter(h.getMaxColumns(), n - h.getMaxColumns());
  }
  const enc = h.getRange(1, 1, 1, n);
  const valores = enc.getValues()[0];
  const vacio = valores.every(function (x) {
    return String(x).trim() === "";
  });
  if (vacio) {
    enc.setNumberFormat("@").setValues([encabezados]).setFontWeight("bold");
    h.setFrozenRows(1);
  } else {
    valores.forEach(function (v, i) {
      if (String(v).trim() === "") {
        h.getRange(1, 1 + i).setNumberFormat("@").setValue(encabezados[i]).setFontWeight("bold");
      }
    });
  }
  return h;
}

// Hoja de las notas: la llamada "Notas"
function hojaNotas_() {
  return hojaTabla_(NOMBRE_HOJA_NOTAS, ENCABEZADOS_NOTAS);
}

// Hoja de los proyectos: la llamada "Proyectos"
function hojaProyectos_() {
  return hojaTabla_(NOMBRE_HOJA_PROYECTOS, ENCABEZADOS_PROYECTOS);
}

// Hoja de la galería: la llamada "Galeria"
function hojaGaleria_() {
  return hojaTabla_(NOMBRE_HOJA_GALERIA, ENCABEZADOS_GALERIA);
}

// Hoja con el color de cada día del calendario: la llamada "Colores"
function hojaColores_() {
  return hojaTabla_(NOMBRE_HOJA_COLORES, ENCABEZADOS_COLORES);
}

// Convierte el valor de una celda a texto (las fechas reales se muestran dd/MM/yyyy HH:mm)
function celdaTexto_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  }
  return String(v === null || v === undefined ? "" : v).trim();
}

function responder_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Normaliza la fecha de la columna A a "YYYY-MM-DD"
function fechaTexto_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v).trim();
}

// ---------- Textos largos: pasan a Drive cuando no caben en una celda ----------
// Google Sheets admite solo 50,000 caracteres por celda. Los textos largos de TODAS las zonas (notas,
// actividades, trabajo, pedidos de yeso, ejercicio, diario, deudas, información primordial, comandos y
// bazar) se guardan así:
//  - hasta UMBRAL_DRIVE caracteres: directo en su celda, como siempre (se ve en la hoja);
//  - si pasan de ahí: el texto va a un archivo .txt dentro de la carpeta "notaslargas" de Drive y la celda
//    queda con una marca "☁DRIVE:<Id del archivo>". Al leer, la marca se cambia sola por el texto.
// Si después el texto vuelve a ser corto, regresa a la celda y su archivo va a la papelera.
// LIMITE_TEXTO_LARGO es un tope de seguridad (debe ser igual al de la página; ver app.js e index.html).
const UMBRAL_DRIVE = 40000;
const LIMITE_TEXTO_LARGO = 1000000;
const PREFIJO_DRIVE = "☁DRIVE:";

// Id del archivo de Drive si la celda trae la marca (si no, "")
function idArchivoDeCelda_(v) {
  const s = String(v === null || v === undefined ? "" : v).trim();
  return s.indexOf(PREFIJO_DRIVE) === 0 ? s.slice(PREFIJO_DRIVE.length).trim() : "";
}

// Valor de una celda -> texto completo (si trae la marca de Drive, se lee el archivo)
function textoLeer_(v) {
  const archivoId = idArchivoDeCelda_(v);
  if (!archivoId) return celdaTexto_(v);
  const t = notarioLeerArchivo_(archivoId);
  return t === null
    ? "⚠️ No se pudo leer el archivo de Drive de este texto (Id " + archivoId + ")"
    : t.trim();
}

function nombreArchivoTexto_(etiqueta, nombre, id) {
  const limpio =
    String(nombre || "")
      .replace(/[\\\/:*?"<>|\r\n]+/g, " ")
      .trim()
      .slice(0, 60) || "Sin nombre";
  return etiqueta + " - " + limpio + " [" + id + "].txt";
}

// Texto -> lo que se escribe en la celda: el mismo texto si es corto, o la marca de Drive si es largo.
// valorAnterior es lo que tenía la celda antes (para reusar o quitar su archivo).
// forzarDrive (opcional): si es true, el texto va SIEMPRE a Drive, aunque sea corto.
function textoGuardar_(texto, etiqueta, nombre, id, valorAnterior, forzarDrive) {
  const t = String(texto === null || texto === undefined ? "" : texto);
  const previo = idArchivoDeCelda_(valorAnterior);
  // Un texto vacío no necesita archivo. Y si el texto ya vivía en Drive, se queda ahí aunque sea corto
  // (ya no se regresa a la hoja). Lo corto que viene de una nota antigua en Sheets se queda en su celda
  // hasta que se use «Migrar a Drive».
  if (!previo && (!t.trim() || (t.length <= UMBRAL_DRIVE && !forzarDrive))) {
    return t;
  }
  const nombreArchivo = nombreArchivoTexto_(etiqueta, nombre, id);
  if (previo) {
    try {
      const f = DriveApp.getFileById(previo);
      f.setContent(t);
      f.setName(nombreArchivo);
      return PREFIJO_DRIVE + previo;
    } catch (err) {
      // el archivo anterior ya no existe: se crea uno nuevo
    }
  }
  const archivo = carpetaNotarios_().createFile(nombreArchivo, t, MimeType.PLAIN_TEXT);
  return PREFIJO_DRIVE + archivo.getId();
}

// Si la celda traía la marca de Drive, manda su archivo a la papelera (no hace nada si no)
function textoSoltar_(valor) {
  const archivoId = idArchivoDeCelda_(valor);
  if (!archivoId) return;
  try {
    DriveApp.getFileById(archivoId).setTrashed(true);
  } catch (err) {}
}

// ---------- Notas (hoja "Notas") ----------

// La columna H «Favorito»: "Sí" = marcada con la ⭐
function favoritoDeCelda_(v) {
  return /^(s[ií]|1|true|verdadero)$/i.test(celdaTexto_(v));
}

function notasListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    const ultima = ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS);
    const notas = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, COL_NOTAS, ultima - 1, N_COL_NOTAS).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const texto = textoLeer_(f[3]);
        if (!nombre && !texto) return; // fila sin nota
        // «Favorito» ya no es una etiqueta (ahora es la columna H): esas notas pasan a ser notas comunes («General»)
        let etiquetaNota = celdaTexto_(f[2]);
        if (etiquetaNota === "Favorito") {
          etiquetaNota = "General";
          h.getRange(i + 2, COL_NOTAS + 2).setNumberFormat("@").setValue("General");
        }
        let id = celdaTexto_(f[5]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder borrarla desde la página
          id = String(base + i);
          h.getRange(i + 2, COL_NOTAS + 5).setNumberFormat("@").setValue(id);
        }
        notas.push({
          id: id,
          nombre: nombre,
          fecha: celdaTexto_(f[1]),
          etiqueta: etiquetaNota,
          texto: texto,
          color: celdaTexto_(f[4]),
          identificador: celdaTexto_(f[6]),
          favorito: favoritoDeCelda_(f[7]),
          // "drive" si el texto de la nota vive en un archivo de Drive; "sheets" si está en la celda
          destino: idArchivoDeCelda_(f[3]) ? "drive" : "sheets",
        });
      });
    }
    return responder_({ ok: true, notas: notas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Si un guardado ya estaba (un intento anterior sí llegó pero su respuesta se perdió), no se repite
function idYaExiste_(h, colId, ultimaFila, id) {
  if (ultimaFila < 2 || !id) return false;
  const ids = h.getRange(2, colId, ultimaFila - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (celdaTexto_(ids[i][0]) === String(id)) return true;
  }
  return false;
}

function notasAgregar_(p) {
  const id = String(p.id || "");
  const nombre = String(p.nombre || "").trim().slice(0, 80) || "Sin nombre";
  const fecha = String(p.fecha || "").trim().slice(0, 40);
  const etiqueta = String(p.etiqueta || "General");
  const texto = String(p.texto || "").trim();
  const color = String(p.color || "Blanco");
  const identificador = String(p.identificador || "").trim().slice(0, 40);
  const favorito = p.favorito === true || p.favorito === "true" ? "Sí" : "";
  // Dónde se guarda el texto: "sheets" (en la celda) o "drive" (siempre en un archivo de Drive)
  const destino = String(p.destino || "") === "drive" ? "drive" : "sheets";
  const idOk = /^\d{10,16}$/.test(id);
  if (
    !idOk ||
    !texto ||
    texto.length > LIMITE_TEXTO_LARGO ||
    ETIQUETAS_NOTA.indexOf(etiqueta) === -1 ||
    !colorValido_(color)
  ) {
    // El detalle ayuda a saber qué dato no gustó
    return responder_({
      ok: false,
      error:
        "Datos inválidos (id ok: " + idOk +
        ", largo texto: " + texto.length +
        ", etiqueta: " + etiqueta +
        ", color: " + color + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    if (idYaExiste_(h, COL_NOTAS + 5, ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS), id)) return responder_({ ok: true });
    // Siguiente fila libre dentro de las columnas de notas (el encabezado cuenta como fila 1)
    const fila = Math.max(ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, COL_NOTAS, 1, N_COL_NOTAS)
      .setNumberFormat("@")
      .setValues([[nombre, fecha, etiqueta, textoGuardar_(texto, "Nota", nombre, id, "", true), color, id, identificador, favorito]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function notasBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de nota: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    const ultima = ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_NOTAS + 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          // Si el texto estaba en Drive, su archivo va a la papelera
          textoSoltar_(h.getRange(i + 2, COL_NOTAS + 3).getValue());
          // Se quitan las celdas de la nota y las de abajo suben
          h.getRange(i + 2, COL_NOTAS, 1, N_COL_NOTAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la nota" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Edita una nota completa: nombre, fecha, etiqueta, texto, color e identificador
function notasEditar_(p) {
  const id = String(p.id || "");
  const nombre = String(p.nombre || "").trim().slice(0, 80) || "Sin nombre";
  const fecha = String(p.fecha || "").trim();
  const etiqueta = String(p.etiqueta || "General");
  const texto = String(p.texto || "").trim();
  const color = String(p.color || "Blanco");
  const identificador = String(p.identificador || "").trim().slice(0, 40);
  const destino = String(p.destino || "") === "drive" ? "drive" : "sheets";
  if (
    !/^\d{10,16}$/.test(id) ||
    !texto ||
    texto.length > LIMITE_TEXTO_LARGO ||
    ETIQUETAS_NOTA.indexOf(etiqueta) === -1 ||
    !colorValido_(color)
  ) {
    return responder_({
      ok: false,
      error:
        "Datos inválidos (id ok: " + /^\d{10,16}$/.test(id) +
        ", largo texto: " + texto.length +
        ", etiqueta: " + etiqueta +
        ", color: " + color + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    const ultima = ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_NOTAS + 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          const fila = i + 2;
          // Si la fecha no viene en el formato dd/mm/aaaa hh:mm, se conserva la que ya tenía
          const fechaFinal = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(fecha)
            ? fecha
            : celdaTexto_(h.getRange(fila, COL_NOTAS + 1).getValue());
          h.getRange(fila, COL_NOTAS, 1, 5)
            .setNumberFormat("@")
            .setValues([[nombre, fechaFinal, etiqueta, textoGuardar_(texto, "Nota", nombre, id, h.getRange(fila, COL_NOTAS + 3).getValue(), destino === "drive"), color]]);
          h.getRange(fila, COL_NOTAS + 6).setNumberFormat("@").setValue(identificador);
          // La ⭐ solo se cambia si la página la manda (así otras ediciones no la borran)
          if (p.favorito !== undefined) {
            h.getRange(fila, COL_NOTAS + 7).setNumberFormat("@").setValue(p.favorito === true || p.favorito === "true" ? "Sí" : "");
          }
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la nota" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Marca o quita la ⭐ de una nota (no toca nada más: ni etiqueta, ni texto, ni zona)
function notasFavorito_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de nota: " + id + ")" });
  }
  const valor = p.favorito === true || p.favorito === "true" ? "Sí" : "";
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    const ultima = ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_NOTAS + 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, COL_NOTAS + 7).setNumberFormat("@").setValue(valor);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la nota" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Cambia la fecha y hora de una nota (formato dd/mm/aaaa hh:mm)
function notasCambiarFecha_(p) {
  const id = String(p.id || "");
  const fecha = String(p.fecha || "").trim();
  if (!/^\d{10,16}$/.test(id) || !/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(fecha)) {
    return responder_({
      ok: false,
      error: "Datos inválidos (id de nota: " + id + ", fecha: " + fecha + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotas_();
    const ultima = ultimaFilaEn_(h, COL_NOTAS, N_COL_NOTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_NOTAS + 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, COL_NOTAS + 1).setNumberFormat("@").setValue(fecha);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la nota" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Proyectos (hoja "Proyectos") ----------

function proyectoDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 120),
    fecha: String(p.fecha || "").trim().slice(0, 40),
    descripcion: String(p.descripcion || "").trim(),
    imagen: String(p.imagen || "").trim(),
    links: String(p.links || "").trim(),
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function proyectoError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de proyecto inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (d.descripcion.length > 5000) return "la descripción es demasiado larga";
  if (d.links.length > 3000) return "los links son demasiado largos";
  if (d.imagen && (d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen))) {
    return "la dirección de la imagen no es válida";
  }
  return "";
}

function proyectosListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProyectos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PROYECTOS);
    const proyectos = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_PROYECTOS).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const descripcion = celdaTexto_(f[2]);
        const imagen = celdaTexto_(f[3]);
        if (!nombre && !descripcion && !imagen) return; // fila sin proyecto
        let id = celdaTexto_(f[5]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 6).setNumberFormat("@").setValue(id);
        }
        proyectos.push({
          id: id,
          nombre: nombre,
          fecha: celdaTexto_(f[1]),
          descripcion: descripcion,
          imagen: imagen,
          links: celdaTexto_(f[4]),
        });
      });
    }
    return responder_({ ok: true, proyectos: proyectos });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function proyectosAgregar_(p) {
  const d = proyectoDatos_(p);
  const motivo = proyectoError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProyectos_();
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_PROYECTOS), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_PROYECTOS)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha, d.descripcion, d.imagen, d.links, d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function proyectosEditar_(p) {
  const d = proyectoDatos_(p);
  const motivo = proyectoError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProyectos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PROYECTOS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 6, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          const fila = i + 2;
          // Si la fecha no viene en el formato dd/mm/aaaa hh:mm, se conserva la que ya tenía
          const fecha = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(d.fecha)
            ? d.fecha
            : celdaTexto_(h.getRange(fila, 2).getValue());
          h.getRange(fila, 1, 1, 5)
            .setNumberFormat("@")
            .setValues([[d.nombre, fecha, d.descripcion, d.imagen, d.links]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el proyecto" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function proyectosBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de proyecto: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProyectos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PROYECTOS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 6, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          // Se quitan las celdas del proyecto y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_PROYECTOS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el proyecto" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Sube una imagen (base64, sin el prefijo "data:...") a imgbb y devuelve su dirección
function proyectosSubirImagen_(p) {
  if (!IMGBB_API_KEY) {
    return responder_({ ok: false, error: "Falta la API key de imgbb (IMGBB_API_KEY) en el Apps Script" });
  }
  const b64 = String(p.imagen || "");
  if (!b64 || b64.length > 8000000 || !/^[A-Za-z0-9+\/=]+$/.test(b64)) {
    return responder_({ ok: false, error: "Imagen inválida o demasiado grande" });
  }
  let r;
  try {
    r = UrlFetchApp.fetch("https://api.imgbb.com/1/upload?key=" + encodeURIComponent(IMGBB_API_KEY), {
      method: "post",
      payload: { image: b64 },
      muteHttpExceptions: true,
    });
  } catch (err) {
    return responder_({ ok: false, error: "No se pudo conectar con imgbb" });
  }
  let j = null;
  try {
    j = JSON.parse(r.getContentText());
  } catch (err) {}
  if (r.getResponseCode() !== 200 || !j || !j.success || !j.data || !j.data.url) {
    const detalle = j && j.error && j.error.message ? j.error.message : "código " + r.getResponseCode();
    return responder_({ ok: false, error: "imgbb no aceptó la imagen (" + detalle + ")" });
  }
  return responder_({ ok: true, url: j.data.url });
}

// ---------- Galería (hoja "Galeria") ----------

function galeriaDatos_(p) {
  return {
    id: String(p.id || ""),
    imagen: String(p.imagen || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    etiqueta: String(p.etiqueta || "General").trim(),
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function galeriaError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de imagen inválido: " + d.id;
  if (!d.imagen || d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen)) {
    return "la dirección de la imagen no es válida";
  }
  if (d.descripcion.length > 2000) return "la descripción es demasiado larga";
  if (ETIQUETAS_GALERIA.indexOf(d.etiqueta) === -1) return "etiqueta: " + d.etiqueta;
  return "";
}

function galeriaListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaGaleria_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_GALERIA);
    const galeria = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_GALERIA).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const imagen = celdaTexto_(f[0]);
        const descripcion = celdaTexto_(f[1]);
        if (!imagen && !descripcion) return; // fila sin imagen
        let id = celdaTexto_(f[3]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 4).setNumberFormat("@").setValue(id);
        }
        galeria.push({
          id: id,
          imagen: imagen,
          descripcion: descripcion,
          etiqueta: celdaTexto_(f[2]),
        });
      });
    }
    return responder_({ ok: true, galeria: galeria });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function galeriaAgregar_(p) {
  const d = galeriaDatos_(p);
  const motivo = galeriaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaGaleria_();
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_GALERIA), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_GALERIA)
      .setNumberFormat("@")
      .setValues([[d.imagen, d.descripcion, d.etiqueta, d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function galeriaEditar_(p) {
  const d = galeriaDatos_(p);
  const motivo = galeriaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaGaleria_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_GALERIA);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.imagen, d.descripcion, d.etiqueta]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function galeriaBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de imagen: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaGaleria_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_GALERIA);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          // Se quitan las celdas de la imagen y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_GALERIA).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Moldes (hoja "Moldes") ----------
// Imagen, Descripcion, Zonas (varias, separadas por coma), Lista (el botón de Moldes donde se añadió), Id.
const NOMBRE_HOJA_MOLDES = "Moldes";
const N_COL_MOLDES = 5;
const ENCABEZADOS_MOLDES = ["Imagen", "Descripcion", "Zonas", "Lista", "Id"];
const ZONAS_MOLDES = ["Figuras", "Religioso", "Bases", "Macetas", "Halloween", "Navidad"];
const LISTAS_MOLDES = ["todos", "tiene-polo", "tiene-madre", "tiene-fer", "dueno-polo", "dueno-madre", "dueno-fer"];

function hojaMoldes_() {
  return hojaTabla_(NOMBRE_HOJA_MOLDES, ENCABEZADOS_MOLDES);
}

function moldesZonasDe_(v) {
  const crudo = Array.isArray(v) ? v : String(v || "").split(",");
  const r = [];
  crudo.forEach(function (z) {
    const t = String(z).trim();
    if (ZONAS_MOLDES.indexOf(t) !== -1 && r.indexOf(t) === -1) r.push(t);
  });
  return r;
}

function moldesDatos_(p) {
  return {
    id: String(p.id || ""),
    imagen: String(p.imagen || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    zonas: moldesZonasDe_(p.zonas),
    lista: String(p.lista || "todos").trim(),
  };
}

function moldesError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de imagen inválido: " + d.id;
  if (!d.imagen || d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen)) {
    return "la dirección de la imagen no es válida";
  }
  if (d.descripcion.length > 2000) return "la descripción es demasiado larga";
  if (!d.zonas.length) return "elige al menos una zona";
  if (LISTAS_MOLDES.indexOf(d.lista) === -1) return "lista: " + d.lista;
  return "";
}

function moldesListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaMoldes_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_MOLDES);
    const moldes = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_MOLDES).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const imagen = celdaTexto_(f[0]);
        if (!imagen) return; // fila sin imagen
        let id = celdaTexto_(f[4]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 5).setNumberFormat("@").setValue(id);
        }
        const lista = celdaTexto_(f[3]);
        moldes.push({
          id: id,
          imagen: imagen,
          descripcion: celdaTexto_(f[1]),
          zonas: moldesZonasDe_(celdaTexto_(f[2])),
          lista: LISTAS_MOLDES.indexOf(lista) === -1 ? "todos" : lista,
        });
      });
    }
    return responder_({ ok: true, moldes: moldes });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function moldesAgregar_(p) {
  const d = moldesDatos_(p);
  const motivo = moldesError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaMoldes_();
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_MOLDES), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    h.getRange(fila, 1, 1, N_COL_MOLDES)
      .setNumberFormat("@")
      .setValues([[d.imagen, d.descripcion, d.zonas.join(", "), d.lista, d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function moldesEditar_(p) {
  const d = moldesDatos_(p);
  const motivo = moldesError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaMoldes_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_MOLDES);
    if (ultima >= 2) {
      const ids = h.getRange(2, 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 4)
            .setNumberFormat("@")
            .setValues([[d.imagen, d.descripcion, d.zonas.join(", "), d.lista]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function moldesBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de imagen: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaMoldes_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_MOLDES);
    if (ultima >= 2) {
      const ids = h.getRange(2, 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, 1, 1, N_COL_MOLDES).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Productos Confirmados (hoja "Productos Confirmados") ----------
// Imagen, Descripcion, Zonas (varias, separadas por coma), Lista (el botón de Productos Confirmados donde se añadió), Id,
// Precios (columna antigua, ya no se usa; se migra sola a la columna Precio), Precio (un valor por imagen, por ejemplo "$100": igual en todas
// sus zonas). Las zonas se guardan en la hoja "Productos Config".
const NOMBRE_HOJA_PRODCONF = "Productos Confirmados";
const N_COL_PRODCONF = 7;
const ENCABEZADOS_PRODCONF = ["Imagen", "Descripcion", "Zonas", "Lista", "Id", "Precios", "Precio"];
const ZONAS_PRODCONF = ["Figuras", "Religioso", "Bases", "Macetas", "Halloween", "Navidad"];
const LISTAS_PRODCONF = ["todos", "tiene-polo", "tiene-madre", "tiene-fer", "dueno-polo", "dueno-madre", "dueno-fer"];

function hojaProdConf_() {
  const h = hojaTabla_(NOMBRE_HOJA_PRODCONF, ENCABEZADOS_PRODCONF);
  // Hojas creadas antes de las columnas nuevas: se agregan sus encabezados
  if (h.getMaxColumns() < N_COL_PRODCONF) h.insertColumnsAfter(h.getMaxColumns(), N_COL_PRODCONF - h.getMaxColumns());
  for (let c = 6; c <= N_COL_PRODCONF; c++) {
    const celda = h.getRange(1, c);
    if (String(celda.getValue()).trim() === "") celda.setNumberFormat("@").setValue(ENCABEZADOS_PRODCONF[c - 1]).setFontWeight("bold");
  }
  return h;
}

// Las zonas ya no son una lista fija: se pueden crear nuevas desde la página (solo se limpia el texto)
function prodConfZonasDe_(v) {
  const crudo = Array.isArray(v) ? v : String(v || "").split(",");
  const r = [];
  crudo.forEach(function (z) {
    const t = String(z).replace(/[,\r\n]+/g, " ").trim().slice(0, 40);
    if (t && r.indexOf(t) === -1) r.push(t);
  });
  return r;
}

// Precio de una imagen: un texto corto (por ejemplo "$100")
function prodConfPrecioDe_(v) {
  return String(v === null || v === undefined ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, 40);
}

// Columna antigua «Precios»: {zona: id de subcategoría}. Solo se usa para migrar.
function prodConfPreciosAntiguos_(v) {
  let o = v;
  if (typeof o === "string") {
    try { o = JSON.parse(o || "{}"); } catch (e) { o = {}; }
  }
  return o && typeof o === "object" && !Array.isArray(o) ? o : {};
}

// Configuración tal como está escrita en la hoja (sin limpiar, para poder leer las subcategorías antiguas)
function prodConfConfigCruda_() {
  try {
    const h = hojaTabla_(NOMBRE_HOJA_PRODCONF_CFG, ["Config"]);
    const txt = celdaTexto_(h.getRange(2, 1).getValue());
    return txt ? JSON.parse(txt) : null;
  } catch (e) {
    return null;
  }
}

// Nombre de la subcategoría antigua (la primera zona que tenga una)
function prodConfPrecioAntiguo_(mapa, cruda) {
  const zonas = cruda && Array.isArray(cruda.zonas) ? cruda.zonas : [];
  const claves = Object.keys(mapa);
  for (let k = 0; k < claves.length; k++) {
    for (let z = 0; z < zonas.length; z++) {
      if (!zonas[z] || zonas[z].nombre !== claves[k] || !Array.isArray(zonas[z].precios)) continue;
      for (let p = 0; p < zonas[z].precios.length; p++) {
        const pr = zonas[z].precios[p];
        if (pr && pr.id === mapa[claves[k]] && pr.nombre) return prodConfPrecioDe_(pr.nombre);
      }
    }
  }
  return "";
}

function prodConfDatos_(p) {
  return {
    id: String(p.id || ""),
    imagen: String(p.imagen || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    zonas: prodConfZonasDe_(p.zonas),
    lista: String(p.lista || "todos").trim(),
    precio: prodConfPrecioDe_(p.precio),
  };
}

function prodConfError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de imagen inválido: " + d.id;
  if (!d.imagen || d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen)) {
    return "la dirección de la imagen no es válida";
  }
  if (d.descripcion.length > 2000) return "la descripción es demasiado larga";
  if (!d.zonas.length) return "elige al menos una zona";
  if (LISTAS_PRODCONF.indexOf(d.lista) === -1) return "lista: " + d.lista;
  return "";
}

function prodConfListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProdConf_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PRODCONF);
    const productos = [];
    let cruda; // configuración antigua (solo se lee si hace falta migrar)
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_PRODCONF).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const imagen = celdaTexto_(f[0]);
        if (!imagen) return; // fila sin imagen
        let id = celdaTexto_(f[4]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 5).setNumberFormat("@").setValue(id);
        }
        const lista = celdaTexto_(f[3]);
        let precio = prodConfPrecioDe_(celdaTexto_(f[6]));
        const antiguos = celdaTexto_(f[5]);
        if (!precio && antiguos) {
          // Migración: el precio antes era una subcategoría por zona; ahora es un valor de la imagen
          if (cruda === undefined) cruda = prodConfConfigCruda_();
          precio = prodConfPrecioAntiguo_(prodConfPreciosAntiguos_(antiguos), cruda);
          if (precio) h.getRange(i + 2, 7).setNumberFormat("@").setValue(precio);
        }
        if (antiguos) h.getRange(i + 2, 6).setValue("");
        productos.push({
          id: id,
          imagen: imagen,
          descripcion: celdaTexto_(f[1]),
          zonas: prodConfZonasDe_(celdaTexto_(f[2])),
          lista: LISTAS_PRODCONF.indexOf(lista) === -1 ? "todos" : lista,
          precio: precio,
        });
      });
    }
    return responder_({ ok: true, productos: productos });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function prodConfAgregar_(p) {
  const d = prodConfDatos_(p);
  const motivo = prodConfError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProdConf_();
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_PRODCONF), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    h.getRange(fila, 1, 1, N_COL_PRODCONF)
      .setNumberFormat("@")
      .setValues([[d.imagen, d.descripcion, d.zonas.join(", "), d.lista, d.id, "", d.precio]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function prodConfEditar_(p) {
  const d = prodConfDatos_(p);
  const motivo = prodConfError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProdConf_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PRODCONF);
    if (ultima >= 2) {
      const ids = h.getRange(2, 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 4)
            .setNumberFormat("@")
            .setValues([[d.imagen, d.descripcion, d.zonas.join(", "), d.lista]]);
          h.getRange(i + 2, 6, 1, 2).setNumberFormat("@").setValues([["", d.precio]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function prodConfBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de imagen: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProdConf_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PRODCONF);
    if (ultima >= 2) {
      const ids = h.getRange(2, 5, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, 1, 1, N_COL_PRODCONF).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la imagen" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Productos Confirmados: zonas y subcategorías de precio (hoja "Productos Config") ----------
// Un solo JSON en la celda A2: { zonas: [ { nombre } ] }. Los precios ya no se guardan aquí: son un valor de cada imagen.
const NOMBRE_HOJA_PRODCONF_CFG = "Productos Config";

function prodConfConfigLimpia_(c) {
  const zonas = [];
  const vistas = {};
  const lista = c && Array.isArray(c.zonas) ? c.zonas.slice(0, 60) : [];
  lista.forEach(function (z) {
    const nombre = String((z && z.nombre) || "").replace(/[,\r\n]+/g, " ").trim().slice(0, 40);
    if (!nombre || vistas[nombre.toLowerCase()]) return;
    vistas[nombre.toLowerCase()] = true;
    zonas.push({ nombre: nombre });
  });
  return { zonas: zonas };
}

function prodConfConfigLeer_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTabla_(NOMBRE_HOJA_PRODCONF_CFG, ["Config"]);
    const txt = celdaTexto_(h.getRange(2, 1).getValue());
    let config = null;
    if (txt) {
      try { config = prodConfConfigLimpia_(JSON.parse(txt)); } catch (e) { config = null; }
    }
    return responder_({ ok: true, config: config });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function prodConfConfigGuardar_(p) {
  let c = p.config;
  if (typeof c === "string") {
    try { c = JSON.parse(c); } catch (e) { c = null; }
  }
  if (!c || !Array.isArray(c.zonas)) return responder_({ ok: false, error: "Datos inválidos (configuración)" });
  const limpia = prodConfConfigLimpia_(c);
  const txt = JSON.stringify(limpia);
  if (txt.length > 40000) return responder_({ ok: false, error: "La configuración es demasiado grande" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTabla_(NOMBRE_HOJA_PRODCONF_CFG, ["Config"]);
    h.getRange(2, 1).setNumberFormat("@").setValue(txt);
    return responder_({ ok: true, config: limpia });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Cambia el nombre de precios o los quita, de todas las imágenes a la vez.
// p.cambios = [{ de: "precio actual", a: "precio nuevo" }]  («a» vacío = quitar el precio). Si dos precios quedan con el mismo nombre, se juntan.
function prodConfPreciosAplicar_(p) {
  const cambios = Array.isArray(p.cambios) ? p.cambios.slice(0, 300) : [];
  const mapa = {};
  let hay = false;
  cambios.forEach(function (c) {
    const de = prodConfPrecioDe_(c && c.de);
    if (!de) return;
    mapa[de] = prodConfPrecioDe_(c && c.a);
    hay = true;
  });
  if (!hay) return responder_({ ok: false, error: "Datos inválidos (cambios de precio)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaProdConf_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PRODCONF);
    let cambiadas = 0;
    if (ultima >= 2) {
      const col = h.getRange(2, 7, ultima - 1, 1).getValues();
      col.forEach(function (v) {
        const actual = prodConfPrecioDe_(celdaTexto_(v[0]));
        if (actual && Object.prototype.hasOwnProperty.call(mapa, actual)) {
          v[0] = mapa[actual];
          cambiadas++;
        }
      });
      if (cambiadas) h.getRange(2, 7, col.length, 1).setNumberFormat("@").setValues(col);
    }
    return responder_({ ok: true, imagenes: cambiadas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Elimina una zona: la quita de la configuración y de todas las imágenes que la tenían.
// Las imágenes NO se borran; las que solo estaban en esa zona quedan «Sin zona».
function prodConfZonaBorrar_(p) {
  const zona = String(p.zona || "").replace(/[,\r\n]+/g, " ").trim().slice(0, 40);
  if (!zona) return responder_({ ok: false, error: "Datos inválidos (zona)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 1) Imágenes
    const h = hojaProdConf_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_PRODCONF);
    let quitadas = 0;
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_PRODCONF).getValues();
      filas.forEach(function (f, i) {
        const zonas = prodConfZonasDe_(celdaTexto_(f[2]));
        if (zonas.indexOf(zona) === -1) return;
        h.getRange(i + 2, 3).setNumberFormat("@").setValue(zonas.filter(function (z) { return z !== zona; }).join(", "));
        quitadas++;
      });
    }
    // 2) Configuración de zonas y subcategorías
    const hc = hojaTabla_(NOMBRE_HOJA_PRODCONF_CFG, ["Config"]);
    const txt = celdaTexto_(hc.getRange(2, 1).getValue());
    if (txt) {
      let cfg = null;
      try { cfg = prodConfConfigLimpia_(JSON.parse(txt)); } catch (e) { cfg = null; }
      if (cfg) {
        cfg.zonas = cfg.zonas.filter(function (z) { return z.nombre !== zona; });
        hc.getRange(2, 1).setNumberFormat("@").setValue(JSON.stringify(cfg));
      }
    }
    return responder_({ ok: true, imagenes: quitadas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Ejercicio (hoja "Ejercicio") ----------
// Nombre, Fecha (AAAA-MM-DD), Descripcion, Id. Si la hoja no existe, se crea sola.
const NOMBRE_HOJA_EJERCICIO = "Ejercicio";
const N_COL_EJERCICIO = 4;
const ENCABEZADOS_EJERCICIO = ["Nombre", "Fecha", "Descripcion", "Id"];

function hojaEjercicio_() {
  return hojaTabla_(NOMBRE_HOJA_EJERCICIO, ENCABEZADOS_EJERCICIO);
}

// Fecha de la columna B como "AAAA-MM-DD" (acepta fecha real, "AAAA-MM-DD" o "dd/mm/aaaa")
function fechaEjercicio_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const s = String(v === null || v === undefined ? "" : v).trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
  if (m) return m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2);
  return "";
}

function ejercicioDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    fecha: String(p.fecha || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function ejercicioError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de ejercicio inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  return "";
}

function ejercicioListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEjercicio_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_EJERCICIO);
    const ejercicios = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_EJERCICIO).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const fecha = fechaEjercicio_(f[1]);
        if (!nombre && !fecha) return; // fila sin ejercicio
        let id = celdaTexto_(f[3]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 4).setNumberFormat("@").setValue(id);
        }
        ejercicios.push({ id: id, nombre: nombre, fecha: fecha, descripcion: textoLeer_(f[2]), destino: idArchivoDeCelda_(f[2]) ? "drive" : "sheets" });
      });
    }
    return responder_({ ok: true, ejercicios: ejercicios });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function ejercicioAgregar_(p) {
  const d = ejercicioDatos_(p);
  const motivo = ejercicioError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEjercicio_();
    if (idYaExiste_(h, 4, ultimaFilaEn_(h, 1, N_COL_EJERCICIO), d.id)) return responder_({ ok: true });
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_EJERCICIO), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_EJERCICIO)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Ejercicio", d.nombre, d.id, "", true), d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function ejercicioEditar_(p) {
  const d = ejercicioDatos_(p);
  const motivo = ejercicioError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEjercicio_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_EJERCICIO);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Ejercicio", d.nombre, d.id, h.getRange(i + 2, 3).getValue(), d.destino === "drive")]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el ejercicio" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function ejercicioBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de ejercicio: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEjercicio_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_EJERCICIO);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, 3).getValue());
          // Se quitan las celdas del ejercicio y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_EJERCICIO).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el ejercicio" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Diario (hoja "Diario") ----------
// Nombre, Fecha (AAAA-MM-DD), Descripcion, Trabajos terminados, Id. Si la hoja no existe, se crea sola.
// La columna D "Trabajos terminados" queda vacía en las anotaciones normales y dice "Sí" en los
// trabajos que se marcaron como finalizados desde la zona de Trabajo. La columna E "Id" se llena sola.
const NOMBRE_HOJA_DIARIO = "Diario";
const N_COL_DIARIO = 5;
const COL_ID_DIARIO = 5;
const COL_CREADA_DIARIO = 6; // F: fecha y hora de creación (dd/mm/aaaa hh:mm)
const COL_MODIF_DIARIO = 7; // G: días en que se modificó, separados por " | "
const COL_FAV_DIARIO = 12; // L: "Sí" = favorita (las columnas H a K son de las deudas)
const FORMATO_SELLO_ = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
const ENCABEZADOS_DIARIO = ["Nombre", "Fecha", "Descripcion", "Trabajos terminados", "Id"];
const MARCA_TRABAJO_TERMINADO = "Sí";
// Marca de las notas que se dieron por finalizadas desde «Día de Hoy» (pasan al Diario)
const MARCA_TAREA_FINALIZADA = "Tarea finalizada";
// Marca de las actividades que se dieron por finalizadas desde la zona Actividades (pasan al Diario)
const MARCA_ACTIVIDAD_FINALIZADA = "Actividad finalizada";
// (El límite de texto de todas las zonas es LIMITE_TEXTO_LARGO: ver "Textos largos" más abajo)

function hojaDiario_() {
  const h = hojaTabla_(NOMBRE_HOJA_DIARIO, ENCABEZADOS_DIARIO);
  // Si la columna D todavía se llama "Id" (versión anterior), pasa a ser "Trabajos terminados"
  const c = h.getRange(1, 4);
  if (nombreNormalizado_(celdaTexto_(c.getValue())) === "id") {
    c.setNumberFormat("@").setValue(ENCABEZADOS_DIARIO[3]).setFontWeight("bold");
  }
  // Columnas extra: F «Creada», G «Modificaciones» y L «Favorito» (solo se escribe el encabezado si está vacío)
  if (h.getMaxColumns() < COL_FAV_DIARIO) h.insertColumnsAfter(h.getMaxColumns(), COL_FAV_DIARIO - h.getMaxColumns());
  [[COL_CREADA_DIARIO, "Creada"], [COL_MODIF_DIARIO, "Modificaciones"], [COL_FAV_DIARIO, "Favorito"]].forEach(function (x) {
    const celda = h.getRange(1, x[0]);
    if (celdaTexto_(celda.getValue()) === "") celda.setNumberFormat("@").setValue(x[1]).setFontWeight("bold");
  });
  return h;
}

function diarioDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    fecha: String(p.fecha || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
    // Solo se acepta la marca de tarea finalizada (viene de «Día de Hoy»); cualquier otra cosa se ignora
    terminado: String(p.terminado || "") === MARCA_TAREA_FINALIZADA ? MARCA_TAREA_FINALIZADA : "",
    // Fecha y hora de creación y «ahora» (los manda la página con la hora del dispositivo)
    creada: FORMATO_SELLO_.test(String(p.creada || "")) ? String(p.creada) : "",
    ahora: FORMATO_SELLO_.test(String(p.ahora || "")) ? String(p.ahora) : "",
    // null = la página no lo mandó (se conserva el que tenía)
    favorito: p.favorito === undefined ? null : p.favorito === true || p.favorito === "true",
  };
}

// Hora de respaldo si la página no mandó la suya
function selloAhora_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function diarioError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de anotación inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  return "";
}

function diarioListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDiario_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_DIARIO);
    const diarios = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_DIARIO).getValues();
      const extras = h.getRange(2, COL_CREADA_DIARIO, ultima - 1, 2).getValues(); // F y G
      const favoritos = h.getRange(2, COL_FAV_DIARIO, ultima - 1, 1).getValues(); // L
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const fecha = fechaEjercicio_(f[1]);
        if (!nombre && !fecha) return; // fila sin anotación
        let terminado = celdaTexto_(f[3]);
        let id = celdaTexto_(f[4]);
        if (!id && /^\d{10,16}$/.test(terminado)) {
          // Hoja de la versión anterior: el Id estaba en la columna D, se pasa a la E
          id = terminado;
          terminado = "";
          h.getRange(i + 2, 4).clearContent();
          h.getRange(i + 2, COL_ID_DIARIO).setNumberFormat("@").setValue(id);
        } else if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, COL_ID_DIARIO).setNumberFormat("@").setValue(id);
        }
        diarios.push({
          id: id,
          nombre: nombre,
          fecha: fecha,
          descripcion: textoLeer_(f[2]),
          destino: idArchivoDeCelda_(f[2]) ? "drive" : "sheets",
          terminado: terminado !== "",
          marca: terminado, // "Sí" (trabajo terminado) o "Tarea finalizada" (desde Día de Hoy)
          creada: celdaTexto_(extras[i][0]),
          modificaciones: celdaTexto_(extras[i][1]).split(" | ").filter(function (x) { return x; }),
          favorito: favoritoDeCelda_(favoritos[i][0]),
        });
      });
    }
    return responder_({ ok: true, diarios: diarios });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function diarioAgregar_(p) {
  const d = diarioDatos_(p);
  const motivo = diarioError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDiario_();
    const ultimaD = ultimaFilaEn_(h, 1, N_COL_DIARIO);
    // Si ya estaba (por un intento anterior), no se repite
    if (ultimaD >= 2) {
      const ids = h.getRange(2, COL_ID_DIARIO, ultimaD - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) return responder_({ ok: true });
      }
    }
    const fila = Math.max(ultimaD, 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_DIARIO)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Diario", d.nombre, d.id, "", true), d.terminado, d.id]]);
    h.getRange(fila, COL_CREADA_DIARIO, 1, 2).setNumberFormat("@").setValues([[d.creada || d.ahora || selloAhora_(), ""]]);
    h.getRange(fila, COL_FAV_DIARIO).setNumberFormat("@").setValue(d.favorito ? "Sí" : "");
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function diarioEditar_(p) {
  const d = diarioDatos_(p);
  const motivo = diarioError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDiario_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_DIARIO);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_DIARIO, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          // Solo A, B y C: la columna D (trabajo terminado) no se toca
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Diario", d.nombre, d.id, h.getRange(i + 2, 3).getValue(), d.destino === "drive")]]);
          // Registro de modificaciones: una por día (si ya se modificó hoy, se actualiza la hora de ese día)
          const sello = d.ahora || selloAhora_();
          const celdaM = h.getRange(i + 2, COL_MODIF_DIARIO);
          const mods = celdaTexto_(celdaM.getValue()).split(" | ").filter(function (x) { return x; });
          if (mods.length && mods[mods.length - 1].split(" ")[0] === sello.split(" ")[0]) mods[mods.length - 1] = sello;
          else mods.push(sello);
          celdaM.setNumberFormat("@").setValue(mods.slice(-30).join(" | "));
          if (d.favorito !== null) h.getRange(i + 2, COL_FAV_DIARIO).setNumberFormat("@").setValue(d.favorito ? "Sí" : "");
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la anotación" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function diarioBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de anotación: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDiario_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_DIARIO);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_DIARIO, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, 3).getValue());
          // Se quitan las celdas del diario y las de abajo suben
          h.getRange(i + 2, 1, 1, COL_MODIF_DIARIO).deleteCells(SpreadsheetApp.Dimension.ROWS); // A a G (incluye Creada y Modificaciones)
          h.getRange(i + 2, COL_FAV_DIARIO).deleteCells(SpreadsheetApp.Dimension.ROWS); // L (Favorito)
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la anotación" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Deudas (hoja "Diario", columnas H a K) ----------
// Notas aparte que viven en la misma hoja "Diario" pero en sus propias columnas:
//   H Nombre | I Fecha (de creación) | J Descripcion | K Id
// Las columnas del Diario (A a E) y las de las deudas (H a K) son independientes: cada grupo calcula su
// propia última fila, agrega y borra celdas solo en sus columnas.
const COL_DEUDAS = 8; // columna H
const N_COL_DEUDAS = 4;
const COL_FECHA_DEUDAS = COL_DEUDAS + 1; // columna I
const COL_DESC_DEUDAS = COL_DEUDAS + 2; // columna J
const COL_ID_DEUDAS = COL_DEUDAS + 3; // columna K
const ENCABEZADOS_DEUDAS = ["Nombre", "Fecha", "Descripcion", "Id"];

// Día de hoy como "AAAA-MM-DD" (en la zona horaria del script)
function fechaHoy_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

// "AAAA-MM-DD" -> "dd/mm/aaaa"
function fechaCorta_(f) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || "");
  return m ? m[3] + "/" + m[2] + "/" + m[1] : "";
}

// Hoja "Diario" asegurando que existan las columnas H a K y sus encabezados.
// Si todavía tiene los encabezados de la versión anterior (H Deuda | I Descripcion | J Id), pasan a
// Nombre | Fecha | Descripcion | Id. Los datos de las filas viejas se pasan solos al leer (deudasListar_).
function hojaDeudas_() {
  const h = hojaDiario_();
  const necesarias = COL_DEUDAS + N_COL_DEUDAS - 1;
  if (h.getMaxColumns() < necesarias) {
    h.insertColumnsAfter(h.getMaxColumns(), necesarias - h.getMaxColumns());
  }
  const valores = h.getRange(1, COL_DEUDAS, 1, N_COL_DEUDAS).getValues()[0];
  const versionAnterior = nombreNormalizado_(celdaTexto_(valores[2])) === "id";
  if (versionAnterior) {
    h.getRange(1, COL_DEUDAS, 1, N_COL_DEUDAS)
      .setNumberFormat("@")
      .setValues([ENCABEZADOS_DEUDAS])
      .setFontWeight("bold");
    return h;
  }
  valores.forEach(function (v, i) {
    if (String(v).trim() === "") {
      h.getRange(1, COL_DEUDAS + i).setNumberFormat("@").setValue(ENCABEZADOS_DEUDAS[i]).setFontWeight("bold");
    }
  });
  return h;
}

function deudaDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    fecha: String(p.fecha || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
// (la fecha es opcional: si no viene, al crear la deuda se anota la de hoy)
function deudaError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de deuda inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (d.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  return "";
}

function deudasListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDeudas_();
    const ultima = ultimaFilaEn_(h, COL_DEUDAS, N_COL_DEUDAS);
    const deudas = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, COL_DEUDAS, ultima - 1, N_COL_DEUDAS).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const fila = i + 2;
        const nombre = celdaTexto_(f[0]);
        let fecha = fechaEjercicio_(f[1]);
        let celdaDesc = f[2];
        let id = celdaTexto_(f[3]);
        if (!id && /^\d{10,16}$/.test(celdaTexto_(f[2]))) {
          // Fila de la versión anterior (H Deuda | I Descripcion | J Id): se acomoda a H Nombre | I Fecha |
          // J Descripcion | K Id. Esas deudas no guardaron fecha de creación, así que su fecha queda vacía.
          id = celdaTexto_(f[2]);
          celdaDesc = f[1];
          fecha = "";
          h.getRange(fila, COL_DEUDAS, 1, N_COL_DEUDAS)
            .setNumberFormat("@")
            .setValues([[f[0], "", celdaDesc, id]]);
        }
        const descripcion = textoLeer_(celdaDesc);
        if (!nombre && !descripcion) return; // fila sin deuda
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(fila, COL_ID_DEUDAS).setNumberFormat("@").setValue(id);
        }
        deudas.push({
          id: id,
          nombre: nombre || "Sin nombre",
          fecha: fecha,
          descripcion: descripcion,
          destino: idArchivoDeCelda_(celdaDesc) ? "drive" : "sheets",
        });
      });
    }
    return responder_({ ok: true, deudas: deudas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function deudasAgregar_(p) {
  const d = deudaDatos_(p);
  const motivo = deudaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDeudas_();
    // Si ya estaba (por un intento anterior), no se repite
    const ultimaD = ultimaFilaEn_(h, COL_DEUDAS, N_COL_DEUDAS);
    if (ultimaD >= 2) {
      const ids = h.getRange(2, COL_ID_DEUDAS, ultimaD - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) return responder_({ ok: true });
      }
    }
    // Siguiente fila libre dentro de las columnas H a K (el encabezado cuenta como fila 1)
    const fila = Math.max(ultimaD, 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, COL_DEUDAS, 1, N_COL_DEUDAS)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha || fechaHoy_(), textoGuardar_(d.descripcion, "Deuda", d.nombre, d.id, "", true), d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function deudasEditar_(p) {
  const d = deudaDatos_(p);
  const motivo = deudaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDeudas_();
    const ultima = ultimaFilaEn_(h, COL_DEUDAS, N_COL_DEUDAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_DEUDAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          const fila = i + 2;
          // Solo H (nombre) y J (descripción): la fecha de creación (I) y el Id (K) no se tocan
          h.getRange(fila, COL_DEUDAS).setNumberFormat("@").setValue(d.nombre);
          h.getRange(fila, COL_DESC_DEUDAS)
            .setNumberFormat("@")
            .setValue(textoGuardar_(d.descripcion, "Deuda", d.nombre, d.id, h.getRange(fila, COL_DESC_DEUDAS).getValue(), d.destino === "drive"));
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la deuda" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function deudasBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de deuda: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaDeudas_();
    const ultima = ultimaFilaEn_(h, COL_DEUDAS, N_COL_DEUDAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_DEUDAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, COL_DESC_DEUDAS).getValue());
          // Se quitan solo las celdas H a K de esa deuda y las de abajo suben (el Diario no se mueve)
          h.getRange(i + 2, COL_DEUDAS, 1, N_COL_DEUDAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la deuda" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Deuda finalizada: pasa de las columnas H-K al Diario (columnas A-E) como «Tarea finalizada», con la
// fecha del día en que se presionó el botón. Usa el mismo Id en ambos lados, así que si se repite la
// petición (por un fallo a medias) no queda duplicada en el Diario.
function deudasFinalizar_(p) {
  const id = String(p.id || "");
  const fecha = String(p.fecha || "").trim() || fechaHoy_();
  if (!/^\d{10,16}$/.test(id) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return responder_({ ok: false, error: "Datos inválidos (id de deuda: " + id + ", fecha: " + fecha + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 1) Buscar la deuda (columnas H a K)
    const h = hojaDeudas_();
    const ultima = ultimaFilaEn_(h, COL_DEUDAS, N_COL_DEUDAS);
    let fila = -1;
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_DEUDAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          fila = i + 2;
          break;
        }
      }
    }
    if (fila === -1) return responder_({ ok: false, error: "No se encontró la deuda" });
    const f = h.getRange(fila, COL_DEUDAS, 1, N_COL_DEUDAS).getValues()[0];
    const nombre = celdaTexto_(f[0]).slice(0, 80) || "Sin nombre";
    const creada = fechaCorta_(fechaEjercicio_(f[1]));
    const texto = textoLeer_(f[2]);
    // En el Diario se conserva el día en que se creó la deuda (la fecha de la anotación es la de hoy)
    const descripcion = creada ? "Deuda creada el " + creada + (texto ? "\n\n" + texto : "") : texto;

    // 2) Agregarla al Diario (si ya estaba por un intento anterior, no se repite)
    const hd = hojaDiario_();
    const ultimaD = ultimaFilaEn_(hd, 1, N_COL_DIARIO);
    let yaEsta = false;
    if (ultimaD >= 2) {
      const idsD = hd.getRange(2, COL_ID_DIARIO, ultimaD - 1, 1).getValues();
      for (let i = 0; i < idsD.length; i++) {
        if (celdaTexto_(idsD[i][0]) === id) {
          yaEsta = true;
          break;
        }
      }
    }
    if (!yaEsta) {
      const filaD = Math.max(ultimaD, 1) + 1;
      if (filaD > hd.getMaxRows()) hd.insertRowsAfter(hd.getMaxRows(), filaD - hd.getMaxRows());
      hd.getRange(filaD, 1, 1, N_COL_DIARIO)
        .setNumberFormat("@")
        .setValues([[nombre, fecha, textoGuardar_(descripcion, "Diario", nombre, id, "", true), MARCA_TAREA_FINALIZADA, id]]);
    }

    // 3) Quitarla de las deudas (solo H a K; si su texto estaba en Drive, ese archivo va a la papelera)
    textoSoltar_(f[2]);
    h.getRange(fila, COL_DEUDAS, 1, N_COL_DEUDAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Información Primordial (hoja "Informacion Primordial") ----------
// Nombre, Fecha (AAAA-MM-DD), Descripcion, Id. Si la hoja no existe, se crea sola.
const NOMBRE_HOJA_INFORMACION = "Informacion Primordial";
const N_COL_INFORMACION = 4;
const ENCABEZADOS_INFORMACION = ["Nombre", "Fecha", "Descripcion", "Id"];

function hojaInformacion_() {
  return hojaTabla_(NOMBRE_HOJA_INFORMACION, ENCABEZADOS_INFORMACION);
}

function informacionDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    fecha: String(p.fecha || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function informacionError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  return "";
}

function informacionListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaInformacion_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_INFORMACION);
    const informaciones = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_INFORMACION).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const fecha = fechaEjercicio_(f[1]);
        const descripcion = textoLeer_(f[2]);
        if (!nombre && !fecha && !descripcion) return; // fila vacía
        let id = celdaTexto_(f[3]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 4).setNumberFormat("@").setValue(id);
        }
        informaciones.push({ id: id, nombre: nombre || "Sin nombre", fecha: fecha, descripcion: descripcion, destino: idArchivoDeCelda_(f[2]) ? "drive" : "sheets" });
      });
    }
    return responder_({ ok: true, informaciones: informaciones });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function informacionAgregar_(p) {
  const d = informacionDatos_(p);
  const motivo = informacionError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaInformacion_();
    if (idYaExiste_(h, 4, ultimaFilaEn_(h, 1, N_COL_INFORMACION), d.id)) return responder_({ ok: true });
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_INFORMACION), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_INFORMACION)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Informacion", d.nombre, d.id, "", true), d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function informacionEditar_(p) {
  const d = informacionDatos_(p);
  const motivo = informacionError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaInformacion_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_INFORMACION);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Informacion", d.nombre, d.id, h.getRange(i + 2, 3).getValue(), d.destino === "drive")]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la información" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function informacionBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaInformacion_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_INFORMACION);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, 3).getValue());
          // Se quitan las celdas de esa nota y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_INFORMACION).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la información" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Comandos (hoja "comandos") ----------
// Nombre, Fecha (AAAA-MM-DD), Descripcion, Id. Si la hoja no existe, se crea sola.
const NOMBRE_HOJA_COMANDOS = "comandos";
const N_COL_COMANDOS = 4;
const ENCABEZADOS_COMANDOS = ["Nombre", "Fecha", "Descripcion", "Id"];

function hojaComandos_() {
  return hojaTabla_(NOMBRE_HOJA_COMANDOS, ENCABEZADOS_COMANDOS);
}

function comandoDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    fecha: String(p.fecha || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function comandoError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de comando inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  return "";
}

function comandosListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaComandos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_COMANDOS);
    const comandosLista = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_COMANDOS).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const fecha = fechaEjercicio_(f[1]);
        const descripcion = textoLeer_(f[2]);
        if (!nombre && !fecha && !descripcion) return; // fila vacía
        let id = celdaTexto_(f[3]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, 4).setNumberFormat("@").setValue(id);
        }
        comandosLista.push({ id: id, nombre: nombre || "Sin nombre", fecha: fecha, descripcion: descripcion, destino: idArchivoDeCelda_(f[2]) ? "drive" : "sheets" });
      });
    }
    return responder_({ ok: true, comandosLista: comandosLista });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function comandosAgregar_(p) {
  const d = comandoDatos_(p);
  const motivo = comandoError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaComandos_();
    if (idYaExiste_(h, 4, ultimaFilaEn_(h, 1, N_COL_COMANDOS), d.id)) return responder_({ ok: true });
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_COMANDOS), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_COMANDOS)
      .setNumberFormat("@")
      .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Comando", d.nombre, d.id, "", true), d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function comandosEditar_(p) {
  const d = comandoDatos_(p);
  const motivo = comandoError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaComandos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_COMANDOS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.nombre, d.fecha, textoGuardar_(d.descripcion, "Comando", d.nombre, d.id, h.getRange(i + 2, 3).getValue(), d.destino === "drive")]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el comando" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function comandosBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de comando: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaComandos_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_COMANDOS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 4, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, 3).getValue());
          // Se quitan las celdas de ese comando y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_COMANDOS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el comando" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Bazar (hoja "Bazar") ----------
// Nombre, Informacion, Categoria, Id. Si la hoja no existe, se crea sola (también se acepta "bazar" en minúsculas).
// Categoria solo puede ser: Bazar, Pedidos de Yeso o Ventas (en la hoja sale como lista desplegable).
// Si tu hoja era de la versión anterior (Nombre | Informacion | Id), se acomoda sola: la Id pasa a la D
// y la C queda como Categoria con "Bazar" en los registros que ya tenías.
const NOMBRE_HOJA_BAZAR = "Bazar";
const N_COL_BAZAR = 4;
const COL_CATEGORIA_BAZAR = 3; // columna C
const COL_ID_BAZAR = 4; // columna D
const ENCABEZADOS_BAZAR = ["Nombre", "Informacion", "Categoria", "Id"];
const CATEGORIAS_BAZAR = ["Bazar", "Pedidos de Yeso", "Ventas"];
const CATEGORIA_BAZAR_DEFECTO = "Bazar";

// Texto cualquiera -> una de las tres categorías (si no coincide con ninguna, "Bazar")
function categoriaBazar_(v) {
  const buscada = nombreNormalizado_(celdaTexto_(v));
  for (let i = 0; i < CATEGORIAS_BAZAR.length; i++) {
    if (nombreNormalizado_(CATEGORIAS_BAZAR[i]) === buscada) return CATEGORIAS_BAZAR[i];
  }
  return CATEGORIA_BAZAR_DEFECTO;
}

function hojaBazar_() {
  const h = hojaTabla_(NOMBRE_HOJA_BAZAR, ENCABEZADOS_BAZAR);
  // Versión anterior: la columna C todavía se llama "Id" y guarda las Id. Se pasan a la D y la C
  // queda como "Categoria" (con "Bazar" en cada registro que ya existía).
  const c = h.getRange(1, COL_CATEGORIA_BAZAR);
  if (nombreNormalizado_(celdaTexto_(c.getValue())) === "id") {
    const ultima = ultimaFilaEn_(h, 1, N_COL_BAZAR);
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_BAZAR).getValues();
      const nuevos = filas.map(function (f) {
        const idViejo = celdaTexto_(f[2]);
        const idNuevo = celdaTexto_(f[3]) || idViejo;
        const hayRegistro =
          celdaTexto_(f[0]) !== "" || String(f[1] === null || f[1] === undefined ? "" : f[1]).trim() !== "";
        return [hayRegistro ? CATEGORIA_BAZAR_DEFECTO : "", idNuevo];
      });
      h.getRange(2, COL_CATEGORIA_BAZAR, nuevos.length, 2).setNumberFormat("@").setValues(nuevos);
    }
    c.setNumberFormat("@").setValue(ENCABEZADOS_BAZAR[2]).setFontWeight("bold");
  }
  // Lista desplegable en la columna C para que solo se pueda escribir una de las tres categorías
  try {
    if (!h.getRange(2, COL_CATEGORIA_BAZAR).getDataValidation()) {
      const regla = SpreadsheetApp.newDataValidation()
        .requireValueInList(CATEGORIAS_BAZAR, true)
        .setAllowInvalid(false)
        .build();
      h.getRange(2, COL_CATEGORIA_BAZAR, Math.max(h.getMaxRows() - 1, 1), 1).setDataValidation(regla);
    }
  } catch (err) {
    // la validación es solo una ayuda visual; si falla, todo sigue funcionando
  }
  return h;
}

function bazarDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 80),
    informacion: String(p.informacion || "").trim(),
    categoria: String(p.categoria || CATEGORIA_BAZAR_DEFECTO).trim(),
    destino: String(p.destino || "") === "drive" ? "drive" : "sheets",
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function bazarError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de registro inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (CATEGORIAS_BAZAR.indexOf(d.categoria) === -1) return "categoría inválida: " + d.categoria;
  if (d.informacion.length > LIMITE_TEXTO_LARGO) return "la información es demasiado larga";
  return "";
}

function bazarListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaBazar_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_BAZAR);
    const bazarLista = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_BAZAR).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const informacion = textoLeer_(f[1]);
        if (!nombre && !informacion) return; // fila vacía
        let id = celdaTexto_(f[3]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, COL_ID_BAZAR).setNumberFormat("@").setValue(id);
        }
        bazarLista.push({
          id: id,
          nombre: nombre || "Sin nombre",
          informacion: informacion,
          categoria: categoriaBazar_(f[2]),
          destino: idArchivoDeCelda_(f[1]) ? "drive" : "sheets",
        });
      });
    }
    return responder_({ ok: true, bazarLista: bazarLista });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function bazarAgregar_(p) {
  const d = bazarDatos_(p);
  const motivo = bazarError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaBazar_();
    if (idYaExiste_(h, COL_ID_BAZAR, ultimaFilaEn_(h, 1, N_COL_BAZAR), d.id)) return responder_({ ok: true });
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_BAZAR), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, 1, 1, N_COL_BAZAR)
      .setNumberFormat("@")
      .setValues([[d.nombre, textoGuardar_(d.informacion, "Bazar", d.nombre, d.id, "", true), d.categoria, d.id]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function bazarEditar_(p) {
  const d = bazarDatos_(p);
  const motivo = bazarError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaBazar_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_BAZAR);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_BAZAR, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          // Solo A, B y C (nombre, información y categoría): la columna D (Id) no se toca
          h.getRange(i + 2, 1, 1, 3)
            .setNumberFormat("@")
            .setValues([[d.nombre, textoGuardar_(d.informacion, "Bazar", d.nombre, d.id, h.getRange(i + 2, 2).getValue(), d.destino === "drive"), d.categoria]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el registro" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function bazarBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de registro: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaBazar_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_BAZAR);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_BAZAR, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, 2).getValue());
          // Se quitan las celdas de ese registro y las de abajo suben
          h.getRange(i + 2, 1, 1, N_COL_BAZAR).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró el registro" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Notario (hoja "Notarios" + carpeta de Google Drive) ----------
// Un Notario es una "zona de notas dentro de una zona de notas": tiene nombre y descripción, y dentro
// guarda varias notas SEPARADAS. Las notas YA NO viven dentro de una celda (Google Sheets admite solo
// 50,000 caracteres por celda): cada Notario tiene su propio archivo .txt dentro de una carpeta de
// Google Drive llamada "notaslargas" (se crea sola en "Mi unidad" la primera vez).
// Hoja "Notarios", fila 1: A Zona | B Nombre | C Descripcion | D Fecha | E Notas | F Id | G Archivo
//  - E "Notas": el link del archivo .txt en Drive (para abrirlo con un clic)
//  - G "Archivo": el Id del archivo en Drive (la página lo usa para encontrarlo; no la borres)
// Los notarios antiguos (con las notas escritas dentro de la celda E) se siguen leyendo igual y pasan
// solos a Drive la próxima vez que guardes una nota en ellos (o todos a la vez ejecutando
// migrarNotariosADrive desde el editor).
// Formato del archivo .txt (legible también directamente en Drive):
//   #IdNota|dd/mm/aaaa hh:mm
//   texto de la nota
//   ~~~✂~~~
//   #IdNota|dd/mm/aaaa hh:mm
//   texto de la siguiente nota
const NOMBRE_HOJA_NOTARIOS = "Notarios";
const N_COL_NOTARIOS = 8;
const COL_DESTINO_NOTARIOS = 8; // H: "sheets" (notas en la celda E) o "drive" (notas en un .txt)
const COL_NOTAS_NOTARIOS = 5; // E: link del archivo (o, en los notarios antiguos, las notas mismas)
const COL_ID_NOTARIOS = 6; // F
const COL_ARCHIVO_NOTARIOS = 7; // G: Id del archivo de Drive
const ENCABEZADOS_NOTARIOS = ["Zona", "Nombre", "Descripcion", "Fecha", "Notas", "Id", "Archivo", "Destino"];
// Tope de caracteres de un notario guardado en Google Sheets (límite de una celda)
const LIMITE_NOTARIO_SHEETS = 50000;
// Destino de un notario: "sheets" solo si así se eligió; todo lo demás (incluidos los notarios antiguos) es Drive
// Una zona de notarios es válida si es una de las fijas o la de un proyecto («proy-» + Id del proyecto)
function zonaNotarioValida_(zona) {
  return ZONAS_NOTARIO.indexOf(zona) !== -1 || /^proy-\d{10,16}$/.test(String(zona || ""));
}
function notarioDestinoDe_(v) {
  return celdaTexto_(v).toLowerCase() === "sheets" ? "sheets" : "drive";
}
function notarioLimite_(destino) {
  return destino === "sheets" ? LIMITE_NOTARIO_SHEETS : LIMITE_NOTARIO;
}
const NOMBRE_CARPETA_NOTARIOS = "notaslargas";
// Máximo de caracteres por notario. Es un tope de seguridad (la página los carga todos de una vez);
// si algún día necesitas más, súbelo aquí y también NT_LIMITE en app.js.
const LIMITE_NOTARIO = 1000000;
const SEPARADOR_NOTARIO = "\n~~~✂~~~\n";
const MARCA_SEPARADOR_NOTARIO = "~~~✂~~~";
// Zonas donde se puede crear un Notario (deben ser las mismas claves que usa la página)
const ZONAS_NOTARIO = [
  "notas", "actividades", "trabajo", "pedidos-yeso", "ejercicio", "diario",
  "deudas", "informacion", "comandos", "bazar",
  "notas-imp", "notas-fav", // botón «Notas» de arriba: «Mis notas» y «Favoritas»
];

function hojaNotarios_() {
  return hojaTabla_(NOMBRE_HOJA_NOTARIOS, ENCABEZADOS_NOTARIOS);
}

// Carpeta de Drive donde viven los .txt de los notarios (si no existe, se crea).
// Su Id se guarda en las propiedades del script para no buscarla por nombre cada vez.
function carpetaNotarios_() {
  const props = PropertiesService.getScriptProperties();
  const guardado = props.getProperty("CARPETA_NOTARIOS_ID");
  if (guardado) {
    try {
      const c = DriveApp.getFolderById(guardado);
      if (!c.isTrashed()) return c;
    } catch (err) {
      // la carpeta ya no existe: se busca o se crea otra
    }
  }
  let carpeta = null;
  const it = DriveApp.getFoldersByName(NOMBRE_CARPETA_NOTARIOS);
  while (it.hasNext()) {
    const c = it.next();
    if (!c.isTrashed()) {
      carpeta = c;
      break;
    }
  }
  if (!carpeta) carpeta = DriveApp.createFolder(NOMBRE_CARPETA_NOTARIOS);
  props.setProperty("CARPETA_NOTARIOS_ID", carpeta.getId());
  return carpeta;
}

// Ejecuta esta función UNA sola vez desde el editor (botón "Ejecutar") para darle al script
// el permiso de usar Google Drive. Además crea la carpeta "notaslargas".
function autorizarDrive() {
  const c = carpetaNotarios_();
  Logger.log("Carpeta lista: " + c.getUrl());
}

// Nombre del archivo: "Nombre del notario [Id].txt" (sin caracteres que Drive no acepte bien)
function nombreArchivoNotario_(nombre, id) {
  const limpio =
    String(nombre || "")
      .replace(/[\\\/:*?"<>|\r\n]+/g, " ")
      .trim()
      .slice(0, 60) || "Sin nombre";
  return limpio + " [" + id + "].txt";
}

// Lee un archivo de notario; devuelve null si no se puede (borrado, sin permiso...)
function notarioLeerArchivo_(archivoId) {
  try {
    return DriveApp.getFileById(archivoId).getBlob().getDataAsString("UTF-8");
  } catch (err) {
    return null;
  }
}

// Escribe el contenido de un notario en su archivo de Drive. Si todavía no tiene archivo, lo crea
// en la carpeta "notaslargas" y anota su Id (columna G) y su link (columna E) en la hoja.
function notarioGuardarContenido_(h, fila, id, nombre, archivoId, contenido, destino) {
  if (destino === "sheets" && !archivoId) {
    // Notario de Google Sheets: las notas viven dentro de la celda E
    h.getRange(fila, COL_NOTAS_NOTARIOS).setNumberFormat("@").setValue(contenido);
    return;
  }
  if (archivoId) {
    DriveApp.getFileById(archivoId).setContent(contenido);
    return;
  }
  const archivo = carpetaNotarios_().createFile(
    nombreArchivoNotario_(nombre, id),
    contenido,
    MimeType.PLAIN_TEXT
  );
  h.getRange(fila, COL_ARCHIVO_NOTARIOS).setNumberFormat("@").setValue(archivo.getId());
  h.getRange(fila, COL_NOTAS_NOTARIOS).setNumberFormat("@").setValue(archivo.getUrl());
}

// Texto de una nota sin la marca de separación (por si alguien la escribe)
function limpiarTextoNotario_(t) {
  return String(t || "").split(MARCA_SEPARADOR_NOTARIO).join("~~✂~~").trim();
}

// Contenido (archivo o celda) -> lista de notas [{ id, fecha, texto }]
function notarioParsear_(celda) {
  const s = String(celda === null || celda === undefined ? "" : celda);
  if (!s.trim()) return [];
  const notas = [];
  const base = Math.floor(Date.now() * 1000);
  s.split(SEPARADOR_NOTARIO).forEach(function (parte, i) {
    if (!parte.trim()) return;
    const m = /^#(\d{10,16})\|([^\n]*)\n?([\s\S]*)$/.exec(parte);
    if (m) {
      // Encabezado: «fecha» o «fecha|nombre» (el nombre de la nota es opcional)
      const corte = m[2].indexOf("|");
      const fechaN = (corte < 0 ? m[2] : m[2].slice(0, corte)).trim();
      const nombreN = corte < 0 ? "" : m[2].slice(corte + 1).trim();
      notas.push({ id: m[1], fecha: fechaN, nombre: nombreN, texto: m[3] });
    } else notas.push({ id: String(base + i), fecha: "", nombre: "", texto: parte.trim() }); // escrita a mano
  });
  return notas;
}

// Lista de notas -> texto del archivo
function notarioSerializar_(notas) {
  return notas
    .map(function (n) {
      return "#" + n.id + "|" + n.fecha + (n.nombre ? "|" + n.nombre : "") + "\n" + n.texto;
    })
    .join(SEPARADOR_NOTARIO);
}

function notariosListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_NOTARIOS);
    const notarios = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_NOTARIOS).getValues();
      const base = Math.floor(Date.now() * 1000);
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[1]);
        let contenido = String(f[4] === null || f[4] === undefined ? "" : f[4]);
        if (!nombre && !contenido.trim()) return; // fila vacía
        let id = celdaTexto_(f[5]);
        if (!id) {
          // Fila escrita a mano en la hoja: se le da un Id para poder editarla desde la página
          id = String(base + i);
          h.getRange(i + 2, COL_ID_NOTARIOS).setNumberFormat("@").setValue(id);
        }
        // Si ya tiene archivo en Drive, las notas se leen de ahí (la celda E solo trae el link)
        const archivoId = celdaTexto_(f[6]);
        if (archivoId) {
          const t = notarioLeerArchivo_(archivoId);
          contenido = t === null ? "" : t;
        }
        let zona = celdaTexto_(f[0]);
        if (!zonaNotarioValida_(zona)) zona = "notas";
        notarios.push({
          id: id,
          zona: zona,
          nombre: nombre || "Sin nombre",
          descripcion: celdaTexto_(f[2]),
          fecha: celdaTexto_(f[3]),
          notas: notarioParsear_(contenido),
          destino: archivoId ? "drive" : notarioDestinoDe_(f[7]),
          limite: notarioLimite_(archivoId ? "drive" : notarioDestinoDe_(f[7])),
        });
      });
    }
    return responder_({ ok: true, notarios: notarios, limite: LIMITE_NOTARIO });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Busca la fila de un Notario por su Id (0 si no existe)
function notarioFila_(h, id) {
  const ultima = ultimaFilaEn_(h, 1, N_COL_NOTARIOS);
  if (ultima < 2) return 0;
  const ids = h.getRange(2, COL_ID_NOTARIOS, ultima - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (celdaTexto_(ids[i][0]) === id) return i + 2;
  }
  return 0;
}

// Las notas actuales de un notario: del archivo de Drive o, si es un notario antiguo, de la celda E.
// Devuelve { archivoId, notas } o { error } si el archivo de Drive no se pudo leer (así nunca se
// sobrescribe con algo vacío por error).
function notarioNotasActuales_(h, fila) {
  const f = h.getRange(fila, 1, 1, N_COL_NOTARIOS).getValues()[0];
  const archivoId = celdaTexto_(f[COL_ARCHIVO_NOTARIOS - 1]);
  let contenido;
  if (archivoId) {
    contenido = notarioLeerArchivo_(archivoId);
    if (contenido === null) {
      return {
        error: "No se pudo leer el archivo de este notario en Drive. ¿Lo borraste o lo moviste de la carpeta «" +
          NOMBRE_CARPETA_NOTARIOS + "»?",
      };
    }
  } else {
    const c = f[COL_NOTAS_NOTARIOS - 1];
    contenido = String(c === null || c === undefined ? "" : c);
  }
  return {
    archivoId: archivoId,
    nombre: celdaTexto_(f[1]),
    notas: notarioParsear_(contenido),
    destino: archivoId ? "drive" : notarioDestinoDe_(f[COL_DESTINO_NOTARIOS - 1]),
  };
}

function notariosAgregar_(p) {
  const id = String(p.id || "");
  const zona = String(p.zona || "");
  const nombre = String(p.nombre || "").trim().slice(0, 80);
  const descripcion = String(p.descripcion || "").trim();
  const fecha = String(p.fecha || "").trim().slice(0, 40);
  const destino = "drive"; // todo se guarda en Drive (los notarios antiguos de Sheets se pasan con «Migrar a Drive»)
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ")" });
  if (!zonaNotarioValida_(zona)) return responder_({ ok: false, error: "Datos inválidos (zona: " + zona + ")" });
  if (!nombre) return responder_({ ok: false, error: "Datos inválidos (falta el nombre)" });
  if (descripcion.length > 5000) return responder_({ ok: false, error: "Datos inválidos (la descripción es demasiado larga)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const fila = Math.max(ultimaFilaEn_(h, 1, N_COL_NOTARIOS), 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Si el destino es Drive, el archivo se crea al guardar la primera nota
    h.getRange(fila, 1, 1, N_COL_NOTARIOS)
      .setNumberFormat("@")
      .setValues([[zona, nombre, descripcion, fecha, "", id, "", destino]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Cambia solo el nombre y la descripción (las notas no se tocan)
function notariosEditar_(p) {
  const id = String(p.id || "");
  const nombre = String(p.nombre || "").trim().slice(0, 80);
  const descripcion = String(p.descripcion || "").trim();
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ")" });
  if (!nombre) return responder_({ ok: false, error: "Datos inválidos (falta el nombre)" });
  if (descripcion.length > 5000) return responder_({ ok: false, error: "Datos inválidos (la descripción es demasiado larga)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const fila = notarioFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró el notario" });
    h.getRange(fila, 2, 1, 2).setNumberFormat("@").setValues([[nombre, descripcion]]);
    // Si ya tiene archivo en Drive, se le actualiza el nombre (si falla, no importa)
    const archivoId = celdaTexto_(h.getRange(fila, COL_ARCHIVO_NOTARIOS).getValue());
    if (archivoId) {
      try {
        DriveApp.getFileById(archivoId).setName(nombreArchivoNotario_(nombre, id));
      } catch (err) {}
    }
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function notariosBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const fila = notarioFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró el notario" });
    // Su archivo de Drive va a la papelera (se puede recuperar desde ahí)
    const archivoId = celdaTexto_(h.getRange(fila, COL_ARCHIVO_NOTARIOS).getValue());
    if (archivoId) {
      try {
        DriveApp.getFileById(archivoId).setTrashed(true);
      } catch (err) {}
    }
    // Se quitan las celdas del notario y las de abajo suben
    h.getRange(fila, 1, 1, N_COL_NOTARIOS).deleteCells(SpreadsheetApp.Dimension.ROWS);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Agrega una nota al notario, o reemplaza el texto de una que ya existe (si viene su notaId).
// Si el resultado pasaría de LIMITE_NOTARIO caracteres, NO se guarda.
function notariosNotaGuardar_(p) {
  const id = String(p.id || "");
  const notaId = String(p.notaId || "");
  const fecha = String(p.fecha || "").trim().slice(0, 40).replace(/[\r\n|]/g, " ");
  const texto = limpiarTextoNotario_(p.texto);
  // Nombre de la nota (opcional): una línea, sin «|», máximo 60 caracteres. Si no viene, al editar se conserva el que tenía
  const nombreNota = String(p.nombre || "").replace(/[\r\n|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  if (!/^\d{10,16}$/.test(id) || !/^\d{10,16}$/.test(notaId)) {
    return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ", id de nota: " + notaId + ")" });
  }
  if (!texto) return responder_({ ok: false, error: "Datos inválidos (la nota está vacía)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const fila = notarioFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró el notario" });
    const act = notarioNotasActuales_(h, fila);
    if (act.error) return responder_({ ok: false, error: act.error });
    const notas = act.notas;
    let hallada = false;
    notas.forEach(function (n) {
      if (n.id === notaId) {
        n.texto = texto; // al editar se conserva la fecha original
        if (p.nombre !== undefined) n.nombre = nombreNota;
        hallada = true;
      }
    });
    if (!hallada) notas.push({ id: notaId, fecha: fecha, nombre: nombreNota, texto: texto });
    const contenido = notarioSerializar_(notas);
    const limite = notarioLimite_(act.destino);
    if (contenido.length > limite) {
      return responder_({
        ok: false,
        error:
          "Este notario no tiene espacio: pasaría de " + limite + " caracteres (con esta nota serían " +
          contenido.length + "). Acorta la nota o crea otro notario" + (act.destino === "sheets" ? " (en Google Drive caben hasta " + LIMITE_NOTARIO + ")." : "."),
      });
    }
    notarioGuardarContenido_(h, fila, id, act.nombre, act.archivoId, contenido, act.destino);
    return responder_({ ok: true, largo: contenido.length });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function notariosNotaBorrar_(p) {
  const id = String(p.id || "");
  const notaId = String(p.notaId || "");
  if (!/^\d{10,16}$/.test(id) || !/^\d{10,16}$/.test(notaId)) {
    return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ", id de nota: " + notaId + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaNotarios_();
    const fila = notarioFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró el notario" });
    const act = notarioNotasActuales_(h, fila);
    if (act.error) return responder_({ ok: false, error: act.error });
    const quedan = act.notas.filter(function (n) {
      return n.id !== notaId;
    });
    if (quedan.length === act.notas.length) return responder_({ ok: false, error: "No se encontró la nota" });
    const contenido = notarioSerializar_(quedan);
    notarioGuardarContenido_(h, fila, id, act.nombre, act.archivoId, contenido, act.destino);
    return responder_({ ok: true, largo: contenido.length });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// OPCIONAL: ejecútala UNA vez desde el editor para pasar a Drive, de golpe, todos los notarios
// antiguos (los que todavía tienen sus notas dentro de la celda E). La celda solo se cambia por el
// link del archivo después de comprobar que el .txt quedó idéntico. Si no la ejecutas, cada notario
// pasa solo a Drive la próxima vez que le guardes una nota.
function migrarNotariosADrive() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const h = hojaNotarios_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_NOTARIOS);
    let movidos = 0;
    for (let fila = 2; fila <= ultima; fila++) {
      const f = h.getRange(fila, 1, 1, N_COL_NOTARIOS).getValues()[0];
      const celda = String(f[4] === null || f[4] === undefined ? "" : f[4]);
      if (celdaTexto_(f[6]) || !celda.trim()) continue; // ya está en Drive o no tiene notas
      if (celdaTexto_(f[7]).toLowerCase() === "sheets") continue; // elegido para quedarse en Google Sheets
      let id = celdaTexto_(f[5]);
      if (!id) {
        id = String(Math.floor(Date.now() * 1000) + fila);
        h.getRange(fila, COL_ID_NOTARIOS).setNumberFormat("@").setValue(id);
      }
      const archivo = carpetaNotarios_().createFile(
        nombreArchivoNotario_(celdaTexto_(f[1]), id),
        celda,
        MimeType.PLAIN_TEXT
      );
      if (archivo.getBlob().getDataAsString("UTF-8") !== celda) {
        archivo.setTrashed(true);
        throw new Error("El archivo de la fila " + fila + " no quedó idéntico; no se cambió nada en esa fila.");
      }
      h.getRange(fila, COL_ARCHIVO_NOTARIOS).setNumberFormat("@").setValue(archivo.getId());
      h.getRange(fila, COL_NOTAS_NOTARIOS).setNumberFormat("@").setValue(archivo.getUrl());
      movidos++;
    }
    Logger.log("Notarios pasados a Drive: " + movidos);
  } finally {
    lock.releaseLock();
  }
}

// ---------- Trabajo terminado: pasa de la hoja "Notas" a la hoja "Diario" ----------
// Recibe el Id del trabajo y el día (AAAA-MM-DD) en que se finalizó. Copia el trabajo al Diario
// (con "Sí" en "Trabajos terminados") y lo quita de "Notas". Usa el mismo Id en ambos lados, así
// que si se repite la petición no queda duplicado.
function trabajosFinalizar_(p) {
  const id = String(p.id || "");
  const fecha = String(p.fecha || "").trim();
  if (!/^\d{10,16}$/.test(id) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return responder_({
      ok: false,
      error: "Datos inválidos (id de trabajo: " + id + ", fecha: " + fecha + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 1) Buscar el trabajo en la hoja "Notas"
    const hn = hojaNotas_();
    const ultimaN = ultimaFilaEn_(hn, COL_NOTAS, N_COL_NOTAS);
    let filaN = -1;
    if (ultimaN >= 2) {
      const idsN = hn.getRange(2, COL_NOTAS + 5, ultimaN - 1, 1).getValues();
      for (let i = 0; i < idsN.length; i++) {
        if (celdaTexto_(idsN[i][0]) === id) {
          filaN = i + 2;
          break;
        }
      }
    }
    if (filaN === -1) return responder_({ ok: false, error: "No se encontró el trabajo" });
    const f = hn.getRange(filaN, COL_NOTAS, 1, N_COL_NOTAS).getValues()[0];
    if (celdaTexto_(f[2]) !== "Trabajo") {
      return responder_({ ok: false, error: "Esa nota no es un trabajo" });
    }
    const nombre = celdaTexto_(f[0]).slice(0, 80) || "Sin nombre";
    const descripcion = textoLeer_(f[3]);

    // 2) Agregarlo al Diario (si ya estaba por un intento anterior, no se repite)
    const hd = hojaDiario_();
    const ultimaD = ultimaFilaEn_(hd, 1, N_COL_DIARIO);
    let yaEsta = false;
    if (ultimaD >= 2) {
      const idsD = hd.getRange(2, COL_ID_DIARIO, ultimaD - 1, 1).getValues();
      for (let i = 0; i < idsD.length; i++) {
        if (celdaTexto_(idsD[i][0]) === id) {
          yaEsta = true;
          break;
        }
      }
    }
    if (!yaEsta) {
      const filaD = Math.max(ultimaD, 1) + 1;
      if (filaD > hd.getMaxRows()) hd.insertRowsAfter(hd.getMaxRows(), filaD - hd.getMaxRows());
      hd.getRange(filaD, 1, 1, N_COL_DIARIO)
        .setNumberFormat("@")
        .setValues([[nombre, fecha, textoGuardar_(descripcion, "Diario", nombre, id, "", true), MARCA_TRABAJO_TERMINADO, id]]);
    }

    // 3) Quitarlo de "Notas" (las celdas de abajo suben; si su texto estaba en Drive, ese archivo va a la papelera)
    textoSoltar_(f[3]);
    hn.getRange(filaN, COL_NOTAS, 1, N_COL_NOTAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Actividad (o trabajo) finalizada: pasa de la hoja "Notas" al "Diario" ----------
// Recibe el Id de la actividad/trabajo (hoja "Notas") y el día (AAAA-MM-DD) en que se finalizó.
//  1) Si en el Diario existe el recuerdo de esa actividad (porque se creó desde el Diario), le agrega al
//     final la línea «✅ Terminada el dd/mm/aaaa». El Id de la actividad es el del recuerdo MÁS
//     OFFSET_ID_ACTIVIDAD (la página usa el mismo número en app.js); así se enlazan sin repetir Id.
//  2) Crea en el Diario una anotación nueva con el día en que se terminó; conserva la descripción y agrega
//     «📅 Iniciada el … · ✅ Terminada el …». Su Id sale del Id de la actividad, así que si se repite la petición
//     no queda duplicada.
//  3) Quita la actividad de "Notas".
const OFFSET_ID_ACTIVIDAD = 7000000007; // debe ser igual a OFFSET_ID_ACTIVIDAD de app.js
function fechaTextoDeClave_(clave) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(clave || ""));
  return m ? m[3] + "/" + m[2] + "/" + m[1] : "";
}

function actividadFinalizar_(p) {
  const id = String(p.id || "");
  const fecha = String(p.fecha || "").trim();
  if (!/^\d{10,16}$/.test(id) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return responder_({
      ok: false,
      error: "Datos inválidos (id de actividad: " + id + ", fecha: " + fecha + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 1) Buscar la actividad en la hoja "Notas"
    const hn = hojaNotas_();
    const ultimaN = ultimaFilaEn_(hn, COL_NOTAS, N_COL_NOTAS);
    let filaN = -1;
    if (ultimaN >= 2) {
      const idsN = hn.getRange(2, COL_NOTAS + 5, ultimaN - 1, 1).getValues();
      for (let i = 0; i < idsN.length; i++) {
        if (celdaTexto_(idsN[i][0]) === id) {
          filaN = i + 2;
          break;
        }
      }
    }
    if (filaN === -1) return responder_({ ok: false, error: "No se encontró la actividad" });
    const f = hn.getRange(filaN, COL_NOTAS, 1, N_COL_NOTAS).getValues()[0];
    const etiqueta = celdaTexto_(f[2]);
    if (etiqueta !== "Actividades" && etiqueta !== "Trabajo" && etiqueta !== "Largo Plazo") {
      return responder_({ ok: false, error: "Esa nota no es una actividad ni un trabajo" });
    }
    const nombre = celdaTexto_(f[0]).slice(0, 80) || "Sin nombre";
    const descripcion = textoLeer_(f[3]);
    const inicioTxt = (/^\d{1,2}\/\d{1,2}\/\d{4}/.exec(celdaTexto_(f[1])) || [""])[0];
    const finTxt = fechaTextoDeClave_(fecha);
    const lineaFin = "✅ Terminada el " + finTxt;
    const lineaCopia = (inicioTxt ? "📅 Iniciada el " + inicioTxt + " · " : "") + lineaFin;

    // 2) Diario: recuerdo original (mismo Id) y copia nueva
    const hd = hojaDiario_();
    const ultimaD = ultimaFilaEn_(hd, 1, N_COL_DIARIO);
    const idsD = ultimaD >= 2 ? hd.getRange(2, COL_ID_DIARIO, ultimaD - 1, 1).getValues() : [];
    const copiaId = String(Number(id) + 1000000000);
    const recuerdoId = String(Number(id) - OFFSET_ID_ACTIVIDAD);
    let filaMemoria = -1;
    let yaEstaCopia = false;
    for (let i = 0; i < idsD.length; i++) {
      const v = celdaTexto_(idsD[i][0]);
      if (v === recuerdoId) filaMemoria = i + 2;
      if (v === copiaId) yaEstaCopia = true;
    }

    // 2a) Al recuerdo del Diario se le agrega la fecha de terminación (solo una vez)
    let memoria = null;
    if (filaMemoria !== -1) {
      const celda = hd.getRange(filaMemoria, 3).getValue();
      const nombreMem = celdaTexto_(hd.getRange(filaMemoria, 1).getValue()) || nombre;
      const textoMem = textoLeer_(celda);
      let nuevoMem = textoMem;
      if (textoMem.indexOf("✅ Terminada el") === -1) {
        nuevoMem = textoMem ? textoMem + "\n\n" + lineaFin : lineaFin;
        if (nuevoMem.length > LIMITE_TEXTO_LARGO) {
          return responder_({ ok: false, error: "El recuerdo del Diario es demasiado largo para agregarle la fecha" });
        }
        hd.getRange(filaMemoria, 3)
          .setNumberFormat("@")
          .setValue(textoGuardar_(nuevoMem, "Diario", nombreMem, recuerdoId, celda, !!idArchivoDeCelda_(celda)));
      }
      memoria = { id: recuerdoId, descripcion: nuevoMem };
    }

    // 2b) Copia en el Diario con el día en que se terminó (si ya estaba por un intento anterior, no se repite)
    const marca = etiqueta === "Trabajo" ? MARCA_TRABAJO_TERMINADO : MARCA_ACTIVIDAD_FINALIZADA;
    const descCopia = descripcion ? descripcion + "\n\n" + lineaCopia : lineaCopia;
    if (descCopia.length > LIMITE_TEXTO_LARGO) {
      return responder_({ ok: false, error: "La descripción es demasiado larga para copiarla al Diario" });
    }
    if (!yaEstaCopia) {
      const filaD = Math.max(ultimaD, 1) + 1;
      if (filaD > hd.getMaxRows()) hd.insertRowsAfter(hd.getMaxRows(), filaD - hd.getMaxRows());
      hd.getRange(filaD, 1, 1, N_COL_DIARIO)
        .setNumberFormat("@")
        .setValues([[nombre, fecha, textoGuardar_(descCopia, "Diario", nombre, copiaId, "", true), marca, copiaId]]);
    }

    // 3) Quitarla de "Notas" (las celdas de abajo suben; si su texto estaba en Drive, ese archivo va a la papelera)
    textoSoltar_(f[3]);
    hn.getRange(filaN, COL_NOTAS, 1, N_COL_NOTAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
    return responder_({
      ok: true,
      copia: { id: copiaId, nombre: nombre, fecha: fecha, descripcion: descCopia, marca: marca, destino: "drive" },
      memoria: memoria,
    });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Los datos del calendario YA NO se entregan por GET: la URL y la clave de config.js son públicas
// (quedan visibles en la página). Se leen con doPost, acción "calendario_listar", que exige
// iniciar sesión con la cuenta autorizada.
// ---------- Empresas/Proyectos (hoja propia «Empresas Proyectos», columnas A a J) ----------
// Cada empresa o proyecto es una fila de su hoja:
//   A Nombre | B Fecha | C Link | D Imagen | E Descripcion/Nota | F zona de links | G Id
// (Antes vivían en la primera hoja, columnas H a N: la función empresasMigrar_ las mueve sola a la hoja nueva
// la primera vez, y también se puede ejecutar a mano desde el editor con «migrarEmpresasANuevaHoja».)
// La imagen se sube con la acción "proyecto_imagen" (imgbb).
const NOMBRE_HOJA_EMPRESAS = "Empresas Proyectos"; // también se acepta «Empresas/Proyectos»
const COL_EMP = 1; // columna A
const N_COL_EMP = 13; // columnas A a M (H «Notas», I «Zona», J «Grupo», K «Subgrupo», L «Orden», M «OrdenNotas»)
const N_COL_EMP_BASE = 7; // columnas A a G: los datos de la empresa o proyecto (sin las notas)
const COL_DESC_EMP = COL_EMP + 4; // columna E
const COL_ID_EMP = COL_EMP + 6; // columna G
const COL_NOTAS_EMP = COL_EMP + 7; // columna H (notas personales)
const COL_ZONA_EMP = COL_EMP + 8; // columna I (zona: Proyectos, Canales de Contenido o Aplicaciones)
const ZONAS_EMP = ["Proyectos", "Canales de Contenido", "Aplicaciones"];
const COL_GRUPO_EMP = COL_EMP + 9; // columna J (grupo dentro de Proyectos: Personales o Ajenos)
const GRUPOS_EMP = ["Personales", "Ajenos"];
const COL_SUBGRUPO_EMP = COL_EMP + 10; // columna K (subgrupo dentro del grupo)
const COL_ORDEN_EMP = COL_EMP + 11; // columna L (posición: 1, 2, 3...; vacío = al final, en el orden de la hoja)
const COL_ORDEN_NOTAS_EMP = COL_EMP + 12; // columna M (orden de las notas y notarios del proyecto: Ids separados por comas)
// Personales se divide en Míos y Familiares; Ajenos, en Amigos y Clientes (lo vacío cuenta como el primero)
const SUBGRUPOS_EMP = { Personales: ["Míos", "Familiares"], Ajenos: ["Amigos", "Clientes"] };
const COL_EMP_ORIGEN = 8; // columna H de la primera hoja (donde estaban antes)
const ENCABEZADOS_EMP = [
  "Nombre Empresa/Proyecto",
  "Fecha Empresa/Proyecto",
  "Link Empresa/Proyecto",
  "Imagen Empresa/Proyecto",
  "Descripcion/Nota Empresa/Proyecto",
  "zona de links Empresa/Proyecto",
  "Id Empresa/Proyecto",
  "Notas",
  "Zona",
  "Grupo",
  "Subgrupo",
  "Orden",
  "OrdenNotas",
];

// Hoja de empresas y proyectos (si no existe se crea; los encabezados que ya estén no se tocan)
function hojaEmpresas_() {
  return hojaTabla_(NOMBRE_HOJA_EMPRESAS, ENCABEZADOS_EMP);
}

// Mueve los datos de la primera hoja (columnas H a N) a la hoja de empresas (columnas A a G).
// Solo actúa si la hoja nueva aún no tiene datos y el origen sí; copia con su formato, comprueba que la copia
// quedó igual y hasta entonces borra el origen. Devuelve { movidas, motivo }.
function empresasMigrar_() {
  const origenHoja = hoja_();
  const destino = hojaEmpresas_();
  if (origenHoja.getSheetId() === destino.getSheetId()) return { movidas: 0, motivo: "origen y destino son la misma hoja" };
  const ultimaOrigen = ultimaFilaEn_(origenHoja, COL_EMP_ORIGEN, N_COL_EMP_BASE);
  if (ultimaOrigen < 2) return { movidas: 0, motivo: "no hay datos en la primera hoja (H a N)" };
  if (ultimaFilaEn_(destino, COL_EMP, N_COL_EMP) >= 2) return { movidas: 0, motivo: "la hoja nueva ya tiene datos" };
  const origen = origenHoja.getRange(1, COL_EMP_ORIGEN, ultimaOrigen, N_COL_EMP_BASE);
  const antes = JSON.stringify(origen.getValues());
  if (destino.getMaxRows() < ultimaOrigen) destino.insertRowsAfter(destino.getMaxRows(), ultimaOrigen - destino.getMaxRows());
  const dest = destino.getRange(1, COL_EMP, ultimaOrigen, N_COL_EMP_BASE);
  origen.copyTo(dest); // valores y formato
  SpreadsheetApp.flush();
  if (JSON.stringify(dest.getValues()) !== antes) {
    return { movidas: 0, motivo: "la copia no quedó igual al origen; no se borró nada" };
  }
  origen.clear();
  return { movidas: ultimaOrigen - 1, motivo: "" };
}

// Para ejecutarla a mano: en el editor del Apps Script elige esta función y presiona «Ejecutar»
// (el resultado queda en Ver → Registros de ejecución).
function migrarEmpresasANuevaHoja() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const r = empresasMigrar_();
    Logger.log(r.movidas ? "Se movieron " + r.movidas + " empresa(s) o proyecto(s) a la hoja nueva." : "No se movió nada: " + r.motivo);
  } finally {
    lock.releaseLock();
  }
}

function empresaDatos_(p) {
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || "").trim().slice(0, 120),
    fecha: String(p.fecha || "").trim(),
    link: String(p.link || "").trim(),
    imagen: String(p.imagen || "").trim(),
    descripcion: String(p.descripcion || "").trim(),
    links: String(p.links || "").trim(),
    zona: empresaZona_(p.zona),
    grupo: empresaGrupo_(p.grupo),
    subgrupo: empresaSubgrupo_(empresaGrupo_(p.grupo), p.subgrupo),
  };
}

// Subgrupo válido dentro de su grupo (acepta con o sin acento; lo vacío o desconocido cuenta como el primero del grupo)
function empresaSubgrupo_(grupo, x) {
  const lista = SUBGRUPOS_EMP[grupo] || SUBGRUPOS_EMP[GRUPOS_EMP[0]];
  const t = nombreNormalizado_(x || "");
  for (let i = 0; i < lista.length; i++) {
    if (nombreNormalizado_(lista[i]) === t) return lista[i];
  }
  return lista[0];
}

// Grupo válido (lo vacío o desconocido cuenta como «Personales»)
function empresaGrupo_(x) {
  const t = String(x || "").trim();
  return GRUPOS_EMP.indexOf(t) !== -1 ? t : GRUPOS_EMP[0];
}

// Zona válida (lo vacío o desconocido cuenta como «Proyectos», así lo que ya tenías sigue donde estaba)
function empresaZona_(z) {
  const t = String(z || "").trim();
  return ZONAS_EMP.indexOf(t) !== -1 ? t : ZONAS_EMP[0];
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function empresaError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de empresa inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (d.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) return "fecha inválida: " + d.fecha;
  if (d.link.length > 2000) return "el link es demasiado largo";
  if (d.links.length > 5000) return "la zona de links es demasiado larga";
  if (d.descripcion.length > LIMITE_TEXTO_LARGO) return "la descripción es demasiado larga";
  if (d.imagen && (d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen))) {
    return "la dirección de la imagen no es válida";
  }
  return "";
}

function empresasListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    try {
      empresasMigrar_(); // una sola vez: trae lo que estaba en la primera hoja (H a N) a la hoja nueva
    } catch (err) {
      // si falla, igual se lee la hoja nueva
    }
    const h = hojaEmpresas_();
    const ultima = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
    const empresas = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, COL_EMP, ultima - 1, N_COL_EMP).getValues();
      const base = Math.floor(Date.now() * 1000);
      const vistos = {};
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const descripcion = textoLeer_(f[4]);
        const imagen = celdaTexto_(f[3]);
        const link = celdaTexto_(f[2]);
        const links = celdaTexto_(f[5]);
        const notasInfo = empresaNotasLeer_(f[7]); // columna H: notas personales
        if (!nombre && !descripcion && !imagen && !link && !links && !notasInfo.notas.length) return; // fila sin empresa
        let id = celdaTexto_(f[6]);
        if (!id || vistos[id]) {
          // Fila escrita a mano (sin Id) o copiada de otra (Id repetido): se le da un Id propio para que
          // cada nota se edite por separado y no comparta imagen con otra
          let n = base + i;
          while (vistos[String(n)]) n++;
          id = String(n);
          h.getRange(i + 2, COL_ID_EMP).setNumberFormat("@").setValue(id);
        }
        vistos[id] = true;
        empresas.push({
          id: id,
          nombre: nombre || "Sin nombre",
          fecha: fechaEjercicio_(f[1]),
          link: link,
          imagen: imagen,
          descripcion: descripcion,
          links: links,
          zona: empresaZona_(celdaTexto_(f[8])), // columna I
          grupo: empresaGrupo_(celdaTexto_(f[9])), // columna J
          subgrupo: empresaSubgrupo_(empresaGrupo_(celdaTexto_(f[9])), celdaTexto_(f[10])), // columna K
          orden: Math.max(0, parseInt(celdaTexto_(f[11]), 10) || 0), // columna L (0 = sin orden: va al final)
          ordenNotas: celdaTexto_(f[12]), // columna M: Ids de notas y notarios en su orden (separados por comas)
          notas: notasInfo.notas.map(empresaNotaPublica_),
          notasLargo: notasInfo.largo,
          notasError: notasInfo.error || "",
        });
      });
    }
    return responder_({ ok: true, version: VERSION, empresas: empresas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function empresasAgregar_(p) {
  const d = empresaDatos_(p);
  const motivo = empresaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    // Si ya estaba (por un intento anterior), no se repite
    const ultimaE = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
    if (ultimaE >= 2) {
      const ids = h.getRange(2, COL_ID_EMP, ultimaE - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) return responder_({ ok: true });
      }
    }
    // Siguiente fila libre de la hoja (el encabezado cuenta como fila 1)
    const fila = Math.max(ultimaE, 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, COL_EMP, 1, N_COL_EMP_BASE)
      .setNumberFormat("@")
      .setValues([[
        d.nombre,
        d.fecha || fechaHoy_(),
        d.link,
        d.imagen,
        textoGuardar_(d.descripcion, "Empresa", d.nombre, d.id, ""),
        d.links,
        d.id,
      ]]);
    h.getRange(fila, COL_ZONA_EMP, 1, 3).setNumberFormat("@").setValues([[d.zona, d.grupo, d.subgrupo]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function empresasEditar_(p) {
  const d = empresaDatos_(p);
  const motivo = empresaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const ultima = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_EMP, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          const fila = i + 2;
          // Se actualizan A a F; la Id (G) no se toca
          const anterior = h.getRange(fila, COL_DESC_EMP).getValue();
          h.getRange(fila, COL_EMP, 1, N_COL_EMP_BASE - 1)
            .setNumberFormat("@")
            .setValues([[
              d.nombre,
              d.fecha || fechaHoy_(),
              d.link,
              d.imagen,
              textoGuardar_(d.descripcion, "Empresa", d.nombre, d.id, anterior),
              d.links,
            ]]);
          h.getRange(fila, COL_ZONA_EMP, 1, 3).setNumberFormat("@").setValues([[d.zona, d.grupo, d.subgrupo]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la empresa o proyecto" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Guarda el orden de los proyectos (botón «Mover Proyectos»): p.orden = lista de Ids en el orden deseado.
// Cada Id recibe su posición (1, 2, 3...) en la columna L «Orden»; si alguna fila no viene en la lista, queda al final.
function empresasOrdenGuardar_(p) {
  const lista = Array.isArray(p.orden) ? p.orden.map(function (x) { return String(x); }) : null;
  if (!lista || !lista.length || lista.length > 5000) return responder_({ ok: false, error: "Datos inválidos (orden)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const ultima = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
    if (ultima < 2) return responder_({ ok: false, error: "No hay empresas ni proyectos" });
    const ids = h.getRange(2, COL_ID_EMP, ultima - 1, 1).getValues();
    const pos = {};
    lista.forEach(function (id, i) { if (!(id in pos)) pos[id] = i + 1; });
    let siguiente = lista.length + 1;
    const valores = ids.map(function (f) {
      const id = celdaTexto_(f[0]);
      if (!id) return [""];
      if (pos[id]) return [pos[id]];
      return [siguiente++];
    });
    h.getRange(2, COL_ORDEN_EMP, valores.length, 1).setNumberFormat("0").setValues(valores);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function empresasBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) {
    return responder_({ ok: false, error: "Datos inválidos (id de empresa: " + id + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const ultima = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_EMP, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          textoSoltar_(h.getRange(i + 2, COL_DESC_EMP).getValue());
          empresaNotasSoltar_(h.getRange(i + 2, COL_NOTAS_EMP).getValue());
          // Se quitan las celdas A a H de esa fila y las de abajo suben
          h.getRange(i + 2, COL_EMP, 1, N_COL_EMP).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la empresa o proyecto" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Notas personales de cada empresa o proyecto (columna H «Notas») ----------
// Todas las notas de una empresa viven en UNA celda de la columna H. Cada nota se escribe así:
//   #Id|fecha de creación|fecha de modificación|destino|nombre
//   <texto, o la marca ☁DRIVE:<Id del archivo> si el destino es "drive">
// y las notas se separan con la misma marca que usan los Notarios.
//  - destino "sheets": el texto vive en la celda. La celda admite 50,000 caracteres en total (LIMITE_NOTARIO_SHEETS),
//    contando encabezados y separadores, y se reparten entre las notas de Sheets de esa empresa.
//  - destino "drive": el texto vive en su propio .txt (carpeta «notaslargas»), hasta 1,000,000 caracteres por nota
//    (LIMITE_NOTARIO); en la celda solo queda una marca corta.
// Las notas hechas antes de esta versión (solo «#Id|fecha») se siguen leyendo: salen como notas de Sheets sin nombre.
function empresaFila_(h, id) {
  const ultima = ultimaFilaEn_(h, COL_EMP, N_COL_EMP);
  if (ultima < 2) return 0;
  const ids = h.getRange(2, COL_ID_EMP, ultima - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (celdaTexto_(ids[i][0]) === id) return i + 2;
  }
  return 0;
}

// Texto de un campo de una sola línea (sin saltos ni «|», que separan los campos del encabezado)
function empresaNotaCampo_(t, max) {
  return String(t === null || t === undefined ? "" : t)
    .replace(/[\r\n|]+/g, " ")
    .trim()
    .slice(0, max);
}

// Etiquetas que puede llevar una nota de empresa o proyecto (las que no la tienen son notas normales)
const ETIQUETAS_NOTA_EMPRESA = ["Trabajo", "Actividades"];
// La etiqueta va al final del encabezado: #Id|fecha|modificada|destino|nombre|etiqueta (las notas viejas no la traen)
function empresaNotaSerializar_(n) {
  const cuerpo = n.destino === "drive" ? PREFIJO_DRIVE + n.archivoId : n.texto;
  const etiqueta = ETIQUETAS_NOTA_EMPRESA.indexOf(n.etiqueta) !== -1 ? "|" + n.etiqueta : "";
  return "#" + n.id + "|" + n.fecha + "|" + n.modificada + "|" + n.destino + "|" + n.nombre + etiqueta + "\n" + cuerpo;
}

function empresaNotasSerializar_(notas) {
  return notas.map(empresaNotaSerializar_).join(SEPARADOR_NOTARIO);
}

// Lo que se manda a la página (sin datos internos como el Id del archivo)
function empresaNotaPublica_(n) {
  return {
    id: n.id,
    nombre: n.nombre,
    fecha: n.fecha,
    modificada: n.modificada,
    destino: n.destino,
    etiqueta: n.etiqueta || "",
    texto: n.texto,
    largo: empresaNotaSerializar_(n).length,
  };
}

// Celda de la columna H -> { notas: [...], largo, error? }. Los textos de Drive se leen de su archivo.
function empresaNotasLeer_(celda) {
  const crudo = textoLeer_(celda); // por compatibilidad: si TODA la celda estaba en Drive, se lee de ahí
  if (crudo.indexOf("⚠️ No se pudo leer el archivo de Drive") === 0) {
    return { notas: [], largo: 0, error: "No se pudo leer el archivo de Drive de las notas de esta empresa. ¿Lo borraste o lo moviste?" };
  }
  const notas = [];
  const base = Math.floor(Date.now() * 1000);
  String(crudo)
    .split(SEPARADOR_NOTARIO)
    .forEach(function (parte, i) {
      if (!parte.trim()) return;
      const m = /^#(\d{10,16})\|([^\n]*)\n?([\s\S]*)$/.exec(parte);
      const id = m ? m[1] : String(base + i);
      const campos = m ? m[2].split("|") : [""];
      const cuerpo = m ? m[3] : parte.trim(); // escrita a mano: sin encabezado
      const resto = campos.slice(3); // nombre y, al final, la etiqueta (si la tiene)
      const ultimo = resto.length > 1 ? String(resto[resto.length - 1]).trim() : "";
      const tieneEtiqueta = ETIQUETAS_NOTA_EMPRESA.indexOf(ultimo) !== -1;
      const nota = {
        id: id,
        fecha: (campos[0] || "").trim(),
        modificada: (campos[1] || "").trim(),
        destino: (campos[2] || "").trim() === "drive" ? "drive" : "sheets",
        nombre: (tieneEtiqueta ? resto.slice(0, -1) : resto).join("|").trim(),
        etiqueta: tieneEtiqueta ? ultimo : "",
        texto: cuerpo,
        archivoId: "",
      };
      if (nota.destino === "drive") {
        nota.archivoId = idArchivoDeCelda_(cuerpo);
        if (nota.archivoId) {
          const t = notarioLeerArchivo_(nota.archivoId);
          nota.texto = t === null ? "⚠️ No se pudo leer el archivo de Drive de esta nota (Id " + nota.archivoId + ")" : t;
        } else {
          nota.destino = "sheets"; // sin marca de Drive: es texto escrito a mano en la celda
        }
      }
      notas.push(nota);
    });
  return { notas: notas, largo: empresaNotasSerializar_(notas).length };
}

// Manda a la papelera los archivos de Drive que mencione la celda (al borrar una empresa)
function empresaNotasSoltar_(celda) {
  const s = String(celda === null || celda === undefined ? "" : celda);
  const re = /☁DRIVE:([A-Za-z0-9_-]+)/g;
  let m;
  while ((m = re.exec(s))) {
    try {
      DriveApp.getFileById(m[1]).setTrashed(true);
    } catch (err) {}
  }
}

// Escribe la celda H con todas las notas. Devuelve { error } o { largo }.
function empresaNotasEscribir_(h, fila, celdaAnterior, notas) {
  const contenido = empresaNotasSerializar_(notas);
  if (contenido.length > LIMITE_NOTARIO_SHEETS) {
    return {
      error:
        "No cabe en Google Sheets: la celda de notas de esta empresa pasaría de " + LIMITE_NOTARIO_SHEETS +
        " caracteres (serían " + contenido.length + "). Acorta la nota, borra alguna o guárdala en Google Drive.",
    };
  }
  h.getRange(fila, COL_NOTAS_EMP).setNumberFormat("@").setValue(contenido);
  textoSoltar_(celdaAnterior); // si toda la celda estaba antes en un archivo de Drive, ese archivo ya no hace falta
  return { largo: contenido.length };
}

function archivoPrevioDe_(nota) {
  return nota && nota.archivoId ? nota.archivoId : "";
}

function empresaArchivoNota_(nombreEmpresa, nombreNota, notaId) {
  return nombreArchivoTexto_("Nota empresa", nombreEmpresa + (nombreNota ? " - " + nombreNota : ""), notaId);
}

// Agrega una nota a la empresa, o cambia la que ya existe (si viene su notaId).
// Se puede cambiar su nombre, su fecha de creación, su texto y su destino (Sheets o Drive).
function empresasNotaGuardar_(p) {
  const id = String(p.id || "");
  const notaId = String(p.notaId || "");
  const texto = limpiarTextoNotario_(p.texto);
  const nombre = empresaNotaCampo_(p.nombre, 80);
  const fecha = empresaNotaCampo_(p.fecha, 40);
  const modificada = empresaNotaCampo_(p.modificada, 40);
  const destinoPedido = p.destino === "drive" ? "drive" : "sheets";
  // Solo se cambia la etiqueta si la página la manda (null = no tocarla)
  const etiquetaPedida = p.etiqueta === undefined ? null : ETIQUETAS_NOTA_EMPRESA.indexOf(p.etiqueta) !== -1 ? p.etiqueta : "";
  if (!/^\d{10,16}$/.test(id) || !/^\d{10,16}$/.test(notaId)) {
    return responder_({ ok: false, error: "Datos inválidos (id de empresa: " + id + ", id de nota: " + notaId + ")" });
  }
  if (!texto) return responder_({ ok: false, error: "Datos inválidos (la nota está vacía)" });
  if (texto.length > LIMITE_NOTARIO) {
    return responder_({ ok: false, error: "La nota es demasiado larga: pasa de " + LIMITE_NOTARIO + " caracteres (tiene " + texto.length + ")." });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const fila = empresaFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró la empresa o proyecto" });
    const celda = h.getRange(fila, COL_NOTAS_EMP).getValue();
    const act = empresaNotasLeer_(celda);
    if (act.error) return responder_({ ok: false, error: act.error });
    let nota = null;
    act.notas.forEach(function (n) {
      if (n.id === notaId) nota = n;
    });
    const esNueva = !nota;
    // Las notas nuevas siempre van a Drive; una antigua en Sheets solo cambia si se pide Drive («Migrar a Drive»)
    const destino = esNueva || archivoPrevioDe_(nota) ? "drive" : destinoPedido;
    const archivoPrevio = nota ? nota.archivoId : "";
    if (esNueva) {
      nota = { id: notaId, fecha: fecha, modificada: "", destino: destino, nombre: nombre, etiqueta: etiquetaPedida || "", texto: texto, archivoId: "" };
      act.notas.push(nota);
    } else {
      if (fecha) nota.fecha = fecha; // la fecha de creación se puede corregir
      nota.modificada = modificada; // y queda anotado cuándo se modificó
      nota.nombre = nombre;
      if (etiquetaPedida !== null) nota.etiqueta = etiquetaPedida;
      nota.destino = destino;
      nota.texto = texto;
    }
    // Antes de tocar Drive se comprueba que la celda alcanzará (con una marca de Drive de largo típico)
    nota.archivoId = destino === "drive" ? archivoPrevio || new Array(45).join("x") : "";
    if (empresaNotasSerializar_(act.notas).length > LIMITE_NOTARIO_SHEETS) {
      return responder_({
        ok: false,
        error:
          "No cabe en Google Sheets: la celda de notas de esta empresa pasaría de " + LIMITE_NOTARIO_SHEETS +
          " caracteres. Acorta la nota, borra alguna o guárdala en Google Drive.",
      });
    }
    let archivoNuevo = null;
    if (destino === "drive") {
      const nombreEmpresa = celdaTexto_(h.getRange(fila, COL_EMP).getValue());
      const nombreArchivo = empresaArchivoNota_(nombreEmpresa, nombre, notaId);
      let reusado = false;
      if (archivoPrevio) {
        try {
          const f = DriveApp.getFileById(archivoPrevio);
          f.setContent(texto);
          f.setName(nombreArchivo);
          nota.archivoId = archivoPrevio;
          reusado = true;
        } catch (err) {
          // el archivo anterior ya no existe: se crea uno nuevo
        }
      }
      if (!reusado) {
        archivoNuevo = carpetaNotarios_().createFile(nombreArchivo, texto, MimeType.PLAIN_TEXT);
        nota.archivoId = archivoNuevo.getId();
      }
    }
    const r = empresaNotasEscribir_(h, fila, celda, act.notas);
    if (r.error) {
      if (archivoNuevo) archivoNuevo.setTrashed(true);
      return responder_({ ok: false, error: r.error });
    }
    if (destino === "sheets" && archivoPrevio) {
      // la nota pasó de Drive a Sheets: su archivo ya no hace falta
      try {
        DriveApp.getFileById(archivoPrevio).setTrashed(true);
      } catch (err) {}
    }
    return responder_({ ok: true, largo: r.largo, notaLargo: empresaNotaSerializar_(nota).length, etiqueta: nota.etiqueta || "" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Guarda el orden de las notas y notarios de UN proyecto (botón «Mover» de «Notas del proyecto»):
// p.id = Id del proyecto, p.orden = lista de Ids (de notas y notarios) en el orden deseado.
// Se anota en la columna M «OrdenNotas»; lo que no esté en la lista queda al final.
function empresasNotasOrdenGuardar_(p) {
  const id = String(p.id || "");
  const lista = Array.isArray(p.orden) ? p.orden.map(function (x) { return String(x); }) : null;
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de empresa: " + id + ")" });
  if (!lista || lista.length > 2000 || lista.some(function (x) { return !/^\d{10,16}$/.test(x); })) {
    return responder_({ ok: false, error: "Datos inválidos (orden de las notas)" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const fila = empresaFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró la empresa o proyecto" });
    h.getRange(fila, COL_ORDEN_NOTAS_EMP).setNumberFormat("@").setValue(lista.join(","));
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function empresasNotaBorrar_(p) {
  const id = String(p.id || "");
  const notaId = String(p.notaId || "");
  if (!/^\d{10,16}$/.test(id) || !/^\d{10,16}$/.test(notaId)) {
    return responder_({ ok: false, error: "Datos inválidos (id de empresa: " + id + ", id de nota: " + notaId + ")" });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaEmpresas_();
    const fila = empresaFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró la empresa o proyecto" });
    const celda = h.getRange(fila, COL_NOTAS_EMP).getValue();
    const act = empresaNotasLeer_(celda);
    if (act.error) return responder_({ ok: false, error: act.error });
    let archivo = "";
    const quedan = act.notas.filter(function (n) {
      if (n.id === notaId) archivo = n.archivoId;
      return n.id !== notaId;
    });
    if (quedan.length === act.notas.length) return responder_({ ok: false, error: "No se encontró la nota" });
    const r = empresaNotasEscribir_(h, fila, celda, quedan);
    if (r.error) return responder_({ ok: false, error: r.error });
    if (archivo) {
      try {
        DriveApp.getFileById(archivo).setTrashed(true);
      } catch (err) {}
    }
    return responder_({ ok: true, largo: r.largo });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Migrar a Drive: pasa el texto de una nota de la celda de Google Sheets a un .txt de Drive ----------
// El texto se quita de la celda (queda solo la marca ☁DRIVE:<Id>). La fila se conserva porque es el índice de la página.
function zonaMigrar_(zona) {
  if (zona === "nota") return { hoja: hojaNotas_, texto: COL_NOTAS + 3, id: COL_NOTAS + 5, nombre: COL_NOTAS, etiqueta: "Nota" };
  if (zona === "ejercicio") return { hoja: hojaEjercicio_, texto: 3, id: 4, nombre: 1, etiqueta: "Ejercicio" };
  if (zona === "diario") return { hoja: hojaDiario_, texto: 3, id: COL_ID_DIARIO, nombre: 1, etiqueta: "Diario" };
  if (zona === "deuda") return { hoja: hojaDeudas_, texto: COL_DESC_DEUDAS, id: COL_ID_DEUDAS, nombre: COL_DEUDAS, etiqueta: "Deuda" };
  if (zona === "informacion") return { hoja: hojaInformacion_, texto: 3, id: 4, nombre: 1, etiqueta: "Informacion" };
  if (zona === "comando") return { hoja: hojaComandos_, texto: 3, id: 4, nombre: 1, etiqueta: "Comando" };
  if (zona === "bazar") return { hoja: hojaBazar_, texto: 2, id: COL_ID_BAZAR, nombre: 1, etiqueta: "Bazar" };
  return null;
}

function migrarDrive_(p) {
  const zona = String(p.zona || "");
  const id = String(p.id || "");
  const z = zonaMigrar_(zona);
  if (!z) return responder_({ ok: false, error: "Datos inválidos (zona: " + zona + ")" });
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id: " + id + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = z.hoja();
    const ultima = h.getLastRow();
    let fila = 0;
    if (ultima >= 2) {
      const ids = h.getRange(2, z.id, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          fila = i + 2;
          break;
        }
      }
    }
    if (!fila) return responder_({ ok: false, error: "No se encontró el registro" });
    const celda = h.getRange(fila, z.texto);
    const valor = celda.getValue();
    if (idArchivoDeCelda_(valor)) return responder_({ ok: true, yaEstaba: true });
    const texto = celdaTexto_(valor);
    if (!texto) return responder_({ ok: false, error: "Este registro no tiene texto que migrar" });
    const nombre = celdaTexto_(h.getRange(fila, z.nombre).getValue());
    const marca = textoGuardar_(texto, z.etiqueta, nombre, id, "", true);
    // Antes de quitar el texto de la hoja se comprueba que el archivo quedó idéntico
    const copia = notarioLeerArchivo_(idArchivoDeCelda_(marca));
    if (copia === null || copia !== texto) {
      textoSoltar_(marca);
      return responder_({ ok: false, error: "El archivo de Drive no quedó idéntico; no se cambió nada en la hoja." });
    }
    celda.setNumberFormat("@").setValue(marca);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Notario de Google Sheets (notas dentro de la celda E) -> archivo .txt en Drive
function notariosMigrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de notario: " + id + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const h = hojaNotarios_();
    const fila = notarioFila_(h, id);
    if (!fila) return responder_({ ok: false, error: "No se encontró el notario" });
    const f = h.getRange(fila, 1, 1, N_COL_NOTARIOS).getValues()[0];
    if (celdaTexto_(f[COL_ARCHIVO_NOTARIOS - 1])) {
      h.getRange(fila, COL_DESTINO_NOTARIOS).setNumberFormat("@").setValue("drive");
      return responder_({ ok: true, yaEstaba: true });
    }
    const contenido = String(f[COL_NOTAS_NOTARIOS - 1] === null || f[COL_NOTAS_NOTARIOS - 1] === undefined ? "" : f[COL_NOTAS_NOTARIOS - 1]);
    const archivo = carpetaNotarios_().createFile(nombreArchivoNotario_(celdaTexto_(f[1]), id), contenido, MimeType.PLAIN_TEXT);
    if (archivo.getBlob().getDataAsString("UTF-8") !== contenido) {
      archivo.setTrashed(true);
      return responder_({ ok: false, error: "El archivo de Drive no quedó idéntico; no se cambió nada en la hoja." });
    }
    h.getRange(fila, COL_ARCHIVO_NOTARIOS).setNumberFormat("@").setValue(archivo.getId());
    h.getRange(fila, COL_NOTAS_NOTARIOS).setNumberFormat("@").setValue(archivo.getUrl());
    h.getRange(fila, COL_DESTINO_NOTARIOS).setNumberFormat("@").setValue("drive");
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Hoja de redes (hoja única de Empresas/Proyectos; pestaña "Hoja Redes") ----------
const NOMBRE_HOJA_REDES = "Hoja Redes"; // hoja 1 (principal): nombres y links de los videos
const NOMBRE_HOJA_REDES_2 = "Hoja Redes 2"; // hoja 2 (secundaria): misma estructura, p. ej. links de los shorts (se crea sola)
const N_COL_REDES = 15; // columnas de origen; la página puede agregar más y moverlas de lugar
const ENCABEZADOS_REDES = [
  "Nombre", "Fecha", "Youtube", "Aviso", "Facebook", "Aviso", "Instagram", "Aviso",
  "TikTok", "Aviso", "Threads", "Aviso", "X", "Aviso", "Whatsapp Community",
];
const MAX_COL_REDES = 60; // igual a HOJA_COL_MAX en app.js
const MAX_NOMBRE_COL_REDES = 60; // igual a HOJA_NOMBRE_COL_MAX en app.js
const MAX_FILAS_REDES = 2000; // igual a HOJA_FILAS_MAX en app.js
const MAX_CELDA_REDES = 5000; // igual a HOJA_CELDA_MAX en app.js

// n = 1 (principal) o 2 (secundaria); la página lo manda como p.hoja y una página vieja no lo manda (= 1)
function numeroHojaRedes_(p) {
  return p && Number(p.hoja) === 2 ? 2 : 1;
}

// (Desde la versión 5 el contenido de cada hoja vive en un archivo de Drive; ver más abajo «Las hojas de redes de cada proyecto viven en GOOGLE DRIVE».
//  Las pestañas de abajo quedan como respaldo del momento en que se pasó cada hoja a Drive.)
// Cada empresa/proyecto tiene sus propias hojas de redes: pestañas «Hoja Redes <Nombre> #<Id>» (hoja 1) y
// «Hoja Redes (2) <Nombre> #<Id>» (hoja 2). Se encuentran por el «#<Id>» del final (el nombre solo es para que
// las reconozcas; si cambias el nombre del proyecto, la pestaña se renombra sola).
// Migración: las pestañas de antes («Hoja Redes» y «Hoja Redes 2», que eran de todos los proyectos) pasan al
// proyecto llamado «El Polo Dancer» la primera vez que se abre su hoja (se renombran, no se pierde nada).
const PROYECTO_HOJAS_ANTERIORES = "el polo dancer";

function idEmpresaRedes_(p) {
  return String(p && p.empresa !== undefined && p.empresa !== null ? p.empresa : "").replace(/[^0-9A-Za-z_]/g, "").slice(0, 40);
}

// Busca la pestaña de redes de un proyecto SIN crearla (null si no existe). Incluye la migración de «El Polo Dancer».
function buscarHojaRedes_(n, p) {
  const id = idEmpresaRedes_(p);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const base = n === 2 ? "Hoja Redes (2)" : "Hoja Redes";
  const sufijo = " #" + id;
  const nombreProyecto = String(p.empresaNombre || "").replace(/[\[\]*?:\/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
  const deseado = base + (nombreProyecto ? " " + nombreProyecto : "") + sufijo;
  const hojas = ss.getSheets();
  let h = null;
  for (let i = 0; i < hojas.length; i++) {
    const nom = hojas[i].getName();
    const esDos = nom.indexOf("Hoja Redes (2)") === 0;
    if (nom.indexOf("Hoja Redes") === 0 && nom.slice(-sufijo.length) === sufijo && esDos === (n === 2)) {
      h = hojas[i];
      break;
    }
  }
  if (!h && nombreNormalizado_(p.empresaNombre || "") === PROYECTO_HOJAS_ANTERIORES) {
    // «El Polo Dancer»: se queda con la hoja que ya tenías
    const viejo = nombreNormalizado_(n === 2 ? NOMBRE_HOJA_REDES_2 : NOMBRE_HOJA_REDES);
    for (let i = 0; i < hojas.length; i++) {
      if (nombreNormalizado_(hojas[i].getName()) === viejo) {
        h = hojas[i];
        break;
      }
    }
  }
  if (h && h.getName() !== deseado) {
    try { h.setName(deseado); } catch (e) {}
  }
  return h;
}

function hojaRedes_(n, p) {
  const id = idEmpresaRedes_(p);
  // Una página vieja no manda el proyecto: se usa la hoja de antes
  if (!id) return hojaTabla_(n === 2 ? NOMBRE_HOJA_REDES_2 : NOMBRE_HOJA_REDES, ENCABEZADOS_REDES);
  let h = buscarHojaRedes_(n, p);
  if (!h) {
    const base = n === 2 ? "Hoja Redes (2)" : "Hoja Redes";
    const nombreProyecto = String(p.empresaNombre || "").replace(/[\[\]*?:\/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
    h = SpreadsheetApp.getActiveSpreadsheet().insertSheet(base + (nombreProyecto ? " " + nombreProyecto : "") + " #" + id);
  }
  return hojaTabla_(h.getName(), ENCABEZADOS_REDES); // asegura columnas y encabezados
}

// ---------- Las hojas de redes de cada proyecto viven en GOOGLE DRIVE ----------
// Cada hoja (la principal y la secundaria de cada proyecto) es un archivo .json dentro de la carpeta «notaslargas»
// de Drive, igual que el texto de las notas: «Hoja Redes <Nombre> #<Id>.json» y «Hoja Redes (2) <Nombre> #<Id>.json».
// Contenido: { "version": 1, "columnas": [...], "filas": [[...], ...] }.
// Migración: la primera vez que se abre la hoja de un proyecto, si ya tenía una pestaña en el libro de Google Sheets,
// su contenido se copia al archivo de Drive y se comprueba que quedó idéntico. La pestaña NO se borra ni se vuelve
// a modificar: queda como respaldo de ese momento. Desde entonces solo se lee y se guarda el archivo de Drive.
const PREFIJO_PROP_REDES = "HOJA_REDES_ARCHIVO_"; // propiedad del script: <n>_<Id> -> Id del archivo de Drive
const PREFIJO_PROP_REDES_MIGRADA = "HOJA_REDES_MIGRADA_"; // marca: esta hoja ya vive en Drive
const MAX_TOTAL_REDES = 5000000; // caracteres máximos del archivo de una hoja

function nombreArchivoRedes_(n, p) {
  const nombreProyecto = String(p.empresaNombre || "").replace(/[\\\/:*?"<>|\[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
  return (n === 2 ? "Hoja Redes (2)" : "Hoja Redes") + (nombreProyecto ? " " + nombreProyecto : "") + " #" + idEmpresaRedes_(p) + ".json";
}

// El archivo de Drive de la hoja (null si no existe). Primero por la propiedad guardada; si falta, se busca por su «#<Id>.json».
function archivoRedes_(n, p) {
  const id = idEmpresaRedes_(p);
  const props = PropertiesService.getScriptProperties();
  const clave = PREFIJO_PROP_REDES + n + "_" + id;
  const guardado = props.getProperty(clave);
  if (guardado) {
    try {
      const f = DriveApp.getFileById(guardado);
      if (!f.isTrashed()) return f;
    } catch (e) {}
  }
  const sufijo = " #" + id + ".json";
  const it = carpetaNotarios_().getFiles();
  while (it.hasNext()) {
    const f = it.next();
    const nom = f.getName();
    const esDos = nom.indexOf("Hoja Redes (2)") === 0;
    if (nom.indexOf("Hoja Redes") === 0 && nom.slice(-sufijo.length) === sufijo && esDos === (n === 2) && !f.isTrashed()) {
      props.setProperty(clave, f.getId());
      return f;
    }
  }
  return null;
}

function redesContenido_(columnas, filas) {
  return JSON.stringify({ version: 1, columnas: columnas, filas: filas });
}

// Lee el archivo de una hoja -> { columnas, filas } o null si no se pudo leer o no tiene el formato esperado
function redesLeerArchivo_(f) {
  try {
    const j = JSON.parse(f.getBlob().getDataAsString("UTF-8"));
    if (!j || !Array.isArray(j.columnas) || !Array.isArray(j.filas) || !j.columnas.length) return null;
    const columnas = j.columnas.map(function (x, i) {
      return String(x === null || x === undefined ? "" : x).trim() || ENCABEZADOS_REDES[i] || "Columna " + (i + 1);
    });
    const filas = j.filas.map(function (fila) {
      return columnas.map(function (_, c) {
        const v = Array.isArray(fila) ? fila[c] : "";
        return String(v === null || v === undefined ? "" : v);
      });
    });
    return { columnas: columnas, filas: filas };
  } catch (e) {
    return null;
  }
}

// Crea el archivo de una hoja y comprueba que quedó idéntico (si no, lo manda a la papelera y avisa)
function redesCrearArchivo_(n, p, columnas, filas) {
  const contenido = redesContenido_(columnas, filas);
  if (contenido.length > MAX_TOTAL_REDES) throw new Error("La hoja es demasiado grande para guardarla (máximo " + MAX_TOTAL_REDES + " caracteres).");
  const f = carpetaNotarios_().createFile(nombreArchivoRedes_(n, p), contenido, MimeType.PLAIN_TEXT);
  if (f.getBlob().getDataAsString("UTF-8") !== contenido) {
    f.setTrashed(true);
    throw new Error("El archivo de Drive no quedó idéntico; no se cambió nada.");
  }
  const props = PropertiesService.getScriptProperties();
  const id = idEmpresaRedes_(p);
  props.setProperty(PREFIJO_PROP_REDES + n + "_" + id, f.getId());
  props.setProperty(PREFIJO_PROP_REDES_MIGRADA + n + "_" + id, "1");
  return f;
}

// Cuántas columnas están en uso: hasta la última que tenga algo escrito (en el encabezado o en los datos); mínimo las 15 de origen
function anchoUsadoRedes_(h) {
  const ultFila = h.getLastRow();
  const ultCol = h.getLastColumn();
  let ancho = N_COL_REDES;
  if (ultFila < 1 || ultCol <= N_COL_REDES) return ancho;
  const v = h.getRange(1, N_COL_REDES + 1, ultFila, ultCol - N_COL_REDES).getValues();
  for (let i = 0; i < v.length; i++) {
    for (let j = v[i].length - 1; j >= 0; j--) {
      if (String(v[i][j]).trim() !== "") {
        if (N_COL_REDES + j + 1 > ancho) ancho = N_COL_REDES + j + 1;
        break;
      }
    }
  }
  return Math.min(ancho, MAX_COL_REDES);
}

// Lee una pestaña de redes: { columnas, filas }
function redesLeerHoja_(h) {
  const ancho = anchoUsadoRedes_(h);
  const columnas = h.getRange(1, 1, 1, ancho).getValues()[0].map(function (x, i) {
    return celdaTexto_(x) || ENCABEZADOS_REDES[i] || "Columna " + (i + 1);
  });
  const ultima = ultimaFilaEn_(h, 1, ancho);
  let filas = [];
  if (ultima >= 2) {
    filas = h.getRange(2, 1, ultima - 1, ancho).getValues().map(function (f) {
      return f.map(celdaTexto_);
    });
  }
  return { columnas: columnas, filas: filas };
}

function redesListar_(p) {
  const n = numeroHojaRedes_(p);
  const id = idEmpresaRedes_(p);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let datos;
    let almacen = "hoja";
    let archivoUrl = "";
    if (id) {
      almacen = "drive";
      const props = PropertiesService.getScriptProperties();
      let archivo = archivoRedes_(n, p);
      if (archivo) {
        datos = redesLeerArchivo_(archivo);
        if (!datos) {
          return responder_({ ok: false, error: "No se pudo leer el archivo de Drive de esta hoja. ¿Lo borraste o lo cambiaste a mano? Búscalo en la carpeta «" + NOMBRE_CARPETA_NOTARIOS + "» (o en la papelera de Drive)." });
        }
        try {
          const deseado = nombreArchivoRedes_(n, p);
          if (archivo.getName() !== deseado) archivo.setName(deseado); // el proyecto cambió de nombre
        } catch (e) {}
      } else if (props.getProperty(PREFIJO_PROP_REDES_MIGRADA + n + "_" + id)) {
        // Ya vivía en Drive pero el archivo no está: NO se vuelve a copiar la pestaña vieja (estaría desactualizada)
        return responder_({ ok: false, error: "No se encontró el archivo de Drive de esta hoja. Si lo mandaste a la papelera de Drive, restáuralo (carpeta «" + NOMBRE_CARPETA_NOTARIOS + "»)." });
      } else {
        // Primera vez: se pasa a Drive lo que ya hubiera en su pestaña del libro (si no hay pestaña, nace vacía)
        const h = buscarHojaRedes_(n, p);
        datos = h ? redesLeerHoja_(h) : { columnas: ENCABEZADOS_REDES.slice(), filas: [] };
        archivo = redesCrearArchivo_(n, p, datos.columnas, datos.filas);
      }
      archivoUrl = archivo.getUrl();
    } else {
      // Una página vieja no manda el proyecto: se sigue usando la pestaña de antes
      datos = redesLeerHoja_(hojaRedes_(n, p));
    }
    // dinamico: esta versión sabe guardar columnas nuevas o movidas (la página lo comprueba antes de ofrecerlas)
    // hoja: se devuelve el número pedido; así la página sabe que este Apps Script ya maneja 2 hojas (uno viejo no lo manda)
    // empresa: se devuelve el proyecto pedido; así la página sabe que este Apps Script ya maneja una hoja por proyecto
    // almacen: "drive" si la hoja vive en un archivo de Google Drive
    return responder_({ ok: true, filas: datos.filas, columnas: datos.columnas, dinamico: true, hoja: n, empresa: id, almacen: almacen, archivo: archivoUrl });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Guarda la hoja completa (las filas de abajo que queden vacías se quitan).
// p.columnas = nombres de las columnas en el orden actual; una página vieja no los manda: entonces se guardan las 15 de origen y el encabezado no se toca.
function redesGuardar_(p) {
  const n = numeroHojaRedes_(p);
  const id = idEmpresaRedes_(p);
  if (!Array.isArray(p.filas)) return responder_({ ok: false, error: "Datos inválidos (filas)" });
  if (p.filas.length > MAX_FILAS_REDES) {
    return responder_({ ok: false, error: "Demasiadas filas (máximo " + MAX_FILAS_REDES + ")" });
  }
  let nombres = null;
  let nCol = N_COL_REDES;
  if (Array.isArray(p.columnas)) {
    nombres = p.columnas.map(function (x) {
      return String(x === null || x === undefined ? "" : x).trim().slice(0, MAX_NOMBRE_COL_REDES);
    });
    nCol = nombres.length;
    if (nCol < 1 || nCol > MAX_COL_REDES) {
      return responder_({ ok: false, error: "Número de columnas inválido (máximo " + MAX_COL_REDES + ")" });
    }
    if (nombres.some(function (x) { return x === ""; })) {
      return responder_({ ok: false, error: "Hay una columna sin nombre" });
    }
  }
  const filas = p.filas.map(function (f) {
    const fila = [];
    for (let c = 0; c < nCol; c++) {
      const v = Array.isArray(f) ? f[c] : "";
      fila.push(String(v === null || v === undefined ? "" : v).slice(0, MAX_CELDA_REDES));
    }
    return fila;
  });
  while (filas.length && filas[filas.length - 1].every(function (x) { return String(x).trim() === ""; })) filas.pop();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (id) {
      // Cada proyecto guarda su hoja en un archivo de Drive
      const columnas = nombres || ENCABEZADOS_REDES.slice(0, nCol);
      const contenido = redesContenido_(columnas, filas);
      if (contenido.length > MAX_TOTAL_REDES) {
        return responder_({ ok: false, error: "La hoja es demasiado grande para guardarla (máximo " + MAX_TOTAL_REDES + " caracteres en total)." });
      }
      const archivo = archivoRedes_(n, p);
      if (archivo) {
        archivo.setContent(contenido);
        try {
          const deseado = nombreArchivoRedes_(n, p);
          if (archivo.getName() !== deseado) archivo.setName(deseado);
        } catch (e) {}
      } else {
        const props = PropertiesService.getScriptProperties();
        if (props.getProperty(PREFIJO_PROP_REDES_MIGRADA + n + "_" + id)) {
          return responder_({ ok: false, error: "No se encontró el archivo de Drive de esta hoja. Si lo mandaste a la papelera de Drive, restáuralo (carpeta «" + NOMBRE_CARPETA_NOTARIOS + "»)." });
        }
        redesCrearArchivo_(n, p, columnas, filas);
      }
      return responder_({ ok: true, filas: filas.length, columnas: nCol, hoja: n, almacen: "drive" });
    }
    // Una página vieja no manda el proyecto: se sigue usando la pestaña de antes
    const h = hojaRedes_(n, p);
    if (h.getMaxColumns() < nCol) h.insertColumnsAfter(h.getMaxColumns(), nCol - h.getMaxColumns());
    const ancho = Math.max(nCol, anchoUsadoRedes_(h));
    const ultima = ultimaFilaEn_(h, 1, ancho);
    if (nombres) h.getRange(1, 1, 1, nCol).setNumberFormat("@").setValues([nombres]).setFontWeight("bold");
    if (filas.length) {
      if (h.getMaxRows() < filas.length + 1) h.insertRowsAfter(h.getMaxRows(), filas.length + 1 - h.getMaxRows());
      // Formato texto para que nada se convierta en fórmula o fecha. Primero se escribe y después se limpia lo sobrante.
      h.getRange(2, 1, filas.length, nCol).setNumberFormat("@").setValues(filas);
    }
    if (ultima > filas.length + 1) {
      h.getRange(filas.length + 2, 1, ultima - filas.length - 1, ancho).clearContent();
    }
    return responder_({ ok: true, filas: filas.length, columnas: nCol, hoja: n });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Miniaturas de videos de redes (acción «miniatura_link») ----------
// La página manda el link de un video de Facebook, Instagram, TikTok, Threads o X y aquí se busca la imagen de portada:
//   · TikTok: su servicio oEmbed público.
//   · X: el servicio de publicaciones incrustadas de X (syndication).
//   · Facebook, Instagram y Threads: la etiqueta og:image de la página pública del video (y, en Instagram, la versión «embed»).
// Solo funciona con videos PÚBLICOS. Si la red no entrega la imagen, se responde ok:false y la página deja el recuadro de color con el logo.
// Se recuerda el resultado 6 horas (CacheService) para no pedir lo mismo muchas veces. Solo se visitan dominios de estas redes.
const REDES_MINIATURA = {
  facebook: ["facebook.com", "fb.watch", "fb.com", "fb.me"],
  instagram: ["instagram.com", "instagr.am"],
  tiktok: ["tiktok.com"],
  threads: ["threads.net", "threads.com"],
  x: ["x.com", "twitter.com", "t.co"],
};
const UA_MINIATURA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const MAX_URL_MINIATURA = 600;
const SEGUNDOS_CACHE_MINIATURA = 6 * 3600;

function hostDeUrl_(url) {
  const m = /^https:\/\/([^\/?#:@]+)/i.exec(String(url || ""));
  return m ? m[1].toLowerCase() : "";
}

// Red a la que pertenece un dominio ("" si no es de una red permitida)
function redDeHostMiniatura_(host) {
  host = String(host || "").toLowerCase();
  if (!host) return "";
  for (const red in REDES_MINIATURA) {
    if (REDES_MINIATURA[red].some(function (h) { return host === h || host.slice(-(h.length + 1)) === "." + h; })) return red;
  }
  return "";
}

function resolverUrlMiniatura_(base, loc) {
  if (/^https:\/\//i.test(loc)) return loc;
  if (/^\/\//.test(loc)) return "https:" + loc;
  const m = /^(https:\/\/[^\/?#]+)/i.exec(base);
  if (m && loc.charAt(0) === "/") return m[1] + loc;
  return "";
}

function decodificarHtml_(t) {
  return String(t || "")
    .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

// Descarga una página siguiendo las redirecciones a mano (solo hacia dominios de redes permitidas). null si no se pudo.
function descargarMiniatura_(url) {
  let actual = url;
  for (let i = 0; i < 5; i++) {
    if (!redDeHostMiniatura_(hostDeUrl_(actual))) return null;
    const r = UrlFetchApp.fetch(actual, {
      muteHttpExceptions: true,
      followRedirects: false,
      headers: { "User-Agent": UA_MINIATURA, "Accept-Language": "es-MX,es;q=0.9,en;q=0.8" },
    });
    const c = r.getResponseCode();
    if (c >= 300 && c < 400) {
      const h = r.getHeaders();
      const loc = h["Location"] || h["location"];
      if (!loc) return null;
      actual = resolverUrlMiniatura_(actual, String(loc));
      if (!actual) return null;
      continue;
    }
    return { codigo: c, texto: c === 200 ? r.getContentText() : "", url: actual };
  }
  return null;
}

// Imagen og:image de un HTML (descarta los logos genéricos que ponen las redes cuando no hay miniatura)
function ogImagenDe_(html) {
  const t = String(html || "");
  const m = /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i.exec(t) ||
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i.exec(t);
  return m ? imagenValida_(decodificarHtml_(m[1])) : "";
}

function imagenValida_(u) {
  u = String(u || "").trim();
  if (!/^https:\/\/\S+$/i.test(u) || u.length > 1800) return "";
  if (/\/rsrc\.php\/|\/favicon|\/images\/logo|static\.cdninstagram\.com\/rsrc/i.test(u)) return ""; // logo genérico, no es la portada
  return u;
}

function miniaturaTikTok_(url) {
  let u = url;
  if (/^(vm|vt)\./.test(hostDeUrl_(url))) {
    const f = descargarMiniatura_(url); // link corto: se resuelve al link completo
    if (f && f.url) u = f.url;
  }
  try {
    const r = UrlFetchApp.fetch("https://www.tiktok.com/oembed?url=" + encodeURIComponent(u), { muteHttpExceptions: true });
    if (r.getResponseCode() === 200) {
      const j = JSON.parse(r.getContentText());
      const img = imagenValida_(j && j.thumbnail_url);
      if (img) return img;
    }
  } catch (e) {}
  const f2 = descargarMiniatura_(u);
  return f2 && f2.codigo === 200 ? ogImagenDe_(f2.texto) : "";
}

function miniaturaX_(url) {
  let u = url;
  if (hostDeUrl_(url) === "t.co") {
    const f = descargarMiniatura_(url);
    if (f && f.url) u = f.url;
  }
  const m = /\/status\/(\d+)/.exec(u);
  if (m) {
    try {
      const id = m[1];
      const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
      const r = UrlFetchApp.fetch("https://cdn.syndication.twimg.com/tweet-result?id=" + id + "&lang=es&token=" + token, { muteHttpExceptions: true });
      if (r.getResponseCode() === 200) {
        const j = JSON.parse(r.getContentText());
        const det = j && Array.isArray(j.mediaDetails) && j.mediaDetails.length ? j.mediaDetails[0] : null;
        const img = imagenValida_(det && det.media_url_https) ||
          imagenValida_(j && j.video && j.video.poster) ||
          imagenValida_(j && Array.isArray(j.photos) && j.photos.length && j.photos[0].url);
        if (img) return img;
      }
    } catch (e) {}
  }
  const f2 = descargarMiniatura_(u);
  return f2 && f2.codigo === 200 ? ogImagenDe_(f2.texto) : "";
}

function miniaturaPaginaOg_(red, url) {
  const f = descargarMiniatura_(url);
  let img = f && f.codigo === 200 ? ogImagenDe_(f.texto) : "";
  if (!img && red === "instagram") {
    // Versión «embed» de la publicación: suele traer la portada aunque la página normal pida iniciar sesión
    const m = /^(https:\/\/[^\/?#]+\/(?:[^\/]+\/)?(?:reel|reels|p|tv)\/[\w-]+)/i.exec((f && f.url) || url);
    if (m) {
      const f2 = descargarMiniatura_(m[1] + "/embed/captioned/");
      if (f2 && f2.codigo === 200) {
        const e = /class=["'][^"']*EmbeddedMediaImage[^"']*["'][^>]*src=["']([^"']+)["']/i.exec(f2.texto) ||
          /<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*EmbeddedMediaImage/i.exec(f2.texto);
        img = e ? imagenValida_(decodificarHtml_(e[1])) : ogImagenDe_(f2.texto);
      }
    }
  }
  return img;
}

function miniaturaDe_(red, url) {
  if (red === "tiktok") return miniaturaTikTok_(url);
  if (red === "x") return miniaturaX_(url);
  return miniaturaPaginaOg_(red, url);
}

function miniaturaLink_(p) {
  const url = String(p.url || "").trim();
  if (!/^https:\/\/\S+$/i.test(url) || url.length > MAX_URL_MINIATURA) return responder_({ ok: false, error: "Link inválido (debe empezar con https://)" });
  const red = redDeHostMiniatura_(hostDeUrl_(url));
  if (!red) return responder_({ ok: false, error: "Esa red no está permitida para miniaturas" });
  const cache = CacheService.getScriptCache();
  const clave = "mini_" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, url)).slice(0, 40);
  if (!p.forzar) {
    const guardada = cache.get(clave);
    if (guardada) return responder_({ ok: true, imagen: guardada, red: red });
  }
  let imagen = "";
  try { imagen = miniaturaDe_(red, url); } catch (err) { imagen = ""; }
  if (!imagen) return responder_({ ok: false, error: "No se pudo leer la miniatura (¿el video es privado o la red la bloqueó?)", red: red });
  try { cache.put(clave, imagen, SEGUNDOS_CACHE_MINIATURA); } catch (err) {}
  return responder_({ ok: true, imagen: imagen, red: red });
}

function doGet(e) {
  // La versión no es secreta: sirve para comprobar qué código está publicado (abre la URL /exec en el navegador)
  return responder_({ ok: false, version: VERSION, error: "Inicia sesión con Google para ver el calendario" });
}

// Devuelve todos los datos del calendario (columnas A a D)
function calendarioListar_() {
  const h = hoja_();
  const ultima = ultimaFilaEn_(h, 1, 4);
  const datos = {};
  if (ultima >= 2) {
    const filas = h.getRange(2, 1, ultima - 1, 4).getValues();
    filas.forEach(function (f) {
      const fecha = fechaTexto_(f[0]);
      if (!fecha) return;
      datos[fecha] = {
        actividades: String(f[1]),
        descripcion: String(f[2]),
        anotaciones: String(f[3]),
      };
    });
  }
  // Colores de los días (hoja "Colores"): se agregan como "color" a cada día
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const hc = hojaColores_();
    const uc = ultimaFilaEn_(hc, 1, 2);
    if (uc >= 2) {
      hc.getRange(2, 1, uc - 1, 2).getValues().forEach(function (f) {
        const fecha = fechaTexto_(f[0]);
        const color = celdaTexto_(f[1]);
        if (!fecha || !color) return;
        if (!datos[fecha]) datos[fecha] = { actividades: "", descripcion: "", anotaciones: "" };
        datos[fecha].color = color;
      });
    }
  } finally {
    lock.releaseLock();
  }
  return responder_({ ok: true, version: VERSION, datos: datos });
}

// Guarda el color de un día (o lo quita si viene vacío)
function calendarioColor_(p) {
  const fecha = String(p.fecha || "");
  const color = String(p.color || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || (color !== "" && !colorValido_(color))) {
    return responder_({
      ok: false,
      error: "Datos inválidos (fecha: " + fecha + ", color: " + color + ")",
    });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaColores_();
    const ultima = ultimaFilaEn_(h, 1, 2);
    let fila = -1;
    if (ultima >= 2) {
      const fechas = h.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < fechas.length; i++) {
        if (fechaTexto_(fechas[i][0]) === fecha) {
          fila = i + 2;
          break;
        }
      }
    }
    if (color === "") {
      if (fila !== -1) {
        if (h.getMaxRows() > 2) h.deleteRow(fila);
        else h.getRange(fila, 1, 1, 2).clearContent();
      }
    } else if (fila !== -1) {
      h.getRange(fila, 2).setNumberFormat("@").setValue(color);
    } else {
      const nueva = Math.max(ultima, 1) + 1;
      if (nueva > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), nueva - h.getMaxRows());
      h.getRange(nueva, 1, 1, 2).setNumberFormat("@").setValues([[fecha, color]]);
    }
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Tareas Obligatorias Diarias (hoja «Tareas Diarias») ----------
// Cada tarea es una fila: A Id | B Tarea | C Creada. Las tareas se quedan ahí para siempre; al darlas por
// completadas, la página agrega una «Tarea finalizada» al Diario (acción diario_agregar) con el día y la hora.
const NOMBRE_HOJA_TAREAS_DIARIAS = "Tareas Diarias";
const ENCABEZADOS_TAREAS_DIARIAS = ["Id", "Tarea", "Creada", "Hora", "Alarma"];
const N_COL_TAREAS_DIARIAS = 5;
const ALARMAS_TAREA_DIARIA = ["", "celular", "pc", "ambos"];

// Horario opcional (HH:MM) y dónde suena la alarma; devuelve el motivo si no sirven, o "" si están bien
function tareaDiariaHoraAlarma_(p) {
  const hora = String(p.hora || "").trim();
  const alarma = String(p.alarma || "").trim();
  if (hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) return { error: "horario inválido: " + hora };
  if (ALARMAS_TAREA_DIARIA.indexOf(alarma) === -1) return { error: "alarma inválida: " + alarma };
  return { hora: hora, alarma: hora ? alarma : "" };
}
const LIMITE_TAREA_DIARIA = 300;

function hojaTareasDiarias_() {
  return hojaTabla_(NOMBRE_HOJA_TAREAS_DIARIAS, ENCABEZADOS_TAREAS_DIARIAS);
}

function tareasDiariasListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTareasDiarias_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_TAREAS_DIARIAS);
    const tareas = [];
    if (ultima >= 2) {
      h.getRange(2, 1, ultima - 1, N_COL_TAREAS_DIARIAS).getValues().forEach(function (f) {
        const id = celdaTexto_(f[0]);
        const texto = celdaTexto_(f[1]);
        if (!id || !texto) return;
        tareas.push({ id: id, texto: texto, creada: celdaTexto_(f[2]), hora: celdaTexto_(f[3]), alarma: celdaTexto_(f[4]) });
      });
    }
    return responder_({ ok: true, tareas: tareas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function tareasDiariasAgregar_(p) {
  const id = String(p.id || "");
  const texto = String(p.texto || "").trim().slice(0, LIMITE_TAREA_DIARIA);
  if (!/^\d{10,16}$/.test(id) || !texto) {
    return responder_({ ok: false, error: "Datos inválidos (id: " + id + ", texto vacío: " + !texto + ")" });
  }
  const ha = tareaDiariaHoraAlarma_(p);
  if (ha.error) return responder_({ ok: false, error: "Datos inválidos (" + ha.error + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTareasDiarias_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_TAREAS_DIARIAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) return responder_({ ok: true }); // ya estaba (intento repetido)
      }
    }
    const fila = Math.max(ultima, 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    const creada = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
    h.getRange(fila, 1, 1, N_COL_TAREAS_DIARIAS).setNumberFormat("@").setValues([[id, texto, creada, ha.hora, ha.alarma]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function tareasDiariasEditar_(p) {
  const id = String(p.id || "");
  const texto = String(p.texto || "").trim().slice(0, LIMITE_TAREA_DIARIA);
  if (!/^\d{10,16}$/.test(id) || !texto) {
    return responder_({ ok: false, error: "Datos inválidos (id: " + id + ", texto vacío: " + !texto + ")" });
  }
  const ha = tareaDiariaHoraAlarma_(p);
  if (ha.error) return responder_({ ok: false, error: "Datos inválidos (" + ha.error + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTareasDiarias_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_TAREAS_DIARIAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, 2).setNumberFormat("@").setValue(texto);
          h.getRange(i + 2, 4, 1, 2).setNumberFormat("@").setValues([[ha.hora, ha.alarma]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la tarea" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function tareasDiariasBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de tarea: " + id + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaTareasDiarias_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_TAREAS_DIARIAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, 1, 1, N_COL_TAREAS_DIARIAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la tarea" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Cuentas (hoja «Cuentas», zona dentro de Diario) ----------
// Cada cuenta es uno de tus correos, una fila: A Nombre del proyecto | B Referencia del correo | C Imagen | D Proyectos (Ids de la hoja
// «Empresas Proyectos» separados por comas) | E Id | F «Claude Disponible» (fecha y hora en que vuelve la sesión de Claude, AAAA-MM-DD HH:MM)
// | G «Claude Registro» (una línea por cambio: «dd/mm/aaaa hh:mm|AAAA-MM-DD HH:MM», la más reciente primero; se llenan solas)
// | H «Links Personales» (las apps que más usas: un link por línea).
// La imagen se sube con la acción "proyecto_imagen" (imgbb).
const NOMBRE_HOJA_CUENTAS = "Cuentas";
const ENCABEZADOS_CUENTAS = ["Nombre Cuenta", "Referencia Correo Cuenta", "Imagen Cuenta", "Proyectos vinculados", "Id Cuenta", "Claude Disponible", "Claude Registro", "Links Personales"];
const N_COL_CUENTAS = 8;
const COL_ID_CUENTAS = 5;
const COL_CLAUDE_DISPONIBLE = 6;
const COL_CLAUDE_REGISTRO = 7;
const COL_PERSONALES = 8;
const MAX_REGISTRO_CLAUDE = 20;

function hojaCuentas_() {
  return hojaTabla_(NOMBRE_HOJA_CUENTAS, ENCABEZADOS_CUENTAS);
}

function cuentaDatos_(p) {
  const proy = Array.isArray(p.proyectos) ? p.proyectos : [];
  return {
    id: String(p.id || ""),
    nombre: String(p.nombre || p.correo || "").trim().slice(0, 120), // sin nombre se usa la referencia
    correo: String(p.correo || "").trim().slice(0, 200), // referencia del correo (texto libre, no el correo real)
    imagen: String(p.imagen || "").trim(),
    proyectos: proy.map(function (x) { return String(x); }).filter(function (x) { return /^\d{10,16}$/.test(x); }).slice(0, 300),
    // Links de Proyectos Personales: un link http(s) por línea (lo demás se descarta)
    personales: String(p.personales || "").split(/\r?\n/).map(function (l) { return l.trim(); })
      .filter(function (l) { return /^https?:\/\/\S+$/i.test(l) && l.length <= 500; }).slice(0, 30).join("\n"),
  };
}

// Devuelve el motivo si los datos no sirven, o "" si están bien
function cuentaError_(d) {
  if (!/^\d{10,16}$/.test(d.id)) return "id de cuenta inválido: " + d.id;
  if (!d.nombre) return "falta el nombre";
  if (d.imagen && (d.imagen.length > 2000 || !/^https?:\/\/\S+$/i.test(d.imagen))) return "la dirección de la imagen no es válida";
  return "";
}

function cuentasListar_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    const cuentas = [];
    if (ultima >= 2) {
      const filas = h.getRange(2, 1, ultima - 1, N_COL_CUENTAS).getValues();
      const base = Math.floor(Date.now() * 1000);
      const vistos = {};
      filas.forEach(function (f, i) {
        const nombre = celdaTexto_(f[0]);
        const correo = celdaTexto_(f[1]);
        const imagen = celdaTexto_(f[2]);
        if (!nombre && !correo && !imagen) return; // fila sin cuenta
        let id = celdaTexto_(f[4]);
        if (!id || vistos[id]) {
          // Fila escrita a mano (sin Id) o copiada de otra: se le da un Id propio
          let n = base + i;
          while (vistos[String(n)]) n++;
          id = String(n);
          h.getRange(i + 2, COL_ID_CUENTAS).setNumberFormat("@").setValue(id);
        }
        vistos[id] = true;
        cuentas.push({
          id: id,
          nombre: nombre || correo || "Sin nombre",
          correo: correo,
          imagen: imagen,
          proyectos: celdaTexto_(f[3]).split(",").map(function (x) { return x.trim(); }).filter(Boolean),
          personales: celdaTexto_(f[COL_PERSONALES - 1]),
          claudeDisponible: celdaTexto_(f[COL_CLAUDE_DISPONIBLE - 1]),
          claudeRegistro: celdaTexto_(f[COL_CLAUDE_REGISTRO - 1])
            .split("\n")
            .map(function (l) {
              const partes = l.split("|");
              return { cuando: (partes[0] || "").trim(), disponible: (partes[1] || "").trim() };
            })
            .filter(function (r) { return r.cuando; }),
        });
      });
    }
    return responder_({ ok: true, cuentas: cuentas });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function cuentasAgregar_(p) {
  const d = cuentaDatos_(p);
  const motivo = cuentaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_CUENTAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) return responder_({ ok: true }); // ya estaba (intento repetido)
      }
    }
    const fila = Math.max(ultima, 1) + 1;
    if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
    h.getRange(fila, 1, 1, N_COL_CUENTAS).setNumberFormat("@").setValues([[d.nombre, d.correo, d.imagen, d.proyectos.join(","), d.id, "", "", d.personales]]);
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function cuentasEditar_(p) {
  const d = cuentaDatos_(p);
  const motivo = cuentaError_(d);
  if (motivo) return responder_({ ok: false, error: "Datos inválidos (" + motivo + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_CUENTAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === d.id) {
          // Columnas A a D y H (links personales): la E (Id) y las de Claude (F y G) no se tocan al editar la cuenta
          h.getRange(i + 2, 1, 1, 4).setNumberFormat("@").setValues([[d.nombre, d.correo, d.imagen, d.proyectos.join(",")]]);
          h.getRange(i + 2, COL_PERSONALES).setNumberFormat("@").setValue(d.personales);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la cuenta" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// «Claude»: guarda la fecha y hora en que vuelve a estar disponible la sesión de una cuenta (p.disponible, vacía = quitar el aviso)
// y agrega al registro cuándo se hizo el cambio (p.cuando, dd/mm/aaaa hh:mm).
function cuentasClaudeGuardar_(p) {
  const id = String(p.id || "");
  const disponible = String(p.disponible || "").trim();
  const cuando = String(p.cuando || "").trim();
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de cuenta: " + id + ")" });
  if (disponible && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(disponible)) return responder_({ ok: false, error: "Datos inválidos (fecha y hora: " + disponible + ")" });
  if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(cuando)) return responder_({ ok: false, error: "Datos inválidos (cuándo se anotó: " + cuando + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_CUENTAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          const fila = i + 2;
          const previo = celdaTexto_(h.getRange(fila, COL_CLAUDE_REGISTRO).getValue());
          const lineas = previo ? previo.split("\n") : [];
          lineas.unshift(cuando + "|" + disponible);
          h.getRange(fila, COL_CLAUDE_DISPONIBLE, 1, 2)
            .setNumberFormat("@")
            .setValues([[disponible, lineas.slice(0, MAX_REGISTRO_CLAUDE).join("\n")]]);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la cuenta" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function cuentasBorrar_(p) {
  const id = String(p.id || "");
  if (!/^\d{10,16}$/.test(id)) return responder_({ ok: false, error: "Datos inválidos (id de cuenta: " + id + ")" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    if (ultima >= 2) {
      const ids = h.getRange(2, COL_ID_CUENTAS, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (celdaTexto_(ids[i][0]) === id) {
          h.getRange(i + 2, 1, 1, N_COL_CUENTAS).deleteCells(SpreadsheetApp.Dimension.ROWS);
          return responder_({ ok: true });
        }
      }
    }
    return responder_({ ok: false, error: "No se encontró la cuenta" });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Guarda el orden de las cuentas (botón «Mover» de la zona Cuentas): p.orden = lista de Ids en el orden deseado.
// El orden es el de las filas de la hoja «Cuentas»: se reescriben las filas en ese orden.
// Las filas que no vengan en la lista se quedan al final, en el orden que tenían.
function cuentasOrdenGuardar_(p) {
  const lista = Array.isArray(p.orden) ? p.orden.map(function (x) { return String(x); }) : null;
  if (!lista || !lista.length || lista.length > 5000) return responder_({ ok: false, error: "Datos inválidos (orden de cuentas)" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = hojaCuentas_();
    const ultima = ultimaFilaEn_(h, 1, N_COL_CUENTAS);
    if (ultima < 2) return responder_({ ok: false, error: "No hay cuentas" });
    const filas = h.getRange(2, 1, ultima - 1, N_COL_CUENTAS).getValues();
    const porId = {};
    const sinId = [];
    filas.forEach(function (f) {
      const id = celdaTexto_(f[COL_ID_CUENTAS - 1]);
      if (id && !(id in porId)) porId[id] = f; else sinId.push(f);
    });
    const nuevas = [];
    const usados = {};
    lista.forEach(function (id) {
      if (porId[id] && !usados[id]) { nuevas.push(porId[id]); usados[id] = true; }
    });
    filas.forEach(function (f) {
      const id = celdaTexto_(f[COL_ID_CUENTAS - 1]);
      if (id && porId[id] === f && !usados[id]) { nuevas.push(f); usados[id] = true; }
    });
    sinId.forEach(function (f) { nuevas.push(f); });
    if (nuevas.length !== filas.length) return responder_({ ok: false, error: "No se pudo reordenar (las filas no coinciden)" });
    h.getRange(2, 1, nuevas.length, N_COL_CUENTAS).setNumberFormat("@").setValues(nuevas.map(function (f) {
      return f.map(function (c) { return celdaTexto_(c); });
    }));
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Envoltura de doPost: si algo falla fuera de los try/catch internos (por ejemplo, no se consigue el
// bloqueo a tiempo), Google devolvería una página HTML de error y la página mostraría
// «Unexpected token '<'». Así, en su lugar, siempre se responde un JSON con el motivo real.
function doPost(e) {
  try {
    return doPostInterno_(e);
  } catch (err) {
    return responder_({ ok: false, error: "Error en el Apps Script: " + String(err) });
  }
}

// Guarda un campo de un día (crea la fila si no existe) o maneja las notas.
// Solo la cuenta autorizada.
function doPostInterno_(e) {
  // Primero se valida la petición (clave + cuenta de Google); solo después se toca la hoja
  let p;
  try {
    p = JSON.parse(e.postData.contents);
  } catch (err) {
    return responder_({ ok: false, error: "Datos inválidos (no es JSON)" });
  }
  if (!p || p.token !== TOKEN) return responder_({ ok: false, error: "No autorizado" });
  // idToken puede ser un token de Google recién emitido o el pase de larga duración de un dispositivo
  const verificacion = verificarCredencial_(p.idToken);
  if (!verificacion.ok) return responder_(verificacion);

  // Sesiones de dispositivo (para no tener que iniciar sesión cada hora)
  if (p.accion === "sesion_crear") return sesionCrear_(p, verificacion);
  if (p.accion === "sesion_renovar") return sesionRenovar_(verificacion);
  if (p.accion === "sesion_listar") return sesionListar_(verificacion);
  if (p.accion === "sesion_cerrar") return sesionCerrar_(verificacion);
  if (p.accion === "sesion_revocar") return sesionRevocar_(p);

  // Calendario: leer los datos. Solo para la cuenta autorizada.
  if (p.accion === "calendario_listar") return calendarioListar_();
  if (p.accion === "calendario_color") return calendarioColor_(p);

  // Notas: leer, agregar y borrar. También solo para la cuenta autorizada.
  if (p.accion === "nota_listar") return notasListar_();
  if (p.accion === "nota_agregar") return notasAgregar_(p);
  if (p.accion === "nota_borrar") return notasBorrar_(p);
  if (p.accion === "nota_fecha") return notasCambiarFecha_(p);
  if (p.accion === "nota_editar") return notasEditar_(p);
  if (p.accion === "nota_favorito") return notasFavorito_(p);

  // Proyectos: también solo para la cuenta autorizada.
  if (p.accion === "proyecto_listar") return proyectosListar_();
  if (p.accion === "proyecto_agregar") return proyectosAgregar_(p);
  if (p.accion === "proyecto_editar") return proyectosEditar_(p);
  if (p.accion === "proyecto_borrar") return proyectosBorrar_(p);
  if (p.accion === "proyecto_imagen") return proyectosSubirImagen_(p);

  // Galería: también solo para la cuenta autorizada (las imágenes se suben con "proyecto_imagen").
  if (p.accion === "galeria_listar") return galeriaListar_();
  if (p.accion === "galeria_agregar") return galeriaAgregar_(p);
  if (p.accion === "galeria_editar") return galeriaEditar_(p);
  if (p.accion === "galeria_borrar") return galeriaBorrar_(p);

  // Moldes: también solo para la cuenta autorizada (las imágenes se suben con "proyecto_imagen").
  if (p.accion === "moldes_listar") return moldesListar_();
  if (p.accion === "moldes_agregar") return moldesAgregar_(p);
  if (p.accion === "moldes_editar") return moldesEditar_(p);
  if (p.accion === "moldes_borrar") return moldesBorrar_(p);

  // Productos Confirmados (igual que Moldes, con su propia hoja).
  if (p.accion === "prodconf_listar") return prodConfListar_();
  if (p.accion === "prodconf_agregar") return prodConfAgregar_(p);
  if (p.accion === "prodconf_editar") return prodConfEditar_(p);
  if (p.accion === "prodconf_borrar") return prodConfBorrar_(p);
  if (p.accion === "prodconf_config_leer") return prodConfConfigLeer_();
  if (p.accion === "prodconf_config_guardar") return prodConfConfigGuardar_(p);
  if (p.accion === "prodconf_zona_borrar") return prodConfZonaBorrar_(p);
  if (p.accion === "prodconf_precios_aplicar") return prodConfPreciosAplicar_(p);

  // Ejercicio: también solo para la cuenta autorizada.
  if (p.accion === "ejercicio_listar") return ejercicioListar_();
  if (p.accion === "ejercicio_agregar") return ejercicioAgregar_(p);
  if (p.accion === "ejercicio_editar") return ejercicioEditar_(p);
  if (p.accion === "ejercicio_borrar") return ejercicioBorrar_(p);

  // Trabajo terminado: pasa de "Notas" a "Diario". También solo para la cuenta autorizada.
  if (p.accion === "trabajo_finalizar") return trabajosFinalizar_(p);
  // Actividad o trabajo finalizado: agrega la fecha de término al recuerdo del Diario y crea la copia del día de hoy
  if (p.accion === "actividad_finalizar") return actividadFinalizar_(p);

  // Diario: también solo para la cuenta autorizada.
  if (p.accion === "diario_listar") return diarioListar_();
  if (p.accion === "diario_agregar") return diarioAgregar_(p);
  if (p.accion === "diario_editar") return diarioEditar_(p);
  if (p.accion === "diario_borrar") return diarioBorrar_(p);

  // Deudas (columnas H a K de la hoja "Diario"): también solo para la cuenta autorizada.
  if (p.accion === "deuda_listar") return deudasListar_();
  if (p.accion === "deuda_finalizar") return deudasFinalizar_(p);
  if (p.accion === "deuda_agregar") return deudasAgregar_(p);
  if (p.accion === "deuda_editar") return deudasEditar_(p);
  if (p.accion === "deuda_borrar") return deudasBorrar_(p);

  // Información Primordial (hoja "Informacion Primordial"): también solo para la cuenta autorizada.
  if (p.accion === "informacion_listar") return informacionListar_();
  if (p.accion === "informacion_agregar") return informacionAgregar_(p);
  if (p.accion === "informacion_editar") return informacionEditar_(p);
  if (p.accion === "informacion_borrar") return informacionBorrar_(p);

  // Comandos (hoja "comandos"): también solo para la cuenta autorizada.
  if (p.accion === "comando_listar") return comandosListar_();
  if (p.accion === "comando_agregar") return comandosAgregar_(p);
  if (p.accion === "comando_editar") return comandosEditar_(p);
  if (p.accion === "comando_borrar") return comandosBorrar_(p);

  // Bazar (hoja "Bazar"): también solo para la cuenta autorizada.
  if (p.accion === "bazar_listar") return bazarListar_();
  if (p.accion === "bazar_agregar") return bazarAgregar_(p);
  if (p.accion === "bazar_editar") return bazarEditar_(p);
  if (p.accion === "bazar_borrar") return bazarBorrar_(p);

  // Empresas/Proyectos (primera hoja, columnas H a N): también solo para la cuenta autorizada.
  if (p.accion === "empresa_listar") return empresasListar_();
  if (p.accion === "empresa_agregar") return empresasAgregar_(p);
  if (p.accion === "empresa_editar") return empresasEditar_(p);
  if (p.accion === "empresa_borrar") return empresasBorrar_(p);
  if (p.accion === "empresa_orden_guardar") return empresasOrdenGuardar_(p);
  if (p.accion === "empresa_nota_guardar") return empresasNotaGuardar_(p);
  if (p.accion === "empresa_nota_borrar") return empresasNotaBorrar_(p);
  if (p.accion === "empresa_notas_orden_guardar") return empresasNotasOrdenGuardar_(p);

  // Hoja de redes (zona Empresas/Proyectos) y «Migrar a Drive»: también solo para la cuenta autorizada.
  if (p.accion === "hoja_redes_listar") return redesListar_(p);
  if (p.accion === "hoja_redes_guardar") return redesGuardar_(p);
  if (p.accion === "miniatura_link") return miniaturaLink_(p);
  if (p.accion === "migrar_drive") return migrarDrive_(p);
  if (p.accion === "notario_migrar") return notariosMigrar_(p);

  // Tareas Obligatorias Diarias (hoja "Tareas Diarias")
  if (p.accion === "tarea_diaria_listar") return tareasDiariasListar_();
  if (p.accion === "tarea_diaria_agregar") return tareasDiariasAgregar_(p);
  if (p.accion === "tarea_diaria_editar") return tareasDiariasEditar_(p);
  if (p.accion === "tarea_diaria_borrar") return tareasDiariasBorrar_(p);

  // Cuentas (hoja "Cuentas", dentro de Diario): tus correos, con sus proyectos vinculados.
  if (p.accion === "cuenta_listar") return cuentasListar_();
  if (p.accion === "cuenta_agregar") return cuentasAgregar_(p);
  if (p.accion === "cuenta_editar") return cuentasEditar_(p);
  if (p.accion === "cuenta_borrar") return cuentasBorrar_(p);
  if (p.accion === "cuenta_claude_guardar") return cuentasClaudeGuardar_(p);
  if (p.accion === "cuenta_orden_guardar") return cuentasOrdenGuardar_(p);

  // Notario (hoja "Notarios"): también solo para la cuenta autorizada.
  if (p.accion === "notario_listar") return notariosListar_();
  if (p.accion === "notario_agregar") return notariosAgregar_(p);
  if (p.accion === "notario_editar") return notariosEditar_(p);
  if (p.accion === "notario_borrar") return notariosBorrar_(p);
  if (p.accion === "notario_nota_guardar") return notariosNotaGuardar_(p);
  if (p.accion === "notario_nota_borrar") return notariosNotaBorrar_(p);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const col = COLUMNAS[p.campo];
    if (!col || !/^\d{4}-\d{2}-\d{2}$/.test(p.fecha)) {
      return responder_({
        ok: false,
        error: "Datos inválidos (acción recibida: " + p.accion + ", campo: " + p.campo + ")",
      });
    }

    const h = hoja_();
    const ultima = ultimaFilaEn_(h, 1, 4); // solo cuenta las columnas del calendario
    let fila = -1;
    let destino = Math.max(ultima, 1) + 1; // por defecto, al final
    if (ultima >= 2) {
      const fechas = h.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < fechas.length; i++) {
        const f = fechaTexto_(fechas[i][0]);
        if (f === p.fecha) {
          fila = i + 2;
          break;
        }
        // Primera fecha posterior: ahí debe entrar la fila nueva
        if (f > p.fecha && destino > ultima) {
          destino = i + 2;
        }
      }
    }
    if (fila === -1) {
      fila = destino;
      if (fila > h.getMaxRows()) h.insertRowsAfter(h.getMaxRows(), fila - h.getMaxRows());
      // Si no va al final, se abre un hueco y las demás filas bajan.
      // Solo se desplazan las columnas A a D.
      if (fila <= ultima) h.getRange(fila, 1, 1, 4).insertCells(SpreadsheetApp.Dimension.ROWS);
      h.getRange(fila, 1).setNumberFormat("@").setValue(p.fecha);
    }
    // Formato texto para que nada se convierta en fórmula o fecha
    h.getRange(fila, col).setNumberFormat("@").setValue(String(p.valor));
    return responder_({ ok: true });
  } catch (err) {
    return responder_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
