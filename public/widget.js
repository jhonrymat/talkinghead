(function () {
    window.addEventListener("DOMContentLoaded", function () {
        // Leer los datos del script tag
        const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
        const userId = script.dataset.user || "anonimo";
        const userName = script?.dataset.name || "Estudiante";

        // aquí creas tu burbuja e iframe y usas postMessage para pasar los datos
        console.log("Datos desde script:", userId, userName);

        // Crear el botón flotante
        const btn = document.createElement("div");
        btn.id = "chat-widget-btn";
        btn.style = `
                        position: fixed;
                        bottom: 24px;
                        right: 24px;
                        background: #0078d7;
                        border-radius: 50%;
                        width: 56px;
                        height: 56px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        cursor: pointer;
                    `;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.4 4.5 3.53 5.88L6 21l4.12-2.24c.6.1 1.22.16 1.88.16 4.97 0 9-3.58 9-8s-4.03-8-9-8z"/></svg>`;

        document.body.appendChild(btn);

        // Crear el iframe oculto
        const iframe = document.createElement("iframe");
        iframe.src = "http://localhost:3000"; // Tu URL real
        iframe.style = `
                            position: fixed;
                            bottom: 90px;
                            right: 24px;
                            width: 360px;
                            height: 580px;
                            max-width: 90vw;
                            border: none;
                            border-radius: 16px;
                            display: none;
                            z-index: 9998;
                            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                        `;
        document.body.appendChild(iframe);

        // Mostrar/Ocultar
        btn.addEventListener("click", () => {
            iframe.style.display = "block";

            // Enviar los datos de usuario al iframe
            iframe.contentWindow.postMessage({
                userId,
                userName
            }, "http://localhost:3000"); // ← Reemplaza por tu dominio
        });

        // Escuchar para cerrarlo desde adentro si agregas botón 'X'
        window.addEventListener("message", (e) => {
            if (e.data === "    ") {
                iframe.style.display = "none";
            }
        });
    });
})();
