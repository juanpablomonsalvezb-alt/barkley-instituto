import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Error boundary para capturar errores de renderizado
window.addEventListener("error", (event) => {
  console.error("Error global:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rechazada:", event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento root");
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Error al renderizar la aplicación:", error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui; text-align: center;">
      <h1 style="color: #a51c30;">Error al cargar la aplicación</h1>
      <p>Por favor, abre la consola del navegador (F12) para ver los detalles del error.</p>
      <pre style="background: #f5f5f5; padding: 1rem; margin-top: 1rem; text-align: left; overflow: auto;">${error}</pre>
    </div>
  `;
}
