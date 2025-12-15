/**
 * Theme Hooks System - Similar to WordPress hooks
 * Allows themes and plugins to hook into system events
 */

type HookCallback = (...args: any[]) => any | Promise<any>
type FilterCallback = (value: any, ...args: any[]) => any | Promise<any>

class HookManager {
  private actions: Map<string, HookCallback[]> = new Map()
  private filters: Map<string, FilterCallback[]> = new Map()

  /**
   * Add an action hook
   */
  addAction(hook: string, callback: HookCallback, priority: number = 10): void {
    if (!this.actions.has(hook)) {
      this.actions.set(hook, [])
    }

    const callbacks = this.actions.get(hook)!
    callbacks.push(callback)
    
    // Sort by priority (lower number = higher priority)
    callbacks.sort((a, b) => {
      const aPriority = (a as any).__priority || 10
      const bPriority = (b as any).__priority || 10
      return aPriority - bPriority
    })

    ;(callback as any).__priority = priority
  }

  /**
   * Remove an action hook
   */
  removeAction(hook: string, callback: HookCallback): void {
    const callbacks = this.actions.get(hook)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Execute an action hook
   */
  async doAction(hook: string, ...args: any[]): Promise<void> {
    const callbacks = this.actions.get(hook)
    if (!callbacks) return

    for (const callback of callbacks) {
      try {
        await callback(...args)
      } catch (error) {
        console.error(`Error in action hook ${hook}:`, error)
      }
    }
  }

  /**
   * Add a filter hook
   */
  addFilter(hook: string, callback: FilterCallback, priority: number = 10): void {
    if (!this.filters.has(hook)) {
      this.filters.set(hook, [])
    }

    const callbacks = this.filters.get(hook)!
    callbacks.push(callback)
    
    // Sort by priority
    callbacks.sort((a, b) => {
      const aPriority = (a as any).__priority || 10
      const bPriority = (b as any).__priority || 10
      return aPriority - bPriority
    })

    ;(callback as any).__priority = priority
  }

  /**
   * Remove a filter hook
   */
  removeFilter(hook: string, callback: FilterCallback): void {
    const callbacks = this.filters.get(hook)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Apply a filter hook
   */
  async applyFilters<T = any>(hook: string, value: T, ...args: any[]): Promise<T> {
    const callbacks = this.filters.get(hook)
    if (!callbacks) return value

    let result = value
    for (const callback of callbacks) {
      try {
        result = await callback(result, ...args)
      } catch (error) {
        console.error(`Error in filter hook ${hook}:`, error)
      }
    }

    return result
  }

  /**
   * Clear all hooks
   */
  clear(): void {
    this.actions.clear()
    this.filters.clear()
  }
}

// Singleton instance
export const hooks = new HookManager()

// Convenience functions
export function addAction(hook: string, callback: HookCallback, priority?: number): void {
  hooks.addAction(hook, callback, priority)
}

export function removeAction(hook: string, callback: HookCallback): void {
  hooks.removeAction(hook, callback)
}

export function doAction(hook: string, ...args: any[]): Promise<void> {
  return hooks.doAction(hook, ...args)
}

export function addFilter(hook: string, callback: FilterCallback, priority?: number): void {
  hooks.addFilter(hook, callback, priority)
}

export function removeFilter(hook: string, callback: FilterCallback): void {
  hooks.removeFilter(hook, callback)
}

export function applyFilters<T = any>(hook: string, value: T, ...args: any[]): Promise<T> {
  return hooks.applyFilters(hook, value, ...args)
}

// Common hooks
export const HOOKS = {
  // Content hooks
  CONTENT_CREATED: 'content.created',
  CONTENT_UPDATED: 'content.updated',
  CONTENT_DELETED: 'content.deleted',
  CONTENT_PUBLISHED: 'content.published',
  
  // Theme hooks
  THEME_ACTIVATED: 'theme.activated',
  THEME_DEACTIVATED: 'theme.deactivated',
  
  // User hooks
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_CREATED: 'user.created',
  
  // Admin hooks
  ADMIN_INIT: 'admin.init',
  ADMIN_PAGE_LOAD: 'admin.page.load',
  
  // Frontend hooks
  FRONTEND_INIT: 'frontend.init',
  FRONTEND_PAGE_LOAD: 'frontend.page.load',
  
  // Filter hooks
  FILTER_CONTENT: 'filter.content',
  FILTER_TITLE: 'filter.title',
  FILTER_EXCERPT: 'filter.excerpt',
  FILTER_META: 'filter.meta',
} as const

