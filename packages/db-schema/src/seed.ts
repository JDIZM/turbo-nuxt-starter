import { getDb } from './drizzle.ts'
import { users, workspaces } from './schema.ts'
import { createHash } from 'node:crypto'

/**
 * Hash password (simple example - use bcrypt in production)
 */
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

/**
 * Seed database with example data
 */
async function seed() {
  console.log('Seeding database...')

  const db = getDb()

  try {
    // Create test users
    const [user1, user2] = await db
      .insert(users)
      .values([
        {
          email: 'alice@example.com',
          name: 'Alice Johnson',
          password: hashPassword('password123'),
          emailVerified: true
        },
        {
          email: 'bob@example.com',
          name: 'Bob Smith',
          password: hashPassword('password123'),
          emailVerified: true
        }
      ])
      .returning()

    console.log('✅ Created users:', user1.email, user2.email)

    // Create test workspaces
    const [workspace1, workspace2] = await db
      .insert(workspaces)
      .values([
        {
          name: 'Acme Corporation',
          slug: 'acme-corp',
          description: 'Main workspace for Acme Corporation',
          ownerId: user1.id
        },
        {
          name: "Bob's Projects",
          slug: 'bobs-projects',
          description: 'Personal workspace for Bob',
          ownerId: user2.id
        }
      ])
      .returning()

    console.log('✅ Created workspaces:', workspace1.name, workspace2.name)

    console.log('✅ Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
