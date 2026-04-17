<script setup lang="ts">
import { Card } from "ui"

useHead({
  title: "About - Turbo Nuxt Starter",
  meta: [
    {
      name: "description",
      content: "Learn about the Turbo Nuxt Starter - a production-ready monorepo template",
    },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900">About</h1>
      <p class="mt-4 text-lg text-gray-600">
        A modern, production-ready monorepo starter built with Nuxt 4, Turborepo, and TypeScript.
      </p>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <Card shadow="md">
        <h2 class="text-2xl font-semibold text-gray-900">What's Included</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 class="font-medium text-gray-900">Frontend</h3>
            <ul class="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Nuxt 4.1 with Vue 3.5</li>
              <li>• TypeScript 5.7</li>
              <li>• Tailwind CSS v4</li>
              <li>• Shared UI component library</li>
              <li>• Storybook integration</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Backend</h3>
            <ul class="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Express API with TypeScript</li>
              <li>• Supabase authentication</li>
              <li>• PostgreSQL + Drizzle ORM</li>
              <li>• OpenAPI documentation</li>
              <li>• Rate limiting & security</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card shadow="md">
        <h2 class="text-2xl font-semibold text-gray-900">Infrastructure</h2>
        <div class="mt-4 space-y-3 text-gray-600">
          <p>
            <strong class="text-gray-900">Turborepo</strong> - Intelligent build system with caching
            and parallel execution
          </p>
          <p>
            <strong class="text-gray-900">Docker</strong> - Multi-stage builds with development and
            production configurations
          </p>
          <p>
            <strong class="text-gray-900">GCP Cloud Run</strong> - Terraform infrastructure with
            Workload Identity Federation
          </p>
          <p>
            <strong class="text-gray-900">GitHub Actions</strong> - Automated CI/CD pipelines for
            testing and deployment
          </p>
        </div>
      </Card>

      <Card shadow="md">
        <h2 class="text-2xl font-semibold text-gray-900">Developer Experience</h2>
        <div class="mt-4 space-y-3 text-gray-600">
          <p>
            <strong class="text-gray-900">Hot Module Replacement</strong> - Instant feedback during
            development
          </p>
          <p>
            <strong class="text-gray-900">Type Safety</strong> - End-to-end TypeScript with strict
            mode enabled
          </p>
          <p>
            <strong class="text-gray-900">Code Quality</strong> - ESLint, Prettier, and automated
            formatting
          </p>
          <p>
            <strong class="text-gray-900">Documentation</strong> - Docus-powered docs site with
            deployment guides
          </p>
        </div>
      </Card>

      <Card shadow="md">
        <h2 class="text-2xl font-semibold text-gray-900">Getting Started</h2>
        <div class="mt-4 space-y-3 text-gray-600">
          <p>To start developing with this template:</p>
          <ol class="ml-4 list-decimal space-y-2">
            <li>Clone the repository</li>
            <li>
              Run <code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm">pnpm install</code>
            </li>
            <li>
              Start Supabase:
              <code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm">supabase start</code>
            </li>
            <li>
              Run dev servers:
              <code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm">pnpm dev</code>
            </li>
          </ol>
          <p class="mt-4">
            Check out the
            <a
              href="/docs"
              class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              documentation
            </a>
            for detailed setup instructions.
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>
