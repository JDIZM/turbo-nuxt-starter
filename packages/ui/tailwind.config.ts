import type { Config } from 'tailwindcss'
import sharedConfig from 'tailwind-config'

const config: Config = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './atoms/**/*.{vue,js,ts,jsx,tsx}',
    './molecules/**/*.{vue,js,ts,jsx,tsx}',
    './organisms/**/*.{vue,js,ts,jsx,tsx}'
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      }
    }
  }
}

export default config
