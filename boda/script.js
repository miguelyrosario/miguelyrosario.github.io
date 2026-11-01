/**
 * ====================================================================
 * CONFIGURACIÓN DE LA BODA - MIGUEL & ROSARIO
 * ====================================================================
 */
const WEDDING_CONFIG = {
  // Fecha y hora del enlace: 11 de Septiembre de 2027 a las 17:30
  weddingDate: "2027-09-11T17:30:00",

  // URL del Web App de Google Apps Script (sigue las instrucciones en INSTRUCCIONES_GOOGLE_SHEETS.md)
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbwrFht5ZDslpaO3OU2CTMkGF96xxGywiVZVZozreFhfE5tKTVjzdgITjIIV-EnCnKISQQ/exec"
};

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initMobileNav();
  initFormInteractivity();
  initFormSubmit();
  initIbanCopy();
});

/**
 * 1. CONTADOR REGRESIVO (O CONTEO DE DÍAS TRAS LA BODA)
 */
function initCountdown() {
  const targetDate = new Date(WEDDING_CONFIG.weddingDate).getTime();
  const countdownTitle = document.getElementById("countdownTitle");
  const countdownContainer = document.getElementById("countdown");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const pad = (n) => (n < 10 ? "0" + n : n);

    if (distance < 0) {
      // Si la fecha ya ha pasado: solo indica días y debajo "desde el gran día"
      const elapsed = Math.abs(distance);
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));

      if (countdownTitle) {
        countdownTitle.style.display = "none";
      }

      if (countdownContainer) {
        countdownContainer.innerHTML = `
          <div class="post-wedding-countdown">
            <span class="post-wedding-days">${days} ${days === 1 ? "día" : "días"}</span>
            <span class="post-wedding-sub">desde el gran día</span>
          </div>
        `;
      }
      return;
    }

    // Aún falta para el enlace
    if (countdownTitle) {
      countdownTitle.style.display = "block";
      countdownTitle.textContent = "Cuenta atrás para nuestro gran día:";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/**
 * 2. MENÚ MÓVIL
 */
function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });
  }
}

/**
 * 3. INTERACTIVIDAD CONDICIONAL DEL FORMULARIO (CONFIRMACIÓN INDIVIDUAL)
 */
function initFormInteractivity() {
  // A. Toggle Asistencia (Sí vs No)
  const radioAsistencia = document.querySelectorAll('input[name="asistencia"]');
  const bloqueAsiste = document.getElementById("bloqueAsiste");
  const bloqueNoAsiste = document.getElementById("bloqueNoAsiste");

  const invNombre = document.getElementById("invitado_nombre") || document.getElementById("invitado1_nombre");
  const invTel = document.getElementById("invitado_telefono") || document.getElementById("invitado1_telefono");
  const noAsisteNombre = document.getElementById("noasiste_nombre");
  const noAsisteTel = document.getElementById("noasiste_telefono");

  radioAsistencia.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "No podré asistir") {
        bloqueAsiste.classList.add("hidden");
        bloqueNoAsiste.classList.remove("hidden");

        if (invNombre) invNombre.required = false;
        if (invTel) invTel.required = false;
        if (noAsisteNombre) noAsisteNombre.required = true;
        if (noAsisteTel) noAsisteTel.required = true;
      } else {
        bloqueAsiste.classList.remove("hidden");
        bloqueNoAsiste.classList.add("hidden");

        if (invNombre) invNombre.required = true;
        if (invTel) invTel.required = true;
        if (noAsisteNombre) noAsisteNombre.required = false;
        if (noAsisteTel) noAsisteTel.required = false;
      }
    });
  });

  // B. Toggle Alergias / Celiaquía (No vs Sí)
  const radioAlergias = document.querySelectorAll('input[name="tiene_alergias"]');
  const campoAlergiasDetalle = document.getElementById("campoAlergiasDetalle");
  const textareaAlergias = document.getElementById("alergias_detalle");

  radioAlergias.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "Sí") {
        campoAlergiasDetalle.classList.remove("hidden");
        if (textareaAlergias) textareaAlergias.required = true;
      } else {
        campoAlergiasDetalle.classList.add("hidden");
        if (textareaAlergias) textareaAlergias.required = false;
      }
    });
  });
}

/**
 * 4. ENVÍO Y SINCRONIZACIÓN CON GOOGLE SHEETS
 */
function initFormSubmit() {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const formFeedback = document.getElementById("formFeedback");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Verificamos si ya han configurado la URL de Google Sheets
    if (
      !WEDDING_CONFIG.googleScriptUrl ||
      WEDDING_CONFIG.googleScriptUrl.includes("AQUÍ_TU_URL")
    ) {
      showFeedback(
        "Aún no has configurado la URL de Google Sheets en script.js. Abre el archivo INSTRUCCIONES_GOOGLE_SHEETS.md para configurarla en 2 minutos.",
        "error"
      );
      return;
    }

    // Estado cargando
    setLoading(true);
    formFeedback.classList.add("hidden");

    // Recopilar datos según asistencia
    const formData = new FormData(form);
    const asistencia = formData.get("asistencia") || "Sí, asistiré";

    let data = {};

    if (asistencia === "No podré asistir") {
      const nombreNoAsiste = formData.get("noasiste_nombre") || "";
      const telNoAsiste = formData.get("noasiste_telefono") || "";

      data = {
        fecha_registro: new Date().toLocaleString("es-ES"),
        asistencia: "No podré asistir",
        invitado_nombre: nombreNoAsiste,
        invitado_telefono: telNoAsiste,
        invitado1_nombre: nombreNoAsiste,
        invitado1_telefono: telNoAsiste,
        modalidad: "-",
        invitado2_nombre: "-",
        invitado2_telefono: "-",
        tiene_alergias: "No aplica",
        alergias_detalle: "-",
        servicio_bus: "No aplica",
        cancion: "-",
        mensaje: formData.get("noasiste_mensaje") || "No podrá asistir a la boda."
      };
    } else {
      // Sí asiste (confirmación individual)
      const tieneAlergias = formData.get("tiene_alergias") || "No";
      const alergiasDetalle = tieneAlergias === "Sí" ? (formData.get("alergias_detalle") || "") : "Ninguna";
      const servicioBus = formData.get("servicio_bus") || "No";
      const nombreAsiste = formData.get("invitado_nombre") || formData.get("invitado1_nombre") || "";
      const telAsiste = formData.get("invitado_telefono") || formData.get("invitado1_telefono") || "";

      data = {
        fecha_registro: new Date().toLocaleString("es-ES"),
        asistencia: "Sí, asistiré",
        invitado_nombre: nombreAsiste,
        invitado_telefono: telAsiste,
        invitado1_nombre: nombreAsiste,
        invitado1_telefono: telAsiste,
        modalidad: "Individual",
        invitado2_nombre: "-",
        invitado2_telefono: "-",
        tiene_alergias: tieneAlergias,
        alergias_detalle: alergiasDetalle,
        servicio_bus: servicioBus,
        cancion: formData.get("cancion") || "-",
        mensaje: formData.get("mensaje") || "-"
      };
    }

    try {
      // Convertir datos a parámetros URL
      const params = new URLSearchParams();
      for (const key in data) {
        params.append(key, data[key]);
      }

      // Envío en modo no-cors a Google Apps Script
      await fetch(WEDDING_CONFIG.googleScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      // Éxito
      setLoading(false);
      const nombreAgradecimiento = data.invitado_nombre || data.invitado1_nombre || "gracias";
      showFeedback(
        `¡Muchas gracias, ${nombreAgradecimiento}! Tu respuesta ha quedado registrada correctamente en la lista de invitados de Miguel y Rosario.`,
        "success"
      );
      form.reset();

      // Restaurar estado visual por defecto
      const elAsiste = document.getElementById("bloqueAsiste");
      const elNoAsiste = document.getElementById("bloqueNoAsiste");
      const elAlergias = document.getElementById("campoAlergiasDetalle");

      if (elAsiste) elAsiste.classList.remove("hidden");
      if (elNoAsiste) elNoAsiste.classList.add("hidden");
      if (elAlergias) elAlergias.classList.add("hidden");

    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setLoading(false);
      showFeedback(
        "Hubo un problema de conexión al enviar tu respuesta. Por favor, inténtalo de nuevo o avísanos directamente.",
        "error"
      );
    }
  });

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnText.classList.add("hidden");
      btnSpinner.classList.remove("hidden");
    } else {
      btnText.classList.remove("hidden");
      btnSpinner.classList.add("hidden");
    }
  }

  function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.classList.remove("hidden");
  }
}

/**
 * 5. COPIAR IBAN AL PORTAPAPELES
 */
function initIbanCopy() {
  const btnCopy = document.getElementById("btnCopyIban");
  const ibanCode = document.getElementById("ibanCode");
  const copyText = document.getElementById("copyText");
  const copyIcon = document.getElementById("copyIcon");

  if (!btnCopy || !ibanCode) return;

  btnCopy.addEventListener("click", async () => {
    const ibanString = ibanCode.textContent.trim();

    try {
      await navigator.clipboard.writeText(ibanString);
      
      btnCopy.classList.add("copied");
      copyText.textContent = "¡IBAN Copiado! ✓";
      if (copyIcon) copyIcon.className = "fas fa-check";

      setTimeout(() => {
        btnCopy.classList.remove("copied");
        copyText.textContent = "Copiar IBAN";
        if (copyIcon) copyIcon.className = "far fa-copy";
      }, 2500);

    } catch (err) {
      // Fallback para navegadores antiguos
      const tempInput = document.createElement("input");
      tempInput.value = ibanString;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      btnCopy.classList.add("copied");
      copyText.textContent = "¡IBAN Copiado! ✓";
      if (copyIcon) copyIcon.className = "fas fa-check";

      setTimeout(() => {
        btnCopy.classList.remove("copied");
        copyText.textContent = "Copiar IBAN";
        if (copyIcon) copyIcon.className = "far fa-copy";
      }, 2500);
    }
  });
}
