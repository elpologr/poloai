# Mi organizador

Página web sencilla para organizar mi día a día.

## Secciones

- **Calendario**: calendario navegable del año 1930 al 2100. Al hacer clic en un día se abre un panel con tres secciones, una debajo de otra y en este orden: **Descripción**, **Actividades** y **Anotaciones**. El panel tiene fondo negro. Cada sección tiene un botón con flecha que despliega su zona de texto; debajo se muestran siempre los **primeros 4 recuadros** (cuadrados, uno a la derecha del otro) y, si hay más de 4, aparece un botón **Desplegar** que muestra el resto. Cada texto que guardas es un recuadro (tantos como quieras) y en la hoja de Google Sheets todos los de una sección quedan en la misma celda, separados entre paréntesis: `(primero) (segundo)`. Si un texto trae paréntesis sueltos, se guardan como corchetes para no romper el formato. El contenido antiguo sin paréntesis se muestra como un solo recuadro. El botón ↻ vuelve a leer los datos de la hoja por si la editaste a mano.
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

`index.html`, `styles.css` y `app.js` deben ser de la **misma versión** (la actual es la 5). Si mezclas archivos viejos con nuevos, el calendario puede quedarse en enero de 1930, los días no abren el panel o el fondo no cambia a morado. En ese caso la página muestra un aviso amarillo arriba que indica qué archivo está desactualizado. Solución: sube de nuevo **todos** los archivos del proyecto a GitHub (reemplazando los anteriores) y recarga con Ctrl+F5 (en Mac: Cmd+Shift+R).

Al pulsar **Calendario** siempre se muestra el mes y el año actuales.

## Seguridad

- Mantén el repositorio **privado**: `config.js` contiene la URL y la clave de acceso a tu hoja.
- Quien tenga la URL y la clave puede leer y escribir en la hoja, así que no las compartas.

## Archivos

- `index.html`: estructura de la página
- `styles.css`: estilos
- `app.js`: menú, calendario, submenú de días y conexión con Google Sheets
- `config.js`: URL y clave de la conexión
- `google-apps-script.gs`: código que se pega en Apps Script
