import type { Preview } from "@storybook/vue3"
import { withThemeByClassName } from "@storybook/addon-themes"
import "../src/styles.css"

// Detect user's system color scheme preference
const prefersDark =
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark"
      },
      defaultTheme: prefersDark ? "dark" : "light"
    })
  ]
}

export default preview
