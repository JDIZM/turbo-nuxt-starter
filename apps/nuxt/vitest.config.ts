import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
// import vueJsx from "@vitejs/plugin-vue-jsx"

export default defineConfig({
  // plugins: [vue(), vueJsx()],
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  test: {
    setupFiles: [fileURLToPath(new URL('./tests/setup.ts', import.meta.url))],
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      provider: 'istanbul' // or 'v8'
    }
  }
})
