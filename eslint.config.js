import { defineConfig } from "eslint/config"
import globals from "globals"
import pluginJs from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import eslintConfigPrettier from "eslint-config-prettier"

export default defineConfig([
  {
    ignores: ["**/dist/**", "**/docs/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    ...pluginJs.configs.recommended,
    ...pluginVue.configs["flat/essential"],
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },
  eslintConfigPrettier,
])
