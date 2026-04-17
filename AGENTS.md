# AGENTS.md

Project-specific instructions for AI coding assistants (Claude Code, Cursor, GitHub Copilot, etc.).
`CLAUDE.md` is a symlink to this file — update this file, both stay in sync.

## Overview

Turborepo monorepo: **Nuxt 4 + Vue 3** frontend, **Express** and **Nitro** backends, PostgreSQL via
**Drizzle ORM**, Supabase for auth, Storybook for component dev, Docus for docs, Docker + GCP Cloud
Run for deploys.

Flagship status: this is the most-used starter template. Treat changes as load-bearing.

## Workspace Layout

```
apps/
  api/         Express REST API (tsup build, tsx dev)
  nitro/       Nitro server alternative (edge-ready)
  nuxt/        Nuxt 4 SSR frontend (port 3001)
  docus/       Nuxt Content docs site (port 3003)
  storybook/   Storybook 9 for ui package
  vite/        Vite playground
packages/
  api-types/         Zod schemas + OpenAPI types (shared contracts)
  db-schema/         Drizzle schema + migrations + pg client
  eslint-config-custom/  Flat config: base/node/nuxt/nitro/vue
  helpers/           HttpError, request/response helpers, strings — has Vitest tests
  logger/            Pino logger (+ pino-pretty dev)
  tailwind-config/   Shared Tailwind v4 config
  tsconfig/          Shared TS configs
  ui/                Vue 3 component library (atoms/molecules)
```

### Dependency direction

`apps/*` depend on `packages/*`; packages may depend on other packages (e.g. `helpers` ← `api-types`,
`logger`). Do not introduce reverse deps from `packages/` back into `apps/`.

## Tooling Baselines

- **pnpm 10.17.1** (pinned via `packageManager` field; enable with `corepack enable`)
- **Node >=22** — all `engines` fields must match root
- **Turborepo 2** — pipeline in `turbo.json`
- **ESLint 9 flat config** — import from `eslint-config-custom`; use `^9.0.0` range everywhere
- **Prettier 3** — config at `.prettierrc.json` (no semi, double quotes, `trailingComma: "es5"`,
  100-col, Tailwind plugin)
- **Vitest 3** for unit tests (`test:unit`)
- **TypeScript 5.x strict** via `packages/tsconfig`

## Common Commands

Run from the repo root unless noted:

```bash
pnpm dev               # all apps in parallel (turbo)
pnpm dev:web           # Nuxt only
pnpm dev:api           # Express only
pnpm build             # turbo run build
pnpm lint              # eslint --fix across workspaces
pnpm lint:check        # no auto-fix (CI)
pnpm format            # prettier --write at root
pnpm typecheck         # turbo run typecheck
pnpm test:unit         # all vitest suites
pnpm setup             # ./scripts/dev-setup.sh
pnpm docker:dev        # full dev stack (app + db) via compose
pnpm docker:db         # just Postgres
```

Database (from `packages/db-schema`):

```bash
pnpm migrate:create    # drizzle-kit generate
pnpm migrate:push      # drizzle-kit push
pnpm studio            # drizzle-kit studio
```

## Patterns to Follow

### Adding a new app

1. Scaffold under `apps/<name>/` with its own `package.json`, `tsconfig.json`, `eslint.config.js`.
2. Set `"engines": { "node": ">=22" }` and add `"name"` matching the directory.
3. Extend a preset from `packages/eslint-config-custom` (e.g. `./nuxt.js`).
4. Extend the appropriate config from `packages/tsconfig`.
5. Reference workspace packages as `"<name>": "workspace:*"`.
6. Add pipeline tasks to `turbo.json` only if non-default behavior is needed.
7. Add a multi-stage Dockerfile using `turbo prune` for production builds (see existing apps).

### Adding a new package

1. Scaffold under `packages/<name>/` mirroring an existing simple package (e.g. `logger`).
2. `"private": true`, `"type": "module"`, explicit `exports` map.
3. Add `lint`, `lint:check`, `typecheck` scripts (plus `test:unit` if tests exist).
4. Consumers import via the package name, not relative paths.

### API architecture (`apps/api`)

- Express + Helmet + rate-limit + pino-http.
- Schemas live in `packages/api-types` (Zod → OpenAPI via `@asteasolutions/zod-to-openapi`).
- DB access through `packages/db-schema` (Drizzle + `pg`).
- Throw `HttpError` from `packages/helpers` for predictable error responses.
- Auth via Supabase + JWT (`jsonwebtoken`, `cookie-parser`).

### Frontend (`apps/nuxt`)

- Nuxt auto-imports; do not re-declare `vue-router` as a direct dep.
- Pinia for state, `@vueuse/core` for composables, `@headlessui/vue` for primitives.
- Tailwind v4 via `@tailwindcss/vite`; share tokens through `packages/tailwind-config`.
- UI primitives come from `packages/ui`.

## Conventions & Gotchas

- **Do not** add `vue-router` explicitly to the Nuxt app — Nuxt ships it.
- **Do not** pin Storybook deps to alpha versions; use stable `^9.1.x`.
- Keep `engines.node` aligned to `>=22` across every `package.json`.
- `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` blocks sub-24h-old releases — expected.
- `onlyBuiltDependencies` gates which packages can run install scripts (pnpm 10 supply-chain
  hardening). Add to this list, never disable globally.
- When changing Prettier config, run `pnpm format` and commit the reformat separately from logic
  changes to keep reviews sane.

## Deployment

- Docker multi-stage builds per app (`Dockerfile`) + dev variants (`Dockerfile.dev`).
- Terraform in `infra/` targets GCP Cloud Run with Workload Identity Federation — no static service
  account keys.
- GitHub Actions pipelines handle build, test, and deploy; Renovate manages dependency PRs.

## When In Doubt

- Match the pattern used by the simplest existing app or package.
- Prefer editing the shared config in `packages/` over duplicating per-app configuration.
- If a change touches more than one app, run `pnpm typecheck && pnpm lint:check && pnpm test:unit`
  before opening a PR.
