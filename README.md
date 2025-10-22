# Turbo Nuxt Starter - Turborepo + Nuxt 4 + Vue 3 Monorepo

A production-ready **Turborepo monorepo starter** template for building modern full-stack applications with **Nuxt 4**, **Vue 3**, Express/Nitro APIs, and PostgreSQL. Perfect for developers looking for a comprehensive **TypeScript monorepo** with component libraries, documentation, and production-grade infrastructure.

## 🚀 Features

### Full-Stack Monorepo Architecture

- **Turborepo** - Intelligent build system with caching and parallel execution
- **Multiple Apps** - Nuxt 4 frontend, Express API, Nitro server, Storybook, and Docus documentation
- **Workspace Packages** - Shared UI components, type definitions, utilities, and database schemas
- **pnpm 10** - Fast, disk-efficient package manager with built-in security features

### Frontend Excellence

- **Nuxt 4 + Vue 3** - Modern SSR framework with Composition API
- **Tailwind CSS + DaisyUI** - Utility-first styling with pre-built components
- **Pinia** - Type-safe state management
- **Storybook** - Component-driven development with isolated testing
- **TypeScript** - Full type safety across the entire stack

### Backend Flexibility

- **Express API** - Production-ready REST API with middleware, auth, and OpenAPI docs
- **Nitro Server** - Modern server framework with edge deployment support
- **PostgreSQL + Drizzle ORM** - Type-safe database with migrations and seed data
- **Zod Validation** - Runtime schema validation with auto-generated TypeScript types

### Production-Ready Infrastructure

- **Docker Support** - Multi-stage builds with BuildKit caching
- **Corepack** - Automatic package manager version management
- **Security** - Lifecycle script protection, minimum release age, rate limiting
- **Structured Logging** - Pino logger for request tracking and debugging
- **API Documentation** - Auto-generated OpenAPI/Swagger documentation
- **Database Tools** - Drizzle Kit migrations, PostgreSQL + pgAdmin containers

### Developer Experience

- **Docus Documentation** - Beautiful docs site powered by Nuxt Content
- **Hot Module Replacement** - Fast development with instant updates
- **Shared TypeScript Configs** - Consistent tsconfig across all packages
- **ESLint + Prettier** - Code quality and formatting enforcement
- **CI/CD Ready** - GitHub Actions workflows with prepare commands

## Why This Starter?

### 🎯 Comprehensive Yet Flexible

Unlike minimal starters, this template provides **production-grade infrastructure** out of the box while remaining flexible enough to remove what you don't need. Choose between Express or Nitro for your API, use Storybook for component development, and deploy with Docker.

### 🔒 Security-First Approach

Built with **pnpm 10's latest security features** including lifecycle script protection and minimum release age settings. These features became critical after major npm supply chain attacks in 2025.

### 📦 True Monorepo Architecture

Leverages **Turborepo** for intelligent caching and parallel task execution. Shared packages (ui, helpers, api-types, db-schema, logger) demonstrate real-world monorepo patterns used in production applications.

### 🚀 Modern Tech Stack

- **Nuxt 4.1+** - Latest stable with Vue 3.5+ and Vite 6
- **TypeScript 5.7+** - Strict mode with comprehensive type safety
- **pnpm 10** - Fastest package manager with built-in security
- **Node 20+ LTS** - Future-proof with long-term support

### 📚 Documentation-Driven

Includes **Docus** (powered by Nuxt 4 + Nuxt Content) for beautiful, searchable documentation. Markdown-based content with Vue component support makes it easy to maintain comprehensive docs alongside your code.

### 🎨 Component Library Ready

**Storybook integration** with pre-built UI components (Button, Input, Card, Modal, Alert, Badge) demonstrates component-driven development patterns. Perfect for design systems and reusable components.

### 🗄️ Database-Ready

PostgreSQL + Drizzle ORM setup with migrations, seeds, and type-safe queries. Docker Compose configuration includes pgAdmin for database management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS) - [Download](https://nodejs.org/)
- **Corepack** - Package manager version manager (included with Node.js 16+)
- **Docker** (for database) - [Get Docker](https://docs.docker.com/get-docker/)

Enable Corepack if not already enabled:

```bash
corepack enable
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/turbo-nuxt-starter.git
cd turbo-nuxt-starter

# Install dependencies
pnpm install

# Rebuild native modules (required for Docus/better-sqlite3)
pnpm rebuild better-sqlite3

# Copy environment variables
cp .env.example .env

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run database migrations
cd packages/db-schema
pnpm migrate:push
cd ../..

# Start all apps
pnpm dev
```

## 🔐 Supabase Local Development

This starter includes **Supabase authentication** with local Docker development. No cloud account needed for development!

### Setup Supabase CLI

```bash
# Install Supabase CLI
pnpm add -g supabase

# Initialize Supabase (creates supabase/ directory)
supabase init

# Start local Supabase stack (PostgreSQL, Auth, Storage, etc.)
supabase start
```

### Configure Environment

After `supabase start`, copy the credentials to your `.env` file:

```bash
# Supabase Local Development
SUPABASE_URL=http://localhost:54321

# Option 1: New key system (2025+) - Recommended
# Displayed in `supabase start` output
SUPABASE_PUBLISHABLE_KEY=sb_publishable_*
# SUPABASE_SECRET_KEY=sb_secret_*  # Only needed for admin operations

# Option 2: Legacy JWT keys - Still supported
# Get all credentials with: supabase status -o env
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# JWT Secret for token verification (required for both key systems)
# Get from: supabase status -o env | grep JWT_SECRET
SUPABASE_AUTH_JWT_SECRET=<your-jwt-secret>

# Database (Supabase local uses port 54322, not 5432)
DATABASE_URL=postgresql://postgres:<password>@localhost:54322/postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=54322
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-password>
POSTGRES_DB=postgres
```

**About Supabase Keys:**

- **API Keys** (`sb_publishable_*` or `anon`): For SDK initialization - functionally equivalent
- **JWT System**: Newer asymmetric keys enable local token verification (faster, more secure)
- Both servers use `supabase.auth.getClaims()` which automatically uses Web Crypto API with asymmetric keys
- Learn more: [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys) | [JWT Signing Keys](https://supabase.com/blog/jwt-signing-keys)

### Run Database Migrations

```bash
cd packages/db-schema
pnpm migrate:push
```

### Seed Test Accounts (Optional)

```bash
cd apps/api
pnpm seed
```

This creates 3 test accounts in Supabase Auth + database:

- alice@example.com / password123
- bob@example.com / password123
- charlie@example.com / password123

### Access Supabase Studio

Supabase Studio (web UI) runs at **http://localhost:54323**

Manage users, view database, test Auth, and more!

### Authentication Flow

1. **Sign up a user** (creates Supabase Auth user + account record):

```bash
curl -X POST http://localhost:3002/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123","fullName":"Alice Johnson"}'
```

2. **Sign in** (returns JWT access token):

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

3. **Access protected endpoints** (use JWT token):

```bash
curl http://localhost:3002/api/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

### How Auth Works

- **Supabase Auth** handles passwords, JWT tokens, sessions
- **Both APIs** verify JWT tokens using `supabase.auth.getClaims()`
  - With asymmetric keys: Local verification using Web Crypto API (fast, offline)
  - With symmetric keys: Falls back to Auth server verification
- **Account UUID** matches Supabase Auth user ID (synced on signup)
- **Protected routes** require `Authorization: Bearer <token>` header

### Useful Commands

```bash
# Check Supabase services status
supabase status

# Stop all services
supabase stop

# Reset database (WARNING: deletes all data)
supabase db reset

# Generate migration from schema changes
supabase db diff -f migration_name
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- **`vite`** - [Vite](https://vitejs.dev/) + Vue 3 application (port 3000)
- **`nuxt`** - [Nuxt 4](https://nuxt.com/) frontend application (port 3001)
- **`api`** - [Express API](https://expressjs.com/) server with TypeScript (port 3002)
- **`docus`** - [Docus](https://docus.dev/) documentation site (port 3003)
- **`nitro`** - [Nitro](https://nitro.unjs.io/) server example (port 3004)
- **`storybook`** - [Storybook](https://storybook.js.org/) for component development (port 6006)
- **`ui`** - Shared Vue component library with Tailwind CSS
- **`eslint-config-custom`** - ESLint configurations for different environments
- **`tsconfig`** - Shared TypeScript configurations
- **`tailwind-config`** - Shared Tailwind CSS configuration

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development

### Start All Services

Run all applications simultaneously:

```bash
pnpm dev
```

This starts all applications on their configured ports:

| Application | Port | URL | Environment Variable |
|-------------|------|-----|---------------------|
| Vite + Vue 3 | 3000 | http://localhost:3000 | - |
| Nuxt Frontend | 3001 | http://localhost:3001 | NUXT_PORT |
| Express API | 3002 | http://localhost:3002 | API_PORT |
| Docus Docs | 3003 | http://localhost:3003 | DOCS_PORT |
| Nitro Server | 3004 | http://localhost:3004 | NITRO_PORT |
| Storybook | 6006 | http://localhost:6006 | - |

**Infrastructure Services:**

| Service | Port | URL | Environment Variable |
|---------|------|-----|---------------------|
| Supabase Studio | 54323 | http://localhost:54323 | - |
| Supabase API | 54321 | http://localhost:54321 | SUPABASE_URL |
| PostgreSQL | 54322 | postgresql://localhost:54322 | POSTGRES_PORT |

### Individual Services

Start specific services:

```bash
# Start only the API server
pnpm dev:api

# Start only the Nuxt frontend
pnpm dev:web

# Start Storybook
pnpm --filter storybook storybook
```

### Build

Build all applications and packages:

```bash
pnpm build
```

### API Endpoints

The Express API provides these endpoints:

- `GET /health` - Health check
- `GET /api` - API information
- `GET /api/users` - Example users endpoint

Test the API:

```bash
curl http://localhost:3002/health
curl http://localhost:3002/api/users
```

## Project Structure

```
turbo-nuxt-starter/
├── apps/
│   ├── api/                 # Express.js API server
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   └── server.ts    # Main server file
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── nuxt/               # Nuxt 3 frontend
│   ├── nitro/              # Nitro server example
│   ├── storybook/          # Component development
│   └── vite/               # Vite + Vue 3 app
├── packages/
│   ├── ui/                 # Shared Vue components
│   ├── eslint-config-custom/ # ESLint configurations
│   ├── tsconfig/           # TypeScript configurations
│   └── tailwind-config/    # Tailwind CSS config
├── package.json            # Root workspace config
└── turbo.json             # Turborepo configuration
```

## Environment Configuration

### API Environment Variables

Copy `.env.example` to `.env` in the API directory:

```bash
cp apps/api/.env.example apps/api/.env
```

Configure as needed:

- `PORT` - API server port (default: 3002)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin

## Adding New Features

### New API Routes

1. Create route file in `apps/api/src/routes/`
2. Export router and import in `apps/api/src/routes/index.ts`

### New UI Components

1. Add component to `packages/ui/`
2. Export from `packages/ui/index.ts`
3. Use in any app: `import { MyComponent } from 'ui'`

### Shared Types

Add TypeScript types to `packages/ui/types/` for cross-package usage.

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## CI/CD Setup

### TypeScript Configuration Generation

Nuxt and Nitro apps generate their TypeScript configurations at prepare time:

- `apps/nuxt/.nuxt/tsconfig.json` - Generated by `nuxt prepare`
- `apps/nitro/.nitro/tsconfig.json` - Generated by `nitro prepare`
- `apps/docus/.nuxt/tsconfig.json` - Generated by `nuxt prepare --extends docus`

**Local Development:**

- These are generated automatically via `postinstall` scripts when you run `pnpm install`
- No manual action required

**CI/CD Pipelines:**

- If you skip postinstall scripts (common practice with `--ignore-scripts`), you must run `turbo prepare` before typechecking
- This ensures all `.nuxt` and `.nitro` directories are generated with proper TypeScript configurations

### Example GitHub Actions Workflow

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 10.17.1

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      # Install dependencies (skip postinstall for speed)
      - run: pnpm install --frozen-lockfile --ignore-scripts

      # Rebuild native modules
      - run: pnpm rebuild better-sqlite3

      # Generate TypeScript configs for Nuxt/Nitro
      - run: turbo prepare

      # Run quality checks
      - run: turbo lint:check
      - run: turbo typecheck
      - run: turbo test:unit
      - run: turbo build
```

### Manual Prepare Command

If you need to manually regenerate TypeScript configurations:

```bash
# Regenerate all configs
turbo prepare

# Or for a specific app
pnpm --filter nuxt prepare
pnpm --filter nitro prepare
pnpm --filter docus prepare
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## Troubleshooting

### TypeScript Configuration Not Found

If `pnpm typecheck` fails with errors about missing TypeScript configurations or cannot find auto-imported functions (`useHead`, `defineNuxtConfig`, etc.):

**Cause:** The `.nuxt` and `.nitro` directories haven't been generated yet.

**Solution:**

```bash
# Regenerate TypeScript configurations
turbo prepare

# Then run typecheck again
pnpm typecheck
```

This is especially common in CI/CD environments when using `pnpm install --ignore-scripts`. See the [CI/CD Setup](#cicd-setup) section for more details.

### better-sqlite3 Bindings Error

If you encounter an error like `Could not locate the bindings file` when running the Docus app, it means the native module `better-sqlite3` needs to be rebuilt for your system.

**Error example:**

```
Error: Could not locate the bindings file. Tried:
→ /path/to/node_modules/better-sqlite3/build/better_sqlite3.node
```

**Solution:**

```bash
# Rebuild the native module
pnpm rebuild better-sqlite3
```

This is required because `better-sqlite3` is a native Node.js addon that must be compiled for your specific:

- Node.js version (e.g., Node 22.17.0)
- Operating system (macOS, Linux, Windows)
- CPU architecture (arm64, x64)

The rebuild command will compile the module correctly for your environment.

## Security Features (pnpm 10)

This starter uses **pnpm 10** with enhanced security features to protect against supply chain attacks.

### Lifecycle Script Protection

**By default, lifecycle scripts from dependencies are disabled.** This prevents malicious packages from executing arbitrary code during installation.

Only explicitly allowed packages can run lifecycle scripts, configured in `pnpm-workspace.yaml`:

```yaml
onlyBuiltDependencies:
  - better-sqlite3 # Native module requiring compilation
  - esbuild # Build tool needing platform binaries
```

If you need to allow additional packages to run lifecycle scripts, add them to this list.

### Minimum Release Age

**New package versions are delayed by 24 hours before installation** to give the community time to identify malicious releases.

```yaml
minimumReleaseAge: 1440 # 24 hours in minutes
```

This setting is configured in `pnpm-workspace.yaml` and helps protect against:

- Compromised maintainer accounts
- Malicious package updates
- Supply chain injection attacks

**Note:** This only affects newly published versions. Existing versions install immediately.

### Package Manager Version Management

Corepack automatically manages the pnpm version based on the `packageManager` field in `package.json`:

```json
{
  "packageManager": "pnpm@10.17.1"
}
```

This ensures everyone on your team uses the same pnpm version, eliminating "works on my machine" issues.

### Learn More

- [pnpm Supply Chain Security](https://pnpm.io/supply-chain-security)
- [pnpm 10 Release Notes](https://pnpm.io/blog/releases/10.16)
- [Corepack Documentation](https://nodejs.org/api/corepack.html)
