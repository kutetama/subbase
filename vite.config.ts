import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "package.json"), "utf8"));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    // FastAPI 골격 페어 (server/ — uvicorn 기본 8000)
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
