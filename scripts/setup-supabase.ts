/**
 * Setup script for Supabase database
 * This script will create all tables in Supabase
 * 
 * Usage:
 * 1. Make sure DATABASE_URL is set in .env
 * 2. Run: npm run db:push
 * 
 * Or use this script directly:
 * npx tsx scripts/setup-supabase.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Supabase setup...\n')

  try {
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!\n')

    // Check if tables exist by trying to query them
    console.log('🔍 Checking existing tables...')
    
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Users table exists (${userCount} users)`)
    } catch (error) {
      console.log('❌ Users table does not exist')
      throw new Error('Tables not created. Please run: npm run db:push')
    }

    try {
      const scheduleCount = await prisma.scheduleItem.count()
      console.log(`✅ Schedule items table exists (${scheduleCount} items)`)
    } catch (error) {
      console.log('❌ Schedule items table does not exist')
    }

    try {
      const materialCount = await prisma.material.count()
      console.log(`✅ Materials table exists (${materialCount} materials)`)
    } catch (error) {
      console.log('❌ Materials table does not exist')
    }

    try {
      const articleCount = await prisma.article.count()
      console.log(`✅ Articles table exists (${articleCount} articles)`)
    } catch (error) {
      console.log('❌ Articles table does not exist')
    }

    try {
      const downloadCount = await prisma.downloadSoftware.count()
      console.log(`✅ Download software table exists (${downloadCount} downloads)`)
    } catch (error) {
      console.log('❌ Download software table does not exist')
    }

    try {
      const newsCount = await prisma.newsArticle.count()
      console.log(`✅ News articles table exists (${newsCount} news)`)
    } catch (error) {
      console.log('❌ News articles table does not exist')
    }

    try {
      const pageCount = await prisma.page.count()
      console.log(`✅ Pages table exists (${pageCount} pages)`)
    } catch (error) {
      console.log('❌ Pages table does not exist')
    }

    try {
      const apiLogCount = await prisma.apiLog.count()
      console.log(`✅ API logs table exists (${apiLogCount} logs)`)
    } catch (error) {
      console.log('❌ API logs table does not exist')
    }

    console.log('\n✅ All tables checked successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Make sure all environment variables are set in Vercel')
    console.log('2. The default admin user will be created automatically on first login')
    console.log('3. You can use Prisma Studio to view/edit data: npm run db:studio')

  } catch (error) {
    console.error('\n❌ Error:', error)
    console.error('\n💡 Solution:')
    console.error('Run the following command to create all tables:')
    console.error('  npm run db:push')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

