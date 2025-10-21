# Nitro Server

A production-ready Nitro server with authentication, database integration, and comprehensive API documentation.

## Features

- 🚀 **Nitro Framework** - Modern server framework with edge/serverless support
- 🔒 **Security** - Security headers, CORS, rate limiting
- 🔐 **Authentication** - JWT authentication with Supabase
- 📊 **Database** - PostgreSQL with Drizzle ORM
- 📝 **API Documentation** - Auto-generated OpenAPI/Swagger documentation
- 🏗️ **File-based Routing** - Automatic route registration
- 📦 **Shared Packages** - Uses workspace packages for types, helpers, logging

## Prerequisites

- Node.js >= 20
- pnpm (package manager)
- Supabase (local or cloud)

## Development

### Environment Setup

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
NODE_ENV=development
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_AUTH_JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3001
```

### Start Development Server

```bash
pnpm dev
```

Server runs on port `3004` (configurable via `NITRO_PORT` environment variable).

## API Documentation

Once the server is running, access the API documentation at:

- **Swagger UI**: http://localhost:3004/_swagger
- **Scalar UI**: http://localhost:3004/_scalar
- **OpenAPI JSON**: http://localhost:3004/_openapi.json

## Available Endpoints

### Health

- `GET /health` - Server health check

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

### User

- `GET /api/me` - Get current user (protected)
- `GET /user` - List all users
- `GET /user/:id` - Get user by ID

## Project Structure

```
apps/nitro/
├── server/
│   ├── routes/           # API routes (file-based routing)
│   │   ├── health.get.ts
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup.post.ts
│   │   │   │   └── login.post.ts
│   │   │   └── me.get.ts
│   │   └── user/
│   │       ├── index.get.ts
│   │       └── [id].get.ts
│   ├── middleware/       # Middleware (numbered for order)
│   │   ├── 0.security.ts    # Security headers + CORS
│   │   ├── 1.rateLimit.ts   # Rate limiting
│   │   ├── log.ts           # Request/response logging
│   │   └── auth.ts          # JWT verification
│   └── utils/            # Utility functions
│       ├── config.ts        # Configuration
│       └── auth.ts          # Auth helpers
├── nitro.config.ts       # Nitro configuration
└── package.json          # Dependencies
```

## Middleware

Middleware runs automatically in numbered order:

1. **0.security.ts** - Adds security headers and handles CORS
2. **1.rateLimit.ts** - Rate limiting (100 req/15min per IP)
3. **log.ts** - Structured logging with Pino
4. **auth.ts** - JWT verification (skips public routes)

## OpenAPI Annotations

Routes use `defineRouteMeta` to add OpenAPI documentation:

```typescript
export default defineEventHandler((event) => {
  // Route handler
})

defineRouteMeta({
  openAPI: {
    tags: ["Authentication"],
    summary: "Create new account",
    description: "Register a new user",
    requestBody: { /* schema */ },
    responses: { /* responses */ }
  }
})
```

## Port Configuration

The server port is configured via environment variables:

- **Environment Variable**: `PORT` or `NITRO_PORT`
- **Default**: 3004
- **Documentation**: https://nitro.unjs.io/deploy/node

Set in package.json script:

```json
{
  "scripts": {
    "dev": "PORT=${NITRO_PORT:-3004} nitro dev"
  }
}
```

## Scripts

- `pnpm dev` - Start development server (port 3004)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript type checking

## Workspace Dependencies

This app uses shared packages from the monorepo:

- **api-types** - Zod schemas and TypeScript types
- **db-schema** - Drizzle ORM schema and database utilities
- **helpers** - HttpError class, apiResponse helper
- **logger** - Pino logger factory

## Comparison with Express API

### Advantages of Nitro

✅ **Simpler**: File-based routing (no manual registration)
✅ **Faster**: Optimized for edge/serverless deployment
✅ **Built-in OpenAPI**: No extra libraries needed
✅ **Type-safe**: Better TypeScript inference with h3
✅ **Modern**: Uses Web standards (fetch, Response, etc.)

### When to Use Express

- Need more mature ecosystem/plugins
- Prefer imperative route registration
- Team has Express expertise

Both servers share the same workspace packages and authentication logic!

## Learn More

- [Nitro Quick Start](https://nitro.unjs.io/guide#quick-start)
- [Nitro Config Documentation](https://nitro.build/config)
- [Nitro Routing Guide](https://nitro.build/guide/routing)
