import { logger } from "logger"
import { verifyToken } from "../utils/auth"

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to context
 * Only runs on routes that require authentication
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Skip auth for public routes
  const publicRoutes = [
    "/health",
    "/api/auth/login",
    "/api/auth/signup",
    "/_swagger",
    "/_scalar",
    "/_openapi.json"
  ]

  if (publicRoutes.some((route) => path.startsWith(route))) {
    return
  }

  // Skip auth for non-API routes
  if (!path.startsWith("/api/")) {
    return
  }

  // Verify token and attach user to context
  try {
    const user = await verifyToken(event)
    event.context.user = user
  } catch (error) {
    // Auth middleware doesn't throw - individual routes decide if auth is required
    // This allows optional auth on some routes
    event.context.user = null
    logger.warn({ err: error }, "Authentication failed in auth middleware")
  }
})
