import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

/**
 * User schema for database entity
 */
export const UserSchema = z.object({
  id: z.uuid().openapi({ description: "User unique identifier" }),
  email: z.email().openapi({ description: "User email address", example: "user@example.com" }),
  name: z.string().min(1).max(255).openapi({ description: "User full name", example: "John Doe" }),
  avatar: z
    .string()
    .url()
    .nullable()
    .openapi({ description: "User avatar URL", example: "https://example.com/avatar.jpg" }),
  createdAt: z.date().openapi({ description: "Account creation timestamp" }),
  updatedAt: z.date().openapi({ description: "Last update timestamp" })
})

export type User = z.infer<typeof UserSchema>

/**
 * Create user request schema
 */
export const CreateUserSchema = z.object({
  email: z.email().openapi({ description: "User email address", example: "user@example.com" }),
  name: z.string().min(1).max(255).openapi({ description: "User full name", example: "John Doe" }),
  password: z
    .string()
    .min(8)
    .max(100)
    .openapi({ description: "User password (min 8 characters)", example: "securePassword123" }),
  avatar: z
    .string()
    .url()
    .optional()
    .openapi({ description: "User avatar URL", example: "https://example.com/avatar.jpg" })
})

export type CreateUser = z.infer<typeof CreateUserSchema>

/**
 * Update user request schema
 */
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(255)
    .optional()
    .openapi({ description: "User full name", example: "John Doe" }),
  avatar: z
    .string()
    .url()
    .nullable()
    .optional()
    .openapi({ description: "User avatar URL", example: "https://example.com/avatar.jpg" })
})

export type UpdateUser = z.infer<typeof UpdateUserSchema>

/**
 * User response schema (without sensitive data)
 */
export const UserResponseSchema = UserSchema

export type UserResponse = z.infer<typeof UserResponseSchema>

/**
 * User list query parameters
 */
export const UserListQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .openapi({ description: "Search by name or email", example: "john" }),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .openapi({ description: "Page number", example: "1" }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .openapi({ description: "Items per page", example: "10" })
})

export type UserListQuery = z.infer<typeof UserListQuerySchema>
