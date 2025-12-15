/**
 * Theme Router - Routes theme pages
 */

import React from 'react'
import { themeManager } from './manager'
import { loadThemePage } from './loader'

export interface ThemeRoute {
  path: string
  page: string
  layout?: string
}

export class ThemeRouter {
  private routes: Map<string, ThemeRoute> = new Map()

  /**
   * Register a route
   */
  registerRoute(path: string, page: string, layout?: string): void {
    this.routes.set(path, { path, page, layout })
  }

  /**
   * Get route for path
   */
  getRoute(path: string): ThemeRoute | null {
    // Try exact match first
    if (this.routes.has(path)) {
      return this.routes.get(path)!
    }

    // Try dynamic routes - check if path matches a dynamic pattern
    for (const [routePath, route] of this.routes.entries()) {
      if (this.matchRoute(routePath, path)) {
        return route
      }
    }

    // Special handling for materials/[id]
    if (path.startsWith('/materials/') && path !== '/materials') {
      const dynamicRoute = this.routes.get('/materials/[id]')
      if (dynamicRoute) {
        return dynamicRoute
      }
    }

    return null
  }

  /**
   * Match route pattern
   */
  private matchRoute(pattern: string, path: string): boolean {
    // Simple pattern matching (can be enhanced)
    const patternParts = pattern.split('/').filter(Boolean)
    const pathParts = path.split('/').filter(Boolean)

    if (patternParts.length !== pathParts.length) {
      return false
    }

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]
      
      if (!patternPart || !pathPart) {
        return false
      }
      
      // Check if it's a dynamic segment [id] or [slug]
      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        // Dynamic segment - matches any value
        continue
      }
      
      // Exact match required
      if (patternPart !== pathPart) {
        return false
      }
    }

    return true
  }

  /**
   * Load page component for route
   */
  async loadPageComponent(themeName: string, route: ThemeRoute): Promise<React.ComponentType<any> | null> {
    return loadThemePage(themeName, route.page)
  }
}

// Default routes for default theme
export function getDefaultRoutes(): ThemeRoute[] {
  return [
    { path: '/', page: 'home.tsx' },
    { path: '/materials', page: 'materials/page.tsx' },
    { path: '/materials/[id]', page: 'materials/[id]/page.tsx' },
    { path: '/schedule', page: 'schedule/page.tsx' },
    { path: '/downloads', page: 'downloads/page.tsx' },
    { path: '/contact', page: 'contact/page.tsx' },
    { path: '/about', page: 'about/page.tsx' },
    { path: '/privacy', page: 'privacy/page.tsx' },
    { path: '/terms', page: 'terms/page.tsx' },
  ]
}

// Singleton instance
export const themeRouter = new ThemeRouter()

// Register default routes
getDefaultRoutes().forEach((route) => {
  themeRouter.registerRoute(route.path, route.page, route.layout)
})
