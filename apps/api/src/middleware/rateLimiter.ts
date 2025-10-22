import { rateLimit } from "express-rate-limit"
import { logger } from "logger"
import { apiResponse } from "helpers"
import type { RateLimitRequestHandler } from "express-rate-limit"

export const createRateLimiter = (options: {
  windowMs: number
  max: number
  message: string
  skipSuccessfulRequests?: boolean
}): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: (req, res) => {
      logger.warn(
        {
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          path: req.path,
          method: req.method
        },
        "Rate limit exceeded"
      )

      const response = apiResponse.error(new Error(options.message))

      res.status(response.code).json(response)
    }
  })
}

// Standard rate limit for regular API operations
export const standardRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later."
})

// Stricter rate limit for authentication operations
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes for auth operations
  message: "Too many authentication attempts, please try again later."
})
