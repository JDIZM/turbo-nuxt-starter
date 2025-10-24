import { z } from "zod"

/**
 * Schema for validating UUID parameters
 */
export const UserParamsSchema = z.object({
  id: z.uuid("Invalid user ID format")
})

/**
 * Schema for updating user account
 */
export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  fullName: z.string().min(1).optional()
})
