import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"
import globals from "globals"

/*
 * This is a custom ESLint configuration for use with
 * Nitro server apps.
 *
 * Nitro is a server framework built on top of h3 and is used by Nuxt
 * for its server engine.
 */
export default defineConfig(
  {
    ignores: [
      "dist/",
      "node_modules/",
      ".output/",
      ".nitro/",
      ".netlify/",
      ".vercel/",
      "nitro.config.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-undef": "off",
    },
  }
)
