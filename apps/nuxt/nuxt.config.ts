// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt', // https://pinia.vuejs.org/ssr/nuxt.html
    '@nuxt/image' // https://image.nuxt.com
  ],
  devtools: { enabled: true },
  image: {
    format: ['webp'],
    quality: 80
  }
})
