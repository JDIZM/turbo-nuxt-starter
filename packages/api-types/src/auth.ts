import { z } from 'zod'

/**
 * Login request schema
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({ description: 'User email address', example: 'user@example.com' }),
  password: z.string().min(1).openapi({ description: 'User password', example: 'password123' })
})

export type Login = z.infer<typeof LoginSchema>

/**
 * Register request schema
 */
export const RegisterSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({ description: 'User email address', example: 'user@example.com' }),
  name: z.string().min(1).max(255).openapi({ description: 'User full name', example: 'John Doe' }),
  password: z
    .string()
    .min(8)
    .max(100)
    .openapi({ description: 'User password (min 8 characters)', example: 'securePassword123' })
})

export type Register = z.infer<typeof RegisterSchema>

/**
 * Auth token response schema
 */
export const AuthTokenSchema = z.object({
  accessToken: z.string().openapi({ description: 'JWT access token' }),
  refreshToken: z.string().optional().openapi({ description: 'JWT refresh token' }),
  expiresIn: z.number().openapi({ description: 'Token expiration time in seconds', example: 3600 }),
  tokenType: z.string().default('Bearer').openapi({ description: 'Token type', example: 'Bearer' })
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

/**
 * Auth response schema (token + user)
 */
export const AuthResponseSchema = z.object({
  token: AuthTokenSchema,
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string()
  })
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

/**
 * Refresh token request schema
 */
export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .openapi({ description: 'Refresh token to exchange for new access token' })
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>

/**
 * JWT payload schema
 */
export const JWTPayloadSchema = z.object({
  sub: z.string().uuid().openapi({ description: 'User ID (subject)' }),
  email: z.string().email().openapi({ description: 'User email' }),
  iat: z.number().openapi({ description: 'Issued at timestamp' }),
  exp: z.number().openapi({ description: 'Expiration timestamp' })
})

export type JWTPayload = z.infer<typeof JWTPayloadSchema>
