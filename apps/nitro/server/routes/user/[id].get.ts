import { apiResponse, HttpErrors, HttpStatusCode, HttpError } from "helpers"

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw HttpErrors.BadRequest("User ID is required")
    }

    // Mock user data - in production, fetch from database
    const users: Record<string, { id: string; email: string; name: string }> = {
      "1": { id: "1", email: "user1@example.com", name: "User One" },
      "2": { id: "2", email: "user2@example.com", name: "User Two" }
    }

    const user = users[id]

    if (!user) {
      throw HttpErrors.NotFound(`User with ID ${id} not found`)
    }

    return apiResponse.success(HttpStatusCode.OK, user, "User retrieved successfully")
  } catch (error) {
    // Format error using apiResponse helper
    if (error instanceof HttpError) {
      const errorResponse = apiResponse.error(error)
      setResponseStatus(event, errorResponse.code)
      return errorResponse
    }
    // Handle unexpected errors
    const errorResponse = apiResponse.error(
      error instanceof Error ? error : new Error("Unknown error"),
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
    setResponseStatus(event, errorResponse.code)
    return errorResponse
  }
})

// OpenAPI metadata
defineRouteMeta({
  openAPI: {
    tags: ["Users"],
    summary: "Get user by ID",
    description: "Returns a specific user by their ID (mock data)",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        description: "User ID",
        schema: {
          type: "string",
          example: "1"
        }
      }
    ],
    responses: {
      200: {
        description: "User retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    email: { type: "string", example: "user1@example.com" },
                    name: { type: "string", example: "User One" }
                  }
                },
                message: { type: "string", example: "User retrieved successfully" }
              }
            }
          }
        }
      },
      404: {
        description: "User not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 404 },
                error: { type: "string", example: "NOT_FOUND" },
                message: { type: "string", example: "User with ID 1 not found" }
              }
            }
          }
        }
      }
    }
  }
})
