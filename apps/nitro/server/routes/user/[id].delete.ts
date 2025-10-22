import { apiResponse, HttpErrors, HttpStatusCode, HttpError } from "helpers"
import { deleteAccount } from "../../utils/accounts.methods"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw HttpErrors.BadRequest("User ID is required")
    }

    // Verify authenticated user can only delete their own account
    const userId = event.context.user?.userId

    if (!userId || userId !== id) {
      throw HttpErrors.Forbidden("You can only delete your own account")
    }

    await deleteAccount(id)

    return apiResponse.success(HttpStatusCode.OK, null, "User deleted successfully")
  } catch (error) {
    if (error instanceof HttpError) {
      const errorResponse = apiResponse.error(error)
      setResponseStatus(event, errorResponse.code)
      return errorResponse
    }
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
    summary: "Delete user by ID",
    description: "Deletes a user account (users can only delete their own account)",
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
        description: "User deleted successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: { type: "null" },
                message: { type: "string", example: "User deleted successfully" }
              }
            }
          }
        }
      },
      403: {
        description: "Forbidden - can only delete own account",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 403 },
                error: { type: "string", example: "FORBIDDEN" },
                message: { type: "string", example: "You can only delete your own account" }
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
                message: {
                  type: "string",
                  example: "Account with UUID 123e4567-e89b-12d3-a456-426614174000 not found"
                }
              }
            }
          }
        }
      }
    }
  }
})
