import type { Config } from 'tailwindcss'
import sharedConfig from 'tailwind-config'

const config: Pick<Config, 'content' | 'presets'> = {
  content: ['../../packages/ui/**/*.vue'],
  presets: [sharedConfig]
}

export default config
