'use client'

import { useQuery } from '@tanstack/react-query'
import { getCache, setCache, CACHE_KEYS } from '@/lib/cache'

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
  excerpt: string
  youtubeUrl?: string
}

interface UseMaterialsOptions {
  subjectId?: string
  status?: string
}

/**
 * Fetch materials/articles with caching
 */
export function useMaterials(options?: UseMaterialsOptions) {
  const { subjectId, status = 'published' } = options || {}

  return useQuery<Article[]>({
    queryKey: ['materials', subjectId, status],
    queryFn: async () => {
      // Check cache first
      const cacheKey = `${CACHE_KEYS.ARTICLES_DATA}_${subjectId || 'all'}_${status}`
      const cached = getCache<Article[]>(cacheKey)
      
      if (cached) {
        return cached
      }

      // Fetch from API
      const params = new URLSearchParams()
      if (subjectId) params.append('subjectId', subjectId)
      if (status) params.append('status', status)

      const response = await fetch(`/api/articles/by-subject?${params.toString()}`, {
        headers: {
          'Cache-Control': 'max-age=3600', // 1 hour
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch materials')
      }

      const data = await response.json()
      
      // Cache the results
      setCache(cacheKey, data)
      
      return data
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (React Query v5)
  })
}
