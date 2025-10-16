// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxt/image" // https://image.nuxt.com
  ],
  css: ["~/app.css"],
  vite: {
    plugins: [tailwindcss()]
  },
  devtools: { enabled: true },
  image: {
    format: ["webp"],
    quality: 80
  }
})
