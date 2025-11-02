import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        // Copy HTML files
        {
          src: "src/popup/popup.html",
          dest: "popup",
        },
        {
          src: "src/popup/popup.css",
          dest: "popup",
        },
        {
          src: "src/options/options.html",
          dest: "options",
        },
        {
          src: "src/options/options.css",
          dest: "options",
        },
        // Copy CSS files
        {
          src: "src/sites/kalshi/kalshi.css",
          dest: "sites/kalshi",
        },
        // Copy webextension-polyfill for runtime use
        {
          src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
          dest: "lib",
        },
        // Copy manifest and assets
        {
          src: "manifest.json",
          dest: ".",
        },
        {
          src: "assets",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background.ts"),
        popup: resolve(__dirname, "src/popup/popup.ts"),
        options: resolve(__dirname, "src/options/options.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        format: "es",
      },
    },
    target: ["chrome110", "firefox110", "edge110"],
  },
  esbuild: {
    target: "es2020",
  },
});
