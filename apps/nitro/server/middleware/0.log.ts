import { createLogger } from "logger"

const logger = createLogger()

/**
 * Structured logging middleware using Pino
 * Logs all incoming requests and responses
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const method = event.method
  const url = getRequestURL(event)

  try {
    // Log incoming request
    logger.info({
      type: "request",
      method,
      url: url.pathname,
      ip: getRequestIP(event)
    })

    // Wait for response (this doesn't block the request)
    event.node.res.on("finish", () => {
      const duration = Date.now() - startTime
      const statusCode = event.node.res.statusCode

      logger.info({
        type: "response",
        method,
        url: url.pathname,
        statusCode,
        duration: `${duration}ms`
      })
    })
  } catch (error) {
    logger.error({
      type: "error",
      method,
      url: url.pathname,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})
