import { supabase } from "../../../utils/auth"
import { createDbAccount } from "../../../utils/accounts"
import { RegisterSchema, type Register } from "api-types"
import { HttpErrors, apiResponse, HttpStatusCode, HttpError } from "helpers"

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody<Register>(event)
    const validationResult = RegisterSchema.safeParse(body)

    if (!validationResult.success) {
      throw HttpErrors.BadRequest(`Validation failed: ${validationResult.error.message}`)
    }

    const { email, password, name } = validationResult.data

    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      throw HttpErrors.BadRequest(error.message)
    }

    if (!data.user) {
      throw HttpErrors.InternalError("Failed to create user")
    }

    // Create account record in database
    await createDbAccount({
      uuid: data.user.id,
      email: data.user.email!,
      fullName: name
    })

    return apiResponse.success(
      HttpStatusCode.CREATED,
      {
        user: {
          id: data.user.id,
          email: data.user.email
        },
        session: data.session
      },
      "Account created successfully"
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
    summary: "Create new account",
    description: "Register a new user with email and password",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "name", "password"],
            properties: {
              email: { type: "string", example: "user@example.com" },
              name: { type: "string", example: "John Doe" },
              password: { type: "string", example: "SecurePass123!" }
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: "Account created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 201 },
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
                    session: { type: "object" }
                  }
                },
                message: { type: "string", example: "Account created successfully" }
              }
            }
          }
        }
      },
      400: {
        description: "Validation error or email already exists",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 400 },
                error: { type: "string", example: "BAD_REQUEST" },
                message: { type: "string", example: "Validation failed" }
              }
            }
          }
        }
      }
    }
  }
})
