import { resolve } from "path";
import { defineConfig } from "vite";
import { chromeExtension, simpleReloader } from "vite-plugin-chrome-extension";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: "src/manifest.json"
    }
  },
  plugins: [
    chromeExtension(),
    simpleReloader(),
  ],
});
