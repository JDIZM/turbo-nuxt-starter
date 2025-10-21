import { supabase } from "../../../utils/auth"
import { LoginSchema, type Login } from "api-types"
import { HttpErrors, apiResponse, HttpStatusCode, HttpError } from "helpers"

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody<Login>(event)
    const validationResult = LoginSchema.safeParse(body)

    if (!validationResult.success) {
      throw HttpErrors.BadRequest(
        `Validation failed: ${validationResult.error.message}`
      )
    }

    const { email, password } = validationResult.data

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw HttpErrors.Unauthorized("Invalid email or password")
    }

    if (!data.session) {
      throw HttpErrors.InternalError("Failed to create session")
    }

    return apiResponse.success(
      HttpStatusCode.OK,
      {
        user: {
          id: data.user.id,
          email: data.user.email
        },
        session: data.session
      },
      "Login successful"
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
    tags: ["Authentication"],
    summary: "Login to account",
    description: "Authenticate user with email and password",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "user@example.com" },
              password: { type: "string", example: "SecurePass123!" }
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                data: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" }
                      }
                    },
                    session: {
                      type: "object",
                      properties: {
                        access_token: { type: "string" },
                        refresh_token: { type: "string" }
                      }
                    }
                  }
                },
                message: { type: "string", example: "Login successful" }
              }
            }
          }
        }
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 401 },
                error: { type: "string", example: "UNAUTHORIZED" },
                message: { type: "string", example: "Invalid email or password" }
              }
            }
          }
        }
      }
    }
  }
})
