import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- Import plugin mới của v4
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Thêm vào danh sách plugins
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
