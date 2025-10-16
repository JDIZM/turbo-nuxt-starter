import { describe, it, expect } from "vitest"
import { HttpError, HttpErrors, HttpStatusCode, ErrorCode } from "../src/HttpError"

describe("HttpError", () => {
  describe("HttpStatusCode const", () => {
    it("should have correct status code values", () => {
      expect(HttpStatusCode.BAD_REQUEST).toBe(400)
      expect(HttpStatusCode.UNAUTHORIZED).toBe(401)
      expect(HttpStatusCode.FORBIDDEN).toBe(403)
      expect(HttpStatusCode.NOT_FOUND).toBe(404)
      expect(HttpStatusCode.CONFLICT).toBe(409)
      expect(HttpStatusCode.UNPROCESSABLE_ENTITY).toBe(422)
      expect(HttpStatusCode.TOO_MANY_REQUESTS).toBe(429)
      expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500)
    })
  })

  describe("ErrorCode const", () => {
    it("should have correct error code strings", () => {
      expect(ErrorCode.BAD_REQUEST).toBe("BAD_REQUEST")
      expect(ErrorCode.UNAUTHORIZED).toBe("UNAUTHORIZED")
      expect(ErrorCode.NOT_FOUND).toBe("NOT_FOUND")
      expect(ErrorCode.INTERNAL_SERVER_ERROR).toBe("INTERNAL_SERVER_ERROR")
    })
  })

  describe("HttpError class", () => {
    it("should create error with status code and message", () => {
      const error = new HttpError(HttpStatusCode.BAD_REQUEST, "Invalid input")

      expect(error.code).toBe(400)
      expect(error.message).toBe("Invalid input")
      expect(error.error).toBe(ErrorCode.BAD_REQUEST)
      expect(error.name).toBe("HttpError")
    })

    it("should accept custom error code", () => {
      const error = new HttpError(
        HttpStatusCode.BAD_REQUEST,
        "Invalid input",
        ErrorCode.VALIDATION_FAILED
      )

      expect(error.code).toBe(400)
      expect(error.error).toBe(ErrorCode.VALIDATION_FAILED)
    })

    it("should use default code if not provided", () => {
      const error = new HttpError(HttpStatusCode.NOT_FOUND, "Not found")

      expect(error.error).toBe(ErrorCode.NOT_FOUND)
    })

    it("should return UNKNOWN_ERROR for unrecognized status codes", () => {
      const error = new HttpError(418 as HttpStatusCode, "I am a teapot")

      expect(error.error).toBe(ErrorCode.UNKNOWN_ERROR)
    })

    it("should convert to response object", () => {
      const error = new HttpError(HttpStatusCode.UNAUTHORIZED, "Unauthorized access")
      const response = error.toResponse()

      expect(response).toEqual({
        code: 401,
        error: ErrorCode.UNAUTHORIZED,
        message: "Unauthorized access"
      })
    })
  })

  describe("HttpErrors factory functions", () => {
    describe("4xx errors", () => {
      it("should create BadRequest error", () => {
        const error = HttpErrors.BadRequest("Custom message")

        expect(error.code).toBe(HttpStatusCode.BAD_REQUEST)
        expect(error.error).toBe(ErrorCode.BAD_REQUEST)
        expect(error.message).toBe("Custom message")
      })

      it("should create InvalidInput error", () => {
        const error = HttpErrors.InvalidInput()

        expect(error.code).toBe(HttpStatusCode.BAD_REQUEST)
        expect(error.error).toBe(ErrorCode.INVALID_INPUT)
        expect(error.message).toBe("Invalid input provided")
      })

      it("should create ValidationFailed error", () => {
        const error = HttpErrors.ValidationFailed()

        expect(error.code).toBe(HttpStatusCode.BAD_REQUEST)
        expect(error.error).toBe(ErrorCode.VALIDATION_FAILED)
      })

      it("should create MissingParameter error with parameter name", () => {
        const error = HttpErrors.MissingParameter("userId")

        expect(error.code).toBe(HttpStatusCode.BAD_REQUEST)
        expect(error.error).toBe(ErrorCode.MISSING_PARAMETER)
        expect(error.message).toBe("Missing required parameter: userId")
      })

      it("should create Unauthorized error", () => {
        const error = HttpErrors.Unauthorized()

        expect(error.code).toBe(HttpStatusCode.UNAUTHORIZED)
        expect(error.error).toBe(ErrorCode.UNAUTHORIZED)
      })

      it("should create InvalidToken error", () => {
        const error = HttpErrors.InvalidToken()

        expect(error.code).toBe(HttpStatusCode.UNAUTHORIZED)
        expect(error.error).toBe(ErrorCode.INVALID_TOKEN)
      })

      it("should create Forbidden error", () => {
        const error = HttpErrors.Forbidden()

        expect(error.code).toBe(HttpStatusCode.FORBIDDEN)
        expect(error.error).toBe(ErrorCode.FORBIDDEN)
      })

      it("should create InsufficientPermissions error", () => {
        const error = HttpErrors.InsufficientPermissions()

        expect(error.code).toBe(HttpStatusCode.FORBIDDEN)
        expect(error.error).toBe(ErrorCode.INSUFFICIENT_PERMISSIONS)
      })

      it("should create NotFound error with resource name", () => {
        const error = HttpErrors.NotFound("User")

        expect(error.code).toBe(HttpStatusCode.NOT_FOUND)
        expect(error.error).toBe(ErrorCode.NOT_FOUND)
        expect(error.message).toBe("User not found")
      })

      it("should create Conflict error", () => {
        const error = HttpErrors.Conflict()

        expect(error.code).toBe(HttpStatusCode.CONFLICT)
        expect(error.error).toBe(ErrorCode.CONFLICT)
      })

      it("should create UnprocessableEntity error", () => {
        const error = HttpErrors.UnprocessableEntity()

        expect(error.code).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY)
        expect(error.error).toBe(ErrorCode.UNPROCESSABLE_ENTITY)
      })

      it("should create TooManyRequests error", () => {
        const error = HttpErrors.TooManyRequests()

        expect(error.code).toBe(HttpStatusCode.TOO_MANY_REQUESTS)
        expect(error.error).toBe(ErrorCode.TOO_MANY_REQUESTS)
      })
    })

    describe("5xx errors", () => {
      it("should create InternalError error", () => {
        const error = HttpErrors.InternalError()

        expect(error.code).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR)
        expect(error.error).toBe(ErrorCode.INTERNAL_SERVER_ERROR)
        expect(error.message).toBe("Internal server error")
      })

      it("should create DatabaseError error", () => {
        const error = HttpErrors.DatabaseError()

        expect(error.code).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR)
        expect(error.error).toBe(ErrorCode.DATABASE_ERROR)
        expect(error.message).toBe("Database operation failed")
      })
    })
  })
})
