(function () {
  window.addEventListener("DOMContentLoaded", function () {
    let userId = "anonimo";
    let API_URL = "https://talkinghead-production.up.railway.app"; // Valor por defecto

    try {
      let script = document.currentScript;

      if (!script) {
        const scripts = Array.from(document.getElementsByTagName('script'));
        script = scripts.find(s => s.src && s.src.includes("widget.js") && s.src.includes("userId"));
      }

      if (script) {
        const scriptSrc = new URL(script.src);
        userId = scriptSrc.searchParams.get("userId") || "anonimo";
        API_URL = scriptSrc.origin;
      } else {
        console.warn("❗ No se encontró el script, intentando fallback desde location.search...");
        const urlParams = new URLSearchParams(window.location.search);
        userId = urlParams.get("userId") || "anonimo";
      }
    } catch (err) {
      console.error("❌ Error obteniendo userId:", err);
    }




    // Crear el botón flotante
    const btn = document.createElement("div");
    btn.id = "aulaViva-btn";
    btn.style = `
      position: fixed;
      bottom: 10px;
      right: 65px;
      background: #0078d7;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 16;
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s ease;
    `;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.4 4.5 3.53 5.88L6 21l4.12-2.24c.6.1 1.22.16 1.88.16 4.97 0 9-3.58 9-8s-4.03-8-9-8z"/></svg>`;
    document.body.appendChild(btn);

    // Crear el iframe oculto
    const iframe = document.createElement("iframe");
    iframe.id = "aulaViva-frame";
    iframe.src = API_URL;
    iframe.allow = "microphone"; // ✅ Permitir micrófono en iframe
    iframe.style = `
      position: fixed;
      bottom: 68px;
      right: 10px;
      width: 360px;
      height: 580px;
      max-width: 90vw;
      border: none;
      border-radius: 16px;
      display: block;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      z-index: 1022;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(iframe);

    let isOpen = false;

    // Mostrar/Ocultar el iframe
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        iframe.style.opacity = "1";
        iframe.style.transform = "translateY(0)";
        iframe.style.pointerEvents = "auto";
        iframe.contentWindow.postMessage({ userId }, API_URL);
      } else {
        iframe.style.opacity = "0";
        iframe.style.transform = "translateY(20px)";
        iframe.style.pointerEvents = "none";
      }
    }

    btn.addEventListener("click", toggleChat);

    // Cierre desde el iframe (opcional)
    window.addEventListener("message", (e) => {
      if (e.origin !== API_URL) return;
      if (e.data === "close-aulaViva") {
        isOpen = false;
        iframe.style.opacity = "0";
        iframe.style.transform = "translateY(20px)";
        iframe.style.pointerEvents = "none";
      }
    });
  });
})();
