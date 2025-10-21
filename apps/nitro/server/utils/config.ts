/**
 * Server configuration
 * Centralizes environment variable access with validation
 * Note: .env is loaded in nitro.config.ts for monorepo compatibility
 */

const getJwtSecret = (): string => {
  const secret = process.env.SUPABASE_AUTH_JWT_SECRET
  const env = process.env.NODE_ENV || "development"

  if (!secret && env === "production") {
    throw new Error("SUPABASE_AUTH_JWT_SECRET is required in production")
  }

  // Only allow fallback in development
  return secret || "super-secret-jwt-token-with-at-least-32-characters-long"
}

/**
 * Get Supabase key - supports both new (2025+) and legacy formats
 * Priority: publishable_key > anon_key (for backward compatibility)
 */
const getSupabaseKey = (): string => {
  // Prefer new publishable key format (sb_publishable_*)
  if (process.env.SUPABASE_PUBLISHABLE_KEY) {
    return process.env.SUPABASE_PUBLISHABLE_KEY
  }

  // Fallback to legacy anon key (JWT format)
  return process.env.SUPABASE_ANON_KEY || ""
}

export const config = {
  env: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
  // Supabase configuration - supports both new and legacy key formats
  supabaseUrl: process.env.SUPABASE_URL || "http://localhost:54321",
  supabaseAnonKey: getSupabaseKey(),
  // New Supabase key system (2025+)
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  jwtSecret: getJwtSecret()
} as const

export type Config = typeof config
