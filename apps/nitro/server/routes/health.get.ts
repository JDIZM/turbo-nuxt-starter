import { config } from "../utils/config"

export default defineEventHandler((_event) => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: config.env,
    uptime: process.uptime()
  }
})

// OpenAPI metadata
defineRouteMeta({
  openAPI: {
    tags: ["Health"],
    summary: "Health check endpoint",
    description: "Returns server health status and basic information",
    responses: {
      200: {
        description: "Server is healthy",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "healthy" },
                timestamp: { type: "string" },
                environment: { type: "string", example: "development" },
                uptime: { type: "number", example: 123.45 }
              }
            }
          }
        }
      }
    }
  }
})
