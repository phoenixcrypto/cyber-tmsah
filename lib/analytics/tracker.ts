/**
 * Advanced Analytics Tracker
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export interface AnalyticsEvent {
  name: string
  category?: string
  action?: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadUserId()
  }

  private generateSessionId(): string {
    if (typeof window === 'undefined') return ''
    const stored = sessionStorage.getItem('analytics_session_id')
    if (stored) return stored

    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', id)
    return id
  }

  private loadUserId(): void {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('analytics_user_id')
    if (stored) {
      this.userId = stored
    } else {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('analytics_user_id', id)
      this.userId = id
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    this.track({
      name: 'page_view',
      category: 'navigation',
      action: 'view',
      label: path,
      properties: {
        title,
        path,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Track custom event
   */
  track(event: AnalyticsEvent) {
    const fullEvent = {
      ...event,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
    }

    this.events.push(fullEvent)

    // Send to analytics endpoint
    this.sendToServer(fullEvent)

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties,
      })
    }
  }

  /**
   * Track user behavior
   */
  trackUserBehavior(action: string, details?: Record<string, any>) {
    this.track({
      name: 'user_behavior',
      category: 'user',
      action,
      ...(details && { properties: details }),
    })
  }

  /**
   * Track content interaction
   */
  trackContentInteraction(contentId: string, interactionType: string, details?: Record<string, any>) {
    this.track({
      name: 'content_interaction',
      category: 'content',
      action: interactionType,
      label: contentId,
      properties: {
        contentId,
        ...details,
      },
    })
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType: string, value?: number, details?: Record<string, any>) {
    this.track({
      name: 'conversion',
      category: 'conversion',
      action: conversionType,
      ...(value !== undefined && { value }),
      ...(details && { properties: details }),
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      name: 'error',
      category: 'error',
      action: 'occurred',
      label: error.message,
      properties: {
        errorMessage: error.message,
        errorStack: error.stack,
        ...context,
      },
    })
  }

  /**
   * Send event to server
   */
  private async sendToServer(event: AnalyticsEvent & { sessionId: string; userId: string | null; timestamp: number }) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Error sending analytics event:', error)
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this.userId
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker()

/**
 * React hook for tracking page views
 */
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      analytics.trackPageView(fullPath, document.title)
    }
  }, [pathname, searchParams])
}

