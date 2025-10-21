import { HttpErrors, apiResponse, HttpStatusCode, HttpError } from "helpers"

export default defineEventHandler(async (event) => {
  try {
    // User is attached to context by auth middleware
    const user = event.context.user

    if (!user) {
      throw HttpErrors.Unauthorized("Authentication required")
    }

    return apiResponse.success(
      HttpStatusCode.OK,
      {
        id: user.userId,
        email: user.email
      },
      "User retrieved successfully"
    )
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
    tags: ["User"],
    summary: "Get current user",
    description: "Returns information about the authenticated user",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "User information retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                    email: { type: "string", example: "user@example.com" }
                  }
                },
                message: { type: "string", example: "User retrieved successfully" }
              }
            }
          }
        }
      },
      401: {
        description: "Unauthorized - missing or invalid token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 401 },
                error: { type: "string", example: "UNAUTHORIZED" },
                message: { type: "string", example: "Authentication required" }
              }
            }
          }
        }
      }
    }
  }
})
