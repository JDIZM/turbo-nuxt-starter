import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
  LoginSchema,
  AuthResponseSchema,
  UserSchema
} from "api-types"

const registry = new OpenAPIRegistry()

// Register core schemas
registry.register("User", UserSchema)
registry.register("Login", LoginSchema)
registry.register("AuthResponse", AuthResponseSchema)
registry.register("SuccessResponse", SuccessResponseSchema(z.unknown()))
registry.register("ErrorResponse", ErrorResponseSchema)

// Security scheme for JWT Bearer token
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
})

// Example authentication route
registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  summary: "User login",
  description: "Authenticate user with email and password",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(AuthResponseSchema)
        }
      }
    },
    400: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Example protected route
registry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "List users",
  description: "Get a list of users (example protected route)",
  security: [{ bearerAuth: [] }],
  tags: ["Users"],
  responses: {
    200: {
      description: "List of users",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              users: z.array(UserSchema)
            })
          )
        }
      }
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

export function generateOpenAPIDocument(): ReturnType<OpenApiGeneratorV3["generateDocument"]> {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Turbo Nuxt Starter API",
      description: `A starter Express API template with TypeScript, Zod validation, and OpenAPI documentation.

## Authorization

This API uses JWT Bearer token authentication:

- **JWT Bearer Token**: Include in Authorization header for authentication
- All protected endpoints require a valid JWT token

## Features

- Type-safe request/response handling with Zod schemas
- Automatic OpenAPI documentation generation
- Standardized error responses (BLA-172 format)
- Request logging and monitoring`,
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3002",
        description:
          process.env.NODE_ENV === "production" ? "Production server" : "Development server"
      }
    ],
    tags: [
      { name: "Authentication", description: "User authentication endpoints" },
      { name: "Users", description: "User management operations" }
    ]
  })
}
