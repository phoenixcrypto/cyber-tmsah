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
        videoUrl: download.videoUrl || null,
        downloadUrl: download.downloadUrl || null,
        category: download.category || null,
      },
      create: {
        id: download.id,
        name: download.name,
        nameEn: download.nameEn,
        description: download.description,
        descriptionEn: download.descriptionEn,
        icon: download.icon,
        videoUrl: download.videoUrl || null,
        downloadUrl: download.downloadUrl || null,
        category: download.category || null,
      },
    })
  }
  return seedDownloads.length
}

function mapGroup(group: string) {
  return group === 'Group 2' ? 'Group2' : 'Group1'
}

async function seedScheduleData() {
  const items = [...seedScheduleLectures, ...seedScheduleSections]
  for (const item of items) {
    await prisma.scheduleItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        time: item.time,
        location: item.location,
        instructor: item.instructor,
        type: item.type,
        group: mapGroup(item.group),
        sectionNumber: item.sectionNumber,
        day: item.day,
      },
      create: {
        id: item.id,
        title: item.title,
        time: item.time,
        location: item.location,
        instructor: item.instructor,
        type: item.type,
        group: mapGroup(item.group),
        sectionNumber: item.sectionNumber,
        day: item.day,
      },
    })
  }
  return items.length
}

async function seedNewsData() {
  for (const article of seedNews) {
    await prisma.newsArticle.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        titleEn: article.titleEn,
        subjectId: article.subjectId,
        subjectTitle: article.subjectTitle,
        subjectTitleEn: article.subjectTitleEn,
        url: article.url,
        status: article.status,
        publishedAt: new Date(article.publishedAt),
      },
      create: {
        id: article.id,
        title: article.title,
        titleEn: article.titleEn,
        subjectId: article.subjectId,
        subjectTitle: article.subjectTitle,
        subjectTitleEn: article.subjectTitleEn,
        url: article.url,
        status: article.status,
        publishedAt: new Date(article.publishedAt),
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
        metaDescription: page.metaDescription,
        metaDescriptionEn: page.metaDescriptionEn,
        status: page.status,
        order: page.order,
      },
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        titleEn: page.titleEn,
        content: page.content,
        contentEn: page.contentEn,
        metaDescription: page.metaDescription,
        metaDescriptionEn: page.metaDescriptionEn,
        status: page.status,
        order: page.order,
      },
    })
  }
  return seedPages.length
}

async function seedArticlesData() {
  for (const article of seedArticles) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        materialId: article.materialId,
        title: article.title,
        titleEn: article.titleEn,
        content: article.content,
        contentEn: article.contentEn,
        excerpt: article.excerpt,
        excerptEn: article.excerptEn,
        author: article.author,
        status: article.status,
        tags: article.tags,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      },
      create: {
        id: article.id,
        materialId: article.materialId,
        title: article.title,
        titleEn: article.titleEn,
        content: article.content,
        contentEn: article.contentEn,
        excerpt: article.excerpt,
        excerptEn: article.excerptEn,
        author: article.author,
        status: article.status,
        tags: article.tags,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      },
    })
  }
  return seedArticles.length
}

export async function seedInitialData() {
  console.log('🌱 Seeding initial platform data...')
  try {
    const materials = await seedMaterialsData()
    const downloads = await seedDownloadsData()
    const schedule = await seedScheduleData()
    const news = await seedNewsData()
    const pages = await seedPagesData()
    const articles = await seedArticlesData()

    console.log('✅ Seeding completed successfully!')
    console.table([
      { dataset: 'Materials', count: materials },
      { dataset: 'Downloads', count: downloads },
      { dataset: 'Schedule Items', count: schedule },
      { dataset: 'News Articles', count: news },
      { dataset: 'Pages', count: pages },
      { dataset: 'Articles', count: articles },
    ])
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedInitialData()
}


