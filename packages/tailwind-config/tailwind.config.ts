import type { Config } from "tailwindcss"

// Minimal config for tooling compatibility
// Theme customization is done in theme.css using @theme directive
const config: Omit<Config, "content"> = {
  darkMode: "class"
}

export default config
