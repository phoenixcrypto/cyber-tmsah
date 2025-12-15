/**
 * Content API - Unified API for all content types
 * This API provides a single interface for themes to access content
 */

import { db } from '@/lib/db/firebase'

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

// Helper function to get cached data
function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }
  return null
}

// Helper function to set cache
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Clear cache for a specific key
export function clearCache(key: string): void {
  cache.delete(key)
}

// Clear all cache
export function clearAllCache(): void {
  cache.clear()
}

// Articles API
export async function getArticles(options?: {
  limit?: number
  offset?: number
  status?: 'published' | 'draft'
  materialId?: string
  search?: string
}) {
  const cacheKey = `articles:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const articlesRef = db.collection('articles')
    let query: FirebaseFirestore.Query = articlesRef

    if (options?.status) {
      query = query.where('status', '==', options.status)
    }

    if (options?.materialId) {
      query = query.where('materialId', '==', options.materialId)
    }

    if (options?.search) {
      // Note: Firestore doesn't support full-text search natively
      // You might need to use Algolia or similar for better search
      query = query.where('title', '>=', options.search)
        .where('title', '<=', options.search + '\uf8ff')
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.offset(options.offset)
    }

    const snapshot = await query.orderBy('publishedAt', 'desc').get()
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, articles)
    return articles
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export async function getArticle(id: string) {
  const cacheKey = `article:${id}`
  const cached = getCached<any>(cacheKey)
  if (cached) return cached

  try {
    const doc = await db.collection('articles').doc(id).get()
    if (!doc.exists) return null

    const article = { id: doc.id, ...doc.data() }
    setCache(cacheKey, article)
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Materials API
export async function getMaterials(options?: {
  limit?: number
  offset?: number
  search?: string
}) {
  const cacheKey = `materials:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const materialsRef = db.collection('materials')
    let query: FirebaseFirestore.Query = materialsRef

    if (options?.search) {
      query = query.where('title', '>=', options.search)
        .where('title', '<=', options.search + '\uf8ff')
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.offset(options.offset)
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get()
    const materials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, materials)
    return materials
  } catch (error) {
    console.error('Error fetching materials:', error)
    return []
  }
}

export async function getMaterial(id: string) {
  const cacheKey = `material:${id}`
  const cached = getCached<any>(cacheKey)
  if (cached) return cached

  try {
    const doc = await db.collection('materials').doc(id).get()
    if (!doc.exists) return null

    const material = { id: doc.id, ...doc.data() }
    setCache(cacheKey, material)
    return material
  } catch (error) {
    console.error('Error fetching material:', error)
    return null
  }
}

// News API
export async function getNews(options?: {
  limit?: number
  offset?: number
  status?: 'published' | 'draft'
}) {
  const cacheKey = `news:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const newsRef = db.collection('news_articles')
    let query: FirebaseFirestore.Query = newsRef

    if (options?.status) {
      query = query.where('status', '==', options.status)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.offset(options.offset)
    }

    const snapshot = await query.orderBy('publishedAt', 'desc').get()
    const news = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, news)
    return news
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

// Pages API
export async function getPages(options?: {
  status?: 'published' | 'draft'
  slug?: string
}) {
  const cacheKey = `pages:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const pagesRef = db.collection('pages')
    let query: FirebaseFirestore.Query = pagesRef

    if (options?.status) {
      query = query.where('status', '==', options.status)
    }

    if (options?.slug) {
      query = query.where('slug', '==', options.slug)
    }

    const snapshot = await query.orderBy('order', 'asc').get()
    const pages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, pages)
    return pages
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

export async function getPage(slug: string) {
  const cacheKey = `page:${slug}`
  const cached = getCached<any>(cacheKey)
  if (cached) return cached

  try {
    const snapshot = await db.collection('pages')
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .limit(1)
      .get()

    if (snapshot.empty) return null

    const page = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    setCache(cacheKey, page)
    return page
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// Schedule API
export async function getSchedule(options?: {
  group?: string
  day?: string
}) {
  const cacheKey = `schedule:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const scheduleRef = db.collection('schedule_items')
    let query: FirebaseFirestore.Query = scheduleRef

    if (options?.group) {
      query = query.where('group', '==', options.group)
    }

    if (options?.day) {
      query = query.where('day', '==', options.day)
    }

    const snapshot = await query.orderBy('time', 'asc').get()
    const schedule = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, schedule)
    return schedule
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return []
  }
}

// Downloads API
export async function getDownloads(options?: {
  limit?: number
  category?: string
}) {
  const cacheKey = `downloads:${JSON.stringify(options)}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const downloadsRef = db.collection('download_software')
    let query: FirebaseFirestore.Query = downloadsRef

    if (options?.category) {
      query = query.where('category', '==', options.category)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get()
    const downloads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache(cacheKey, downloads)
    return downloads
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return []
  }
}

// Settings API
export async function getSettings() {
  const cacheKey = 'settings'
  const cached = getCached<any>(cacheKey)
  if (cached) return cached

  try {
    // Settings might be stored in a single document or collection
    // Adjust based on your database structure
    const doc = await db.collection('settings').doc('main').get()
    if (!doc.exists) return {}

    const settings = doc.data()
    setCache(cacheKey, settings)
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
}

// Theme Settings API
export async function getThemeSettings(themeName: string = 'default') {
  const cacheKey = `theme:${themeName}:settings`
  const cached = getCached<any>(cacheKey)
  if (cached) return cached

  try {
    const doc = await db.collection('theme_settings').doc(themeName).get()
    if (!doc.exists) {
      // Return default settings
      return {
        colors: {
          primary: '#ff3b40',
          secondary: '#080808'
        },
        fonts: {
          primary: 'Cairo'
        }
      }
    }

    const settings = doc.data()
    setCache(cacheKey, settings)
    return settings
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return {}
  }
}

