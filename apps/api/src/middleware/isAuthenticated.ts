import type { Request, Response, NextFunction } from "express"
import { logger } from "logger"
import { HttpErrors, apiResponse } from "helpers"
import { verifyToken } from "../handlers/auth/auth.methods.ts"

/**
 * Middleware to verify JWT token from Supabase Auth
 * Extracts Bearer token from Authorization header and verifies it
 * Sets req.accountId with the user's ID from the token
 */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Extract "Bearer TOKEN"

  logger.debug({ msg: "isAuthenticated middleware called", authHeader, hasToken: !!token })

  if (!token) {
    logger.warn({ msg: "No token provided", path: req.path })
    const error = HttpErrors.Unauthorized("Authentication token required")
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  try {
    const verifiedToken = await verifyToken(token)

    if (!verifiedToken) {
      throw new Error("Invalid token")
    }

    const { sub } = verifiedToken
    logger.debug({ msg: `Verified user token for accountId: ${sub}` })

    // Attach user ID to request for use in route handlers
    req.accountId = sub

    next()
  } catch (err) {
    logger.error({ error: err }, "Token verification failed")
    const error = HttpErrors.Unauthorized("Invalid or expired token")
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }
}
