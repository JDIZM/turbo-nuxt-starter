import type { NextFunction, Request, Response } from "express"
import { HttpStatusCode, apiResponse } from "helpers"
import { logger } from "logger"

/**
 * Global error handling middleware
 * Catches all errors thrown in the application and returns standardized error responses
 *
 * @example
 * // In server.ts (must be last middleware):
 * app.use(errorHandler)
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error for monitoring
  logger.error({ err }, "Unhandled error")

  // Optional: Integrate with Sentry for error tracking
  // import * as Sentry from "@sentry/node"
  // Sentry.captureException(err)

  // Use apiResponse helper to format error response
  // Falls back to INTERNAL_SERVER_ERROR if error doesn't have a status code
  const response = apiResponse.error(err, HttpStatusCode.INTERNAL_SERVER_ERROR)

  res.status(response.code).send(response)
}
