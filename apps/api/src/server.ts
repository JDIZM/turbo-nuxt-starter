import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { randomUUID } from "node:crypto"
import { router } from "./routes/index.ts"
import { setupSwagger } from "./docs/swagger.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import { standardRateLimit } from "./middleware/rateLimiter.ts"
import type { Request, Response } from "express"
import { apiResponse, HttpErrors } from "helpers"
import { logger } from "logger"
import { pinoHttp } from "pino-http"
import { config } from "./config.ts"

dotenv.config()

const app = express()
const port = config.port

// Security middleware
app.use(helmet())

// Cookie parser middleware
app.use(cookieParser())

// CORS configuration - supports single origin or multiple origins
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true
  })
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Apply standard rate limiting to all routes
app.use(standardRateLimit)

// Request logging middleware
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req: Request) => req.url === "/health"
    },
    genReqId: (req: Request) => req.headers["x-request-id"] || randomUUID(),
    customLogLevel: (_req: Request, res: Response, err?: Error) => {
      if (res.statusCode >= 500 || err) {
        return "error"
      } else if (res.statusCode >= 400) {
        return "warn"
      }
      return "info"
    }
  })
)

// Setup Swagger/OpenAPI documentation
setupSwagger(app)

// Routes
app.use("/api", router)

// Health check endpoint
app.get("/health", (req, res) => {
  const response = apiResponse.success(200, {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  })
  res.status(response.code).json(response)
})

// 404 handler
app.use("*", (req, res) => {
  const error = HttpErrors.NotFound("The requested resource was not found")
  const response = apiResponse.error(error)
  res.status(response.code).json(response)
})

// Global error handling middleware (must be last)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`)
  console.log(`📋 Health check: http://localhost:${port}/health`)
  if (process.env.NODE_ENV !== "production") {
    console.log(`📚 API docs: http://localhost:${port}/docs`)
    console.log(`📄 OpenAPI spec: http://localhost:${port}/openapi.json`)
  }
})
