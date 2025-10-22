import { logger } from "logger"
import { getDb, eq } from "db-schema/drizzle"
import { accounts, type Account } from "db-schema"
import { HttpErrors } from "helpers"

/**
 * Get all accounts from the database
 * @returns Array of all accounts
 */
export async function getAccounts(): Promise<Account[]> {
  const db = getDb()
  const result = await db.select().from(accounts)

  logger.debug(`Retrieved ${result.length} accounts`)

  return result
}

/**
 * Get a single account by UUID
 * @param uuid - Account UUID
 * @returns Account or null if not found
 */
export async function getAccountById(uuid: string): Promise<Account | null> {
  const db = getDb()
  const result = await db.select().from(accounts).where(eq(accounts.uuid, uuid))

  const account = result[0] || null

  if (!account) {
    logger.debug(`Account not found: ${uuid}`)
  }

  return account
}

/**
 * Update an account by UUID
 * @param uuid - Account UUID
 * @param updates - Partial account data to update
 * @returns Updated account
 */
export async function updateAccount(
  uuid: string,
  updates: Partial<Omit<Account, "uuid" | "createdAt">>
): Promise<Account> {
  const db = getDb()
  const response = await db.update(accounts).set(updates).where(eq(accounts.uuid, uuid)).returning()

  const result = response[0]

  if (!result) {
    throw HttpErrors.NotFound(`Account with UUID ${uuid} not found`)
  }

  logger.info(`Updated account: ${uuid}`)

  return result
}

/**
 * Delete an account by UUID
 * @param uuid - Account UUID
 * @returns Deleted account UUID
 */
export async function deleteAccount(uuid: string): Promise<string> {
  const db = getDb()
  const response = await db.delete(accounts).where(eq(accounts.uuid, uuid)).returning()

  const result = response[0]

  if (!result) {
    throw HttpErrors.NotFound(`Account with UUID ${uuid} not found`)
  }

  logger.info(`Deleted account: ${uuid}`)

  return result.uuid
}
