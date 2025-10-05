/**
 * Generic request interface for framework-agnostic IP extraction
 */
export interface RequestLike {
  headers: Record<string, string | string[] | undefined>
  ip?: string
}

/**
 * Extract IP address from request headers
 * Handles various proxy headers and formats (Cloudflare, X-Real-IP, X-Forwarded-For)
 *
 * @param req - Request object with headers
 * @returns IP address string or undefined
 */
export function getIpFromRequest(req: RequestLike): string | undefined {
  const ips =
    req.headers['cf-connecting-ip'] ??
    req.headers['x-real-ip'] ??
    req.headers['x-forwarded-for'] ??
    req.ip ??
    ''

  const result = ips instanceof Array ? ips : ips.split(',')
  return result[0]?.trim()
}

/**
 * Re-export Express types for convenience
 */
import type { Request, Response, NextFunction } from 'express'
export type { Request, Response, NextFunction }

/**
 * Async handler wrapper for Express routes
 * Automatically catches async errors and passes them to error middleware
 *
 * @param fn - Async route handler function
 * @returns Express middleware function
 *
 * @example
 * import { asyncHandler, type Request, type Response } from 'helpers'
 *
 * app.get('/users', asyncHandler(async (req: Request, res: Response) => {
 *   const users = await db.query.users.findMany()
 *   res.json(users)
 * }))
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)
  }
