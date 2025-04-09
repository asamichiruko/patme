import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
  base: "/pat-self-otb",
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
})
