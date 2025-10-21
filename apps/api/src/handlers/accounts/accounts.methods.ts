import { logger } from "logger"
import { getDb } from "db-schema/drizzle"
import { accounts, insertAccountSchema, type NewAccount } from "db-schema"
import { HttpErrors } from "helpers"

/**
 * Create a new account record in the database
 * @param account - Account data including uuid from Supabase Auth
 * @returns The created account UUID
 */
export async function createDbAccount(account: NewAccount): Promise<string> {
  const validationResult = insertAccountSchema.safeParse(account)

  if (!validationResult.success) {
    throw HttpErrors.BadRequest(`Account validation failed: ${validationResult.error.message}`)
  }

  const db = getDb()
  const response = await db.insert(accounts).values(account).returning()

  const result = response[0]

  if (!result) {
    throw HttpErrors.InternalError("Unable to create account")
  }

  logger.info(`Created account with UUID: ${result.uuid}`)

  return result.uuid
}
