/**
 * Service Worker for PWA Support
 */

const CACHE_NAME = 'cyber-tmsah-v1'
const RUNTIME_CACHE = 'cyber-tmsah-runtime'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
]

// Install event - Cache static assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  if ('skipWaiting' in self && typeof (self as any).skipWaiting === 'function') {
    (self as any).skipWaiting()
  }
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  if ('clients' in self && (self as any).clients && typeof (self as any).clients.claim === 'function') {
    return (self as any).clients.claim()
  }
})

// Fetch event - Serve from cache, fallback to network
self.addEventListener('fetch', (event: any) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip admin pages
  if (event.request.url.includes('/admin')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache the response
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Sync offline actions when online
  // Implementation depends on your needs
}

// Push notifications
self.addEventListener('push', (event: any) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Cyber TMSAH'
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url || '/',
  }

  if ('registration' in self && (self as any).registration && typeof (self as any).registration.showNotification === 'function') {
    event.waitUntil(
      (self as any).registration.showNotification(title, options)
    )
  }
})

// Notification click
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  if ('clients' in self && (self as any).clients && typeof (self as any).clients.openWindow === 'function') {
    event.waitUntil(
      (self as any).clients.openWindow(event.notification.data || '/')
    )
  }
})

