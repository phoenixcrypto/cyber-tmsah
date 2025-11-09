/**
 * Offline Data Manager
 * Handles offline data storage and synchronization
 */

import { dbManager } from './indexeddb'

export interface OfflineData {
  schedule?: any
  tasks?: any[]
  materials?: any[]
  articles?: any[]
  user?: any
}

export class OfflineManager {
  private static instance: OfflineManager
  private isOnline: boolean = navigator.onLine
  private syncListeners: Array<() => Promise<void>> = []

  private constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[OfflineManager] Connection restored')
        this.isOnline = true
        this.syncAll()
      })

      window.addEventListener('offline', () => {
        console.log('[OfflineManager] Connection lost')
        this.isOnline = false
      })
    }
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  isConnected(): boolean {
    return this.isOnline
  }

  async saveSchedule(schedule: any): Promise<void> {
    await dbManager.set('schedule', 'current', schedule)
  }

  async getSchedule(): Promise<any | null> {
    return await dbManager.get('schedule', 'current')
  }

  async saveTasks(tasks: any[]): Promise<void> {
    await dbManager.set('tasks', 'current', tasks)
  }

  async getTasks(): Promise<any[] | null> {
    return await dbManager.get('tasks', 'current')
  }

  async saveMaterials(materials: any[]): Promise<void> {
    await dbManager.set('materials', 'current', materials)
  }

  async getMaterials(): Promise<any[] | null> {
    return await dbManager.get('materials', 'current')
  }

  async saveArticles(articles: any[]): Promise<void> {
    await dbManager.set('articles', 'current', articles)
  }

  async getArticles(): Promise<any[] | null> {
    return await dbManager.get('articles', 'current')
  }

  async saveUserData(user: any): Promise<void> {
    await dbManager.set('user', 'current', user)
  }

  async getUserData(): Promise<any | null> {
    return await dbManager.get('user', 'current')
  }

  async getAllData(): Promise<OfflineData> {
    const [schedule, tasks, materials, articles, user] = await Promise.all([
      this.getSchedule(),
      this.getTasks(),
      this.getMaterials(),
      this.getArticles(),
      this.getUserData(),
    ])

    return {
      schedule,
      tasks: tasks || [],
      materials: materials || [],
      articles: articles || [],
      user,
    }
  }

  async clearAll(): Promise<void> {
    await Promise.all([
      dbManager.clear('schedule'),
      dbManager.clear('tasks'),
      dbManager.clear('materials'),
      dbManager.clear('articles'),
      dbManager.clear('user'),
    ])
  }

  registerSyncListener(listener: () => Promise<void>): void {
    this.syncListeners.push(listener)
  }

  async syncAll(): Promise<void> {
    if (!this.isOnline) {
      console.log('[OfflineManager] Cannot sync: offline')
      return
    }

    console.log('[OfflineManager] Starting sync...')
    for (const listener of this.syncListeners) {
      try {
        await listener()
      } catch (error) {
        console.error('[OfflineManager] Sync error:', error)
      }
    }
    console.log('[OfflineManager] Sync completed')
  }
}

export const offlineManager = OfflineManager.getInstance()

