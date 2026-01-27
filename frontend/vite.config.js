import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dans Docker, on utilisera le nom du service "backend".
// En local, on garde "localhost".
// Note: Vite utilise cette URL pour le proxy côté serveur (dans le conteneur)
const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:8000";
const DJANGO_URL = process.env.VITE_DJANGO_URL || "http://localhost:8001";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  server: {
    host: true,
    watch: {
      usePolling: true, // Crucial pour Windows + Docker
    },
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        ws: true,
      },
      "/auth": {
        target: DJANGO_URL,
        changeOrigin: true,
      },
    },
  },
});
