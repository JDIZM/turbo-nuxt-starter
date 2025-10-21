// https://nitro.unjs.io/config
import { config } from "dotenv"
import { resolve } from "path"
import { fileURLToPath } from "url"

// Load .env from the app directory (not repo root)
const __dirname = fileURLToPath(new URL(".", import.meta.url))
config({ path: resolve(__dirname, ".env") })

export default defineNitroConfig({
  srcDir: "server",
  experimental: {
    openAPI: true // Enables /_swagger, /_scalar, and /_openapi.json endpoints
  }
})
