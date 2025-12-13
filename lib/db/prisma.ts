/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created
 * 
 * This pattern prevents multiple Prisma Client instances in development
 * which can cause connection pool exhaustion.
 * 
 * For MySQL connections:
 * - Use standard MySQL connection string format
 * - Ensure SSL is enabled for production
 */

import { PrismaClient } from '@prisma/client'

/**
 * Type-safe global Prisma instance storage
 * Used to prevent multiple instances in development (Hot Module Replacement)
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Validate DATABASE_URL format
 * Ensures database connection string is properly configured
 */
function validateDatabaseUrl(): void {
  const dbUrl = process.env['DATABASE_URL']
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set in environment variables')
  }

  // Validate MySQL connection string format
  const isMySQL = dbUrl.startsWith('mysql://') || dbUrl.startsWith('mysqlx://')
  
  if (!isMySQL) {
    console.warn('⚠️  Expected MySQL connection string. Current format may not be compatible.')
  }

  // Check for SSL requirement in production
  if (process.env['NODE_ENV'] === 'production' && !dbUrl.includes('sslaccept=strict')) {
    console.warn('⚠️  Production database connections should use SSL (sslaccept=strict)')
  }
}

// Validate on module load (only in production/serverless)
if (process.env['NODE_ENV'] === 'production' || process.env['VERCEL']) {
  try {
    validateDatabaseUrl()
  } catch (error) {
    console.error('❌ DATABASE_URL validation failed:', error instanceof Error ? error.message : String(error))
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma

export default prisma

