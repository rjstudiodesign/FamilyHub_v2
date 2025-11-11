import { defineConfig } from "vite";

const PORT = 5173;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // Definiert explizit den Port, auf dem der Server laufen soll.
    port: PORT,

    // Stellt sicher, dass der Browser automatisch geöffnet wird.
    open: true,

    // Dies ist die "architektonische Veredelung", die den 'port: undefined'-Fehler behebt.
    // Wir sagen dem HMR-Client (der im Browser läuft),
    // wie er den HMR-Server (Vite) kontaktieren soll.
    hmr: {
      // This is the architectural refinement that fixes the 'port: undefined' error.
      // We tell the HMR client (running in the browser)
      // how to contact the HMR server (Vite).
      port: PORT,
    },
  },
});

// Entferne jegliche Verwendung von tailwindcss() im plugins-Array!
// Tailwind wird über PostCSS konfiguriert (siehe postcss.config.js).
