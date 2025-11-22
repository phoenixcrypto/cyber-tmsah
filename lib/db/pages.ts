import { Database } from './database'

export interface Page {
  id: string
  slug: string // URL slug (e.g., 'about', 'contact')
  title: string
  titleEn: string
  content: string // HTML content
  contentEn: string // HTML content in English
  metaDescription?: string
  metaDescriptionEn?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
  order?: number // For ordering pages in navigation
}

const pagesDB = new Database<Page>('pages')

/**
 * Get all pages
 */
export function getAllPages(): Page[] {
  return pagesDB.readAll()
}

/**
 * Get page by ID
 */
export function getPageById(id: string): Page | undefined {
  return pagesDB.findById(id)
}

/**
 * Get page by slug
 */
export function getPageBySlug(slug: string): Page | undefined {
  const pages = pagesDB.readAll()
  return pages.find((page) => page.slug === slug)
}

/**
 * Get published pages
 */
export function getPublishedPages(): Page[] {
  const pages = pagesDB.readAll()
  return pages.filter((page) => page.status === 'published')
}

/**
 * Add new page
 */
export function addPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'> | Page): Page {
  const newPage: Page = {
    ...page,
    id: 'id' in page && page.id ? page.id : `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return pagesDB.add(newPage)
}

/**
 * Update page
 */
export function updatePage(id: string, updates: Partial<Omit<Page, 'id' | 'createdAt'>>): Page | null {
  return pagesDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Delete page
 */
export function deletePage(id: string): boolean {
  return pagesDB.delete(id)
}

