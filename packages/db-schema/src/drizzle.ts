import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema.ts'

const { Pool } = pg

/**
 * Create database connection pool
 */
export function createDbConnection(connectionString?: string) {
  const pool = new Pool({
    connectionString:
      connectionString ||
      process.env.DATABASE_URL ||
      'postgresql://starter:starter_password@localhost:5432/starter_db',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })

  return drizzle(pool, { schema })
}

/**
 * Database instance (singleton)
 */
let dbInstance: ReturnType<typeof createDbConnection> | null = null

export function getDb(connectionString?: string) {
  if (!dbInstance) {
    dbInstance = createDbConnection(connectionString)
  }
  return dbInstance
}

/**
 * Export db instance for convenience
 */
export const db = getDb()

/**
 * Type for database instance
 */
export type Database = typeof db
