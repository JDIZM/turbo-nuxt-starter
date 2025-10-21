# Express API

A modern Express.js API server with TypeScript support, built as part of the Turbo Nuxt monorepo.

## Features

- 🚀 **Express.js** with TypeScript
- 🔒 **Security** with Helmet and CORS
- 🏗️ **Modular routing** structure
- 🔧 **Environment configuration** with dotenv
- 🧹 **Code quality** with ESLint and Prettier
- 🔥 **Hot reload** in development

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (recommended package manager)

### Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3002`

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## API Endpoints

### Health Check

- `GET /health` - Server health status

### API Routes

- `GET /api` - API information
- `GET /api/users` - Example users endpoint

## Project Structure

```
apps/api/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware (future)
│   └── server.ts        # Main server file
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── .env.example
```

## Environment Variables

See `.env.example` for all available environment variables:

- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin (default: http://localhost:3001)

## Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and use in `src/routes/index.ts`
3. The route will be automatically available under `/api/your-route`

Example:

```typescript
// src/routes/posts.ts
import { Router } from "express"

const postsRouter = Router()

postsRouter.get("/", (req, res) => {
  res.json({ posts: [] })
})

export { postsRouter }
```

```typescript
// src/routes/index.ts
import { postsRouter } from "./posts"

router.use("/posts", postsRouter)
```
