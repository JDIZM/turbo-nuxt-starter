import { apiResponse, HttpErrors, HttpStatusCode, HttpError } from "helpers"
import { getAccountById } from "../../utils/accounts.methods"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw HttpErrors.BadRequest("User ID is required")
    }

    const user = await getAccountById(id)

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
    description: "Returns a specific user by their UUID from the database",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        description: "User UUID",
        schema: {
          type: "string",
          example: "123e4567-e89b-12d3-a456-426614174000"
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
                    uuid: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                    email: { type: "string", example: "user@example.com" },
                    fullName: { type: "string", example: "John Doe" },
                    createdAt: { type: "string", format: "date-time" }
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
