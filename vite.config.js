import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
const root = resolve(__dirname, "./src");

// https://vitejs.dev/config/
export default defineConfig({
   build: {
    rollupOptions: {
      external: ['@dotlottie/player-component'],
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["dotlottie-player"].includes(tag),
        },
      },
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      "@": root,
    },
  },
  // base: '/2bit/',
});
