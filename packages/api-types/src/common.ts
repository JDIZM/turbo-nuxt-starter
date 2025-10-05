import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

/**
 * Common response wrapper schema
 */
export const ApiResponseSchema = z.object({
  success: z.boolean().openapi({ description: 'Whether the request was successful' }),
  message: z.string().optional().openapi({ description: 'Response message' }),
  data: z.unknown().optional().openapi({ description: 'Response data' }),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional()
    })
    .optional()
    .openapi({ description: 'Error details if success is false' })
})

export type ApiResponse<T = unknown> = {
  success: boolean
  message?: string
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * Pagination query parameters
 */
export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .openapi({ description: 'Page number', example: '1' }),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .openapi({ description: 'Items per page', example: '10' })
})

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

/**
 * Paginated response schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema).openapi({ description: 'Array of items' }),
    pagination: z
      .object({
        page: z.number().openapi({ description: 'Current page number' }),
        limit: z.number().openapi({ description: 'Items per page' }),
        total: z.number().openapi({ description: 'Total number of items' }),
        totalPages: z.number().openapi({ description: 'Total number of pages' })
      })
      .openapi({ description: 'Pagination metadata' })
  })

export type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * ID parameter schema
 */
export const IdParamSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({ description: 'Resource UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
})

export type IdParam = z.infer<typeof IdParamSchema>

/**
 * Error response helper
 */
export function errorResponse(code: string, message: string, details?: unknown): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}
