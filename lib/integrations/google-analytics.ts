/**
 * Google Analytics Integration
 */

'use client'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * Initialize Google Analytics
 */
export function initGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined') return

  // Load gtag script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script1)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  })
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  })
}

/**
 * Track event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

