// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  experimental: {
    openAPI: true // Enables /_swagger, /_scalar, and /_openapi.json endpoints
  }
})
