/**
 * Shared TypeScript types for the Cyber TMSAH platform
 */

export interface ScheduleItem {
  id?: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab'
  group: 'Group1' | 'Group2' | 'Group 1' | 'Group 2'
  sectionNumber?: number | null
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Material {
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  icon?: string
  color?: string
  articlesCount?: number
  lastUpdated?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Article {
  id: string
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  content?: string
  contentEn?: string
  excerpt?: string
  excerptEn?: string
  materialId?: string
  material?: Material
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
  type?: string
  duration?: string
}

export interface DownloadSoftware {
  id: string
  name: string
  nameEn?: string
  description: string
  descriptionEn?: string
  downloadUrl: string
  version?: string
  category?: string
  icon?: string
  size?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface NewsArticle {
  id: string
  title: string
  titleEn?: string
  content: string
  contentEn?: string
  excerpt?: string
  excerptEn?: string
  imageUrl?: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Page {
  id: string
  slug: string
  title: string
  titleEn?: string
  content: string
  contentEn?: string
  metaDescription?: string
  metaDescriptionEn?: string
  status?: 'draft' | 'published' | 'archived'
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface User {
  id: string
  username: string
  email: string | null
  name: string
  role: 'admin' | 'editor' | 'viewer'
  lastLogin?: string | Date | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface ErrorWithCode extends Error {
  code?: string
  statusCode?: number
}

