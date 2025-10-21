import { config } from "../utils/config"

/**
 * Security middleware - adds security headers and handles CORS
 * Runs first (0. prefix) to protect all routes
 */
export default defineEventHandler((event) => {
  // Security Headers (similar to Helmet.js)
  setResponseHeaders(event, {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  })

  // CORS Headers
  const origin = getHeader(event, "origin")
  const allowedOrigins = config.corsOrigin.split(",")

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeader(event, "Access-Control-Allow-Origin", origin)
    setResponseHeader(event, "Access-Control-Allow-Credentials", "true")
    setResponseHeader(
      event,
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )
    setResponseHeader(
      event,
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )
  }

  // Handle preflight requests
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})
