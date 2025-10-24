# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk add --no-cache libc6-compat
RUN corepack enable && npm install -g turbo@^2.5.8

# Builder stage
FROM base AS builder

WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN pnpx turbo prune api --docker

# Installer stage
FROM base AS installer

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpx turbo build --filter=api

# Production runner
FROM base AS runner

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

USER express

EXPOSE 3002

COPY --from=installer --chown=express:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer --chown=express:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=express:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer --chown=express:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=express:nodejs /app/packages ./packages

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/api/dist/server.esm.js"]
