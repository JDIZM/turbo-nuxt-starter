import dotenv from "dotenv"

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

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.API_PORT || 3002,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL || "http://localhost:54321",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  jwtSecret: getJwtSecret()
} as const

export type Config = typeof config
