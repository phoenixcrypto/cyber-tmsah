/**
 * Strapi CMS API Integration
 * 
 * This file provides fetch helpers and configuration for connecting to Strapi.
 * When CMS_BASE_URL is not set or unreachable, the app falls back to local data.
 */

// Configure your Strapi CMS URL here
// For production, set this via environment variable: process.env.NEXT_PUBLIC_STRAPI_URL
export const CMS_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.cybertmsah.com'

// Optional: API token for Strapi authentication
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

/**
 * Fetches data from Strapi with error handling and fallback
 */
async function fetchFromStrapi<T>(endpoint: string): Promise<T | null> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Add API token if available
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(`${CMS_BASE_URL}${endpoint}`, {
      headers,
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Error fetching from Strapi:`, error)
    return null
  }
}

/**
 * Strapi Data Types (matches the expected Strapi JSON structure)
 */
export interface StrapiData<T> {
  data: T[]
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiArticle {
  id: number
  attributes: {
    title: string
    description: string
    content: string
    slug: string
    type: 'lecture' | 'lab' | 'assignment'
    status: 'published' | 'draft' | 'archived' | 'scheduled'
    duration: string
    excerpt: string
    views: number
    likes: number
    featured: boolean
    tags: string[]
    instructor: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    scheduledFor?: string
    imageUrl?: string
    subject?: {
      data: {
        id: number
        attributes: {
          name: string
          slug: string
          description: string
        }
      }
    }
  }
}

export interface StrapiMaterial {
  id: number
  attributes: {
    name: string
    description: string
    instructor: string
    icon: string
    lectures?: StrapiData<StrapiArticle>
  }
}

export interface StrapiPost {
  id: number
  attributes: {
    title: string
    content: string
    slug: string
    excerpt: string
    author: string
    published: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    tags: string[]
    imageUrl?: string
  }
}

/**
 * Article API Functions
 */
export async function getArticles(params?: {
  subjectId?: string
  status?: string
  limit?: number
  populate?: string
}): Promise<StrapiData<StrapiArticle> | null> {
  let endpoint = '/api/articles'
  
  const queryParams = ['populate=*']
  
  if (params?.subjectId) {
    queryParams.push(`filters[subject][slug][$eq]=${params.subjectId}`)
  }
  
  if (params?.status) {
    queryParams.push(`filters[status][$eq]=${params.status}`)
  }
  
  if (params?.limit) {
    queryParams.push(`pagination[limit]=${params.limit}`)
  }
  
  if (params?.populate) {
    queryParams.push(`populate=${params.populate}`)
  }
  
  if (queryParams.length > 1) {
    endpoint += `?${queryParams.join('&')}`
  } else {
    endpoint += `?${queryParams[0]}`
  }
  
  return fetchFromStrapi<StrapiData<StrapiArticle>>(endpoint)
}

export async function getArticleBySlug(slug: string): Promise<{ data: StrapiArticle | null } | null> {
  return fetchFromStrapi<{ data: StrapiArticle | null }>(
    `/api/articles?filters[slug][$eq]=${slug}&populate=*`
  )
}

export async function getArticleById(id: string | number): Promise<{ data: StrapiArticle } | null> {
  return fetchFromStrapi<{ data: StrapiArticle }>(
    `/api/articles/${id}?populate=*`
  )
}

/**
 * Material API Functions
 */
export async function getMaterials(): Promise<StrapiData<StrapiMaterial> | null> {
  return fetchFromStrapi<StrapiData<StrapiMaterial>>(
    '/api/materials?populate=*'
  )
}

export async function getMaterialBySlug(slug: string): Promise<{ data: StrapiMaterial | null } | null> {
  return fetchFromStrapi<{ data: StrapiMaterial | null }>(
    `/api/materials?filters[slug][$eq]=${slug}&populate[lectures][populate]=*`
  )
}

/**
 * Post API Functions
 */
export async function getPosts(params?: {
  limit?: number
  published?: boolean
}): Promise<StrapiData<StrapiPost> | null> {
  let endpoint = '/api/posts?populate=*'
  
  if (params?.published !== undefined) {
    endpoint += `&filters[published][$eq]=${params.published}`
  }
  
  if (params?.limit) {
    endpoint += `&pagination[limit]=${params.limit}`
  }
  
  return fetchFromStrapi<StrapiData<StrapiPost>>(endpoint)
}

export async function getPostBySlug(slug: string): Promise<{ data: StrapiPost | null } | null> {
  return fetchFromStrapi<{ data: StrapiPost | null }>(
    `/api/posts?filters[slug][$eq]=${slug}`
  )
}

/**
 * Transform Strapi article to app article format
 */
export function transformStrapiArticle(strapiArticle: StrapiArticle): any {
  return {
    id: strapiArticle.id.toString(),
    title: strapiArticle.attributes.title,
    description: strapiArticle.attributes.description,
    content: strapiArticle.attributes.content,
    subjectId: strapiArticle.attributes.subject?.data?.attributes?.slug || '',
    subjectName: strapiArticle.attributes.subject?.data?.attributes?.name || '',
    instructor: strapiArticle.attributes.instructor,
    duration: strapiArticle.attributes.duration,
    date: strapiArticle.attributes.publishedAt.split('T')[0],
    type: strapiArticle.attributes.type,
    status: strapiArticle.attributes.status,
    publishedAt: strapiArticle.attributes.publishedAt,
    lastModified: strapiArticle.attributes.updatedAt,
    views: strapiArticle.attributes.views || 0,
    likes: strapiArticle.attributes.likes || 0,
    tags: strapiArticle.attributes.tags || [],
    featured: strapiArticle.attributes.featured || false,
    scheduledFor: strapiArticle.attributes.scheduledFor,
    imageUrl: strapiArticle.attributes.imageUrl,
    excerpt: strapiArticle.attributes.excerpt,
  }
}

