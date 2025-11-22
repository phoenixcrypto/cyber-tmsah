import { Database } from './database'

export interface NewsArticle {
  id: string
  title: string
  titleEn: string
  subjectId: string
  subjectTitle: string
  subjectTitleEn: string
  url: string
  publishedAt: string
  status: 'published' | 'draft'
  createdAt?: string
  updatedAt?: string
}

const newsDB = new Database<NewsArticle>('news')

/**
 * Get all news articles
 */
export function getAllNewsArticles(): NewsArticle[] {
  return newsDB.readAll()
}

/**
 * Get published news articles
 */
export function getPublishedNewsArticles(limit?: number): NewsArticle[] {
  const articles = newsDB.find((article) => article.status === 'published')
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return limit ? articles.slice(0, limit) : articles
}

/**
 * Get news article by ID
 */
export function getNewsArticleById(id: string): NewsArticle | undefined {
  return newsDB.findById(id)
}

/**
 * Add new news article
 */
export function addNewsArticle(article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'> | NewsArticle): NewsArticle {
  const newArticle: NewsArticle = {
    ...article,
    id: 'id' in article && article.id ? article.id : `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return newsDB.add(newArticle)
}

/**
 * Update news article
 */
export function updateNewsArticle(id: string, updates: Partial<Omit<NewsArticle, 'id' | 'createdAt'>>): NewsArticle | null {
  return newsDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Delete news article
 */
export function deleteNewsArticle(id: string): boolean {
  return newsDB.delete(id)
}

