/**
 * AI Content Suggestions
 */

import { getArticles, getMaterials } from '@/lib/content/api'

export interface ContentSuggestion {
  type: 'title' | 'tag' | 'category' | 'related'
  suggestion: string
  confidence: number
  reason?: string
}

/**
 * Generate title suggestions based on content
 */
export async function generateTitleSuggestions(content: string): Promise<ContentSuggestion[]> {
  // Simple keyword extraction (can be enhanced with AI API)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3)

  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)

  return topWords.map((word, index) => ({
    type: 'title' as const,
    suggestion: word.charAt(0).toUpperCase() + word.slice(1),
    confidence: 0.7 - index * 0.1,
    reason: 'Based on content frequency',
  }))
}

/**
 * Generate tag suggestions
 */
export async function generateTagSuggestions(_content: string, existingTags: string[] = []): Promise<ContentSuggestion[]> {
  // Get similar articles
  const articles = await getArticles({ limit: 10 })
  
  // Extract common tags from similar articles
  const tagFreq: Record<string, number> = {}
  articles.forEach((article: any) => {
    const tags = article.tags || []
    tags.forEach((tag: string) => {
      if (!existingTags.includes(tag)) {
        tagFreq[tag] = (tagFreq[tag] || 0) + 1
      }
    })
  })

  return Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({
      type: 'tag' as const,
      suggestion: tag,
      confidence: Math.min(count / 5, 0.9),
      reason: `Used in ${count} similar articles`,
    }))
}

/**
 * Generate category suggestions
 */
export async function generateCategorySuggestions(content: string): Promise<ContentSuggestion[]> {
  const materials = await getMaterials()
  
  // Simple keyword matching (can be enhanced with AI)
  const contentLower = content.toLowerCase()
  
  return materials
    .map((material: any) => {
      const titleLower = (material.title || '').toLowerCase()
      const descLower = (material.description || '').toLowerCase()
      
      // Calculate similarity
      const titleMatch = titleLower.split(' ').some((word: string) => 
        contentLower.includes(word) && word.length > 3
      )
      const descMatch = descLower.split(' ').some((word: string) => 
        contentLower.includes(word) && word.length > 3
      )
      
      const confidence = titleMatch ? 0.8 : descMatch ? 0.6 : 0.3
      
      return {
        type: 'category' as const,
        suggestion: material.title,
        confidence,
        reason: titleMatch ? 'Title matches content' : 'Description matches content',
      }
    })
    .filter((suggestion) => suggestion.confidence > 0.5)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

/**
 * Generate related content suggestions
 */
export async function generateRelatedContent(contentId: string, _contentType: 'article' | 'material'): Promise<ContentSuggestion[]> {
  // Get similar content based on tags, categories, etc.
  const articles = await getArticles({ limit: 20 })
  
  // Filter out current content
  const related = articles
    .filter((article: any) => article.id !== contentId)
    .slice(0, 5)
    .map((article: any) => ({
      type: 'related' as const,
      suggestion: article.title,
      confidence: 0.7,
      reason: 'Similar content',
      data: {
        id: article.id,
        type: 'article',
      },
    }))

  return related
}

/**
 * Generate SEO suggestions
 */
export async function generateSEOSuggestions(content: string, title: string): Promise<{
  metaDescription?: string
  keywords?: string[]
  suggestions: ContentSuggestion[]
}> {
  // Generate meta description (first 155 characters)
  const metaDescription = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 155)
    .trim()

  // Extract keywords
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 4)

  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  const suggestions: ContentSuggestion[] = []

  // Title length check
  if (title.length > 60) {
    suggestions.push({
      type: 'title',
      suggestion: 'Title should be under 60 characters',
      confidence: 1,
      reason: 'SEO best practice',
    })
  }

  // Meta description length check
  if (metaDescription.length < 120) {
    suggestions.push({
      type: 'title',
      suggestion: 'Meta description should be 120-155 characters',
      confidence: 1,
      reason: 'SEO best practice',
    })
  }

  return {
    metaDescription,
    keywords,
    suggestions,
  }
}

