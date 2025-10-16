import { logger } from "logger"
import { HttpError, HttpStatusCode } from "./HttpError.ts"
import type { ErrorResponse, SuccessResponse } from "api-types"

export type ResponseType<T> = ErrorResponse | SuccessResponse<T>

/**
 * API response helper with error and success methods
 *
 * @example success response
 * const response = apiResponse.success(200, { data: "data" }, "Success");
 *
 * @example error response with HttpError
 * const response = apiResponse.error(HttpErrors.NotFound('User'));
 *
 * @example error response with generic Error
 * const response = apiResponse.error(new Error("error"), HttpStatusCode.INTERNAL_SERVER_ERROR);
 */
export const apiResponse = {
  /**
   * Create error response from HttpError or generic Error
   * Uses warn for 4xx (client errors), error for 5xx (server errors)
   */
  error: (error: HttpError | Error, statusCode?: HttpStatusCode): ErrorResponse => {
    if (error instanceof HttpError) {
      // Use warn for 4xx, error for 5xx
      const logLevel = error.code >= 500 ? "error" : "warn"
      logger[logLevel]({ code: error.code, error: error.error, msg: error.message })
      return error.toResponse()
    }

    // Fallback for generic Error
    const code = statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR
    const httpError = new HttpError(code, error.message)
    const logLevel = httpError.code >= 500 ? "error" : "warn"
    logger[logLevel]({
      code: httpError.code,
      error: httpError.error,
      msg: httpError.message
    })
    return httpError.toResponse()
  },

  /**
   * Create success response
   */
  success: <T>(code: HttpStatusCode | number, data: T, message = "Success"): SuccessResponse<T> => {
    logger.info({ code, msg: message })
    return {
      code,
      data,
      message
    }
  }
} as const
