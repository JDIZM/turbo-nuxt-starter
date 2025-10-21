import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"
import type { H3Event } from "h3"
import { HttpErrors } from "helpers"
import { config } from "./config"

// Initialize Supabase client
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)

/**
 * Extract and verify JWT token from Authorization header
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
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: string
      email: string
    }

    return {
      userId: decoded.sub,
      email: decoded.email
    }
  } catch {
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
