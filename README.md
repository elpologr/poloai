# Polo AI

Página web sencilla para organizar mi día a día.

## Secciones

- **Calendario**: calendario navegable del año 1930 al 2100. Al hacer clic en un día se abre un panel con tres secciones, una debajo de otra y en este orden: **Descripción**, **Actividades** y **Anotaciones**. El panel tiene fondo negro. Cada sección tiene un botón con flecha que despliega su zona de texto; debajo se muestran siempre los **primeros 4 recuadros** (cuadrados, uno a la derecha del otro) y, si hay más de 4, aparece un botón **Desplegar** que muestra el resto. Cada texto que guardas es un recuadro (tantos como quieras) y en la hoja de Google Sheets todos los de una sección quedan en la misma celda, separados entre paréntesis: `(primero) (segundo)`. Si un texto trae paréntesis sueltos, se guardan como corchetes para no romper el formato. El contenido antiguo sin paréntesis se muestra como un solo recuadro. El botón ↻ vuelve a leer los datos de la hoja por si la editaste a mano.
- **Menú lateral**: el botón de tres rayas (esquina superior izquierda) abre una barra lateral con el inicio de sesión con Google. Una vez dentro muestra tu foto, nombre y correo, y un botón **Cerrar sesión**. Se cierra con la ×, tocando fuera de la barra o con la tecla Esc.
- **Actividades**: próximamente.
- **Pendientes**: próximamente.
- **Trabajo**: próximamente.

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

`index.html`, `styles.css` y `app.js` deben ser de la **misma versión** (la actual es la 7). Si mezclas archivos viejos con nuevos, el calendario puede quedarse en enero de 1930, los días no abren el panel o el fondo no cambia a morado. En ese caso la página muestra un aviso amarillo arriba que indica qué archivo está desactualizado. Solución: sube de nuevo **todos** los archivos del proyecto a GitHub (reemplazando los anteriores) y recarga con Ctrl+F5 (en Mac: Cmd+Shift+R).

Al abrir o recargar la página (F5) el **Calendario** aparece de primeras, en el mes y el año actuales. Al pulsar **Calendario** siempre se muestra el mes y el año actuales.

## Iniciar sesión con Google (una sola vez)

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o elige) un proyecto.
2. Ve a **APIs y servicios → Pantalla de consentimiento de OAuth** y configúrala (tipo **Externo**, nombre de la app **Polo AI**, tu correo). Si la dejas en "Prueba", agrega tu correo en **Usuarios de prueba**.
3. Ve a **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth** y elige **Aplicación web**.
4. En **Orígenes autorizados de JavaScript** agrega la dirección donde publicas la página, solo el dominio y sin ruta (por ejemplo `https://elpologr.github.io`). Para probar en tu computadora agrega también `http://localhost:8000` (y ábrela con un servidor local; con `file://` Google no funciona).
5. Copia el **ID de cliente** (termina en `.apps.googleusercontent.com`) y pégalo en `config.js`, en `GOOGLE_CLIENT_ID`.

Nota: por ahora el inicio de sesión solo identifica quién entró (nombre, correo y foto). No protege la hoja de Google Sheets: eso sigue dependiendo de la URL y la clave de `config.js`.

## Firebase

El proyecto de Firebase (`velas-kukumita`) ya está conectado. Su configuración está en `config.js` (`FIREBASE`) y `firebase.js` la carga desde el CDN de Google (versión 12.14.0) y activa **Analytics**. Los datos del SDK de Firebase no son secretos; lo que protege tu proyecto son las reglas (Firestore, Storage...) y los dominios autorizados.

- Para que funcione Analytics y, más adelante, Authentication, agrega tu dominio (por ejemplo `elpologr.github.io`) en la consola de Firebase: **Authentication → Configuración → Dominios autorizados**.
- Analytics no funciona abriendo `index.html` con `file://`; sí en tu página publicada o en `localhost`.
- Para usar otro producto (Firestore, Auth, Storage...) agrega su `import` en `firebase.js` con la misma versión. Desde otros scripts el resultado está en `window.poloFirebase` (`.app` y `.analytics`).

## Seguridad

- Mantén el repositorio **privado**: `config.js` contiene la URL y la clave de acceso a tu hoja.
- Quien tenga la URL y la clave puede leer y escribir en la hoja, así que no las compartas.

## Archivos

- `index.html`: estructura de la página
- `styles.css`: estilos
- `app.js`: menú, calendario, submenú de días y conexión con Google Sheets
- `config.js`: URL y clave de la conexión, ID de Google y configuración de Firebase
- `firebase.js`: inicia Firebase y Analytics
- `google-apps-script.gs`: código que se pega en Apps Script
