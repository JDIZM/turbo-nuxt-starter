# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate && npm install -g turbo

# Builder stage
FROM base AS builder

WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN pnpx turbo prune storybook --docker

# Installer stage
FROM base AS installer

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpx turbo build --filter=storybook

# Production runner with nginx
FROM nginx:alpine AS runner

# Copy built static files
COPY --from=installer /app/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
