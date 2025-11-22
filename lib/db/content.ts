import { Database } from './database'

export interface StaticContent {
  id: string
  page: 'privacy' | 'terms' | 'about'
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  content: string // HTML content
  contentEn: string // HTML content in English
  createdAt?: string
  updatedAt?: string
}

const contentDB = new Database<StaticContent>('content')

/**
 * Get all static content
 */
export function getAllStaticContent(): StaticContent[] {
  return contentDB.readAll()
}

/**
 * Get content by page
 */
export function getContentByPage(page: 'privacy' | 'terms' | 'about'): StaticContent | undefined {
  return contentDB.find((content) => content.page === page)[0]
}

/**
 * Get content by ID
 */
export function getContentById(id: string): StaticContent | undefined {
  return contentDB.findById(id)
}

/**
 * Add or update static content
 */
export function upsertStaticContent(content: Omit<StaticContent, 'id' | 'createdAt' | 'updatedAt'>): StaticContent {
  const existing = getContentByPage(content.page)
  
  if (existing) {
    // Update existing
    return contentDB.update(existing.id, {
      ...content,
      updatedAt: new Date().toISOString(),
    }) || existing
  } else {
    // Add new
    const newContent: StaticContent = {
      ...content,
      id: `content-${content.page}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return contentDB.add(newContent)
  }
}

/**
 * Update static content
 */
export function updateStaticContent(id: string, updates: Partial<Omit<StaticContent, 'id' | 'createdAt'>>): StaticContent | null {
  return contentDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

