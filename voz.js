// ---------- Polo AI por voz ----------
// Intérprete LOCAL de órdenes (sin IA externa, sin llaves, sin enviar datos a nadie).
//   1) Dictas o escribes una orden:  «crea una nota en deudas a fecha de hoy que diga …»
//   2) El intérprete saca la zona, la fecha, el nombre y el texto.
//   3) Te muestra una tarjeta para REVISAR y corregir. Solo al pulsar «Confirmar» se guarda,
//      con las mismas acciones del Apps Script que usan los formularios (nota_agregar,
//      deuda_agregar, diario_agregar…). Nada se escribe en tus hojas sin tu confirmación.
//
// Se carga DESPUÉS de app.js: usa sus funciones y listas (llamarNotas, sesionVigente, notas, deudas…).
(function () {
  "use strict";

  // ======================================================================
  //  ZONAS (cómo guarda cada una y con qué palabras se le nombra)
  // ======================================================================
  // tipo: nota (hoja Notas) | dia (nombre+fecha+descripcion) | sinFecha (Deudas) | bazar (nombre+informacion+categoria)
  const ZONAS = [
    { id: "notas", titulo: "Notas", seccion: "seccion-notas", tipo: "nota", etiqueta: "General",
      alias: ["notas", "nota"] },
    { id: "ejercicio", titulo: "Ejercicio", seccion: "seccion-ejercicio", tipo: "dia", accion: "ejercicio_agregar",
      alias: ["ejercicios", "ejercicio", "rutina", "entrenamiento"] },
    { id: "actividades", titulo: "Pendientes", seccion: "actividades", tipo: "nota", etiqueta: "Actividades",
      alias: ["pendientes", "actividades", "actividad"] },
    { id: "trabajo", titulo: "Trabajo", seccion: "trabajo", tipo: "nota", etiqueta: "Trabajo",
      alias: ["trabajos", "trabajo", "chamba"] },
    { id: "diario", titulo: "Diario", seccion: "seccion-diario", tipo: "dia", accion: "diario_agregar",
      alias: ["diario"] },
    { id: "deudas", titulo: "Deudas", seccion: "seccion-deudas", tipo: "sinFecha", accion: "deuda_agregar",
      alias: ["deudas", "deuda", "adeudos", "adeudo"] },
    { id: "informacion", titulo: "Información Primordial", seccion: "seccion-informacion", tipo: "dia", accion: "informacion_agregar",
      alias: ["informacion primordial", "info primordial", "informacion", "info", "primordial"] },
    { id: "comandos", titulo: "Comandos", seccion: "seccion-comandos", tipo: "dia", accion: "comando_agregar",
      alias: ["comandos", "comando"] },
    { id: "bazar", titulo: "Bazar", seccion: "seccion-bazar", tipo: "bazar", accion: "bazar_agregar",
      categoria: "Bazar", alias: ["bazar"] },
    { id: "ventas", titulo: "Ventas", seccion: "seccion-bazar", tipo: "bazar", accion: "bazar_agregar",
      categoria: "Ventas", alias: ["ventas", "venta"] },
    { id: "yeso", titulo: "Pedidos de Yeso", seccion: "pedidos-yeso", tipo: "nota", etiqueta: "Pedidos de Yeso",
      alias: ["pedidos de yeso", "pedido de yeso", "pedidos", "pedido", "yeso"] },
  ];
  const zonaPorId = (id) => ZONAS.find((z) => z.id === id) || null;

  // Palabra que dices justo después del verbo («crea una DEUDA…») y que ya indica la zona
  const OBJETO_ZONA = {
    deuda: "deudas", adeudo: "deudas", actividad: "actividades", trabajo: "trabajo",
    pedido: "yeso", ejercicio: "ejercicio", comando: "comandos", pendiente: "notas", venta: "ventas",
  };
  const OBJETO_ETIQUETA = { pendiente: "Pendiente Importante" };

  // Misma lista de etiquetas que las Notas (se lee de app.js si está disponible)
  const ETIQUETAS_RESPALDO = ["General", "Tarea/Actividad", "Conjunto de Datos", "Sueños", "Pendiente Importante",
    "Pedidos de Yeso", "Actividades", "Trabajo"];
  function etiquetasNota() {
    try { if (typeof ETIQUETAS_NOTA !== "undefined" && ETIQUETAS_NOTA.length) return ETIQUETAS_NOTA; } catch (e) { /* respaldo */ }
    return ETIQUETAS_RESPALDO;
  }

  // ======================================================================
  //  UTILIDADES DE TEXTO
  // ======================================================================
  const dos = (n) => String(n).padStart(2, "0");

  // Minúsculas y sin acentos, CARÁCTER POR CARÁCTER para que los índices coincidan con el texto original
  function norm(s) {
    let out = "";
    for (const ch of s) {
      let b = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (b.length !== ch.length) b = ch;
      out += b;
    }
    return out;
  }
  // Un «par» guarda el texto original (o) y su versión normalizada (n), siempre del mismo largo
  function par(s) { s = String(s || "").normalize("NFC"); return { o: s, n: norm(s) }; }
  function trozo(p, a, b) { return { o: p.o.slice(a, b), n: p.n.slice(a, b) }; }
  function corte(p, a, b) { return { o: p.o.slice(0, a) + " " + p.o.slice(b), n: p.n.slice(0, a) + " " + p.n.slice(b) }; }
  const SIGNOS = /[\s,;:.\-¿?¡!"“”]/;
  // Quita espacios y signos sueltos del inicio (y del final, salvo que soloInicio sea true)
  function recortar(p, soloInicio) {
    let a = 0, b = p.n.length;
    while (a < b && SIGNOS.test(p.n[a])) a++;
    if (!soloInicio) while (b > a && SIGNOS.test(p.n[b - 1])) b--;
    else while (b > a && /\s/.test(p.n[b - 1])) b--;
    return trozo(p, a, b);
  }
  const mayuscula = (s) => s.replace(/^(\s*)(\p{L})/u, (_, e, c) => e + c.toUpperCase());
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // ======================================================================
  //  FECHAS
  // ======================================================================
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"];
  const DIAS_SEM = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const NUM_PALABRA = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7 };
  const PRE = "(?:(?:a|con|de|del|para|en)\\s+)?(?:(?:fecha|dia)\\s+(?:de\\s+|del\\s+)?)?(?:el\\s+)?";

  function sumarDias(base, n) { const d = new Date(base.getFullYear(), base.getMonth(), base.getDate()); d.setDate(d.getDate() + n); return d; }
  function fechaValida(a, m, d) {
    const f = new Date(a, m, d);
    return f.getFullYear() === a && f.getMonth() === m && f.getDate() === d ? f : null;
  }

  // Cada patrón devuelve una Date (o null si no es una fecha válida)
  const FECHAS = [
    { re: PRE + "(pasado\\s+manana|manana|hoy|ayer|anteayer|antier)",
      f: (m, hoy) => {
        const k = m[1].replace(/\s+/g, " ");
        const off = { "hoy": 0, "manana": 1, "pasado manana": 2, "ayer": -1, "anteayer": -2, "antier": -2 }[k];
        return sumarDias(hoy, off);
      } },
    { re: PRE + "(\\d{1,2})\\s+de\\s+(" + MESES.join("|") + "|setiembre)(?:\\s+(?:de|del)\\s+(\\d{4}))?",
      f: (m, hoy) => {
        const mes = m[2] === "setiembre" ? 8 : MESES.indexOf(m[2]);
        return fechaValida(m[3] ? Number(m[3]) : hoy.getFullYear(), mes, Number(m[1]));
      } },
    { re: PRE + "(\\d{1,2})[/-](\\d{1,2})(?:[/-](\\d{2,4}))?(?!\\d)",
      f: (m, hoy) => {
        let a = m[3] ? Number(m[3]) : hoy.getFullYear();
        if (a < 100) a += 2000;
        return fechaValida(a, Number(m[2]) - 1, Number(m[1]));
      } },
    { re: "dentro\\s+de\\s+(\\d+|un|una|dos|tres|cuatro|cinco|seis|siete)\\s+(dias?|semanas?)",
      f: (m, hoy) => {
        const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM_PALABRA[m[1]];
        return sumarDias(hoy, /^semana/.test(m[2]) ? n * 7 : n);
      } },
    { re: "(?:el\\s+)?(?:(?:proximo|este)\\s+)?(" + DIAS_SEM.join("|") + ")",
      f: (m, hoy) => {
        const objetivo = DIAS_SEM.indexOf(m[1]);
        const delta = ((objetivo - hoy.getDay() + 7) % 7) || 7; // siempre hacia adelante
        return sumarDias(hoy, delta);
      } },
  ];

  // Busca una fecha en el par. anclado = solo si está al inicio. Devuelve { a, b, fecha } o null.
  function buscarFecha(p, hoy, anclado) {
    let mejor = null;
    for (const def of FECHAS) {
      const re = new RegExp((anclado ? "^\\s*(?:,\\s*)?" : "\\b") + "(?:" + def.re + ")(?![\\p{L}\\d])", "u");
      const m = re.exec(p.n);
      if (!m) continue;
      const fecha = def.f(m, hoy);
      if (!fecha) continue;
      if (!mejor || m.index < mejor.a) mejor = { a: m.index, b: m.index + m[0].length, fecha };
    }
    return mejor;
  }

  const iso = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
  const corta = (d) => `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
  const mismoDia = (a, b) => iso(a) === iso(b);

  // ======================================================================
  //  EXPRESIONES DEL INTÉRPRETE
  // ======================================================================
  const VERBO = new RegExp(
    "^(?:(?:quiero|necesito|me\\s+gustaria|puedes|podrias|podria|favor\\s+de|ayudame\\s+a)\\s+(?:que\\s+)?)?(?:me\\s+)?" +
    "(?:crea|crear|crees|creame|agrega|agregar|agregues|agregame|anade|anadir|anademe|anota|anotar|anotes|anotame|" +
    "apunta|apuntar|apuntes|apuntame|escribe|escribir|escribas|escribeme|guarda|guardar|guardes|guardame|" +
    "registra|registrar|registres|registrame|pon|poner|pongas|ponme|haz|hacer|hagas|hazme|genera|generar|" +
    "toma|tomar|deja|dejar|nueva|nuevo)(?=\\s|[,.:;]|$)\\s*");

  const OBJETO = /^(?:por\s+favor[\s,]*)?(?:(?:una|un|unas|unos|la|el|otra|otro|mi|alguna)\s+)?(?:(?:nueva|nuevo)\s+)?(nota|anotacion|apunte|registro|entrada|recordatorio|deuda|adeudo|actividad|trabajo|pedido|ejercicio|comando|pendiente)(?=\s|[,.:;]|$)\s*/;

  // Separa «lo que quieres hacer» de «lo que debe decir»
  const SEPARADOR = new RegExp(
    "(?:^|\\s)(?:que\\s+(?:diga|dice|ponga|escriba|anote|apunte|mencione|contenga|recuerde)|diciendo|" +
    "con\\s+(?:el\\s+)?(?:texto|contenido)|con\\s+(?:la\\s+)?descripcion|el\\s+texto\\s+(?:es|dice)|texto|dice)" +
    "(?=\\s|[:,;]|$)\\s*[:,;-]?\\s*|\\s*:\\s*");

  const PARADAS = "(?:en|a|al|con|para|que|diciendo|de\\s+hoy|de\\s+manana|a\\s+fecha)";
  const NOMBRE_ARR = "(?:(?:con|de)\\s+(?:el\\s+)?(?:nombre|titulo)|llamad[ao]|titulad[ao]|que\\s+se\\s+llame|se\\s+llama)\\s+";
  // Con separador el nombre puede llegar hasta el final de la cabecera; sin él debe terminar en una palabra de parada
  const NOMBRE_RE_FIN = new RegExp("(?:^|\\s)" + NOMBRE_ARR + "(.+?)(?=\\s+" + PARADAS + "\\b|\\s*$)");
  const NOMBRE_RE_PARADA = new RegExp("(?:^|\\s)" + NOMBRE_ARR + "(.+?)(?=\\s+" + PARADAS + "\\b)");
  const NOMBRE_RE_ANCLADO = new RegExp("^\\s*" + NOMBRE_ARR + "(.+?)(?=\\s+" + PARADAS + "\\b)");
  const ETIQUETA_ARR = "(?:con\\s+)?(?:la\\s+)?etiqueta\\s+(?:de\\s+)?";
  const ETIQUETA_RE = new RegExp("(?:^|\\s)" + ETIQUETA_ARR + "(.+?)(?=\\s+" + PARADAS + "\\b|\\s*$)");
  const ETIQUETA_RE_ANCLADO = new RegExp("^\\s*" + ETIQUETA_ARR + "(.+?)(?=\\s+" + PARADAS + "\\b)");

  // Zona: «en (la zona de) deudas», «a la sección de diario», «zona de bazar»…
  const ALIAS = [];
  ZONAS.forEach((z) => z.alias.forEach((a) => ALIAS.push({ a, zona: z.id })));
  ALIAS.sort((x, y) => y.a.length - x.a.length);
  const ART = "(?:(?:la|el|las|los|mi|mis)\\s+)";
  const ZW = "(?:(?:zona|seccion|apartado|pagina|area)\\s+(?:de\\s+" + ART + "?)?)";
  const ZONA_RE = new RegExp(
    "\\b(?:(?:en|a|al|dentro\\s+de|para|hacia)\\s+" + ART + "?" + ZW + "?|" + ZW + ")(" +
    ALIAS.map((x) => esc(x.a).replace(/ /g, "\\s+")).join("|") + ")(?=\\s|[,.;:]|$)");
  function zonaDeAlias(txt) {
    const t = txt.replace(/\s+/g, " ");
    const x = ALIAS.find((y) => y.a === t);
    return x ? x.zona : null;
  }

  function etiquetaDe(candidato) {
    const c = norm(candidato).trim();
    if (!c) return null;
    for (const e of etiquetasNota()) {
      const ne = norm(e);
      if (ne === c || ne.includes(c) || c.includes(ne)) return e;
    }
    return null;
  }

  // Nombre automático a partir del texto: las primeras palabras, cortando antes de «por / porque / para…»
  function nombreDeTexto(texto) {
    const limpio = texto.replace(/^\d{1,2}\/\d{1,2}\/\d{4}\s*:\s*/, "").trim();
    const palabras = limpio.split(/\s+/).filter(Boolean).slice(0, 8);
    let corte = palabras.length;
    for (let i = 3; i < palabras.length; i++) {
      if (/^(por|porque|para|pero|cuando|ya|que)$/i.test(norm(palabras[i]))) { corte = i; break; }
    }
    let nombre = palabras.slice(0, corte).join(" ").replace(/[,;:.\-\s]+$/, "");
    if (nombre.length > 60) nombre = nombre.slice(0, 60).replace(/\s+\S*$/, "");
    return mayuscula(nombre) || "Sin nombre";
  }

  // ======================================================================
  //  INTÉRPRETE
  // ======================================================================
  // Devuelve { ok, zona, zonaDetectada, etiqueta, nombre, texto, fecha, fechaExplicita, avisos }
  function interpretar(entrada, ahora) {
    const hoy = ahora || new Date();
    const avisos = [];
    let p = recortar(par(entrada));
    if (!p.n) return { ok: false, error: "Escribe o dicta una orden." };

    // Muletillas del principio («oye», «por favor»…)
    let m;
    while ((m = /^(?:oye|hey|polo|ok|okay|bueno|a\s+ver|por\s+favor|porfa)(?=[\s,.!]|$)[\s,.!]*/.exec(p.n))) {
      p = trozo(p, m[0].length, p.n.length);
    }
    m = VERBO.exec(p.n);
    if (!m) {
      return { ok: false, error: "No entendí la orden. Empieza con un verbo, por ejemplo: «crea una nota en deudas que diga…»." };
    }
    let resto = trozo(p, m[0].length, p.n.length);

    // «una nota», «una deuda», «un pendiente»…
    let objeto = null;
    m = OBJETO.exec(resto.n);
    if (m) { objeto = m[1]; resto = trozo(resto, m[0].length, resto.n.length); }

    let zona = null, etiqueta = null, nombre = null, fecha = null, fechaExplicita = false, cuerpo;

    const sep = SEPARADOR.exec(resto.n);
    if (sep) {
      // ---- Con «que diga …»: la cabecera es lo de antes y el cuerpo lo de después ----
      let cab = trozo(resto, 0, sep.index);
      cuerpo = trozo(resto, sep.index + sep[0].length, resto.n.length);

      if ((m = NOMBRE_RE_FIN.exec(cab.n))) {
        const fin = m.index + m[0].length;
        nombre = cab.o.slice(fin - m[1].length, fin).trim();
        cab = corte(cab, m.index, fin);
      }
      if ((m = ETIQUETA_RE.exec(cab.n))) {
        const fin = m.index + m[0].length;
        etiqueta = etiquetaDe(cab.o.slice(fin - m[1].length, fin));
        if (!etiqueta) avisos.push("No reconocí la etiqueta «" + cab.o.slice(fin - m[1].length, fin).trim() + "».");
        cab = corte(cab, m.index, fin);
      }
      const f = buscarFecha(cab, hoy, false);
      if (f) { fecha = f.fecha; fechaExplicita = true; cab = corte(cab, f.a, f.b); }
      if ((m = ZONA_RE.exec(cab.n))) zona = zonaDeAlias(m[1]);
    } else {
      // ---- Sin «que diga»: lo que sigue a la zona (y a la fecha) es el texto ----
      let cab = resto, cola;
      if ((m = NOMBRE_RE_PARADA.exec(cab.n))) {
        const fin = m.index + m[0].length;
        nombre = cab.o.slice(fin - m[1].length, fin).trim();
        cab = corte(cab, m.index, fin);
      }
      if ((m = ETIQUETA_RE.exec(cab.n)) && /\s+\S/.test(cab.n.slice(m.index + m[0].length) + " x")) {
        const fin = m.index + m[0].length;
        const cand = cab.o.slice(fin - m[1].length, fin);
        const e = etiquetaDe(cand);
        if (e) { etiqueta = e; cab = corte(cab, m.index, fin); }
      }
      m = ZONA_RE.exec(cab.n);
      if (m) {
        zona = zonaDeAlias(m[1]);
        const fin = m.index + m[0].length;
        const antes = trozo(cab, 0, m.index);
        cola = trozo(cab, fin, cab.n.length);
        const f = buscarFecha(antes, hoy, false);
        if (f) { fecha = f.fecha; fechaExplicita = true; }
      } else {
        cola = cab;
      }
      // Frases de fecha / nombre / etiqueta pegadas justo después de la zona
      for (let vuelta = 0; vuelta < 4; vuelta++) {
        cola = recortar(cola, true);
        let f2;
        if (!fecha && (f2 = buscarFecha(cola, hoy, true))) {
          fecha = f2.fecha; fechaExplicita = true; cola = trozo(cola, f2.b, cola.n.length); continue;
        }
        if (!nombre && (m = NOMBRE_RE_ANCLADO.exec(cola.n))) {
          const fin = m.index + m[0].length;
          nombre = cola.o.slice(fin - m[1].length, fin).trim();
          cola = trozo(cola, fin, cola.n.length); continue;
        }
        if (!etiqueta && (m = ETIQUETA_RE_ANCLADO.exec(cola.n))) {
          const fin = m.index + m[0].length;
          const e = etiquetaDe(cola.o.slice(fin - m[1].length, fin));
          if (e) { etiqueta = e; cola = trozo(cola, fin, cola.n.length); continue; }
        }
        break;
      }
      cuerpo = cola;
    }

    // ---- Limpieza del texto ----
    cuerpo = recortar(cuerpo, true);
    let mq;
    while ((mq = /^(?:que|de|sobre)\s+/.exec(cuerpo.n)) && mq[0].length < cuerpo.n.length) {
      // «que le debo…» -> «le debo…»; «de 100 pesos…» solo si la orden no traía separador
      if (mq[0].startsWith("que") || !sep) cuerpo = trozo(cuerpo, mq[0].length, cuerpo.n.length);
      else break;
    }
    const pf = /[\s,.;]*(?:por\s+favor|porfa)[\s.!]*$/.exec(cuerpo.n);
    if (pf) cuerpo = trozo(cuerpo, 0, pf.index);
    cuerpo = recortar(cuerpo, true);
    const texto = mayuscula(cuerpo.o.replace(/\s+/g, " ").trim());

    // ---- Zona final ----
    const implicita = objeto && OBJETO_ZONA[objeto] ? OBJETO_ZONA[objeto] : null;
    const zonaDetectada = !!(zona || implicita);
    if (!zona) zona = implicita;
    if (!zona) {
      zona = "notas";
      avisos.push("No dijiste la zona: la puse en Notas. Cámbiala abajo si no es esa.");
    }
    if (zona === "notas" && !etiqueta) etiqueta = OBJETO_ETIQUETA[objeto] || "General";
    if (!texto) avisos.push("No alcancé a entender qué debe decir la nota. Escríbelo abajo.");

    return {
      ok: true,
      zona,
      zonaDetectada,
      etiqueta: etiqueta || null,
      nombre: nombre ? mayuscula(nombre.replace(/\s+/g, " ")).slice(0, 80) : nombreDeTexto(texto),
      nombreDicho: !!nombre,
      texto,
      fecha: fecha || hoy,
      fechaExplicita,
      avisos,
    };
  }

  // Zonas que no tienen campo de fecha guardan la fecha dentro del texto (solo si la dijiste)
  function textoConFecha(base, fecha) {
    return corta(fecha) + ": " + base.replace(/^\d{1,2}\/\d{1,2}\/\d{4}\s*:\s*/, "");
  }

  // ======================================================================
  //  GUARDAR (mismas acciones del Apps Script que usan los formularios)
  // ======================================================================
  const idNota = () => String(Date.now());
  const idRegistro = () => String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  function sello(fechaISO) {
    // «dd/mm/aaaa hh:mm»: con la hora actual si es hoy; si no, mediodía
    const [a, mm, d] = fechaISO.split("-").map(Number);
    const ahora = new Date();
    const hoy = a === ahora.getFullYear() && mm === ahora.getMonth() + 1 && d === ahora.getDate();
    const hh = hoy ? `${dos(ahora.getHours())}:${dos(ahora.getMinutes())}` : "12:00";
    return `${dos(d)}/${dos(mm)}/${a} ${hh}`;
  }

  // c = { zona, etiqueta, nombre, fecha (aaaa-mm-dd), texto }
  async function guardarOrden(c) {
    const z = zonaPorId(c.zona);
    if (!z) throw new Error("Elige una zona");
    if (typeof llamarNotas !== "function") throw new Error("app.js no está cargado");
    const nombre = c.nombre.trim() || "Sin nombre";
    const destino = "drive"; // todo se guarda en Drive (el Apps Script también lo fuerza)

    if (z.tipo === "nota") {
      const nota = {
        id: idNota(), nombre, fecha: sello(c.fecha), etiqueta: c.etiqueta || z.etiqueta || "General",
        texto: c.texto, color: "Blanco", identificador: "", destino,
      };
      await llamarNotas("nota_agregar", nota);
      try { if (notasCargadas) { notas.push(nota); dibujarNotas(); } } catch (e) { /* se vuelve a leer al entrar */ }
      return z;
    }
    if (z.tipo === "bazar") {
      const d = { id: idRegistro(), nombre, informacion: c.texto, categoria: z.categoria || "Bazar", destino };
      await llamarNotas(z.accion, d);
      try { if (bzCargadas) { bazarLista.push(d); dibujarChipsBz(); } } catch (e) { /* idem */ }
      return z;
    }
    if (z.tipo === "sinFecha") {
      // La fecha de creación de la deuda es siempre la de hoy (se anota en la columna I de la hoja)
      const d = { id: idRegistro(), nombre, fecha: ipHoy(), descripcion: c.texto, destino };
      await llamarNotas(z.accion, d);
      try { if (deCargadas) { deudas.push(d); dibujarChipsDe(); } } catch (e) { /* idem */ }
      return z;
    }
    // tipo «dia»: Ejercicio, Diario, Información Primordial y Comandos
    const d = { id: idRegistro(), nombre, fecha: c.fecha, descripcion: c.texto, destino };
    if (z.id === "diario") d.terminado = false;
    await llamarNotas(z.accion, d);
    try {
      if (z.id === "ejercicio" && ejCargados) { ejercicios.push(d); dibujarCalendarioEj(); if (ejDia) dibujarChipsEj(); dibujarCalendarioDi(); }
      else if (z.id === "diario" && diCargados) { diarios.push(d); dibujarCalendarioDi(); if (diDia) dibujarChipsDi(); }
      else if (z.id === "informacion" && ipCargadas) { informaciones.push(d); dibujarChipsIp(); }
      else if (z.id === "comandos" && cmCargadas) { comandosLista.push(d); dibujarChipsCm(); }
    } catch (e) { /* se vuelve a leer al entrar */ }
    return z;
  }

  // ======================================================================
  //  PREGUNTAS SOBRE TUS CUENTAS («oye voz, ¿en qué cuenta tengo el imgbb de esta app?»)
  // ======================================================================
  // Solo BUSCA en lo que ya escribiste en la app (Diario → Cuentas y los proyectos vinculados a cada cuenta):
  // nombre de la cuenta, referencia del correo, y nombre / descripción / zona / links / notas de sus proyectos vinculados.
  // No inventa nada: si no hay coincidencias, responde que no se encontró información. No guarda ni modifica nada.
  const MULETILLAS = /^(?:oye|hey|voz|polo|ok|okay|bueno|a\s+ver|por\s+favor|porfa)(?=[\s,.!?¿]|$)[\s,.!?¿]*/;
  const PALABRAS_VACIAS = new Set((
    "de la el los las un una unos unas en y o a al del que cual cuales como donde dime dame busca buscame oye hey voz polo ok " +
    "por para con sin se me mi mis tu tus tengo tienes tiene tienen tengan tenia tuve tuvo esta este esto estos estas ese esa eso " +
    "corresponde corresponden correspondiente relacionada relacionado relacionadas sirve sirven usa uso usar hay " +
    "cuenta cuentas correo correos app aplicacion pagina proyecto proyectos numero llamada llamado favor porfa " +
    "puedes podrias decirme sabes recuerdas ver mostrar muestrame muestra ya es son fue ser lo le les su sus mas muy tambien " +
    "cuantas cuantos quiero saber necesito saber ahi aqui alla puse guarde cual"
  ).split(/\s+/));

  function sinMuletillas(entrada) {
    let t = norm(String(entrada || "")).trim();
    let m;
    while ((m = MULETILLAS.exec(t))) t = t.slice(m[0].length);
    return t;
  }
  // ¿Es una pregunta sobre cuentas (y no una orden de crear algo)?
  function esPregunta(entrada) {
    const t = sinMuletillas(entrada);
    if (!t || VERBO.test(t)) return false;
    const habla = /(?:^|[^a-z])(?:cuentas?|correos?)(?![a-z])/.test(t);
    const arranca = /^(?:en|a|con|de|cual|cuales|que|donde|dime|dame|busca|buscame|cuantas|sabes|recuerdas|hay|tengo)(?![a-z])/.test(t)
      || /[?¿]/.test(String(entrada));
    return (habla && arranca) || /^donde\s+(?:tengo|tenia|puse|guarde|esta)(?![a-z])/.test(t);
  }

  const raiz = (w) => (w.length > 5 && w.endsWith("es") ? w.slice(0, -2) : w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w);
  function terminosDe(entrada) {
    const vistos = new Set();
    return sinMuletillas(entrada).split(/[^a-z0-9ñ]+/).filter((w) => w.length >= 3 && !PALABRAS_VACIAS.has(w))
      .map(raiz).filter((w) => !vistos.has(w) && vistos.add(w));
  }
  const textoLibre = (v) => (v == null ? "" : typeof v === "string" ? v : Array.isArray(v) ? v.map(textoLibre).join(" ") : typeof v === "object" ? JSON.stringify(v) : String(v));

  // cuentas: [{ nombre, correo, proyectos: [id] }]   empresas: [{ id, nombre, descripcion, zona, link, links, notas: [{texto}] }]
  // Devuelve { terminos, resultados: [{ posicion, nombre, correo, coincidencias: [texto] }] }
  function buscarCuentas(entrada, cuentas, empresas) {
    const terminos = terminosDe(entrada);
    const res = { terminos, resultados: [] };
    if (!terminos.length) return res;
    const proyectos = new Map((empresas || []).map((e) => [e.id, e]));
    const regs = terminos.map((t) => new RegExp("(?:^|[^a-z0-9])" + esc(t)));
    const fichas = (cuentas || []).map((c, i) => {
      const campos = [
        { donde: "el nombre de la cuenta", t: c.nombre },
        { donde: "la referencia del correo", t: c.correo },
      ];
      (c.proyectos || []).forEach((id) => {
        const e = proyectos.get(id);
        if (!e) return;
        const notas = Array.isArray(e.notas) ? e.notas.map((n) => (n && n.texto) || "").join(" ") : "";
        campos.push({
          donde: "el proyecto vinculado «" + (e.nombre || "sin nombre") + "»",
          t: [e.nombre, e.descripcion, e.zona, e.link, textoLibre(e.links), notas].map(textoLibre).join(" "),
        });
      });
      campos.forEach((k) => { k.n = norm(textoLibre(k.t)); });
      return { c, posicion: i + 1, campos };
    });
    // Un término que aparece en pocas cuentas pesa más (p. ej. «imgbb») que uno que sale en casi todas
    const cuantas = regs.map((re) => fichas.filter((f) => f.campos.some((k) => re.test(k.n))).length);
    fichas.forEach((f) => {
      let puntos = 0;
      const porDonde = new Map();
      regs.forEach((re, i) => {
        if (!cuantas[i]) return;
        let esta = false;
        f.campos.forEach((k) => {
          if (!re.test(k.n)) return;
          esta = true;
          if (!porDonde.has(k.donde)) porDonde.set(k.donde, []);
          porDonde.get(k.donde).push(terminos[i]);
        });
        if (esta) puntos += 1 / cuantas[i];
      });
      if (puntos > 0) {
        res.resultados.push({
          posicion: f.posicion, puntos,
          nombre: f.c.nombre || "Sin nombre", correo: f.c.correo || "",
          coincidencias: [...porDonde].map(([donde, ts]) => "«" + ts.join("», «") + "» en " + donde),
        });
      }
    });
    res.resultados.sort((a, b) => b.puntos - a.puntos || a.posicion - b.posicion);
    res.resultados = res.resultados.slice(0, 5);
    return res;
  }

  // ======================================================================
  //  INTERFAZ (botón 🎤, ventana y tarjeta de confirmación)
  // ======================================================================
  function montarInterfaz() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const el = (tag, clase, texto) => {
      const e = document.createElement(tag);
      if (clase) e.className = clase;
      if (texto != null) e.textContent = texto;
      return e;
    };

    // Botón flotante
    const fab = el("button", "pv-fab", "🎤");
    fab.type = "button";
    fab.title = "Polo AI: crear notas y preguntar por voz";
    fab.setAttribute("aria-label", "Abrir Polo AI por voz");
    document.body.appendChild(fab);

    // Ventana
    const modal = el("div", "pv-modal");
    modal.hidden = true;
    modal.innerHTML = `
      <div class="pv-caja" role="dialog" aria-modal="true" aria-labelledby="pv-titulo">
        <div class="pv-cab">
          <h3 id="pv-titulo" class="pv-titulo">🎤 Polo AI</h3>
          <button type="button" class="pv-cerrar" aria-label="Cerrar">&times;</button>
        </div>
        <div class="pv-sin-sesion" hidden>
          <p>Inicia sesión con tu cuenta de Google para crear notas por voz.</p>
          <button type="button" class="pv-btn pv-ir-login">Iniciar sesión</button>
        </div>
        <div class="pv-contenido">
          <p class="pv-ayuda">Di o escribe una orden. Ejemplo:
            <em>«crea una nota en la zona de deudas a fecha de hoy que diga que le debo 100 pesos a mi mamá»</em><br>También puedes preguntar por tus cuentas:
            <em>«oye voz, ¿en qué cuenta tengo el imgbb de esta app?»</em></p>
          <textarea class="pv-orden" rows="3" aria-label="Orden"
                    placeholder="Habla con el micrófono o escribe aquí tu orden…"></textarea>
          <div class="pv-fila">
            <button type="button" class="pv-btn pv-mic">🎤 Hablar</button>
            <button type="button" class="pv-btn pv-interpretar">Interpretar</button>
            <button type="button" class="pv-btn pv-sec pv-borrar" title="Borrar la orden">🗑</button>
            <span class="pv-estado" aria-live="polite"></span>
          </div>

          <div class="pv-respuesta" hidden>
            <h4 class="pv-tarjeta-titulo">Respuesta</h4>
            <p class="pv-resp-intro"></p>
            <ul class="pv-resp-lista"></ul>
            <div class="pv-fila">
              <button type="button" class="pv-btn pv-sec pv-resp-hablar" title="Escuchar la respuesta">🔊 Escuchar</button>
              <button type="button" class="pv-btn pv-sec pv-resp-cerrar">Cerrar respuesta</button>
            </div>
          </div>

          <div class="pv-tarjeta" hidden>
            <h4 class="pv-tarjeta-titulo">Revisa antes de guardar</h4>
            <ul class="pv-avisos"></ul>
            <label class="pv-campo"><span>Zona</span><select class="pv-zona"></select></label>
            <label class="pv-campo pv-campo-etiqueta"><span>Etiqueta</span><select class="pv-etiqueta"></select></label>
            <label class="pv-campo"><span>Nombre</span><input class="pv-nombre" type="text" maxlength="80" autocomplete="off" /></label>
            <label class="pv-campo pv-campo-fecha"><span>Fecha</span><input class="pv-fecha" type="date" /></label>
            <label class="pv-campo"><span>Texto</span><textarea class="pv-texto" rows="4"></textarea></label>
            <p class="pv-cifras" hidden></p>
            <div class="pv-fila">
              <button type="button" class="pv-btn pv-confirmar">✔ Confirmar y guardar</button>
              <button type="button" class="pv-btn pv-sec pv-cancelar">Cancelar</button>
              <span class="pv-estado pv-estado-tarjeta" aria-live="polite"></span>
            </div>
          </div>

          <div class="pv-listo" hidden>
            <p class="pv-listo-texto"></p>
            <div class="pv-fila">
              <button type="button" class="pv-btn pv-abrir-zona">Abrir zona</button>
              <button type="button" class="pv-btn pv-sec pv-otra">Otra orden</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const q = (s) => modal.querySelector(s);
    const sinSesion = q(".pv-sin-sesion"), contenido = q(".pv-contenido");
    const orden = q(".pv-orden"), btnMic = q(".pv-mic"), btnInterp = q(".pv-interpretar");
    const estado = q(".pv-estado"), tarjeta = q(".pv-tarjeta"), listo = q(".pv-listo");
    const selZona = q(".pv-zona"), selEtiqueta = q(".pv-etiqueta"), campoEtiqueta = q(".pv-campo-etiqueta");
    const inNombre = q(".pv-nombre"), inFecha = q(".pv-fecha"), campoFecha = q(".pv-campo-fecha");
    const inTexto = q(".pv-texto"), avisosUl = q(".pv-avisos"), cifras = q(".pv-cifras");
    const btnConfirmar = q(".pv-confirmar"), estadoTarjeta = q(".pv-estado-tarjeta");

    ZONAS.forEach((z) => { const o = el("option", "", z.titulo); o.value = z.id; selZona.appendChild(o); });
    etiquetasNota().forEach((e) => { const o = el("option", "", e); o.value = e; selEtiqueta.appendChild(o); });

    let actual = null;          // resultado del intérprete que se está revisando
    let textoEditado = false;   // true si cambiaste el texto a mano
    let ultimaZona = null;      // zona donde se guardó (para «Abrir zona»)

    function decir(msg, tipo, destino) {
      const e = destino || estado;
      e.textContent = msg || "";
      e.className = e.className.replace(/\s*(error|ok)\b/g, "") + (tipo ? " " + tipo : "");
    }

    // ----- Zona seleccionada: qué campos se ven y cómo se arma el texto -----
    function textoMostrado() {
      const z = zonaPorId(selZona.value);
      if (!actual) return inTexto.value;
      // Deudas y Bazar no tienen campo de fecha: si la dijiste, va al inicio del texto
      if (z && (z.tipo === "sinFecha" || z.tipo === "bazar") && actual.fechaExplicita && actual.texto) {
        return textoConFecha(actual.texto, new Date(inFecha.value ? inFecha.value + "T12:00:00" : actual.fecha));
      }
      return actual.texto;
    }
    function actualizarCampos() {
      const z = zonaPorId(selZona.value);
      campoEtiqueta.hidden = !(z && z.id === "notas");
      campoFecha.hidden = !z || z.tipo === "sinFecha" || z.tipo === "bazar";
      if (!textoEditado) inTexto.value = textoMostrado();
      revisarCifras();
    }
    function revisarCifras() {
      // Las fechas (dd/mm/aaaa) no cuentan como cifras a revisar
      const sinFechas = inTexto.value.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, " ");
      const nums = sinFechas.match(/\d[\d.,]*\d|\d/g) || [];
      cifras.hidden = !nums.length;
      cifras.textContent = nums.length ? "💬 Revisa bien las cifras: " + nums.join(", ") : "";
    }
    selZona.addEventListener("change", actualizarCampos);
    inTexto.addEventListener("input", () => { textoEditado = true; revisarCifras(); });
    inFecha.addEventListener("change", () => { if (!textoEditado) inTexto.value = textoMostrado(); });

    function mostrarTarjeta(r) {
      actual = r;
      textoEditado = false;
      selZona.value = r.zona;
      if (r.etiqueta) selEtiqueta.value = r.etiqueta;
      inNombre.value = r.nombre;
      inFecha.value = iso(r.fecha);
      avisosUl.innerHTML = "";
      r.avisos.forEach((a) => avisosUl.appendChild(el("li", "", a)));
      avisosUl.hidden = !r.avisos.length;
      actualizarCampos();
      decir("", "", estadoTarjeta);
      listo.hidden = true;
      tarjeta.hidden = false;
      (r.texto ? btnConfirmar : inTexto).focus();
    }
    function ocultarTarjeta() { tarjeta.hidden = true; actual = null; }

    // ----- Respuestas a preguntas sobre cuentas -----
    const respuesta = q(".pv-respuesta"), respIntro = q(".pv-resp-intro"), respLista = q(".pv-resp-lista");
    let respHablada = "";
    function hablar(txt) {
      try {
        if (!txt || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = "es-MX";
        window.speechSynthesis.speak(u);
      } catch (e) { /* sin voz en este navegador */ }
    }
    function callar() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* nada */ } }
    function ocultarRespuesta() { respuesta.hidden = true; respHablada = ""; callar(); }
    function mostrarRespuesta(intro, items, hablado, porVoz) {
      respIntro.textContent = intro;
      respLista.innerHTML = "";
      (items || []).forEach((it) => {
        const li = el("li", "");
        li.appendChild(el("strong", "", it.titulo));
        if (it.detalle) { li.appendChild(document.createElement("br")); li.appendChild(el("span", "pv-resp-detalle", it.detalle)); }
        respLista.appendChild(li);
      });
      respHablada = hablado || intro;
      respuesta.hidden = false;
      if (porVoz) hablar(respHablada);
    }
    q(".pv-resp-hablar").addEventListener("click", () => hablar(respHablada));
    q(".pv-resp-cerrar").addEventListener("click", () => { ocultarRespuesta(); orden.focus(); });

    async function responderPregunta(porVoz) {
      decir("Buscando en tus cuentas…");
      try {
        if (typeof cuCargadas !== "undefined" && !cuCargadas && typeof cargarCuentas === "function") await cargarCuentas();
        if (typeof emCargadas !== "undefined" && !emCargadas && typeof cargarEmpresas === "function") await cargarEmpresas();
      } catch (e) { /* se usa lo que haya cargado */ }
      const lasCuentas = typeof cuentas !== "undefined" && Array.isArray(cuentas) ? cuentas : [];
      const susProyectos = typeof empresas !== "undefined" && Array.isArray(empresas) ? empresas : [];
      decir("");
      if (!lasCuentas.length) {
        mostrarRespuesta("No se encontró información.", [], "No se encontró información.", porVoz);
        return;
      }
      const r = buscarCuentas(orden.value, lasCuentas, susProyectos);
      if (!r.terminos.length) {
        mostrarRespuesta("No entendí qué buscar. Prueba con algo como: «¿en qué cuenta tengo el imgbb de esta app?»", [], "No entendí qué buscar.", porVoz);
        return;
      }
      if (!r.resultados.length) {
        mostrarRespuesta("No se encontró información.", [], "No se encontró información.", porVoz);
        return;
      }
      const items = r.resultados.map((x) => ({
        titulo: "Cuenta " + x.posicion + ": " + x.nombre + (x.correo ? " (" + x.correo + ")" : ""),
        detalle: "Coincide con " + x.coincidencias.join("; ") + ".",
      }));
      const uno = r.resultados.length === 1;
      const intro = uno ? "Encontré esta cuenta:" : "Encontré " + r.resultados.length + " cuentas posibles (la más probable primero):";
      const hablado = (uno ? "Está en la cuenta número " : "La más probable es la cuenta número ") + r.resultados[0].posicion +
        ", llamada " + r.resultados[0].nombre + "." + (uno ? "" : " También encontré " + (r.resultados.length - 1) + " más.");
      mostrarRespuesta(intro, items, hablado, porVoz);
    }

    // ----- Interpretar la orden -----
    function interpretarOrden(porVoz) {
      detenerDictado();
      ocultarRespuesta();
      if (esPregunta(orden.value)) { ocultarTarjeta(); listo.hidden = true; responderPregunta(porVoz === true); return; }
      const r = interpretar(orden.value);
      if (!r.ok) { ocultarTarjeta(); decir(r.error, "error"); return; }
      decir("");
      listo.hidden = true;
      mostrarTarjeta(r);
    }
    btnInterp.addEventListener("click", () => interpretarOrden(false));
    orden.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); interpretarOrden(false); }
    });
    q(".pv-borrar").addEventListener("click", () => { orden.value = ""; ocultarTarjeta(); ocultarRespuesta(); decir(""); orden.focus(); });

    // ----- Confirmar y guardar -----
    btnConfirmar.addEventListener("click", async () => {
      const texto = inTexto.value.trim();
      if (!texto) { decir("Escribe el texto de la nota", "error", estadoTarjeta); return; }
      const z = zonaPorId(selZona.value);
      if (!z) { decir("Elige una zona", "error", estadoTarjeta); return; }
      if (typeof sesionVigente === "function" && !sesionVigente()) {
        decir("Tu sesión venció: inicia sesión de nuevo", "error", estadoTarjeta);
        return;
      }
      const fecha = inFecha.value || iso(new Date());
      btnConfirmar.disabled = true;
      decir("Guardando…", "", estadoTarjeta);
      try {
        await guardarOrden({
          zona: z.id, etiqueta: selEtiqueta.value, nombre: inNombre.value, fecha, texto,
        });
        ultimaZona = z;
        ocultarTarjeta();
        orden.value = "";
        decir("");
        q(".pv-listo-texto").textContent = "Guardado en " + z.titulo + " ✓";
        listo.hidden = false;
      } catch (err) {
        decir("Error: " + err.message, "error", estadoTarjeta);
      } finally {
        btnConfirmar.disabled = false;
      }
    });
    q(".pv-cancelar").addEventListener("click", () => { ocultarTarjeta(); decir(""); orden.focus(); });
    q(".pv-otra").addEventListener("click", () => { listo.hidden = true; orden.focus(); });
    q(".pv-abrir-zona").addEventListener("click", () => {
      const z = ultimaZona;
      cerrar();
      if (z && typeof mostrarSeccion === "function") mostrarSeccion(z.seccion);
      if (z && z.id === "ventas" && typeof bzMostrarTab === "function") bzMostrarTab("Ventas"); // Ventas es una pantalla de Bazar
    });

    // ----- Dictado por voz (Web Speech API del navegador) -----
    let rec = null, escuchando = false, huboError = false;
    function detenerDictado() {
      if (rec && escuchando) { try { rec.stop(); } catch (e) { /* ya estaba detenido */ } }
    }
    function iniciarDictado() {
      if (!SR) {
        decir("Este navegador no permite dictar por voz. Escribe la orden (en Chrome o Edge sí funciona).", "error");
        return;
      }
      if (escuchando) { detenerDictado(); return; }
      ocultarTarjeta();
      ocultarRespuesta();
      listo.hidden = true;
      const base = orden.value.trim() ? orden.value.trim() + " " : "";
      let finales = "";
      huboError = false;
      rec = new SR();
      rec.lang = "es-MX";
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        escuchando = true;
        fab.classList.add("escuchando");
        btnMic.textContent = "⏹ Detener";
        btnMic.classList.add("escuchando");
        decir("Escuchando… habla ahora");
      };
      rec.onresult = (ev) => {
        let provisional = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const t = ev.results[i][0].transcript;
          if (ev.results[i].isFinal) finales += t; else provisional += t;
        }
        orden.value = (base + finales + provisional).trim();
      };
      rec.onerror = (ev) => {
        huboError = true;
        const msgs = {
          "not-allowed": "El navegador no dio permiso al micrófono. Actívalo en los permisos del sitio.",
          "service-not-allowed": "El navegador no permite el dictado en esta página.",
          "no-speech": "No escuché nada. Pulsa 🎤 y habla de nuevo.",
          "audio-capture": "No encontré un micrófono.",
          "network": "El dictado necesita internet.",
        };
        decir(msgs[ev.error] || "No se pudo dictar (" + ev.error + "). Escribe la orden.", "error");
      };
      rec.onend = () => {
        escuchando = false;
        fab.classList.remove("escuchando");
        btnMic.textContent = "🎤 Hablar";
        btnMic.classList.remove("escuchando");
        if (!huboError && orden.value.trim()) interpretarOrden(true);
        else if (!huboError) decir("No escuché nada. Pulsa 🎤 y habla de nuevo.", "error");
      };
      try { rec.start(); } catch (e) { decir("No se pudo iniciar el micrófono.", "error"); }
    }
    btnMic.addEventListener("click", iniciarDictado);

    // ----- Abrir / cerrar -----
    function actualizarSesion() {
      const dentro = typeof sesionVigente === "function" ? sesionVigente() : false;
      sinSesion.hidden = dentro;
      contenido.hidden = !dentro;
    }
    function abrir() {
      actualizarSesion();
      modal.hidden = false;
      if (!SR) decir("Tu navegador no tiene dictado por voz: escribe la orden aquí.");
      if (!contenido.hidden) orden.focus();
    }
    function cerrar() {
      detenerDictado();
      callar();
      modal.hidden = true;
    }
    fab.addEventListener("click", abrir);
    q(".pv-cerrar").addEventListener("click", cerrar);
    q(".pv-ir-login").addEventListener("click", () => {
      cerrar();
      if (typeof abrirLateral === "function") abrirLateral();
    });
    modal.addEventListener("click", (e) => { if (e.target === modal) cerrar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) cerrar(); });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarInterfaz);
    else montarInterfaz();
  }
  // Para probar el intérprete fuera del navegador (node)
  if (typeof module === "object" && module.exports) module.exports = { interpretar, textoConFecha, norm, esPregunta, buscarCuentas };
})();
