<script setup lang="ts">
import { Header, Footer } from "ui"

const navigationItems = [
  { label: "Dashboard", href: "/", active: true },
  { label: "About", href: "/about", active: false },
]

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#help" },
      { label: "API Reference", href: "http://localhost:3002/docs" },
      { label: "Status", href: "#status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
    ],
  },
]

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: "github" as const },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const },
]

const handleLogin = () => {
  console.log("Login clicked")
  // Navigate to login page or open modal
}

const handleLogout = () => {
  console.log("Logout clicked")
  // Clear auth and redirect
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header
      logo="Turbo Nuxt"
      :navigation-items="navigationItems"
      @login="handleLogin"
      @logout="handleLogout"
    />

    <main class="flex-1 bg-gray-50">
      <slot />
    </main>

    <Footer
      :sections="footerSections"
      :social-links="socialLinks"
      copyright="© 2025 Turbo Nuxt Starter. Built with Nuxt 4 + Turborepo."
    />
  </div>
</template>
