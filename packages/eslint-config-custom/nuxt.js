import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettier from 'eslint-config-prettier'

export default createConfigForNuxt({
  features: {
    typescript: true,
    stylistic: false
  },
  dirs: {
    src: ['./src']
  }
}).append(prettier, {
  ignores: ['node_modules/', 'dist/', '.nuxt/', '.output/'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off'
  }
})
