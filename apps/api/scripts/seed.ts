import { signUpWithSupabase } from "../src/handlers/auth/auth.handlers.ts"
import { createDbAccount } from "../src/handlers/accounts/accounts.methods.ts"

/**
 * Automated seed script for creating test accounts
 * Creates users in Supabase Auth and syncs to database
 *
 * Usage:
 *   cd apps/api
 *   pnpm seed
 */

const testUsers = [
  { email: "alice@example.com", password: "password123", fullName: "Alice Johnson" },
  { email: "bob@example.com", password: "password123", fullName: "Bob Smith" },
  { email: "charlie@example.com", password: "password123", fullName: "Charlie Davis" },
]

async function seed() {
  console.log("🌱 Starting automated seed process...")
  console.log("")

  let successCount = 0
  let errorCount = 0

  for (const user of testUsers) {
    try {
      console.log(`📧 Creating user: ${user.email}`)

      // Create user in Supabase Auth
      const authUser = await signUpWithSupabase(user.email, user.password)

      if (authUser instanceof Error) {
        console.error(`   ❌ Auth signup failed for ${user.email}:`, authUser.message)
        errorCount++
        continue
      }

      console.log(`   ✅ Supabase Auth user created: ${authUser.id}`)

      // Create account record in database
      const accountId = await createDbAccount({
        uuid: authUser.id,
        email: user.email,
        fullName: user.fullName,
      })

      console.log(`   ✅ Database account created: ${accountId}`)
      console.log("")
      successCount++
    } catch (error) {
      console.error(`   ❌ Error creating ${user.email}:`, error)
      errorCount++
      console.log("")
    }
  }

  console.log("=".repeat(50))
  console.log(`✅ Successfully created: ${successCount} accounts`)
  console.log(`❌ Failed: ${errorCount} accounts`)
  console.log("")

  if (successCount > 0) {
    console.log("🎉 Seeding completed!")
    console.log("")
    console.log("📝 Test credentials:")
    testUsers.forEach((user) => {
      console.log(`   Email: ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log("")
    })
  }

  process.exit(errorCount > 0 ? 1 : 0)
}

seed().catch((error) => {
  console.error("❌ Fatal error during seeding:", error)
  process.exit(1)
})
