'use client'

import { useQuery } from '@tanstack/react-query'
import { getCache, setCache, CACHE_KEYS } from '@/lib/cache'

interface ScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab' | 'application'
  section?: string
  group: 'Group 1' | 'Group 2'
  sectionNumber?: number | null
  day: string
  subject?: string
}

interface UseScheduleOptions {
  group?: 'Group 1' | 'Group 2'
  sectionNumber?: number
  day?: string
}

/**
 * Fetch schedule data (static data embedded in component)
 * This hook provides caching layer for schedule filtering
 */
export function useSchedule(options?: UseScheduleOptions) {
  const { group, sectionNumber, day } = options || {}

  return useQuery<ScheduleItem[]>({
    queryKey: ['schedule', group, sectionNumber, day],
    queryFn: async () => {
      // Check cache first
      const cacheKey = `${CACHE_KEYS.SCHEDULE_DATA}_${group || 'all'}_${sectionNumber || 'all'}_${day || 'all'}`
      const cached = getCache<ScheduleItem[]>(cacheKey)
      
      if (cached) {
        return cached
      }

      // Return empty array - actual data comes from component state
      // This is just for cache structure
      return []
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (React Query v5)
  })
}

/**
 * Cache filtered schedule results
 */
export function cacheScheduleResults(
  group: string,
  sectionNumber: string | number | null,
  day: string,
  results: ScheduleItem[]
): void {
  const cacheKey = `${CACHE_KEYS.SCHEDULE_DATA}_${group}_${sectionNumber || 'all'}_${day}`
  setCache(cacheKey, results)
}
