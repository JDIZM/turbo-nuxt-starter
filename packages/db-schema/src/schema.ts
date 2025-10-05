import { pgTable, uuid, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

/**
 * Users table
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

/**
 * User relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces)
}))

/**
 * Workspaces table
 */
export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

/**
 * Workspace relations
 */
export const workspacesRelations = relations(workspaces, ({ one }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id]
  })
}))

/**
 * Zod schemas for validation
 */

// User schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8).max(100),
  avatar: z.string().url().optional()
})

export const selectUserSchema = createSelectSchema(users)

export const updateUserSchema = insertUserSchema.partial().omit({ id: true, createdAt: true })

// Workspace schemas
export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  ownerId: z.string().uuid()
})

export const selectWorkspaceSchema = createSelectSchema(workspaces)

export const updateWorkspaceSchema = insertWorkspaceSchema
  .partial()
  .omit({ id: true, createdAt: true, ownerId: true })

/**
 * TypeScript types
 */
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
