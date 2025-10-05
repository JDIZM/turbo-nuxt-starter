import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createDbConnection } from './drizzle.ts'

/**
 * Run database migrations
 */
async function runMigrations() {
  console.log('Running migrations...')

  const db = createDbConnection()

  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
