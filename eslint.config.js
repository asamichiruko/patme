import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import eslintConfigPrettier from "eslint-config-prettier"

export default defineConfig([
  {
    ignores: ["**/dist/**", "**/docs/**"],
  },
  {
    files: ["**/src/**/*.{js,mjs,cjs,vue}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/src/**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  pluginVue.configs["flat/essential"],
  eslintConfigPrettier,
])
