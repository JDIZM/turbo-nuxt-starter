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

// Signup request schema
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1)
})

// Security scheme for JWT Bearer token
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
})

// Root endpoint
registry.registerPath({
  method: "get",
  path: "/api/",
  summary: "API root",
  description: "Welcome endpoint with API information",
  tags: ["General"],
  responses: {
    200: {
      description: "API information",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              message: z.string(),
              version: z.string(),
              endpoints: z.object({
                health: z.string(),
                api: z.string(),
                auth: z.string(),
                me: z.string()
              })
            })
          )
        }
      }
    }
  }
})

// Signup
registry.registerPath({
  method: "post",
  path: "/api/auth/signup",
  summary: "User signup",
  description: "Create a new user account with email, password, and full name",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignupSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Signup successful",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              accountId: z.string(),
              message: z.string()
            })
          )
        }
      }
    },
    400: {
      description: "Invalid request data",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: "Unable to sign up",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Login
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
          schema: SuccessResponseSchema(
            z.object({
              user: z.object({
                id: z.string(),
                email: z.string()
              }),
              session: z.object({
                access_token: z.string(),
                expires_in: z.number()
              }),
              message: z.string()
            })
          )
        }
      }
    },
    400: {
      description: "Invalid request data",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Logout
registry.registerPath({
  method: "post",
  path: "/api/auth/logout",
  summary: "User logout",
  description: "Logout the authenticated user (client should clear JWT token)",
  security: [{ bearerAuth: [] }],
  tags: ["Authentication"],
  responses: {
    200: {
      description: "Logout successful",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              message: z.string()
            })
          )
        }
      }
    },
    401: {
      description: "Unauthorized - missing or invalid token",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Get current user (protected)
registry.registerPath({
  method: "get",
  path: "/api/me",
  summary: "Get current user",
  description: "Returns information about the authenticated user",
  security: [{ bearerAuth: [] }],
  tags: ["Users"],
  responses: {
    200: {
      description: "User information retrieved successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(UserSchema)
        }
      }
    },
    401: {
      description: "Unauthorized - missing or invalid token",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// List all users
registry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "List users",
  description: "Get a list of all users from the database",
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

// Get user by ID
registry.registerPath({
  method: "get",
  path: "/api/users/{id}",
  summary: "Get user by ID",
  description: "Returns a specific user by their UUID",
  security: [{ bearerAuth: [] }],
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.string().uuid()
    })
  },
  responses: {
    200: {
      description: "User retrieved successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              user: UserSchema
            })
          )
        }
      }
    },
    401: {
      description: "Unauthorized - missing or invalid token",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Update user by ID
registry.registerPath({
  method: "patch",
  path: "/api/users/{id}",
  summary: "Update user by ID",
  description: "Updates a user's information (users can only update their own account)",
  security: [{ bearerAuth: [] }],
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.string().uuid()
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email().optional(),
            fullName: z.string().min(1).optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: "User updated successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              user: UserSchema
            })
          )
        }
      }
    },
    400: {
      description: "Invalid request data",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: "Unauthorized - missing or invalid token",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: "Forbidden - can only update own account",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    }
  }
})

// Delete user by ID
registry.registerPath({
  method: "delete",
  path: "/api/users/{id}",
  summary: "Delete user by ID",
  description: "Deletes a user account (users can only delete their own account)",
  security: [{ bearerAuth: [] }],
  tags: ["Users"],
  request: {
    params: z.object({
      id: z.string().uuid()
    })
  },
  responses: {
    200: {
      description: "User deleted successfully",
      content: {
        "application/json": {
          schema: SuccessResponseSchema(
            z.object({
              message: z.string()
            })
          )
        }
      }
    },
    401: {
      description: "Unauthorized - missing or invalid token",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: "Forbidden - can only delete own account",
      content: {
        "application/json": {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: "User not found",
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
      { name: "General", description: "General API information" },
      { name: "Authentication", description: "User authentication endpoints" },
      { name: "Users", description: "User management operations" }
    ]
  })
}
