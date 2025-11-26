/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created
 * 
 * For Supabase connections:
 * - Direct Connection: Use port 5432 with ?sslmode=require
 * - Connection Pooling: Use port 6543 with postgres.{project_id} as username
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Validate DATABASE_URL format
function validateDatabaseUrl(): void {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set in environment variables')
  }

  // Check if it's a Supabase URL
  const isSupabase = dbUrl.includes('supabase.co') || dbUrl.includes('pooler.supabase.com')
  
  if (isSupabase) {
    // For Supabase, ensure SSL is required
    if (!dbUrl.includes('sslmode=require') && !dbUrl.includes('sslmode=prefer')) {
      console.warn('⚠️  Supabase connection string should include sslmode=require for security')
    }

    // Check if using connection pooling
    const isPooling = dbUrl.includes('pooler.supabase.com') || dbUrl.includes(':6543')
    if (isPooling) {
      // For pooling, username should include project ID
      if (!dbUrl.includes('postgres.') && !dbUrl.includes('postgresql://postgres.')) {
        console.warn('⚠️  Connection Pooling requires username format: postgres.{project_id}')
      }
    }
  }
}

// Validate on module load (only in production/serverless)
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  try {
    validateDatabaseUrl()
  } catch (error) {
    console.error('❌ DATABASE_URL validation failed:', error instanceof Error ? error.message : String(error))
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

