import { Database } from './database'

export interface Article {
  id: string
  materialId: string // ID of the material/subject this article belongs to
  title: string
  titleEn: string
  content: string // HTML content
  contentEn: string // HTML content in English
  excerpt?: string
  excerptEn?: string
  author: string
  status: 'published' | 'draft'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  views?: number
  tags?: string[]
}

const articlesDB = new Database<Article>('articles')

/**
 * Get all articles
 */
export function getAllArticles(): Article[] {
  return articlesDB.readAll()
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): Article | undefined {
  return articlesDB.findById(id)
}

/**
 * Get articles by material ID
 */
export function getArticlesByMaterialId(materialId: string): Article[] {
  const articles = articlesDB.readAll()
  return articles.filter((article) => article.materialId === materialId)
}

/**
 * Get published articles
 */
export function getPublishedArticles(): Article[] {
  const articles = articlesDB.readAll()
  return articles.filter((article) => article.status === 'published')
}

/**
 * Add new article
 */
export function addArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> | Article): Article {
  const newArticle: Article = {
    ...article,
    id: 'id' in article && article.id ? article.id : `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: article.views || 0,
  }
  return articlesDB.add(newArticle)
}

/**
 * Update article
 */
export function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Article | null {
  return articlesDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Delete article
 */
export function deleteArticle(id: string): boolean {
  return articlesDB.delete(id)
}

/**
 * Increment article views
 */
export function incrementArticleViews(id: string): void {
  const article = articlesDB.findById(id)
  if (article) {
    articlesDB.update(id, {
      views: (article.views || 0) + 1,
    })
  }
}

