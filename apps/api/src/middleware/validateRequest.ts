import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { HttpErrors, apiResponse } from "helpers"
import { logger } from "logger"

interface ValidationSchemas {
  body?: z.ZodTypeAny
  params?: z.ZodTypeAny
  query?: z.ZodTypeAny
}

/**
 * Express type extensions for request validation
 * Using namespace is the correct TypeScript pattern for augmenting Express types
 */
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      /**
       * Validated request body data (set by validateRequest middleware)
       */
      validatedBody?: unknown
      /**
       * Validated request params data (set by validateRequest middleware)
       */
      validatedParams?: unknown
      /**
       * Validated request query data (set by validateRequest middleware)
       */
      validatedQuery?: unknown
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Middleware factory for validating Express requests with Zod schemas
 * Validates request body, params, and/or query parameters
 *
 * @example
 * const CreateUserSchema = z.object({ name: z.string(), email: z.string().email() })
 * router.post('/users', validateRequest({ body: CreateUserSchema }), (req, res) => {
 *   // Access validated data
 *   const data = req.validatedBody as z.infer<typeof CreateUserSchema>
 *   // Or use req.body directly (also contains validated data)
 *   const { name, email } = req.body
 * })
 */
export const validateRequest = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body if schema provided
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body)
        if (!bodyResult.success) {
          logger.warn({ error: bodyResult.error, path: req.path }, "Request body validation failed")
          const error = HttpErrors.BadRequest(
            `Invalid request body: ${bodyResult.error.issues[0]?.message || "validation failed"}`
          )
          const response = apiResponse.error(error)
          res.status(response.code).json(response)
          return
        }
        // Store validated body data
        req.validatedBody = bodyResult.data
        // Also replace req.body for convenience (req.body is 'any' in Express)
        req.body = bodyResult.data
      }

      // Validate request params if schema provided
      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params)
        if (!paramsResult.success) {
          logger.warn(
            { error: paramsResult.error, path: req.path },
            "Request params validation failed"
          )
          const error = HttpErrors.BadRequest(
            `Invalid request params: ${paramsResult.error.issues[0]?.message || "validation failed"}`
          )
          const response = apiResponse.error(error)
          res.status(response.code).json(response)
          return
        }
        // Store validated params data
        req.validatedParams = paramsResult.data
      }

      // Validate query parameters if schema provided
      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query)
        if (!queryResult.success) {
          logger.warn(
            { error: queryResult.error, path: req.path },
            "Request query validation failed"
          )
          const error = HttpErrors.BadRequest(
            `Invalid query parameters: ${queryResult.error.issues[0]?.message || "validation failed"}`
          )
          const response = apiResponse.error(error)
          res.status(response.code).json(response)
          return
        }
        // Store validated query data
        req.validatedQuery = queryResult.data
      }

      next()
    } catch (err) {
      logger.error({ error: err, path: req.path }, "Unexpected validation error")
      const error = HttpErrors.InternalError("Request validation failed")
      const response = apiResponse.error(error)
      res.status(response.code).json(response)
      return
    }
  }
}
