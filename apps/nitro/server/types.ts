/**
 * User object attached to request context by auth middleware
 */
export interface AuthUser {
  userId: string
  email: string
}

/**
 * Augment h3's EventHandlerRequest to include our custom context properties
 */
declare module "h3" {
  interface H3EventContext {
    user: AuthUser | null
  }
}
