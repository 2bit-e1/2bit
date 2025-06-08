// vite.config.js
import { resolve } from "path";
import { defineConfig } from "file:///D:/2bit_2025/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/2bit_2025/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import svgLoader from "file:///D:/2bit_2025/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "D:\\2bit_2025";
var root = resolve(__vite_injected_original_dirname, "./src");
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["dotlottie-player"].includes(tag)
        }
      }
    }),
    svgLoader()
  ],
  resolve: {
    alias: {
      "@": root
    }
  }
  // base: '/2bit/',
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFwyYml0XzIwMjVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDJiaXRfMjAyNVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovMmJpdF8yMDI1L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gXCJ2aXRlLXN2Zy1sb2FkZXJcIjtcclxuY29uc3Qgcm9vdCA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiBbXCJkb3Rsb3R0aWUtcGxheWVyXCJdLmluY2x1ZGVzKHRhZyksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgc3ZnTG9hZGVyKCksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcm9vdCxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBiYXNlOiAnLzJiaXQvJyxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBME4sU0FBUyxlQUFlO0FBQ2xQLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGVBQWU7QUFIdEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTSxPQUFPLFFBQVEsa0NBQVcsT0FBTztBQUd2QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixVQUFVO0FBQUEsUUFDUixpQkFBaUI7QUFBQSxVQUNmLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLEdBQUc7QUFBQSxRQUM3RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFVBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQTtBQUVGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
