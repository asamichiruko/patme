import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import eslintConfigPrettier from "eslint-config-prettier"
import vitest from "@vitest/eslint-plugin"

export default defineConfig([
  { ignores: ["**/dist/**", "**/docs/**"] },
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/tests/**"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  pluginVue.configs["flat/essential"],
  eslintConfigPrettier,
])
