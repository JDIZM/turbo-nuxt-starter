---
seo:
  title: Turbo Nuxt Starter - Production-Ready Monorepo
  description: A production-ready monorepo starter with Nuxt 4, Express API, TypeScript,
    Drizzle ORM, and GCP Cloud Run deployment. Built with Turborepo and pnpm workspaces.
---

::u-page-hero
#title
Turbo Nuxt Starter

#description
A production-ready monorepo starter with Nuxt 4, Express API, TypeScript, and GCP Cloud Run deployment.

Built with Turborepo, pnpm workspaces, and modern tooling for scalable full-stack applications.

#links
:::u-button
---
color: neutral
size: xl
to: /getting-started/introduction
trailing-icon: i-lucide-arrow-right
---
Get Started
:::

:::u-button
---
color: neutral
icon: simple-icons-github
size: xl
to: https://github.com/JDIZM/turbo-nuxt-starter
variant: outline
---
Star on GitHub
:::
::

::u-page-section
#title
Everything you need for production

#features
:::u-page-feature
---
icon: i-simple-icons-nuxt
---
#title
[Nuxt 4]{.text-primary} + Vue 3

#description
Server-side rendering, auto-imports, and the latest Vue 3 features with full TypeScript support.
:::

:::u-page-feature
---
icon: i-lucide-server
---
#title
[Express API]{.text-primary} with OpenAPI

#description
Production-ready REST API with Swagger documentation, JWT authentication, rate limiting, and Zod validation.
:::

:::u-page-feature
---
icon: i-simple-icons-turborepo
---
#title
[Turborepo]{.text-primary} Build System

#description
Incremental builds, remote caching, and parallel task execution for blazing fast development.
:::

:::u-page-feature
---
icon: i-simple-icons-docker
---
#title
[Docker]{.text-primary} Ready

#description
Multi-stage Docker builds with turbo prune, health checks, and non-root user security.
:::

:::u-page-feature
---
icon: i-simple-icons-googlecloud
---
#title
[GCP Cloud Run]{.text-primary} Deployment

#description
Terraform infrastructure, Workload Identity Federation, and GitHub Actions CI/CD.
:::

:::u-page-feature
---
icon: i-simple-icons-drizzle
---
#title
[Drizzle ORM]{.text-primary} + PostgreSQL

#description
Type-safe database queries with schema migrations, Supabase integration, and seed scripts.
:::
::

::u-page-section
#title
Monorepo Architecture

#description
Organized as a pnpm workspace with shared packages and multiple applications.

#default
```
turbo-nuxt-starter/
├── apps/
│   ├── api/        # Express REST API
│   ├── nuxt/       # Nuxt 4 frontend
│   ├── nitro/      # Nitro server
│   ├── docus/      # Documentation site
│   ├── storybook/  # Component library
│   └── vite/       # Vue 3 SPA
├── packages/
│   ├── api-types/  # Zod schemas + OpenAPI
│   ├── db-schema/  # Drizzle ORM schema
│   ├── helpers/    # Shared utilities
│   ├── logger/     # Pino logger
│   └── ui/         # Vue components
└── infra/
    └── terraform/  # GCP infrastructure
```
::
