import { Router } from "express"
import { HttpErrors, HttpStatusCode, apiResponse, asyncHandler } from "helpers"
import { isAuthenticated } from "../middleware/isAuthenticated.ts"
import { authRateLimit } from "../middleware/rateLimiter.ts"
import { signup, login } from "../handlers/auth/auth.handlers.ts"
import { getMe } from "../handlers/me/index.ts"

const router = Router()

// Public routes
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const response = apiResponse.success(HttpStatusCode.OK, {
      message: "Welcome to the Turbo Nuxt API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        api: "/api",
        auth: "/api/auth",
        me: "/api/me (requires authentication)"
      }
    })
    res.status(response.code).json(response)
  })
)

// Auth routes (public) with stricter rate limiting
router.post("/auth/signup", authRateLimit, signup)
router.post("/auth/login", authRateLimit, login)

// Protected routes (require authentication)
router.get("/me", isAuthenticated, getMe)

router.get(
  "/users",
  // Uncomment to add authentication: isAuthenticated,
  asyncHandler(async (req, res) => {
    // Example users endpoint with Zod schemas from api-types
    // Schemas provide type safety and OpenAPI generation
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]

    // Type-safe response construction using api-types schemas
    const response = apiResponse.success(HttpStatusCode.OK, { users })
    res.status(response.code).json(response)
  })
)

// Example error route showing HttpErrors usage
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      throw HttpErrors.BadRequest("User ID must be a number")
    }

    // Simulate user lookup with typed data
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]

    const user = users.find((u) => u.id === userId)

    if (!user) {
      throw HttpErrors.NotFound(`User with ID ${userId} not found`)
    }

    // Type-safe response with user schema
    const response = apiResponse.success(HttpStatusCode.OK, { user })
    res.status(response.code).json(response)
  })
)

export { router }
