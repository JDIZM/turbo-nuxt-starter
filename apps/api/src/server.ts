import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { randomUUID } from 'node:crypto'
import { router } from './routes/index.ts'
import type { Request, Response } from 'express'
import { apiResponse, HttpErrors } from 'helpers'
import { logger } from 'logger'
import { pinoHttp } from 'pino-http'

dotenv.config()

const app = express()
const port = process.env.PORT || 3002

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
  })
)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req: Request) => req.url === '/health'
    },
    genReqId: (req: Request) => req.headers['x-request-id'] || randomUUID(),
    customLogLevel: (_req: Request, res: Response, err?: Error) => {
      if (res.statusCode >= 500 || err) {
        return 'error'
      } else if (res.statusCode >= 400) {
        return 'warn'
      }
      return 'info'
    }
  })
)

// Routes
app.use('/api', router)

// Health check endpoint
app.get('/health', (req, res) => {
  const response = apiResponse.success(200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
  res.status(response.statusCode).json(response)
})

// 404 handler
app.use('*', (req, res) => {
  const error = HttpErrors.NotFound('The requested resource was not found')
  const response = apiResponse.error(error)
  res.status(response.statusCode).json(response)
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const response = apiResponse.error(err)
  res.status(response.statusCode).json(response)
})

app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`)
  console.log(`📋 Health check: http://localhost:${port}/health`)
})
