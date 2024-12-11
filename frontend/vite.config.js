import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000", // Backend server
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ""), // Remove '/api' prefix
            },
        },
    },
});
