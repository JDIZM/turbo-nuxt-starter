import { apiResponse, HttpStatusCode } from "helpers"

export default defineEventHandler((_event) => {
  // Mock user data - in production, fetch from database
  const users = [
    { id: "1", email: "user1@example.com", name: "User One" },
    { id: "2", email: "user2@example.com", name: "User Two" }
  ]

  return apiResponse.success(HttpStatusCode.OK, users, "Users retrieved successfully")
})

// OpenAPI metadata
defineRouteMeta({
  openAPI: {
    tags: ["Users"],
    summary: "List all users",
    description: "Returns a list of all users (mock data)",
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
                      id: { type: "string", example: "1" },
                      email: { type: "string", example: "user1@example.com" },
                      name: { type: "string", example: "User One" }
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
