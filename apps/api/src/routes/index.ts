import { Router } from "express"
import { HttpErrors, HttpStatusCode, apiResponse, asyncHandler } from "helpers"
import { isAuthenticated } from "../middleware/isAuthenticated.ts"
import { validateRequest } from "../middleware/validateRequest.ts"
import { authRateLimit } from "../middleware/rateLimiter.ts"
import { signup, login } from "../handlers/auth/auth.handlers.ts"
import { getMe } from "../handlers/me/index.ts"
import { SignupRequestSchema, LoginRequestSchema } from "../schemas/auth.ts"
import { UserParamsSchema, UpdateUserSchema } from "../schemas/users.ts"

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
router.post("/auth/signup", authRateLimit, validateRequest({ body: SignupRequestSchema }), signup)
router.post("/auth/login", authRateLimit, validateRequest({ body: LoginRequestSchema }), login)
router.post(
  "/auth/logout",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    // Client-side should clear the JWT token
    // This endpoint validates the user is authenticated before logout
    const response = apiResponse.success(HttpStatusCode.OK, {
      message: "Logged out successfully"
    })
    res.status(response.code).json(response)
  })
)

// Protected routes (require authentication)
router.get("/me", isAuthenticated, getMe)

router.get(
  "/users",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { getAccounts } = await import("../handlers/accounts/accounts.methods.ts")
    const users = await getAccounts()

    const response = apiResponse.success(HttpStatusCode.OK, { users })
    res.status(response.code).json(response)
  })
)

router.get(
  "/users/:id",
  isAuthenticated,
  validateRequest({ params: UserParamsSchema }),
  asyncHandler(async (req, res) => {
    const { getAccountById } = await import("../handlers/accounts/accounts.methods.ts")
    const userId = req.params.id

    const user = await getAccountById(userId)

    if (!user) {
      throw HttpErrors.NotFound(`User with ID ${userId} not found`)
    }

    const response = apiResponse.success(HttpStatusCode.OK, { user })
    res.status(response.code).json(response)
  })
)

router.patch(
  "/users/:id",
  isAuthenticated,
  validateRequest({ params: UserParamsSchema, body: UpdateUserSchema }),
  asyncHandler(async (req, res) => {
    const { updateAccount } = await import("../handlers/accounts/accounts.methods.ts")
    const userId = req.params.id

    // Only allow users to update their own account
    if (req.accountId !== userId) {
      throw HttpErrors.Forbidden("You can only update your own account")
    }

    const updates = req.body
    const user = await updateAccount(userId, updates)

    const response = apiResponse.success(HttpStatusCode.OK, { user })
    res.status(response.code).json(response)
  })
)

router.delete(
  "/users/:id",
  isAuthenticated,
  validateRequest({ params: UserParamsSchema }),
  asyncHandler(async (req, res) => {
    const { deleteAccount } = await import("../handlers/accounts/accounts.methods.ts")
    const userId = req.params.id

    // Only allow users to delete their own account
    if (req.accountId !== userId) {
      throw HttpErrors.Forbidden("You can only delete your own account")
    }

    await deleteAccount(userId)

    const response = apiResponse.success(HttpStatusCode.OK, {
      message: "Account deleted successfully"
    })
    res.status(response.code).json(response)
  })
)

export { router }
