# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate && npm install -g turbo@^2

# Builder stage
FROM base AS builder

WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN pnpx turbo prune nuxt --docker

# Installer stage
FROM base AS installer

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpx turbo build --filter=nuxt

# Runner stage
FROM base AS runner

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV HOST=0.0.0.0

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt
USER nuxt

EXPOSE 3001

COPY --from=installer --chown=nuxt:nodejs /app/apps/nuxt/.output ./apps/nuxt/.output
COPY --from=installer --chown=nuxt:nodejs /app/apps/nuxt/package.json ./apps/nuxt/package.json

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/nuxt/.output/server/index.mjs"]
