import { NextRequest } from 'next/server'

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

/**
 * Rate limit middleware
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): { success: boolean; remaining: number; resetTime: number } {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  const key = `rate_limit:${ip}`
  const now = Date.now()
  
  const record = rateLimitStore.get(key)
  
  // Clean expired records
  if (record && record.resetTime < now) {
    rateLimitStore.delete(key)
  }
  
  const currentRecord = rateLimitStore.get(key)
  
  if (!currentRecord) {
    // First request
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    }
  }
  
  if (currentRecord.count >= options.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }
  
  // Increment count
  currentRecord.count++
  rateLimitStore.set(key, currentRecord)
  
  return {
    success: true,
    remaining: options.maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

/**
 * Account lockout (after failed login attempts)
 */
const lockoutStore = new Map<string, { attempts: number; lockUntil: number }>()

export function checkAccountLockout(
  identifier: string
): { locked: boolean; lockUntil?: number; remainingAttempts?: number } {
  const record = lockoutStore.get(identifier)
  
  if (!record) {
    return { locked: false, remainingAttempts: 5 }
  }
  
  const now = Date.now()
  
  // Check if still locked
  if (record.lockUntil > now) {
    return {
      locked: true,
      lockUntil: record.lockUntil,
    }
  }
  
  // Lock expired, reset
  if (record.lockUntil < now) {
    lockoutStore.delete(identifier)
    return { locked: false, remainingAttempts: 5 }
  }
  
  return {
    locked: false,
    remainingAttempts: 5 - record.attempts,
  }
}

export function recordFailedAttempt(identifier: string): void {
  const record = lockoutStore.get(identifier) || { attempts: 0, lockUntil: 0 }
  
  record.attempts++
  
  // Lock after 5 attempts
  if (record.attempts >= 5) {
    // Lock for 15 minutes
    record.lockUntil = Date.now() + 15 * 60 * 1000
  }
  
  lockoutStore.set(identifier, record)
}

export function clearFailedAttempts(identifier: string): void {
  lockoutStore.delete(identifier)
}

