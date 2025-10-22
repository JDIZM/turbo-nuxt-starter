import eslint from "@eslint/js"
import prettier from "eslint-config-prettier"

export default [
  eslint.configs.recommended,
  prettier,
  {
    rules: {
      // Add any custom base rules here
    }
  }
]
