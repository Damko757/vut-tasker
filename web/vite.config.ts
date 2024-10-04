import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { resolve } from "path";
import { globSync } from "glob";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                globSync(["./*.html"]).map((file) => [
                    file.slice(0, file.length - path.extname(file).length),
                    fileURLToPath(new URL(file, import.meta.url)),
                ])
            ),
        },
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
        },
    },
    server: {
        port: 5000,
        watch: {
            usePolling: true,
        },
    },
});
