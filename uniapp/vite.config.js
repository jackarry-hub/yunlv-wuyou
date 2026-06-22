import { defineConfig } from "vite";
import uniPlugin from "@dcloudio/vite-plugin-uni";
import { fileURLToPath, URL } from "node:url";

const uni = uniPlugin.default || uniPlugin;

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      components: fileURLToPath(new URL("./components", import.meta.url)),
      common: fileURLToPath(new URL("./common", import.meta.url)),
      store: fileURLToPath(new URL("./store", import.meta.url)),
      pages: fileURLToPath(new URL("./pages", import.meta.url)),
    },
  },
  plugins: [uni()],
});
