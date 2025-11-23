/**
 * Migration script: JSON files → PostgreSQL
 * Run: npm run db:seed
 */

import { prisma } from '../lib/db/prisma'
import fs from 'fs'
import path from 'path'
import { hashPassword } from '../lib/auth/bcrypt'

interface MigrationStats {
  users: number
  schedule: number
  materials: number
  downloads: number
  news: number
  articles: number
  pages: number
}

async function migrateUsers(): Promise<number> {
  const dataPath = path.join(process.cwd(), 'lib', 'db', 'data', 'users.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  users.json not found, skipping...')
    return 0
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let count = 0

  for (const user of data) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          username: user.username,
          email: user.email || null,
          name: user.name,
          password: user.password, // Already hashed
          role: user.role,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        },
        create: {
          id: user.id,
          username: user.username,
          email: user.email || null,
          name: user.name,
          password: user.password,
          role: user.role,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        },
      })
      count++
    } catch (error) {
      console.error(`Error migrating user ${user.id}:`, error)
    }
  }

  // Create default admin if no users exist
  if (count === 0) {
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD
    const defaultName = process.env.DEFAULT_ADMIN_NAME
    
    if (!defaultUsername || !defaultPassword) {
      console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
      return 0
    }
    const hashedPassword = await hashPassword(defaultPassword)

    await prisma.user.create({
      data: {
        username: defaultUsername,
        name: defaultName || defaultUsername,
        password: hashedPassword,
        role: 'admin',
      },
    })
    count = 1
    console.log('✅ Created default admin user')
  }

  return count
}

async function migrateSchedule(): Promise<number> {
  const dataPath = path.join(process.cwd(), 'lib', 'db', 'data', 'schedule.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  schedule.json not found, skipping...')
    return 0
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let count = 0

  for (const item of data) {
    try {
      await prisma.scheduleItem.upsert({
        where: { id: item.id },
        update: {
          title: item.title,
          time: item.time,
          location: item.location,
          instructor: item.instructor,
          type: item.type === 'lab' ? 'lab' : 'lecture',
          group: item.group === 'Group 2' ? 'Group2' : 'Group1',
          sectionNumber: item.sectionNumber || null,
          day: item.day,
        },
        create: {
          id: item.id,
          title: item.title,
          time: item.time,
          location: item.location,
          instructor: item.instructor,
          type: item.type === 'lab' ? 'lab' : 'lecture',
          group: item.group === 'Group 2' ? 'Group2' : 'Group1',
          sectionNumber: item.sectionNumber || null,
          day: item.day,
        },
      })
      count++
    } catch (error) {
      console.error(`Error migrating schedule item ${item.id}:`, error)
    }
  }

  return count
}

async function migrateMaterials(): Promise<number> {
  const dataPath = path.join(process.cwd(), 'lib', 'db', 'data', 'materials.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  materials.json not found, skipping...')
    return 0
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let count = 0

  for (const material of data) {
    try {
      await prisma.material.upsert({
        where: { id: material.id },
        update: {
          title: material.title,
          titleEn: material.titleEn || material.title,
          description: material.description || '',
          descriptionEn: material.descriptionEn || material.description || '',
          icon: material.icon || 'BookOpen',
          color: material.color || 'from-blue-500 to-blue-600',
          articlesCount: material.articlesCount || 0,
          lastUpdated: material.lastUpdated || new Date().toISOString(),
        },
        create: {
          id: material.id,
          title: material.title,
          titleEn: material.titleEn || material.title,
          description: material.description || '',
          descriptionEn: material.descriptionEn || material.description || '',
          icon: material.icon || 'BookOpen',
          color: material.color || 'from-blue-500 to-blue-600',
          articlesCount: material.articlesCount || 0,
          lastUpdated: material.lastUpdated || new Date().toISOString(),
        },
      })
      count++
    } catch (error) {
      console.error(`Error migrating material ${material.id}:`, error)
    }
  }

  return count
}

async function migrateDownloads(): Promise<number> {
  const dataPath = path.join(process.cwd(), 'lib', 'db', 'data', 'downloads.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  downloads.json not found, skipping...')
    return 0
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let count = 0

  for (const download of data) {
    try {
      await prisma.downloadSoftware.upsert({
        where: { id: download.id },
        update: {
          name: download.name,
          nameEn: download.nameEn || download.name,
          description: download.description || '',
          descriptionEn: download.descriptionEn || download.description || '',
          icon: download.icon || 'Download',
          videoUrl: download.videoUrl || null,
          downloadUrl: download.downloadUrl || null,
          category: download.category || null,
        },
        create: {
          id: download.id,
          name: download.name,
          nameEn: download.nameEn || download.name,
          description: download.description || '',
          descriptionEn: download.descriptionEn || download.description || '',
          icon: download.icon || 'Download',
          videoUrl: download.videoUrl || null,
          downloadUrl: download.downloadUrl || null,
          category: download.category || null,
        },
      })
      count++
    } catch (error) {
      console.error(`Error migrating download ${download.id}:`, error)
    }
  }

  return count
}

async function migrateNews(): Promise<number> {
  const dataPath = path.join(process.cwd(), 'lib', 'db', 'data', 'news.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  news.json not found, skipping...')
    return 0
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let count = 0

  for (const news of data) {
    try {
      await prisma.newsArticle.upsert({
        where: { id: news.id },
        update: {
          title: news.title,
          titleEn: news.titleEn || news.title,
          subjectId: news.subjectId,
          subjectTitle: news.subjectTitle,
          subjectTitleEn: news.subjectTitleEn || news.subjectTitle,
          url: news.url,
          status: news.status === 'published' ? 'published' : 'draft',
          publishedAt: new Date(news.publishedAt || Date.now()),
        },
        create: {
          id: news.id,
          title: news.title,
          titleEn: news.titleEn || news.title,
          subjectId: news.subjectId,
          subjectTitle: news.subjectTitle,
          subjectTitleEn: news.subjectTitleEn || news.subjectTitle,
          url: news.url,
          status: news.status === 'published' ? 'published' : 'draft',
          publishedAt: new Date(news.publishedAt || Date.now()),
        },
      })
      count++
    } catch (error) {
      console.error(`Error migrating news ${news.id}:`, error)
    }
  }

  return count
}

async function main() {
  console.log('🚀 Starting migration from JSON to PostgreSQL...\n')

  const stats: MigrationStats = {
    users: 0,
    schedule: 0,
    materials: 0,
    downloads: 0,
    news: 0,
    articles: 0,
    pages: 0,
  }

  try {
    console.log('📦 Migrating users...')
    stats.users = await migrateUsers()
    console.log(`✅ Migrated ${stats.users} users\n`)

    console.log('📅 Migrating schedule items...')
    stats.schedule = await migrateSchedule()
    console.log(`✅ Migrated ${stats.schedule} schedule items\n`)

    console.log('📚 Migrating materials...')
    stats.materials = await migrateMaterials()
    console.log(`✅ Migrated ${stats.materials} materials\n`)

    console.log('💾 Migrating downloads...')
    stats.downloads = await migrateDownloads()
    console.log(`✅ Migrated ${stats.downloads} downloads\n`)

    console.log('📰 Migrating news articles...')
    stats.news = await migrateNews()
    console.log(`✅ Migrated ${stats.news} news articles\n`)

    console.log('\n✨ Migration completed!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${stats.users}`)
    console.log(`   Schedule Items: ${stats.schedule}`)
    console.log(`   Materials: ${stats.materials}`)
    console.log(`   Downloads: ${stats.downloads}`)
    console.log(`   News: ${stats.news}`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { main as migrateToPostgres }

