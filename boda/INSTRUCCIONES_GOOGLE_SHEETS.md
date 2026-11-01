# Guía Paso a Paso: Conectar la Web de tu Boda con Google Sheets

Esta solución es **100% gratuita**, no requiere servidores ni bases de datos complicadas, y permite que cada vez que un invitado confirme su asistencia, aparezca una nueva fila en tu Google Sheet en tiempo real.

---

### Paso 1: Crear tu Hoja de Cálculo en Google Sheets

1. Entra en [Google Sheets (drive.google.com o sheets.new)](https://sheets.new).
2. Ponle un nombre a tu hoja (por ejemplo: **"Invitados Boda - Respuestas"**).
3. No hace falta que pongas títulos en las columnas; el script los creará automáticamente con un diseño elegante la primera vez que alguien envíe el formulario.

---

### Paso 2: Abrir el editor de Apps Script

1. En el menú superior de Google Sheets, haz clic en **Extensiones** > **Apps Script**.
2. Se abrirá una nueva pestaña con un editor de código.
3. Borra todo el código que aparezca por defecto (como `function myFunction() { ... }`).
4. Abre el archivo [`google-apps-script.js`](file:///C:/Users/Chayo/OneDrive/Escritorio/boda/google-apps-script.js) de este proyecto, copia todo su contenido y pégalo en el editor de Apps Script.
5. Haz clic en el icono del disquete (**Guardar**) o presiona `Ctrl + S`.

---

### Paso 3: Publicar como Aplicación Web (¡Paso Clave!)

1. En la esquina superior derecha del editor, haz clic en el botón azul **Implementar** (o *Deploy*) > **Nueva implementación**.
2. Al lado izquierdo de "Seleccionar tipo", haz clic en el icono de engranaje ⚙️ y elige **Aplicación web**.
3. Rellena los campos tal como se indica:
   - **Descripción**: `Sincronización Web Boda`
   - **Ejecutar como**: `Yo (tu correo electrónico)`
   - **Quién tiene acceso**: ⚠️ **Selecciona obligatoriamente: "Cualquier usuario" (Anyone)**.  
     *(Esto es fundamental para que tus invitados puedan enviar sus datos sin necesidad de iniciar sesión en Google).*
4. Haz clic en el botón **Implementar**.
5. Google te pedirá autorizar los permisos:
   - Haz clic en **Autorizar acceso**.
   - Elige tu cuenta de Google.
   - Si te sale una advertencia ("Google no ha verificado esta aplicación"), pulsa en **Configuración avanzada** (Advanced) abajo a la izquierda, y luego en **Ir a Proyecto (no seguro)**.
   - Pulsa en **Permitir**.
6. Se mostrará una ventana con la **URL de la aplicación web** (termina en `/exec`). Haz clic en **Copiar**.

---

### Paso 4: Pegar la URL en tu página web

1. Abre el archivo [`script.js`](file:///C:/Users/Chayo/OneDrive/Escritorio/boda/script.js) en tu editor.
2. En las primeras líneas verás la sección de configuración:
   ```javascript
   const WEDDING_CONFIG = {
     weddingDate: "2027-09-11T17:30:00",
     googleScriptUrl: "AQUÍ_TU_URL_DE_GOOGLE_APPS_SCRIPT"
   };
   ```
3. Reemplaza `"AQUÍ_TU_URL_DE_GOOGLE_APPS_SCRIPT"` por la URL que acabas de copiar.
4. Guarda el archivo.

---

### Paso 5: ¡Probarlo!

1. Haz doble clic en el archivo [`index.html`](file:///C:/Users/Chayo/OneDrive/Escritorio/boda/index.html) para abrirlo en tu navegador.
2. Ve al formulario de confirmación al final de la página.
3. Rellena una prueba (por ejemplo, tu nombre, asistencia, bus, etc.) y pulsa **"Enviar Confirmación"**.
4. ¡Abre tu Google Sheet! Verás aparecer de inmediato la fila con todos los datos registrados.

---

### ¿Cómo añadir más preguntas en el futuro?

Si más adelante quieres añadir nuevas preguntas (por ejemplo: "¿te quedarás a dormir en el hotel?", "¿necesitas trona para bebé?"):
1. Solo tienes que añadir el nuevo `<input>` o `<select>` en el archivo [`index.html`](file:///C:/Users/Chayo/OneDrive/Escritorio/boda/index.html).
2. Añadirlo en `script.js` dentro del objeto `data`.
3. Añadir el encabezado en el array `headers` y en `newRow` de [`google-apps-script.js`](file:///C:/Users/Chayo/OneDrive/Escritorio/boda/google-apps-script.js).
4. Recuerda que cada vez que edites el código de Google Apps Script, debes hacer clic en **Implementar > Administrar implementaciones > Editar (icono lápiz) > Versión: Nueva versión > Implementar**.
