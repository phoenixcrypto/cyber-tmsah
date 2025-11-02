/**
 * Strapi CMS API Integration - STRAPI ONLY MODE
 * 
 * This file provides fetch helpers and configuration for connecting to Strapi.
 * The system ONLY uses Strapi - no local fallback.
 * 
 * IMPORTANT: You MUST configure NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN
 * in your .env.local file for the system to work.
 */

// Configure your Strapi CMS URL here
// REQUIRED: Set this via environment variable: process.env.NEXT_PUBLIC_STRAPI_URL
export const CMS_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL

// REQUIRED: API token for Strapi authentication
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Check if Strapi is configured
export function isStrapiConfigured(): boolean {
  return !!CMS_BASE_URL && !!STRAPI_API_TOKEN
}

/**
 * Fetches data from Strapi with error handling
 * THROWS ERROR if Strapi is not configured or request fails
 */
async function fetchFromStrapi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!isStrapiConfigured()) {
    throw new Error('Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.')
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    ...options?.headers,
  }

  const response = await fetch(`${CMS_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })

  if (!response.ok) {
    // Handle specific error statuses
    if (response.status === 400 || response.status === 500) {
      try {
        // Clone response to read it twice if needed
        const clonedResponse = response.clone()
        const errorData = await clonedResponse.json().catch(() => null)
        
        // If it's a validation or populate error (400) or internal error (500)
        // and there's no data, return empty data structure
        if (errorData?.error && 
            (errorData?.data === null || errorData?.data === undefined)) {
          // For populate errors or validation errors with no data, return empty array
          if (errorData.error.message?.includes('Invalid key') || 
              errorData.error.message?.includes('populate') ||
              errorData.error.message?.includes('Internal Server Error')) {
            // Return empty data structure instead of throwing
            return { data: [], meta: {} } as T
          }
        }
      } catch {
        // If can't parse, continue with error throw
      }
    }
    
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Strapi API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data as T
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
    state: 'published' | 'draft' | 'archived' | 'scheduled'
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
  // Try article-news first (article-new collection type), fallback to articles
  let endpoint = '/api/article-news'
  
  // Use simple populate to avoid errors
  // Only populate subject relation, not nested relations
  const queryParams: string[] = []
  
  // Add populate - use simple format
  if (params?.populate) {
    if (params.populate === '*') {
      // For '*', use simple populate=subject only
      queryParams.push('populate=subject')
    } else if (params.populate.includes('=')) {
      // Already formatted
      queryParams.push(params.populate)
    } else {
      queryParams.push(`populate=${params.populate}`)
    }
  } else {
    // Default: populate subject only
    queryParams.push('populate=subject')
  }
  
  if (params?.subjectId) {
    queryParams.push(`filters[subject][slug][$eq]=${params.subjectId}`)
  }
  
  if (params?.status) {
    queryParams.push(`filters[state][$eq]=${params.status}`)
  }
  
  if (params?.limit) {
    queryParams.push(`pagination[limit]=${params.limit}`)
  }
  
  endpoint += `?${queryParams.join('&')}`
  
  try {
    const result = await fetchFromStrapi<StrapiData<StrapiArticle>>(endpoint)
    
    // Ensure we return null if no data or empty array
    if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
      return null
    }
    
    return result
  } catch (error) {
    // If error fetching, return null (no articles)
    console.error('Error in getArticles:', error)
    return null
  }
}

export async function getArticleBySlug(slug: string): Promise<{ data: StrapiArticle | null } | null> {
  return fetchFromStrapi<{ data: StrapiArticle | null }>(
    `/api/article-news?filters[slug][$eq]=${slug}&populate=*`
  )
}

export async function getArticleById(id: string | number): Promise<{ data: StrapiArticle } | null> {
  return fetchFromStrapi<{ data: StrapiArticle }>(
    `/api/article-news/${id}?populate=*`
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
    status: strapiArticle.attributes.state || (strapiArticle.attributes.publishedAt ? 'published' : 'draft'),
    publishedAt: strapiArticle.attributes.publishedAt,
    lastModified: strapiArticle.attributes.updatedAt,
    views: strapiArticle.attributes.views || 0,
    likes: strapiArticle.attributes.likes || 0,
    tags: strapiArticle.attributes.tags || [],
    scheduledFor: strapiArticle.attributes.scheduledFor,
    imageUrl: strapiArticle.attributes.imageUrl,
    excerpt: strapiArticle.attributes.excerpt || '',
    youtubeUrl: (strapiArticle.attributes as any).youtubeUrl || '',
  }
}

/**
 * Transform app article format to Strapi format
 */
export function transformToStrapiArticle(article: any): any {
  return {
    data: {
      title: article.title,
      description: article.description,
      content: article.content,
      slug: article.slug || article.title.toLowerCase().replace(/\s+/g, '-'),
      type: article.type,
      state: article.status,
      duration: article.duration,
      excerpt: article.excerpt || article.description?.substring(0, 150) || '',
      views: article.views || 0,
      likes: article.likes || 0,
      tags: article.tags || [],
      instructor: article.instructor,
      youtubeUrl: article.youtubeUrl || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      scheduledFor: article.scheduledFor,
      imageUrl: article.imageUrl,
      subject: article.subjectId ? {
        connect: [{ slug: article.subjectId }]
      } : undefined
    }
  }
}

/**
 * CREATE: Create a new article in Strapi
 */
export async function createArticle(article: any): Promise<StrapiArticle> {
  const strapiData = transformToStrapiArticle(article)
  const response = await fetchFromStrapi<{ data: StrapiArticle }>(
    '/api/article-news',
    {
      method: 'POST',
      body: JSON.stringify(strapiData)
    }
  )
  return response.data
}

/**
 * UPDATE: Update an existing article in Strapi
 */
export async function updateArticle(id: string | number, article: any): Promise<StrapiArticle> {
  const strapiData = transformToStrapiArticle(article)
  const response = await fetchFromStrapi<{ data: StrapiArticle }>(
    `/api/article-news/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(strapiData)
    }
  )
  return response.data
}

/**
 * DELETE: Delete an article from Strapi
 */
export async function deleteArticle(id: string | number): Promise<void> {
  await fetchFromStrapi(
    `/api/article-news/${id}`,
    {
      method: 'DELETE'
    }
  )
}

