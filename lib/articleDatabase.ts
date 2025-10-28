// Simple database for storing published articles
// In a real app, this would be a proper database

interface Article {
  id: string
  title: string
  description: string
  content: string
  subjectId: string
  subjectName: string
  instructor: string
  duration: string
  date: string
  type: 'lecture' | 'lab' | 'assignment'
  status: 'published' | 'draft' | 'archived' | 'scheduled'
  publishedAt: string
  lastModified: string
  views: number
  likes: number
  tags: string[]
  featured: boolean
  scheduledFor?: string
  imageUrl?: string
  excerpt: string
}

// In-memory storage (in production, use a real database)
let articles: Article[] = [
  {
    id: '1',
    title: 'Introduction to Applied Physics',
    description: 'Basic concepts and principles of physics in technology applications',
    content: '# Introduction to Applied Physics\n\n## Overview\nApplied physics is the application of physics principles to solve real-world problems and develop new technologies.\n\n## Key Concepts\n\n### 1. Fundamental Principles\n- **Newton\'s Laws of Motion**: The foundation of classical mechanics\n- **Conservation of Energy**: Energy cannot be created or destroyed, only transformed\n- **Wave-Particle Duality**: Matter exhibits both wave and particle properties',
    subjectId: 'applied-physics',
    subjectName: 'Applied Physics',
    instructor: 'Dr. Ahmed Bakr',
    duration: '90 minutes',
    date: '2024-01-15',
    type: 'lecture',
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-15T10:00:00Z',
    views: 156,
    likes: 23,
    tags: ['physics', 'mechanics', 'energy'],
    featured: true,
    excerpt: 'Learn the fundamental concepts of applied physics and their applications in modern technology.'
  },
  {
    id: '2',
    title: 'Calculus Fundamentals',
    description: 'Introduction to differential and integral calculus',
    content: '# Calculus Fundamentals\n\n## Introduction\nCalculus is the mathematical study of continuous change, similar to how geometry is the study of shape and algebra is the study of operations.\n\n## Key Concepts\n\n### 1. Limits\nA limit describes the behavior of a function as its input approaches a particular value.\n\n### 2. Derivatives\nA derivative measures how a function changes as its input changes.\n\n### 3. Integrals\nAn integral represents the area under a curve or the accumulation of quantities.',
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    instructor: 'Dr. Simon Ezzat',
    duration: '90 minutes',
    date: '2024-01-16',
    type: 'lecture',
    status: 'published',
    publishedAt: '2024-01-16T10:00:00Z',
    lastModified: '2024-01-16T10:00:00Z',
    views: 89,
    likes: 15,
    tags: ['calculus', 'mathematics', 'derivatives'],
    featured: false,
    excerpt: 'Master the essential concepts of differential and integral calculus.'
  }
]

export const articleDatabase = {
  // Get all articles
  getAll: (): Article[] => {
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  // Get article by ID
  getById: (id: string): Article | undefined => {
    return articles.find(article => article.id === id)
  },

  // Get articles by subject
  getBySubject: (subjectId: string): Article[] => {
    return articles.filter(article => article.subjectId === subjectId)
  },

  // Search articles
  search: (query: string): Article[] => {
    const lowercaseQuery = query.toLowerCase()
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.description.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.subjectName.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Add new article
  add: (article: Omit<Article, 'id' | 'publishedAt' | 'lastModified' | 'views' | 'likes'>): Article => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: 0,
      likes: 0,
      tags: article.tags || [],
      featured: article.featured || false,
      excerpt: article.excerpt || article.description?.substring(0, 150) || ''
    }
    articles.push(newArticle)
    return newArticle
  },

  // Update article
  update: (id: string, updates: Partial<Article>): Article | null => {
    const index = articles.findIndex(article => article.id === id)
    if (index === -1) return null
    
    articles[index] = {
      ...articles[index],
      ...updates,
      lastModified: new Date().toISOString()
    } as Article
    return articles[index]
  },

  // Delete article
  delete: (id: string): boolean => {
    const index = articles.findIndex(article => article.id === id)
    if (index === -1) return false
    
    articles.splice(index, 1)
    return true
  },

  // Get statistics
  getStats: () => {
    const total = articles.length
    const published = articles.filter(a => a.status === 'published').length
    const drafts = articles.filter(a => a.status === 'draft').length
    const archived = articles.filter(a => a.status === 'archived').length
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
    const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0)

    return {
      total,
      published,
      drafts,
      archived,
      totalViews,
      totalLikes
    }
  }
}
