(function () {
  const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const scriptSrc = new URL(script.src);

  const userId = scriptSrc.searchParams.get("userId") || "anonimo";
  const courseId = scriptSrc.searchParams.get("courseId") || null;
  const agenteId = scriptSrc.searchParams.get("token") || null;
  const initialPrompt = scriptSrc.searchParams.get("initialPrompt") === "true";
  // ✅ Esto obtiene el dominio base del servidor del widget:
  const API_URL = scriptSrc.origin;

  console.log("[Widget] userId:", userId);
  console.log("[Widget] courseId:", courseId);
  console.log("[Widget] initialPrompt:", initialPrompt);
  console.log("[Widget] agenteId:", agenteId);


  // Crear el botón flotante
  const btn = document.createElement("div");
  btn.id = "aulaViva-btn";
  btn.style = `
      position: fixed;
      bottom: 10px;
      right: 70px;
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
      height: 555px;
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

  function openChat() {
    isOpen = true;
    iframe.style.opacity = "1";
    iframe.style.transform = "translateY(0)";
    iframe.style.pointerEvents = "auto";
  }

  function closeChat() {
    isOpen = false;
    iframe.style.opacity = "0";
    iframe.style.transform = "translateY(20px)";
    iframe.style.pointerEvents = "none";
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  btn.addEventListener("click", toggleChat);

  // ✅ Esperar que el iframe cargue para enviar el mensaje, sin abrirlo todavía
  iframe.onload = () => {
    console.log("[Widget] Iframe cargado. Enviando mensaje...");
    iframe.contentWindow.postMessage({
      userId,
      courseId,
      initialPrompt,
      agenteId,
    }, API_URL);
  };

  // Cierre externo opcional desde iframe
  window.addEventListener("message", (e) => {
    if (e.origin !== API_URL) return;

    if (e.data === "close-aulaViva") {
      closeChat();
    }

    // 🔓 Abrir automáticamente si el agente responde
    if (e.data === "open-aulaViva") {
      if (!isOpen) {
        console.log("[Widget] Recibido 'open-aulaViva'. Abriendo chat automáticamente.");
        openChat();
      }
    }
  });
})();
