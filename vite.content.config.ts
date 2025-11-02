import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist",
    lib: {
      formats: ["iife"],
      entry: resolve(__dirname, "src/sites/kalshi/index.ts"),
      name: "KalshiContentScript",
    },
    rollupOptions: {
      external: ["webextension-polyfill"],
      output: {
        entryFileNames: "sites/kalshi/index.js",
        extend: true,
        globals: {
          "webextension-polyfill": "browser",
        },
      },
    },
  },
  esbuild: {
    target: "es2020",
  },
});
