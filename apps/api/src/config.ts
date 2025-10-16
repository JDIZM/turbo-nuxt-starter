import dotenv from "dotenv"

dotenv.config()

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.API_PORT || 3002,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL || "http://localhost:54321",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  jwtSecret:
    process.env.SUPABASE_AUTH_JWT_SECRET ||
    "super-secret-jwt-token-with-at-least-32-characters-long"
} as const

export type Config = typeof config
