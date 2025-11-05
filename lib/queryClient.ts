'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const GC_TIME = 1000 * 60 * 60 * 24 // 24 hours (garbage collection time)
const STALE_TIME = 1000 * 60 * 30 // 30 minutes

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: GC_TIME, // React Query v5 uses gcTime instead of cacheTime
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        retryDelay: 1000,
      },
    },
  })
}

export { QueryClientProvider }
