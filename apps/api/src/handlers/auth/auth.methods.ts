import { logger } from "logger"
import { supabase } from "../../services/supabase.ts"

/**
 * Verify JWT token from Supabase Auth using getClaims()
 *
 * This method automatically adapts based on your Supabase key system:
 * - With asymmetric keys: Verifies locally using Web Crypto API (fast, secure)
 * - With symmetric keys: Makes network call to Auth server (slower, but safe)
 *
 * @param token - The JWT access token to verify
 * @returns The decoded token payload with 'sub' (user ID) or null if invalid
 */
export const verifyToken = async (
  token: string
): Promise<{
  sub: string
} | null> => {
  try {
    // Get claims - this uses Web Crypto API with asymmetric keys (fast)
    // or falls back to Auth server verification with symmetric keys
    // see https://supabase.com/blog/jwt-signing-keys#getting-the-most-benefit
    const { data, error } = await supabase.auth.getClaims(token)

    if (error || !data) {
      logger.warn({ error }, "Token verification failed via getClaims()")
      return null
    }

    // Extract user ID from JWT claims
    const sub = data.claims.sub as string

    if (!sub) {
      logger.warn("Token missing 'sub' claim")
      return null
    }

    return { sub }
  } catch (err) {
    logger.error({ error: err }, "Token validation failed")
    return null
  }
}
