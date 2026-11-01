/**
 * ====================================================================
 * CÓDIGO PARA GOOGLE APPS SCRIPT - BODA MIGUEL & ROSARIO
 * ====================================================================
 * 
 * INSTRUCCIONES:
 * 1. Abre tu hoja de Google Sheets (ej: "Confirmaciones Boda Miguel y Rosario").
 * 2. En el menú superior: Extensiones > Apps Script.
 * 3. Borra todo y pega este código completo.
 * 4. Haz clic en "Guardar" (icono de disquete).
 * 5. Haz clic en "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 6. Tipo: "Aplicación web".
 * 7. En "Quién tiene acceso": selecciona "Cualquier usuario" (Anyone).
 * 8. Haz clic en "Implementar", autoriza los permisos y copia la URL que termina en /exec.
 * 9. Pega esa URL en tu archivo 'script.js' en la variable 'googleScriptUrl'.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // Evitar colisiones si varios invitados envían a la vez

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Encabezados claros y completos para la hoja de cálculo (Confirmación Individual)
    var headers = [
      "Fecha de Registro",
      "¿Asiste?",
      "Nombre y Apellidos",
      "Teléfono / WhatsApp",
      "¿Alergias o Celiaquía?",
      "Detalle de Alergias / Menú Especial",
      "¿Necesita Servicio de Bus (Madrid-Guadalajara)?",
      "Canción Sugerida",
      "Mensaje para Miguel & Rosario"
    ];

    // Si la hoja está vacía, creamos los encabezados con estilo elegante
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4E6350"); // Color verde bosque oliva elegante (Tono 4)
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var p = e.parameter;

    // Fila ordenada con todos los datos individuales
    var newRow = [
      p.fecha_registro || new Date().toLocaleString("es-ES"),
      p.asistencia || "",
      p.invitado_nombre || p.invitado1_nombre || "",
      p.invitado_telefono || p.invitado1_telefono || "",
      p.tiene_alergias || "",
      p.alergias_detalle || "",
      p.servicio_bus || "",
      p.cancion || "",
      p.mensaje || ""
    ];

    sheet.appendRow(newRow);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Respuesta guardada con éxito" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servicio de confirmaciones para la boda de Miguel y Rosario activo.");
}
