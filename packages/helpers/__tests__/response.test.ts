import { describe, it, expect, vi, beforeEach } from "vitest"
import { apiResponse } from "../src/response"
import { HttpErrors, HttpStatusCode, ErrorCode } from "../src/HttpError"

// Mock logger
vi.mock("logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

import { logger } from "logger"

describe("apiResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("success", () => {
    it("should create success response with status code and data", () => {
      const result = apiResponse.success(200, { user: "test" }, "User created")

      expect(result).toEqual({
        code: 200,
        data: { user: "test" },
        message: "User created"
      })
    })

    it("should use default message if not provided", () => {
      const result = apiResponse.success(200, { data: "test" })

      expect(result.message).toBe("Success")
    })

    it("should accept numeric status code", () => {
      const result = apiResponse.success(200, { data: "test" })

      expect(result.code).toBe(200)
    })

    it("should log with info level", () => {
      apiResponse.success(200, { data: "test" }, "Success message")

      expect(logger.info).toHaveBeenCalledWith({
        code: 200,
        msg: "Success message"
      })
    })
  })

  describe("error", () => {
    describe("with HttpError", () => {
      it("should create error response from HttpError", () => {
        const httpError = HttpErrors.NotFound("User")
        const result = apiResponse.error(httpError)

        expect(result).toEqual({
          code: HttpStatusCode.NOT_FOUND,
          error: ErrorCode.NOT_FOUND,
          message: "User not found"
        })
      })

      it("should log with warn level for 4xx errors", () => {
        const httpError = HttpErrors.BadRequest("Invalid input")
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalledWith({
          code: HttpStatusCode.BAD_REQUEST,
          error: ErrorCode.BAD_REQUEST,
          msg: "Invalid input"
        })
      })

      it("should log with error level for 5xx errors", () => {
        const httpError = HttpErrors.InternalError("Server error")
        apiResponse.error(httpError)

        expect(logger.error).toHaveBeenCalledWith({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: ErrorCode.INTERNAL_SERVER_ERROR,
          msg: "Server error"
        })
      })

      it("should use warn for 401 Unauthorized", () => {
        const httpError = HttpErrors.Unauthorized()
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalled()
        expect(logger.error).not.toHaveBeenCalled()
      })

      it("should use warn for 403 Forbidden", () => {
        const httpError = HttpErrors.Forbidden()
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalled()
        expect(logger.error).not.toHaveBeenCalled()
      })

      it("should use warn for 404 Not Found", () => {
        const httpError = HttpErrors.NotFound()
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalled()
        expect(logger.error).not.toHaveBeenCalled()
      })

      it("should use warn for 422 Unprocessable Entity", () => {
        const httpError = HttpErrors.UnprocessableEntity()
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalled()
        expect(logger.error).not.toHaveBeenCalled()
      })

      it("should use warn for 429 Too Many Requests", () => {
        const httpError = HttpErrors.TooManyRequests()
        apiResponse.error(httpError)

        expect(logger.warn).toHaveBeenCalled()
        expect(logger.error).not.toHaveBeenCalled()
      })
    })

    describe("with generic Error", () => {
      it("should create error response from generic Error with default 500 status", () => {
        const genericError = new Error("Something went wrong")
        const result = apiResponse.error(genericError)

        expect(result).toEqual({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: ErrorCode.INTERNAL_SERVER_ERROR,
          message: "Something went wrong"
        })
      })

      it("should accept custom status code for generic Error", () => {
        const genericError = new Error("Bad request")
        const result = apiResponse.error(genericError, HttpStatusCode.BAD_REQUEST)

        expect(result).toEqual({
          code: HttpStatusCode.BAD_REQUEST,
          error: ErrorCode.BAD_REQUEST,
          message: "Bad request"
        })
      })

      it("should log with error level for generic Error with default 500", () => {
        const genericError = new Error("Something went wrong")
        apiResponse.error(genericError)

        expect(logger.error).toHaveBeenCalledWith({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: ErrorCode.INTERNAL_SERVER_ERROR,
          msg: "Something went wrong"
        })
      })

      it("should log with warn level for generic Error with 4xx status", () => {
        const genericError = new Error("Bad request")
        apiResponse.error(genericError, HttpStatusCode.BAD_REQUEST)

        expect(logger.warn).toHaveBeenCalledWith({
          code: HttpStatusCode.BAD_REQUEST,
          error: ErrorCode.BAD_REQUEST,
          msg: "Bad request"
        })
      })
    })
  })
})
