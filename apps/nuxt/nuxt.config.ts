// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxt/image", // https://image.nuxt.com
  ],
  css: ["~/app.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: true },
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: process.env.NUXT_API_SECRET,
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3002",
    },
  },
  image: {
    format: ["webp"],
    quality: 80,
  },
})
