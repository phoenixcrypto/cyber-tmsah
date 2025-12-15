/**
 * Rate Limiter - Prevent abuse and DDoS attacks
 */

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  private readonly defaultLimit: number
  private readonly defaultWindow: number

  constructor(defaultLimit: number = 100, defaultWindow: number = 60000) {
    this.defaultLimit = defaultLimit
    this.defaultWindow = defaultWindow
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string, limit?: number, window?: number): boolean {
    const requestLimit = limit || this.defaultLimit
    const requestWindow = window || this.defaultWindow
    const now = Date.now()

    const record = this.requests.get(identifier)

    if (!record || now > record.resetTime) {
      // Create new record
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + requestWindow,
      })
      return true
    }

    if (record.count >= requestLimit) {
      return false
    }

    // Increment count
    record.count++
    return true
  }

  /**
   * Get remaining requests
   */
  getRemaining(identifier: string, limit?: number): number {
    const requestLimit = limit || this.defaultLimit
    const record = this.requests.get(identifier)

    if (!record) {
      return requestLimit
    }

    return Math.max(0, requestLimit - record.count)
  }

  /**
   * Get reset time
   */
  getResetTime(identifier: string): number | null {
    const record = this.requests.get(identifier)
    return record ? record.resetTime : null
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clean up expired records
   */
  cleanup(): void {
    const now = Date.now()
    for (const [identifier, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(identifier)
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 5 * 60 * 1000)
}

/**
 * Rate limit middleware
 */
export function rateLimitMiddleware(
  identifier: string,
  limit: number = 100,
  window: number = 60000
): { allowed: boolean; remaining: number; resetTime: number | null } {
  const allowed = rateLimiter.isAllowed(identifier, limit, window)
  const remaining = rateLimiter.getRemaining(identifier, limit)
  const resetTime = rateLimiter.getResetTime(identifier)

  return {
    allowed,
    remaining,
    resetTime,
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  // Combine with user agent for better identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}:${userAgent.slice(0, 50)}`
}

