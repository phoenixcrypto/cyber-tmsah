// Articles data structure and helper functions

export interface Article {
  id: string
  title: string
  subjectId: string
  subjectTitle: string
  publishedAt: string
  url: string
  excerpt?: string
  status?: 'published' | 'draft'
}

// Subject data mapping
const subjectData: { [key: string]: { title: string; titleEn: string } } = {
  'applied-physics': {
    title: 'الفيزياء التطبيقية',
    titleEn: 'Applied Physics'
  },
  'mathematics': {
    title: 'الرياضيات',
    titleEn: 'Mathematics'
  },
  'entrepreneurship': {
    title: 'ريادة الأعمال والتفكير الإبداعي',
    titleEn: 'Entrepreneurship & Creative Thinking'
  },
  'information-technology': {
    title: 'تكنولوجيا المعلومات',
    titleEn: 'Information Technology'
  },
  'database-systems': {
    title: 'قواعد البيانات',
    titleEn: 'Database Systems'
  },
  'english-language': {
    title: 'اللغة الإنجليزية',
    titleEn: 'English Language'
  },
  'information-systems': {
    title: 'نظم المعلومات',
    titleEn: 'Information Systems'
  }
}

// Static articles storage
// In production, this would be replaced with a database or API call
let articlesCache: Article[] = []

// Function to add an article (for future use when articles are added)
export function addArticle(article: Omit<Article, 'url'>) {
  const subject = subjectData[article.subjectId]
  if (!subject) return

  const newArticle: Article = {
    ...article,
    url: `/materials/${article.subjectId}/${article.id}`
  }
  
  articlesCache.push(newArticle)
  // Sort by publishedAt (newest first)
  articlesCache.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// Function to get latest articles from all subjects
export function getLatestArticles(lang: 'ar' | 'en' = 'ar', limit: number = 5): Article[] {
  // Filter only published articles
  const publishedArticles = articlesCache.filter(article => article.status !== 'draft')
  
  // Map subject titles based on language
  const articlesWithLocalizedTitles = publishedArticles.map(article => {
    const subject = subjectData[article.subjectId]
    return {
      ...article,
      subjectTitle: lang === 'ar' ? subject?.title || article.subjectTitle : subject?.titleEn || article.subjectTitle
    }
  })
  
  // Return top N articles sorted by publishedAt
  return articlesWithLocalizedTitles.slice(0, limit)
}

// Function to get all articles for a specific subject
export function getArticlesBySubject(subjectId: string): Article[] {
  return articlesCache.filter(article => article.subjectId === subjectId && article.status !== 'draft')
}

// Initialize with sample articles (for testing)
// Remove this in production and use addArticle() when articles are actually added
export function initializeSampleArticles() {
  // This is just for demonstration - remove in production
  // When you add real articles, use addArticle() function
  /*
  addArticle({
    id: 'sample-1',
    title: 'مقدمة في الفيزياء التطبيقية',
    subjectId: 'applied-physics',
    subjectTitle: 'الفيزياء التطبيقية',
    publishedAt: new Date().toISOString(),
    status: 'published'
  })
  */
}

// Export subject data for use in other components
export { subjectData }

