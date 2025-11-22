#!/usr/bin/env node

/**
 * Simple Admin API Tool
 * 
 * Usage Examples:
 *   node scripts/admin-api.js articles:list
 *   node scripts/admin-api.js articles:add --title="عنوان" --content="محتوى"
 *   node scripts/admin-api.js pages:list
 *   node scripts/admin-api.js stats
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
  }

  const options = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  // Add cookie if token exists
  if (ADMIN_TOKEN) {
    headers['Cookie'] = `admin-token=${ADMIN_TOKEN}`
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }
    
    return data
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]
const options = {}

// Parse options
for (let i = 1; i < args.length; i += 2) {
  const key = args[i]?.replace('--', '')
  const value = args[i + 1]
  if (key && value) {
    options[key] = value
  }
}

async function main() {
  switch (command) {
    case 'articles:list':
      const articles = await apiRequest('/api/admin/articles')
      console.log('\n📄 Articles:')
      console.table(articles.articles || [])
      break

    case 'articles:add':
      if (!options.title || !options.content || !options.materialId) {
        console.error('❌ Missing required options: --title, --content, --materialId')
        process.exit(1)
      }
      const newArticle = await apiRequest('/api/admin/articles', 'POST', {
        title: options.title,
        titleEn: options.titleEn || options.title,
        materialId: options.materialId,
        content: options.content,
        contentEn: options.contentEn || options.content,
        author: options.author || 'Admin',
        status: options.status || 'draft',
      })
      console.log('✅ Article added! ID:', newArticle.article?.id)
      break

    case 'pages:list':
      const pages = await apiRequest('/api/admin/pages')
      console.log('\n📄 Pages:')
      console.table(pages.pages || [])
      break

    case 'pages:add':
      if (!options.slug || !options.title || !options.content) {
        console.error('❌ Missing required options: --slug, --title, --content')
        process.exit(1)
      }
      const newPage = await apiRequest('/api/admin/pages', 'POST', {
        slug: options.slug,
        title: options.title,
        titleEn: options.titleEn || options.title,
        content: options.content,
        contentEn: options.contentEn || options.content,
        status: options.status || 'draft',
      })
      console.log('✅ Page added! ID:', newPage.page?.id)
      break

    case 'materials:list':
      const materials = await apiRequest('/api/admin/materials')
      console.log('\n📚 Materials:')
      console.table(materials.materials || [])
      break

    case 'schedule:list':
      const endpoint = options.group 
        ? `/api/admin/schedule?group=${options.group}`
        : '/api/admin/schedule'
      const schedule = await apiRequest(endpoint)
      console.log('\n📅 Schedule:')
      console.table(schedule.items || [])
      break

    case 'users:list':
      const users = await apiRequest('/api/admin/users')
      console.log('\n👥 Users:')
      console.table(users.users || [])
      break

    case 'stats':
      const [scheduleData, materialsData, downloadsData, articlesData, pagesData, usersData] = await Promise.all([
        apiRequest('/api/schedule'),
        apiRequest('/api/materials'),
        apiRequest('/api/downloads'),
        apiRequest('/api/admin/articles'),
        apiRequest('/api/admin/pages'),
        apiRequest('/api/admin/users'),
      ])

      console.log('\n📊 Dashboard Statistics:\n')
      console.log(`Schedule Items: ${scheduleData.schedule?.length || 0}`)
      console.log(`Materials: ${materialsData.materials?.length || 0}`)
      console.log(`Downloads: ${downloadsData.software?.length || 0}`)
      console.log(`Articles: ${articlesData.articles?.length || 0}`)
      console.log(`Pages: ${pagesData.pages?.length || 0}`)
      console.log(`Users: ${usersData.users?.length || 0}`)
      break

    default:
      console.log(`
📖 Cyber TMSAH Admin CLI Tool

Usage:
  node scripts/admin-api.js <command> [options]

Commands:
  articles:list                    List all articles
  articles:add                    Add new article
    --title <title>               Article title (required)
    --content <content>            Article content (required)
    --materialId <id>             Material ID (required)
    --titleEn <titleEn>           Article title (English)
    --contentEn <contentEn>       Article content (English)
    --author <author>             Author name
    --status <status>             Status (published/draft)

  pages:list                      List all pages
  pages:add                       Add new page
    --slug <slug>                 Page slug (required)
    --title <title>               Page title (required)
    --content <content>           Page content (required)
    --titleEn <titleEn>           Page title (English)
    --contentEn <contentEn>       Page content (English)
    --status <status>             Status (published/draft)

  materials:list                  List all materials
  schedule:list                   List all schedule items
    --group <group>               Filter by group (Group 1/Group 2)
  users:list                      List all users
  stats                           Show dashboard statistics

Environment Variables:
  API_URL                         API base URL (default: http://localhost:3000)
  ADMIN_TOKEN                     Admin JWT token (optional, for authentication)

Examples:
  node scripts/admin-api.js articles:list
  node scripts/admin-api.js articles:add --title="عنوان" --content="<p>محتوى</p>" --materialId="material-123"
  node scripts/admin-api.js pages:add --slug="about" --title="من نحن" --content="<p>محتوى</p>"
  node scripts/admin-api.js stats
      `)
  }
}

main().catch(console.error)

