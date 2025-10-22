import { createClient } from "@supabase/supabase-js"
import type { H3Event } from "h3"
import { HttpErrors } from "helpers"
import { config } from "./config"

// Initialize Supabase client
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)

/**
 * Extract and verify JWT token from Authorization header using getClaims()
 *
 * This method automatically adapts based on your Supabase key system:
 * - With asymmetric keys: Verifies locally using Web Crypto API (fast, secure)
 * - With symmetric keys: Makes network call to Auth server (slower, but safe)
 */
export async function verifyToken(event: H3Event): Promise<{
  userId: string
  email: string
}> {
  const authHeader = getHeader(event, "authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw HttpErrors.Unauthorized("Missing or invalid authorization header")
  }

  const token = authHeader.substring(7)

  try {
    // Get claims - this uses Web Crypto API with asymmetric keys (fast)
    // or falls back to Auth server verification with symmetric keys
    const { data, error } = await supabase.auth.getClaims(token)

    if (error || !data) {
      throw HttpErrors.Unauthorized("Token verification failed")
    }

    // Extract user ID and email from JWT claims
    const userId = data.claims.sub as string
    const email = data.claims.email as string

    if (!userId || !email) {
      throw HttpErrors.Unauthorized("Invalid token claims")
    }

    return {
      userId,
      email
    }
  } catch (_err) {
    throw HttpErrors.Unauthorized("Invalid or expired token")
  }
}

/**
 * Get current user from request
 * Used in protected routes
 */
export async function getCurrentUser(event: H3Event) {
  return await verifyToken(event)
}
