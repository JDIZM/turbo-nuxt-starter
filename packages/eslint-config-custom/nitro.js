const { resolve } = require('node:path')
const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * NuxtJs apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */
module.exports = {
  extends: [
    '@nuxt/eslint-config',
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/browser',
    'eslint-config-turbo'
  ].map(require.resolve),
  parserOptions: {
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.cjs', 'nitro.config.ts'],
  rules: {
    'comma-dangle': 'off',
    semi: 'off',
    'no-undef': 'off',
    'import/no-default-export': 'off',
    'eslint-comments/require-description': 'off'
    // add specific rules configurations here
  }
}
