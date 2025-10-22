import { z } from "zod"

/**
 * Schema for user signup request
 */
export const SignupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required")
})

/**
 * Schema for user login request
 */
export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required")
})
