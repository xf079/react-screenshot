import { defineConfig } from "vite";
import svgr from 'vite-plugin-svgr';
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "react-screenshot",
      fileName: (format) => `react-screenshot.${format}.js`,
    },
    rollupOptions: {
      external: ["tsx"],
      output: {
        globals: {
          React: "React",
        },
      },
    },
  },
});
