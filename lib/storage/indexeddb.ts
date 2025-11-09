/**
 * IndexedDB utility for offline data storage
 * Stores schedule, tasks, materials, and other student data locally
 */

const DB_NAME = 'cyber-tmsah-offline'
const DB_VERSION = 1

interface StoreSchema {
  schedule: { id: string; data: any; timestamp: number }
  tasks: { id: string; data: any; timestamp: number }
  materials: { id: string; data: any; timestamp: number }
  articles: { id: string; data: any; timestamp: number }
  user: { id: string; data: any; timestamp: number }
}

export class IndexedDBManager {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) {
      return Promise.resolve()
    }

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('[IndexedDB] Failed to open database:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('[IndexedDB] Database opened successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('schedule')) {
          db.createObjectStore('schedule', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('articles')) {
          db.createObjectStore('articles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' })
        }

        console.log('[IndexedDB] Database schema created/updated')
      }
    })

    return this.initPromise
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB')
    }
    return this.db
  }

  async set<T extends keyof StoreSchema>(
    storeName: T,
    id: string,
    data: StoreSchema[T]['data']
  ): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.put({
        id,
        data,
        timestamp: Date.now(),
      })

      request.onsuccess = () => {
        console.log(`[IndexedDB] Saved ${storeName}:${id}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`[IndexedDB] Failed to save ${storeName}:${id}`, request.error)
        reject(request.error)
      }
    })
  }

  async get<T extends keyof StoreSchema>(
    storeName: T,
    id: string
  ): Promise<StoreSchema[T]['data'] | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          console.log(`[IndexedDB] Retrieved ${storeName}:${id}`)
          resolve(result.data)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        console.error(`[IndexedDB] Failed to get ${storeName}:${id}`, request.error)
        reject(request.error)
      }
    })
  }

  async getAll<T extends keyof StoreSchema>(
    storeName: T
  ): Promise<StoreSchema[T]['data'][]> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()

      request.onsuccess = () => {
        const results = request.result
        console.log(`[IndexedDB] Retrieved all ${storeName}: ${results.length} items`)
        resolve(results.map((r: any) => r.data))
      }

      request.onerror = () => {
        console.error(`[IndexedDB] Failed to get all ${storeName}`, request.error)
        reject(request.error)
      }
    })
  }

  async delete<T extends keyof StoreSchema>(storeName: T, id: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log(`[IndexedDB] Deleted ${storeName}:${id}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`[IndexedDB] Failed to delete ${storeName}:${id}`, request.error)
        reject(request.error)
      }
    })
  }

  async clear<T extends keyof StoreSchema>(storeName: T): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.clear()

      request.onsuccess = () => {
        console.log(`[IndexedDB] Cleared ${storeName}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`[IndexedDB] Failed to clear ${storeName}`, request.error)
        reject(request.error)
      }
    })
  }

  async getTimestamp<T extends keyof StoreSchema>(
    storeName: T,
    id: string
  ): Promise<number | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve(result.timestamp)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}

// Singleton instance
export const dbManager = new IndexedDBManager()

// Initialize on module load (if in browser)
if (typeof window !== 'undefined') {
  dbManager.init().catch((err) => {
    console.error('[IndexedDB] Initialization error:', err)
  })
}

