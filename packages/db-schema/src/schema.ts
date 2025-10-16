import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/**
 * Accounts table
 * Note: Passwords are handled by Supabase Auth, not stored in this table
 * UUID must match the Supabase Auth user ID
 */
export const accounts = pgTable("accounts", {
  uuid: uuid("uuid").primaryKey(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
})

/**
 * Zod schemas for validation
 */
export const insertAccountSchema = createInsertSchema(accounts, {
  email: z.string().email(),
  fullName: z.string().min(1).max(255)
})

export const selectAccountSchema = createSelectSchema(accounts)

export const updateAccountSchema = insertAccountSchema
  .partial()
  .omit({ uuid: true, createdAt: true })

/**
 * TypeScript types
 */
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
