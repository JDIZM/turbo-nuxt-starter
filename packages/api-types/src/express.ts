/**
 * Express type extensions for authentication
 * Using namespace is the correct TypeScript pattern for augmenting Express types
 */

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user's account ID (from Supabase Auth JWT)
       * Set by isAuthenticated middleware
       */
      accountId?: string
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export {}
