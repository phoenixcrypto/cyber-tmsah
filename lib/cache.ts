/**
 * Cache utilities for client-side data persistence
 * Supports both localStorage (simple data) and IndexedDB (large data)
 */

const CACHE_PREFIX = 'cyber-tmsah_'
const CACHE_VERSION = '1.0.0'

// Cache keys
export const CACHE_KEYS = {
  SCHEDULE_DATA: 'schedule_data',
  MATERIALS_DATA: 'materials_data',
  ARTICLES_DATA: 'articles_data',
  USER_PREFERENCES: 'user_preferences',
} as const

// Cache expiration (24 hours)
const CACHE_EXPIRY = 1000 * 60 * 60 * 24

interface CacheItem<T> {
  data: T
  timestamp: number
  version: string
}

/**
 * Save data to localStorage with expiration
 */
export function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return

  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item))
  } catch (error) {
    console.error(`Failed to set cache for key: ${key}`, error)
  }
}

/**
 * Get data from localStorage with expiration check
 */
export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const itemStr = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (!itemStr) return null

    const item: CacheItem<T> = JSON.parse(itemStr)

    // Check expiration
    if (Date.now() - item.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      return null
    }

    // Check version compatibility
    if (item.version !== CACHE_VERSION) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      return null
    }

    return item.data
  } catch (error) {
    console.error(`Failed to get cache for key: ${key}`, error)
    return null
  }
}

/**
 * Remove specific cache key
 */
export function removeCache(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${CACHE_PREFIX}${key}`)
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  if (typeof window === 'undefined') return

  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to clear cache', error)
  }
}

/**
 * Check if cache exists and is valid
 */
export function hasValidCache(key: string): boolean {
  return getCache(key) !== null
}
