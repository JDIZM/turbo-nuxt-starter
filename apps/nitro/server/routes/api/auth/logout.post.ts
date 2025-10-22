import { apiResponse, HttpStatusCode } from "helpers"

export default defineEventHandler((_event) => {
  // Client-side should clear the JWT token
  // This endpoint validates the user is authenticated before logout
  return apiResponse.success(HttpStatusCode.OK, null, "Logged out successfully")
})

// OpenAPI metadata
defineRouteMeta({
  openAPI: {
    tags: ["Authentication"],
    summary: "Logout",
    description: "Logout from the application (client clears JWT token)",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Logged out successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: { type: "null" },
                message: { type: "string", example: "Logged out successfully" }
              }
            }
          }
        }
      }
    }
  }
})
