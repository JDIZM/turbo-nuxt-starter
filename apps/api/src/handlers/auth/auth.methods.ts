import jwt from "jsonwebtoken"
import { logger } from "logger"
import { config } from "../../config.ts"

/**
 * Verify JWT token from Supabase Auth
 * @param token - The JWT access token to verify
 * @returns The decoded token payload with 'sub' (user ID) or null if invalid
 */
export const verifyToken = async (
  token: string
): Promise<{
  sub: string
} | null> => {
  try {
    return jwt.verify(token, config.jwtSecret) as { sub: string }
  } catch (err) {
    logger.error({ error: err }, "Token validation failed")
    return null
  }
}
