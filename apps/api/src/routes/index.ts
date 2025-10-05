import { Router } from 'express'
import { HttpErrors, HttpStatusCode, apiResponse, asyncHandler } from 'helpers'

const router = Router()

// Example API routes
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const response = apiResponse.success(HttpStatusCode.OK, {
      message: 'Welcome to the Turbo Nuxt API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api'
      }
    })
    res.status(response.statusCode).json(response)
  })
)

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    // Example users endpoint with error handling
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]

    const response = apiResponse.success(HttpStatusCode.OK, { users })
    res.status(response.statusCode).json(response)
  })
)

// Example error route
router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      throw HttpErrors.BadRequest('User ID must be a number')
    }

    // Simulate user lookup
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]

    const user = users.find((u) => u.id === userId)

    if (!user) {
      throw HttpErrors.NotFound(`User with ID ${userId} not found`)
    }

    const response = apiResponse.success(HttpStatusCode.OK, { user })
    res.status(response.statusCode).json(response)
  })
)

export { router }
