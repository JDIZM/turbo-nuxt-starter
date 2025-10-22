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
CORS_ORIGIN=http://localhost:3001
PORT=3004        # Development server port
#HOST=0.0.0.0    # Uncomment to bind to all interfaces (not recommended for local dev)

# Supabase Keys - Choose one option:

# Option 1: New key system (2025+) - Recommended for new projects
# SUPABASE_PUBLISHABLE_KEY=sb_publishable_*
# SUPABASE_SECRET_KEY=sb_secret_*

# Option 2: Legacy JWT keys - Still supported for local development
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_AUTH_JWT_SECRET=your-jwt-secret
```

**Supabase Key System:**

Run `supabase start` to get your local development keys. Supabase now supports two key formats:

1. **API Keys** (for SDK initialization):
   - New format: `sb_publishable_*` and `sb_secret_*`
   - Legacy format: `anon` and `service_role` (JWT-based)
   - Both formats are functionally equivalent
   - Config automatically prefers new keys but falls back to legacy

2. **JWT Signing System** (for token verification):
   - Old: Symmetric key (`JWT_SECRET` signs + verifies)
   - New: Asymmetric keys (private key signs, public key verifies)
   - **Benefit**: Local verification with `getClaims()` using Web Crypto API
   - This project uses `supabase.auth.getClaims()` which:
     - With asymmetric keys: Verifies locally (fast, secure, offline)
     - With symmetric keys: Falls back to Auth server call

**Learn More:**
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [JWT Signing Keys](https://supabase.com/blog/jwt-signing-keys)

**Note on Environment Variables in Monorepo:**

- Nitro's built-in .env loading looks for files at `process.cwd()`, which in a monorepo may be the repository root
- This project explicitly loads `apps/nitro/.env` in `nitro.config.ts` for monorepo compatibility
- All environment variables (SUPABASE\_\*, CORS_ORIGIN, etc.) are loaded from the app-specific `.env` file
- The duplicate `dotenv.config()` has been removed from runtime code to avoid conflicts

### Start Development Server

```bash
# Start on localhost:3004 (default)
pnpm dev

# Start and expose on network (use --host flag)
pnpm dev --host
```

Server runs on `http://localhost:3004/` by default (configurable via `PORT` in `.env`).
Use `--host` flag to expose on all network interfaces.

## API Documentation

Once the server is running, access the API documentation at:

- **Swagger UI**: http://localhost:3004/\_swagger
- **Scalar UI**: http://localhost:3004/\_scalar
- **OpenAPI JSON**: http://localhost:3004/\_openapi.json

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
    requestBody: {
      /* schema */
    },
    responses: {
      /* responses */
    }
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
