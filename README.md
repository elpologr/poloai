# Polo AI

Página web sencilla para organizar mi día a día.

## Secciones

- **Calendario**: calendario navegable del año 1930 al 2100. Al hacer clic en un día se abre un panel con tres secciones, una debajo de otra y en este orden: **Descripción**, **Actividades** y **Anotaciones**. El panel tiene fondo negro. Cada sección tiene un botón con flecha que despliega su zona de texto; debajo se muestran siempre los **primeros 4 recuadros** (cuadrados, uno a la derecha del otro) y, si hay más de 4, aparece un botón **Desplegar** que muestra el resto. Cada texto que guardas es un recuadro (tantos como quieras) y empieza con la **fecha y hora** en que lo guardaste (por ejemplo `14/10/2026 21:35`, tomada del reloj de tu dispositivo), en su propia línea antes del texto y en la hoja de Google Sheets todos los de una sección quedan en la misma celda, separados entre paréntesis: `(primero) (segundo)`. Si un texto trae paréntesis sueltos, se guardan como corchetes para no romper el formato. El contenido antiguo sin paréntesis se muestra como un solo recuadro. El botón ↻ vuelve a leer los datos de la hoja por si la editaste a mano.
- **Menú lateral**: el botón de tres rayas (esquina superior izquierda) abre una barra lateral con el inicio de sesión con Google. Una vez dentro muestra tu foto, nombre y correo, y un botón **Cerrar sesión**. Se cierra con la ×, tocando fuera de la barra o con la tecla Esc.
- **Notas**: en la barra lateral, debajo del inicio de sesión, el botón **Notas** abre un panel grande azul pastel con todas tus notas; arriba está el botón **+ Nueva nota**, que abre las opciones para crear una. Al crear una nota le pones un **nombre**, la **fecha y hora** (por defecto la actual, pero puedes cambiarla), eliges una **etiqueta** (General, Tarea/Actividad, Conjunto de Datos, Sueños, Pendiente Importante, Pedidos de Yeso, Actividades, Pendientes o Trabajo) y un **color**: una fila de colores pastel, un botón **Más colores** con una paleta de muchos más (rojos, naranjas, amarillos, verdes, turquesas, azules, morados, rosas, cafés y grises, de claros a oscuros) y un selector para elegir cualquier otro color del espectro. El color se ve de fondo mientras la escribes y también en su tarjeta (si es oscuro, el texto pasa a blanco). Las notas se dividen en **filas por etiqueta**: cada fila tiene un título con el nombre de la etiqueta y muestra sus 4 notas más recientes (se ordenan por su fecha). Si hay más de 4, al final de la fila, a la derecha, aparece el botón **Ver todas**, que abre un submenú con todas las notas de esa etiqueta (se cierra con **‹ Volver** o con Esc). Al **tocar una nota en cualquier zona** se abre una ventana para editar todo: nombre, etiqueta, color, fecha y hora, **identificador** y texto (también desde el submenú «Ver todas»; se cierra con **Cancelar** o Esc). La fecha de cada tarjeta también se puede corregir con el ✎ y las notas se eliminan con la ×. El **identificador** es un número o una palabra opcional: dentro de cada fila de etiqueta las notas se ordenan primero por identificador numérico (1, 2, 3…), luego por palabras de la A a la Z y al final las que no tienen identificador (estas, de la más reciente a la más antigua); a igual identificador, gana la más reciente. Se ve en la tarjeta como `#1`, y si lo cambias a mano en la hoja, el botón ↻ lo vuelve a leer. El botón ↻ vuelve a leer la hoja. Las notas **no** van en la hoja del calendario: van en la hoja llamada **`Notas`** del mismo libro de Google Sheets (si no existe, el Apps Script la crea), con las columnas `Nombre | Fecha | Etiqueta | Nota | Color | Id | Identificador` (en `Color` se guarda el nombre del pastel elegido o, para los demás colores, su código `#rrggbb`). El Apps Script agrega solo los encabezados que falten (`Id` en la F e `Identificador` en la G); la columna F la usa la página para poder borrar y editar cada nota, así que no la borres. Si escribes una fila a mano en esa hoja, aparecerá en la página y se le asignará su `Id`. Para ver, guardar o borrar notas hay que haber iniciado sesión con la cuenta autorizada.
- **Proyectos**: en la barra lateral, debajo de **Notas**, el botón **Proyectos** abre un panel grande con una cuadrícula de recuadros cuadrados 1:1, como en Instagram. El primer recuadro (**+ Nuevo proyecto**) sirve para agregar uno; los demás muestran la imagen de cada proyecto con su nombre (de más reciente a más antiguo según su fecha). Al tocar un recuadro se abre una ventana para editar el **nombre**, la **fecha y hora**, la **descripción**, la **imagen** (elegir, cambiar o quitar) y los **links** (uno por línea; se pueden abrir desde la ventana). También se puede eliminar el proyecto. Las imágenes se reducen a 1600 px en tu dispositivo y el Apps Script las sube a **imgbb**; en la hoja solo se guarda su dirección. Los proyectos viven en la hoja **`Proyectos`** del mismo libro de Google Sheets (si no existe, el Apps Script la crea), con las columnas `Nombre | Fecha | Descripcion | Imagen | Links | Id`. El Apps Script agrega solo el encabezado `Id` en la columna F; la página la usa para poder editar y borrar cada proyecto, así que no la borres. Si escribes una fila a mano en esa hoja, aparecerá en la página y se le asignará su `Id`. Ver, guardar o borrar proyectos exige iniciar sesión con la cuenta autorizada.
- **Pedidos de Yeso** (acceso directo): en la barra lateral, debajo de **Proyectos**, abre el panel de Notas directamente en el submenú de la etiqueta **Pedidos de Yeso**, con todas sus notas. Si todavía no hay ninguna, lo avisa. Con **‹ Volver** se llega a la lista completa de notas.
- **Galería**: debajo del acceso directo, el botón **Galería** abre un panel grande con recuadros cuadrados 1:1. El primero (**+ Nueva imagen**) agrega una imagen; los demás muestran cada imagen con su etiqueta (y su descripción, si tiene), las más recientes primero. Arriba hay filtros por etiqueta con su cantidad: **Todas**, **General**, **Programacion**, **Contenido Digital** y **Perfiles**. Al tocar un recuadro se abre una ventana para cambiar la imagen, la **etiqueta** y la **descripción** (opcional), o eliminarla. Las imágenes se reducen a 1600 px en tu dispositivo y el Apps Script las sube a **imgbb** (la misma clave `IMGBB_API_KEY` que Proyectos). Viven en la hoja **`Galeria`** del mismo libro (si no existe, el Apps Script la crea; el nombre puede estar en minúsculas o con acento), con las columnas `Imagen | Descripcion | Etiqueta | Id`: en `Imagen` va el link de imgbb, `Descripcion` es opcional y `Etiqueta` debe ser una de las cuatro. El Apps Script agrega solo el encabezado `Id` en la columna D; la página lo usa para poder editar y borrar, así que no lo borres. Si escribes una fila a mano, aparecerá en la página y se le asignará su `Id`. Ver, guardar o borrar exige iniciar sesión con la cuenta autorizada.
- **Actividades**, **Pendientes** y **Trabajo** (botones del menú superior): cada uno abre su propia zona azul pastel con un botón de crear (**+ Crear actividad**, **+ Crear pendiente** y **+ Crear trabajo**). El botón abre el mismo formulario de las notas (nombre, color, fecha y hora, identificador y texto), pero la **etiqueta ya viene fija** (`Actividades`, `Pendientes` o `Trabajo`) y no se puede cambiar ahí. Se guardan en la misma hoja **`Notas`**, con las mismas columnas, así que también aparecen en el panel de **Notas** dentro de su fila de etiqueta, y lo que crees, edites o borres en un lado se ve en el otro. Debajo del botón se muestran todas las tarjetas de esa etiqueta, en el mismo orden que en Notas (por identificador y, a igual identificador, la más reciente primero); al tocar una se edita en esa misma zona y la × la elimina. El botón ↻ vuelve a leer la hoja. Como las notas, exigen iniciar sesión con la cuenta autorizada.

## Cómo usarlo

Abre `index.html` en tu navegador (necesita conexión a internet para hablar con Google Sheets).

## Conectar Google Sheets (una sola vez)

La hoja debe tener en la fila 1: `Fecha | Actividades | Descripcion | Anotaciones`. Cada día ocupa una fila (la fecha se guarda como `AAAA-MM-DD`). Las filas se mantienen ordenadas por fecha: si anotas un día anterior, se inserta en su lugar y las demás filas bajan.

1. Abre tu hoja de Google y ve a **Extensiones → Apps Script**.
2. Borra lo que haya y pega el contenido de `google-apps-script.gs`.
3. Cambia `CAMBIA-ESTE-TEXTO` por una clave larga inventada por ti (ejemplo: `mi-clave-9f3k2x7q-2026`).
4. Pulsa **Implementar → Nueva implementación**, elige el tipo **Aplicación web** y configura:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Autoriza los permisos que pida Google y copia la **URL de la aplicación web** (termina en `/exec`).
6. En `config.js` pega esa URL en `APPS_SCRIPT_URL` y la misma clave del paso 3 en `TOKEN`.

Si más adelante cambias el código de Apps Script, usa **Implementar → Administrar implementaciones → Editar → Nueva versión** para que los cambios se apliquen.

## Si algo no se ve o no funciona

`index.html`, `styles.css` y `app.js` deben ser de la **misma versión** (la actual es la 17). Si mezclas archivos viejos con nuevos, el calendario puede quedarse en enero de 1930, los días no abren el panel o el fondo no cambia a morado. En ese caso la página muestra un aviso amarillo arriba que indica qué archivo está desactualizado. Solución: sube de nuevo **todos** los archivos del proyecto a GitHub (reemplazando los anteriores) y recarga con Ctrl+F5 (en Mac: Cmd+Shift+R).

Al abrir o recargar la página (F5) el **Calendario** aparece de primeras, en el mes y el año actuales. Al pulsar **Calendario** siempre se muestra el mes y el año actuales.

## Iniciar sesión con Google (una sola vez)

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o elige) un proyecto.
2. Ve a **APIs y servicios → Pantalla de consentimiento de OAuth** y configúrala (tipo **Externo**, nombre de la app **Polo AI**, tu correo). Si la dejas en "Prueba", agrega tu correo en **Usuarios de prueba**.
3. Ve a **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth** y elige **Aplicación web**.
4. En **Orígenes autorizados de JavaScript** agrega la dirección donde publicas la página, solo el dominio y sin ruta (por ejemplo `https://elpologr.github.io`). Para probar en tu computadora agrega también `http://localhost:8000` (y ábrela con un servidor local; con `file://` Google no funciona).
5. Copia el **ID de cliente** (termina en `.apps.googleusercontent.com`) y pégalo en `config.js`, en `GOOGLE_CLIENT_ID`.

## Quién puede modificar la hoja

Solo la cuenta de Google escrita en `CORREO_AUTORIZADO` (dentro de `google-apps-script.gs`) puede guardar o borrar recuadros. La página manda al Apps Script el token del inicio de sesión de Google y el Apps Script lo verifica con Google en cada guardado: debe ser auténtico, vigente, de tu página (`CLIENT_ID`) y de ese correo. Si no, responde con un error y no toca la hoja.

- Para guardar hay que **iniciar sesión** en la barra lateral con esa cuenta. Si no lo has hecho, la página abre la barra y avisa.
- El token de Google dura cerca de 1 hora; al vencer, la página intenta volver a entrar sola y, si no puede, vuelve a mostrar el botón de Google.
- Para cambiar la cuenta autorizada, edita `CORREO_AUTORIZADO` en `google-apps-script.gs` y publica una **nueva versión** de la implementación.
- `CLIENT_ID` en `google-apps-script.gs` debe ser igual a `GOOGLE_CLIENT_ID` de `config.js`.
- **Importante:** la restricción del calendario es para *modificar*. Leer los datos del calendario sigue necesitando solo la URL y la clave (`TOKEN`) de `config.js`, que quedan visibles para quien abra tu página. Las **notas** sí son privadas: tanto leerlas como guardarlas o borrarlas exige iniciar sesión con la cuenta autorizada.

### Imágenes de Proyectos (imgbb)

1. Entra a [api.imgbb.com](https://api.imgbb.com/), inicia sesión y copia tu **API key**.
2. En `google-apps-script.gs`, pégala en `IMGBB_API_KEY` (entre las comillas). La clave queda solo en el Apps Script; la página no la ve.
3. Sigue los pasos de "Después de cambiar el Apps Script" (nueva versión de la implementación).

Las imágenes de imgbb son públicas para quien tenga su dirección. Al eliminar un proyecto o una imagen de la galería, la imagen no se borra de imgbb. Al pegar una versión nueva de `google-apps-script.gs`, vuelve a poner tu clave en `IMGBB_API_KEY`.

### Después de cambiar el Apps Script

1. Pega el nuevo `google-apps-script.gs` en el editor de Apps Script y guarda.
2. Si es la primera vez que usas esta versión: elige la función `autorizarPermisos` en el menú de funciones, pulsa **Ejecutar** y acepta los permisos (el script se conecta a Google para verificar el inicio de sesión). Si ya lo hiciste antes, este paso se puede omitir; si Google pide permisos nuevos (por la hoja de notas), acéptalos.
3. Ve a **Implementar → Administrar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar**. La URL `/exec` se mantiene igual.

## Firebase

El proyecto de Firebase (`velas-kukumita`) ya está conectado. Su configuración está en `config.js` (`FIREBASE`) y `firebase.js` la carga desde el CDN de Google (versión 12.14.0) y activa **Analytics**. Los datos del SDK de Firebase no son secretos; lo que protege tu proyecto son las reglas (Firestore, Storage...) y los dominios autorizados.

- Para que funcione Analytics y, más adelante, Authentication, agrega tu dominio (por ejemplo `elpologr.github.io`) en la consola de Firebase: **Authentication → Configuración → Dominios autorizados**.
- Analytics no funciona abriendo `index.html` con `file://`; sí en tu página publicada o en `localhost`.
- Para usar otro producto (Firestore, Auth, Storage...) agrega su `import` en `firebase.js` con la misma versión. Desde otros scripts el resultado está en `window.poloFirebase` (`.app` y `.analytics`).

## Seguridad

- Quien tenga la URL y la clave de `config.js` puede **leer** la hoja, así que no las compartas más de lo necesario.
- **Modificar** la hoja solo lo puede hacer la cuenta autorizada (ver "Quién puede modificar la hoja").

## Archivos

- `index.html`: estructura de la página
- `styles.css`: estilos
- `app.js`: menú, calendario, submenú de días, zonas de Actividades/Pendientes/Trabajo y conexión con Google Sheets
- `config.js`: URL y clave de la conexión, ID de Google y configuración de Firebase
- `firebase.js`: inicia Firebase y Analytics
- `google-apps-script.gs`: código que se pega en Apps Script
