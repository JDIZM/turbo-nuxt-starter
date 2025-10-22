import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

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

/**
 * Configuration schema - validates environment variables at startup
 */
const configSchema = z.object({
  env: z.enum(["development", "production", "test"]).default("development"),
  port: z.coerce.number().int().positive().default(3002),
  corsOrigin: z.string().default("http://localhost:3001"),
  supabaseUrl: z.url(),
  supabaseAnonKey: z.string().min(1, "SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY required"),
  supabasePublishableKey: z.string().optional(),
  supabaseSecretKey: z.string().optional(),
  jwtSecret: z.string().min(32, "JWT secret must be at least 32 characters")
})

/**
 * Transform and validate CORS origins
 * Accepts comma-separated list of origins
 */
const getCorsOrigins = (corsOriginString: string): string | string[] => {
  const origins = corsOriginString.split(",").map((origin) => origin.trim())

  // If single origin, return as string (for Express CORS)
  if (origins.length === 1) {
    return origins[0]
  }

  // Multiple origins, return as array
  return origins
}

/**
 * Validated configuration object
 * Throws error at startup if environment variables are invalid
 */
const parseConfig = () => {
  const rawConfig = {
    env: process.env.NODE_ENV || "development",
    port: process.env.API_PORT || 3002,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
    supabaseUrl: process.env.SUPABASE_URL || "http://localhost:54321",
    supabaseAnonKey: getSupabaseKey(),
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    jwtSecret: getJwtSecret()
  }

  const result = configSchema.safeParse(rawConfig)

  if (!result.success) {
    console.error("❌ Invalid configuration:")
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
    })
    throw new Error("Configuration validation failed. Check environment variables.")
  }

  return {
    ...result.data,
    // Parse CORS origins for Express (string | string[])
    corsOrigins: getCorsOrigins(result.data.corsOrigin)
  }
}

export const config = parseConfig()
export type Config = typeof config
