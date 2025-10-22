import type { Request, Response } from "express"
import { apiResponse, HttpErrors, asyncHandler } from "helpers"
import { logger } from "logger"
import { getDb } from "db-schema/drizzle"
import { accounts } from "db-schema"
import { eq } from "drizzle-orm"

/**
 * GET /me - Get current authenticated user's account information
 * Requires authentication middleware to set req.accountId
 */
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Expected error - handle explicitly, don't throw (avoids Sentry alert)
  if (!req.accountId) {
    const error = HttpErrors.Unauthorized("User not authenticated")
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  const db = getDb()
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.uuid, req.accountId)
  })

  // Expected error - handle explicitly, don't throw (avoids Sentry alert)
  if (!account) {
    const error = HttpErrors.NotFound("Account not found")
    const response = apiResponse.error(error)
    res.status(response.code).json(response)
    return
  }

  logger.info({ accountId: req.accountId }, "Retrieved user account")
  const response = apiResponse.success(200, account)
  res.status(response.code).json(response)
})
