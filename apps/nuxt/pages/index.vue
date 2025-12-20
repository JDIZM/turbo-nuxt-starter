<script setup lang="ts">
import { Card, Badge, Spinner } from "ui"

// Health check response type
interface HealthData {
  status: string
  timestamp: string
  environment: string
}

// Fetch API health status
const { data, pending, error, refresh } = await useApi<HealthData>("/health")

// Computed properties for display
const statusColor = computed(() => {
  if (error.value) return "danger"
  if (!data.value) return "warning"
  return data.value.data.status === "ok" ? "success" : "danger"
})

const statusText = computed(() => {
  if (error.value) return "Offline"
  if (!data.value) return "Unknown"
  return data.value.data.status === "ok" ? "Online" : "Error"
})

useHead({
  title: "Dashboard - Turbo Nuxt Starter",
  meta: [
    {
      name: "description",
      content: "Production-ready Nuxt 4 + Turborepo starter with TypeScript, Tailwind, and API integration"
    }
  ]
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">
        Welcome to your Turbo Nuxt Starter. Monitor your API health and explore the features.
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- API Health Status Card -->
      <Card hoverable shadow="md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">API Status</p>
            <div class="mt-2 flex items-center gap-2">
              <Spinner v-if="pending" size="sm" />
              <Badge v-else :variant="statusColor" size="lg">
                {{ statusText }}
              </Badge>
            </div>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full"
            :class="{
              'bg-green-100': statusColor === 'success',
              'bg-red-100': statusColor === 'danger',
              'bg-yellow-100': statusColor === 'warning'
            }"
          >
            <svg
              class="h-6 w-6"
              :class="{
                'text-green-600': statusColor === 'success',
                'text-red-600': statusColor === 'danger',
                'text-yellow-600': statusColor === 'warning'
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div v-if="!pending && data" class="mt-4 text-xs text-gray-500">
          <p>Environment: {{ data.data.environment }}</p>
          <p>Last check: {{ new Date(data.data.timestamp).toLocaleTimeString() }}</p>
        </div>
        <div v-if="error" class="mt-4">
          <p class="text-sm text-red-600">{{ error.message || "Failed to connect to API" }}</p>
          <button
            class="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            @click="refresh"
          >
            Retry
          </button>
        </div>
      </Card>

      <!-- API Endpoint Card -->
      <Card shadow="md">
        <div>
          <p class="text-sm font-medium text-gray-600">API Endpoint</p>
          <p class="mt-2 break-all text-sm font-mono text-gray-900">
            {{ useRuntimeConfig().public.apiBase }}
          </p>
        </div>
        <div class="mt-4">
          <a
            :href="`${useRuntimeConfig().public.apiBase}/docs`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View API Documentation →
          </a>
        </div>
      </Card>

      <!-- Features Card -->
      <Card shadow="md">
        <div>
          <p class="text-sm font-medium text-gray-600">Tech Stack</p>
          <ul class="mt-3 space-y-2 text-sm text-gray-700">
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
              Nuxt 4.1 + Vue 3.5
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
              TypeScript 5.7
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
              Tailwind v4
            </li>
            <li class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-600" />
              Turborepo
            </li>
          </ul>
        </div>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-900">Quick Actions</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="http://localhost:3003"
          target="_blank"
          class="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <h3 class="font-medium text-gray-900">Documentation</h3>
          <p class="mt-1 text-sm text-gray-600">Browse the docs</p>
        </a>
        <a
          href="http://localhost:3002/docs"
          target="_blank"
          class="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <h3 class="font-medium text-gray-900">API Reference</h3>
          <p class="mt-1 text-sm text-gray-600">Explore endpoints</p>
        </a>
        <a
          href="http://localhost:6006"
          target="_blank"
          class="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <h3 class="font-medium text-gray-900">Storybook</h3>
          <p class="mt-1 text-sm text-gray-600">UI components</p>
        </a>
        <a
          href="/about"
          class="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <h3 class="font-medium text-gray-900">About</h3>
          <p class="mt-1 text-sm text-gray-600">Learn more</p>
        </a>
      </div>
    </div>
  </div>
</template>
