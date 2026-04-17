<script lang="ts" setup>
import { ref } from "vue"
import Button from "./Button.vue"

export interface HeaderProps {
  /**
   * Application logo/name
   */
  logo?: string
  /**
   * Navigation items
   */
  navigationItems?: Array<{
    label: string
    href: string
    active?: boolean
  }>
  /**
   * User information
   */
  user?: {
    name: string
    email?: string
    avatar?: string
  } | null
  /**
   * Show mobile menu button
   */
  showMobileMenu?: boolean
}

withDefaults(defineProps<HeaderProps>(), {
  logo: "App",
  navigationItems: () => [],
  user: null,
  showMobileMenu: true,
})

const emit = defineEmits<{
  logout: []
  login: []
  toggleMobileMenu: []
}>()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  emit("toggleMobileMenu")
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="text-primary-600 hover:text-primary-700 text-xl font-bold">
            {{ logo }}
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex md:space-x-8">
          <a
            v-for="item in navigationItems"
            :key="item.href"
            :href="item.href"
            :class="[
              'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
              item.active
                ? 'border-primary-600 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- User Menu / Auth -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <div v-if="user" class="flex items-center space-x-3">
            <span class="text-sm text-gray-700">{{ user.name }}</span>
            <Button variant="outline" size="sm" @click="emit('logout')"> Logout </Button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <Button variant="ghost" size="sm" @click="emit('login')"> Login </Button>
            <Button variant="primary" size="sm" @click="emit('login')"> Sign Up </Button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div v-if="showMobileMenu" class="flex md:hidden">
          <button
            type="button"
            class="focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Hamburger icon -->
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Close icon -->
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen && showMobileMenu" class="border-t border-gray-200 md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <a
          v-for="item in navigationItems"
          :key="item.href"
          :href="item.href"
          :class="[
            'block rounded-md px-3 py-2 text-base font-medium',
            item.active
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          ]"
        >
          {{ item.label }}
        </a>
      </div>
      <div class="border-t border-gray-200 px-4 py-3">
        <div v-if="user" class="space-y-3">
          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
          <div v-if="user.email" class="text-sm text-gray-500">{{ user.email }}</div>
          <Button variant="outline" size="sm" full-width @click="emit('logout')"> Logout </Button>
        </div>
        <div v-else class="space-y-2">
          <Button variant="outline" size="sm" full-width @click="emit('login')"> Login </Button>
          <Button variant="primary" size="sm" full-width @click="emit('login')"> Sign Up </Button>
        </div>
      </div>
    </div>
  </header>
</template>
