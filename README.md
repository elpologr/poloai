# Mi organizador

Página web sencilla para organizar mi día a día.

## Secciones

- **Calendario**: calendario navegable del año 1930 al 2100. Al hacer clic en un día se abre un submenú con los botones **Actividades**, **Descripción** y **Anotaciones**; lo que escribas se guarda en Google Sheets.
- **Actividades**: próximamente.
- **Pendientes**: próximamente.
- **Trabajo**: próximamente.

## Cómo usarlo

Abre `index.html` en tu navegador (necesita conexión a internet para hablar con Google Sheets).

## Conectar Google Sheets (una sola vez)

La hoja debe tener en la fila 1: `Fecha | Actividades | Descripcion | Anotaciones`. Cada día ocupa una fila (la fecha se guarda como `AAAA-MM-DD`).

1. Abre tu hoja de Google y ve a **Extensiones → Apps Script**.
2. Borra lo que haya y pega el contenido de `google-apps-script.gs`.
3. Cambia `CAMBIA-ESTE-TEXTO` por una clave larga inventada por ti (ejemplo: `mi-clave-9f3k2x7q-2026`).
4. Pulsa **Implementar → Nueva implementación**, elige el tipo **Aplicación web** y configura:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Autoriza los permisos que pida Google y copia la **URL de la aplicación web** (termina en `/exec`).
6. En `config.js` pega esa URL en `APPS_SCRIPT_URL` y la misma clave del paso 3 en `TOKEN`.

Si más adelante cambias el código de Apps Script, usa **Implementar → Administrar implementaciones → Editar → Nueva versión** para que los cambios se apliquen.

## Seguridad

- Mantén el repositorio **privado**: `config.js` contiene la URL y la clave de acceso a tu hoja.
- Quien tenga la URL y la clave puede leer y escribir en la hoja, así que no las compartas.

## Archivos

- `index.html`: estructura de la página
- `styles.css`: estilos
- `app.js`: menú, calendario, submenú de días y conexión con Google Sheets
- `config.js`: URL y clave de la conexión
- `google-apps-script.gs`: código que se pega en Apps Script
