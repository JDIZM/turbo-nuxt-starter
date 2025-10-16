import type { Request, Response } from "express"
import { apiResponse, HttpErrors, asyncHandler } from "helpers"
import { logger } from "logger"
import { supabase } from "../../services/supabase.ts"
import { createDbAccount } from "../accounts/accounts.methods.ts"
import type { User } from "@supabase/supabase-js"
import { z } from "zod"

const SignupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  fullName: z.string().min(1)
})

const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

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
 */
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validation = SignupRequestSchema.safeParse(req.body)

  if (!validation.success) {
    const error = HttpErrors.BadRequest(`Invalid request data: ${validation.error.message}`)
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  const { email, password, fullName } = validation.data

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
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validation = LoginRequestSchema.safeParse(req.body)

  if (!validation.success) {
    const error = HttpErrors.BadRequest(`Invalid request data: ${validation.error.message}`)
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  const { email, password } = validation.data

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
