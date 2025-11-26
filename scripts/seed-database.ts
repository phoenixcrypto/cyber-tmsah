/**
 * Database seeding script
 * Run: npm run db:seed
 */

import { migrateToPostgres } from './migrate-to-postgres'
import { seedInitialData } from './seed-initial-data'

async function main() {
  await migrateToPostgres()
  await seedInitialData()
}

main()

