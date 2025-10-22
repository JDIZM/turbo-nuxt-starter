import { apiResponse, HttpStatusCode } from "helpers"
import { getAccounts } from "../../utils/accounts.methods"

export default defineEventHandler(async (_event) => {
  const users = await getAccounts()

  return apiResponse.success(HttpStatusCode.OK, users, "Users retrieved successfully")
})

// OpenAPI metadata
defineRouteMeta({
  openAPI: {
    tags: ["Users"],
    summary: "List all users",
    description: "Returns a list of all users from the database",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Users retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      uuid: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                      email: { type: "string", example: "user@example.com" },
                      fullName: { type: "string", example: "John Doe" },
                      createdAt: { type: "string", format: "date-time" }
                    }
                  }
                },
                message: { type: "string", example: "Users retrieved successfully" }
              }
            }
          }
        }
      }
    }
  }
})
