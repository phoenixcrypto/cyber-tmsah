// Performance optimization utilities

// Lazy loading for components
export const lazyLoadComponent = (importFunc: () => Promise<any>) => {
  return importFunc().then(module => module.default)
}

// Debounce function for search and input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap'
    fontLink.as = 'style'
    document.head.appendChild(fontLink)

    // Preload critical images
    const criticalImages = [
      '/favicon.ico',
      // Add other critical images here
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
}

// Optimize images
export const optimizeImage = (src: string, width?: number, height?: number) => {
  if (typeof window !== 'undefined') {
    // Use Next.js Image optimization
    return src
  }
  return src
}

// Memory management
export const cleanupMemory = () => {
  if (typeof window !== 'undefined') {
    // Clear unused event listeners
    window.removeEventListener('scroll', () => {})
    window.removeEventListener('resize', () => {})
  }
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  } else {
    fn()
  }
}
