import type { Request, Response } from "express"
import { apiResponse, HttpErrors, asyncHandler } from "helpers"
import { logger } from "logger"
import { supabase } from "../../services/supabase.ts"
import { createDbAccount } from "../accounts/accounts.methods.ts"
import type { User } from "@supabase/supabase-js"
import type { SignupRequestSchema, LoginRequestSchema } from "../../schemas/auth.ts"
import type { z } from "zod"

/**
 * Sign up with Supabase Auth
 * Exported for use in seed scripts
 */
export async function signUpWithSupabase(email: string, password: string): Promise<User | Error> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error || !data?.user) {
    logger.error({ error }, "Unable to sign up with Supabase")
    return new Error("Unable to sign up")
  }

  return data.user
}

/**
 * POST /auth/signup
 * Create new user in Supabase Auth and sync to accounts table
 * NOTE: Request body is validated by validateRequest middleware
 */
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Body is already validated by validateRequest middleware
  const { email, password, fullName } = req.body as z.infer<typeof SignupRequestSchema>

  // Create user in Supabase Auth
  const user = await signUpWithSupabase(email, password)

  if (!user || user instanceof Error) {
    // Don't expose the original error to the client (security risk)
    const error = HttpErrors.Unauthorized("Unable to sign up")
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  // Create account record in database using Supabase Auth user ID
  const dbAccountId = await createDbAccount({
    uuid: user.id, // Use Supabase Auth UUID
    email,
    fullName
  })

  const response = apiResponse.success(200, {
    accountId: dbAccountId,
    message: "Signup successful"
  })

  res.status(response.code).json(response)
})

/**
 * POST /auth/login
 * Sign in with Supabase Auth
 * Returns access token and user data
 * NOTE: Request body is validated by validateRequest middleware
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Body is already validated by validateRequest middleware
  const { email, password } = req.body as z.infer<typeof LoginRequestSchema>

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    // Don't expose the original error to the client (security risk)
    logger.error({ error }, "Unable to sign in")
    const httpError = HttpErrors.Unauthorized("Invalid credentials")
    const response = apiResponse.error(httpError)
    res.status(response.code).json(response)
    return
  }

  const response = apiResponse.success(200, {
    user: data.user,
    session: data.session,
    message: "Sign in successful"
  })

  res.status(response.code).json(response)
})
