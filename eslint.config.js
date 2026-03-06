import pluginVue from "eslint-plugin-vue"
import tseslint from "@typescript-eslint/eslint-plugin"
import parserVue from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import prettierConfig from "eslint-config-prettier"

export default [
  {
    files: ["resources/js/**/*.{js,ts,vue}"],

    languageOptions: {
      parser: parserVue,

      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      vue: pluginVue,
      "@typescript-eslint": tseslint,
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-unused-vars": "warn",
      "vue/multi-word-component-names": "off",
    },
  },

  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },

  prettierConfig,
]
