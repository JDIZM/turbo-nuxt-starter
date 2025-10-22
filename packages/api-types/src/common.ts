import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

/**
 * Error response schema - matches BLA-172 format from supabase-express-api
 */
export const ErrorResponseSchema = z.object({
  code: z.number().openapi({
    description: "HTTP status code",
    example: 404
  }),
  error: z.string().openapi({
    description: "Error code identifier",
    example: "NOT_FOUND"
  }),
  message: z.string().openapi({
    description: "Human-readable error message",
    example: "User not found"
  })
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

/**
 * Success response schema factory - matches BLA-172 format from supabase-express-api
 * @param dataSchema - Zod schema for the response data
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number().openapi({
      description: "HTTP status code",
      example: 200
    }),
    data: dataSchema.openapi({
      description: "Response data"
    }),
    message: z.string().openapi({
      description: "Success message",
      example: "Success"
    })
  })

export type SuccessResponse<T> = {
  code: number
  data: T
  message: string
}

/**
 * Pagination query parameters
 */
export const PaginationQuerySchema = z.object({
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

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

/**
 * Paginated response schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema).openapi({ description: "Array of items" }),
    pagination: z
      .object({
        page: z.number().openapi({ description: "Current page number" }),
        limit: z.number().openapi({ description: "Items per page" }),
        total: z.number().openapi({ description: "Total number of items" }),
        totalPages: z.number().openapi({ description: "Total number of pages" })
      })
      .openapi({ description: "Pagination metadata" })
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
    .openapi({ description: "Resource UUID", example: "123e4567-e89b-12d3-a456-426614174000" })
})

export type IdParam = z.infer<typeof IdParamSchema>
