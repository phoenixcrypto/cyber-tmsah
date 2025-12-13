/**
 * Database seeding script
 * Run: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'
import { seedMaterials } from '@/lib/seed-data/materials'
import { seedDownloads } from '@/lib/seed-data/downloads'
import { seedScheduleLectures, seedScheduleSections } from '@/lib/seed-data/schedule'
import { seedNews } from '@/lib/seed-data/news'
import { seedPages } from '@/lib/seed-data/pages'
import { seedArticles } from '@/lib/seed-data/articles'

const prisma = new PrismaClient()

async function seedMaterialsData() {
  for (const material of seedMaterials) {
    await prisma.material.upsert({
      where: { id: material.id },
      update: {
        title: material.title,
        titleEn: material.titleEn,
        description: material.description,
        descriptionEn: material.descriptionEn,
        icon: material.icon,
        color: material.color,
        articlesCount: material.articlesCount,
        lastUpdated: material.lastUpdated,
      },
      create: {
        id: material.id,
        title: material.title,
        titleEn: material.titleEn,
        description: material.description,
        descriptionEn: material.descriptionEn,
        icon: material.icon,
        color: material.color,
        articlesCount: material.articlesCount,
        lastUpdated: material.lastUpdated,
      },
    })
  }
  return seedMaterials.length
}

async function seedDownloadsData() {
  for (const download of seedDownloads) {
    await prisma.downloadSoftware.upsert({
      where: { id: download.id },
      update: {
        name: download.name,
        nameEn: download.nameEn,
        description: download.description,
        descriptionEn: download.descriptionEn,
        icon: download.icon,
        videoUrl: download.videoUrl ?? null,
        downloadUrl: download.downloadUrl ?? null,
        category: download.category ?? null,
      },
      create: {
        id: download.id,
        name: download.name,
        nameEn: download.nameEn,
        description: download.description,
        descriptionEn: download.descriptionEn,
        icon: download.icon,
        videoUrl: download.videoUrl ?? null,
        downloadUrl: download.downloadUrl ?? null,
        category: download.category ?? null,
      },
    })
  }
  return seedDownloads.length
}

async function seedScheduleData() {
  let count = 0
  
  // Seed lectures
  for (const lecture of seedScheduleLectures) {
    await prisma.scheduleItem.upsert({
      where: { id: lecture.id },
      update: {
        title: lecture.title,
        time: lecture.time,
        location: lecture.location,
        instructor: lecture.instructor,
        type: lecture.type,
        group: lecture.group === 'Group 1' ? 'Group1' : 'Group2',
        day: lecture.day as 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
      },
      create: {
        id: lecture.id,
        title: lecture.title,
        time: lecture.time,
        location: lecture.location,
        instructor: lecture.instructor,
        type: lecture.type,
        group: lecture.group === 'Group 1' ? 'Group1' : 'Group2',
        day: lecture.day as 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
      },
    })
    count++
  }
  
  // Seed sections
  for (const section of seedScheduleSections) {
    await prisma.scheduleItem.upsert({
      where: { id: section.id },
      update: {
        title: section.title,
        time: section.time,
        location: section.location,
        instructor: section.instructor,
        type: section.type,
        group: section.group === 'Group 1' ? 'Group1' : 'Group2',
        sectionNumber: section.sectionNumber,
        day: section.day as 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
      },
      create: {
        id: section.id,
        title: section.title,
        time: section.time,
        location: section.location,
        instructor: section.instructor,
        type: section.type,
        group: section.group === 'Group 1' ? 'Group1' : 'Group2',
        sectionNumber: section.sectionNumber,
        day: section.day as 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
      },
    })
    count++
  }
  
  return count
}

async function seedNewsData() {
  for (const news of seedNews) {
    await prisma.newsArticle.upsert({
      where: { id: news.id },
      update: {
        title: news.title,
        titleEn: news.titleEn,
        subjectId: news.subjectId,
        subjectTitle: news.subjectTitle,
        subjectTitleEn: news.subjectTitleEn,
        url: news.url,
        status: news.status,
        publishedAt: news.publishedAt,
      },
      create: {
        id: news.id,
        title: news.title,
        titleEn: news.titleEn,
        subjectId: news.subjectId,
        subjectTitle: news.subjectTitle,
        subjectTitleEn: news.subjectTitleEn,
        url: news.url,
        status: news.status,
        publishedAt: news.publishedAt,
      },
    })
  }
  return seedNews.length
}

async function seedPagesData() {
  for (const page of seedPages) {
    await prisma.page.upsert({
      where: { id: page.id },
      update: {
        slug: page.slug,
        title: page.title,
        titleEn: page.titleEn,
        content: page.content,
        contentEn: page.contentEn,
        metaDescription: page.metaDescription ?? null,
        metaDescriptionEn: page.metaDescriptionEn ?? null,
        status: page.status,
        order: page.order ?? null,
      },
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        titleEn: page.titleEn,
        content: page.content,
        contentEn: page.contentEn,
        metaDescription: page.metaDescription ?? null,
        metaDescriptionEn: page.metaDescriptionEn ?? null,
        status: page.status,
        order: page.order ?? null,
      },
    })
  }
  return seedPages.length
}

async function seedArticlesData() {
  let count = 0
  for (const article of seedArticles) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        materialId: article.materialId,
        title: article.title,
        titleEn: article.titleEn,
        content: article.content,
        contentEn: article.contentEn,
        excerpt: article.excerpt ?? null,
        excerptEn: article.excerptEn ?? null,
        author: article.author,
        status: article.status,
        publishedAt: article.publishedAt ?? null,
        tags: article.tags,
      },
      create: {
        id: article.id,
        materialId: article.materialId,
        title: article.title,
        titleEn: article.titleEn,
        content: article.content,
        contentEn: article.contentEn,
        excerpt: article.excerpt ?? null,
        excerptEn: article.excerptEn ?? null,
        author: article.author,
        status: article.status,
        publishedAt: article.publishedAt ?? null,
        tags: article.tags,
      },
    })
    count++
  }
  return count
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n')
    
    const materialsCount = await seedMaterialsData()
    console.log(`✅ Seeded ${materialsCount} materials`)
    
    const downloadsCount = await seedDownloadsData()
    console.log(`✅ Seeded ${downloadsCount} downloads`)
    
    const scheduleCount = await seedScheduleData()
    console.log(`✅ Seeded ${scheduleCount} schedule items`)
    
    const newsCount = await seedNewsData()
    console.log(`✅ Seeded ${newsCount} news articles`)
    
    const pagesCount = await seedPagesData()
    console.log(`✅ Seeded ${pagesCount} pages`)
    
    const articlesCount = await seedArticlesData()
    console.log(`✅ Seeded ${articlesCount} articles`)
    
    console.log('\n🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

