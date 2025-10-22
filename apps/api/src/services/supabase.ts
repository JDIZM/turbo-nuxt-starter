import { createClient } from "@supabase/supabase-js"
import { config } from "../config.ts"

/**
 * Supabase client for authentication and database operations
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
