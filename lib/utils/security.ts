/**
 * Security utilities for brute force protection and rate limiting
 */

import { getFirestoreDB } from '@/lib/db/firebase'
import { FieldValue } from 'firebase-admin/firestore'

export interface LoginAttempt {
  ipAddress: string
  username: string
  timestamp: Date
  success: boolean
}

export interface BlockedIP {
  ipAddress: string
  blockedUntil: Date
  attempts: number
  reason: string
}

// Configuration
const MAX_LOGIN_ATTEMPTS = 5 // Maximum failed attempts before blocking
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes window
const DELAY_BASE_MS = 1000 // Base delay in milliseconds
const DELAY_MULTIPLIER = 2 // Exponential backoff multiplier

/**
 * Check if IP is blocked
 */
export async function isIPBlocked(ipAddress: string): Promise<boolean> {
  try {
    const db = getFirestoreDB()
    const blockedIPsSnapshot = await db.collection('blockedIPs')
      .where('ipAddress', '==', ipAddress)
      .where('blockedUntil', '>', new Date())
      .limit(1)
      .get()

    return !blockedIPsSnapshot.empty
  } catch (error) {
    console.error('Error checking blocked IP:', error)
    return false // Don't block if there's an error
  }
}

/**
 * Get failed login attempts count for IP
 */
export async function getFailedAttempts(ipAddress: string, username?: string): Promise<number> {
  try {
    const db = getFirestoreDB()
    const cutoffTime = new Date(Date.now() - ATTEMPT_WINDOW_MS)
    
    let query: any = db.collection('loginAttempts')
      .where('ipAddress', '==', ipAddress)
      .where('success', '==', false)
      .where('timestamp', '>', cutoffTime)

    if (username) {
      query = query.where('username', '==', username)
    }

    const snapshot = await query.get()
    return snapshot.size
  } catch (error) {
    console.error('Error getting failed attempts:', error)
    return 0
  }
}

/**
 * Record login attempt
 */
export async function recordLoginAttempt(
  ipAddress: string,
  username: string,
  success: boolean
): Promise<void> {
  try {
    const db = getFirestoreDB()
    await db.collection('loginAttempts').add({
      ipAddress,
      username,
      success,
      timestamp: FieldValue.serverTimestamp(),
    })

    // If failed, check if we need to block
    if (!success) {
      const failedAttempts = await getFailedAttempts(ipAddress, username)
      
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        await blockIP(ipAddress, `Too many failed login attempts (${failedAttempts})`)
      }
    } else {
      // Clear failed attempts on successful login
      await clearFailedAttempts(ipAddress, username)
    }
  } catch (error) {
    console.error('Error recording login attempt:', error)
    // Don't throw - logging shouldn't break login
  }
}

/**
 * Block IP address
 */
export async function blockIP(ipAddress: string, reason: string): Promise<void> {
  try {
    const db = getFirestoreDB()
    const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS)
    
    // Check if IP is already blocked
    const existingBlock = await db.collection('blockedIPs')
      .where('ipAddress', '==', ipAddress)
      .limit(1)
      .get()

    if (!existingBlock.empty && existingBlock.docs.length > 0) {
      // Update existing block
      const blockDoc = existingBlock.docs[0]
      if (!blockDoc) {
        // Create new block if doc is undefined
        await db.collection('blockedIPs').add({
          ipAddress,
          blockedUntil,
          attempts: 1,
          reason,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
        return
      }
      
      const blockData = blockDoc.data()
      const currentAttempts = (blockData?.['attempts'] as number) || 0
      
      await db.collection('blockedIPs').doc(blockDoc.id).update({
        blockedUntil,
        attempts: currentAttempts + 1,
        reason,
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else {
      // Create new block
      await db.collection('blockedIPs').add({
        ipAddress,
        blockedUntil,
        attempts: 1,
        reason,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
    }
  } catch (error) {
    console.error('Error blocking IP:', error)
  }
}

/**
 * Clear failed attempts for IP/username
 */
export async function clearFailedAttempts(ipAddress: string, username: string): Promise<void> {
  try {
    const db = getFirestoreDB()
    const cutoffTime = new Date(Date.now() - ATTEMPT_WINDOW_MS)
    
    const attemptsSnapshot = await db.collection('loginAttempts')
      .where('ipAddress', '==', ipAddress)
      .where('username', '==', username)
      .where('success', '==', false)
      .where('timestamp', '>', cutoffTime)
      .get()

    // Delete old failed attempts (optional - can also just let them expire)
    const batch = db.batch()
    attemptsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
  } catch (error) {
    console.error('Error clearing failed attempts:', error)
  }
}

/**
 * Calculate delay based on failed attempts (exponential backoff)
 */
export async function getLoginDelay(ipAddress: string, username?: string): Promise<number> {
  const failedAttempts = await getFailedAttempts(ipAddress, username)
  
  if (failedAttempts === 0) {
    return 0
  }

  // Exponential backoff: delay = base * (multiplier ^ attempts)
  const delay = DELAY_BASE_MS * Math.pow(DELAY_MULTIPLIER, Math.min(failedAttempts, 5))
  
  // Cap at 30 seconds
  return Math.min(delay, 30000)
}

/**
 * Apply delay if needed
 */
export async function applyLoginDelay(ipAddress: string, username?: string): Promise<void> {
  const delay = await getLoginDelay(ipAddress, username)
  
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 255) // Limit length
}

/**
 * Sanitize text input (alias for sanitizeInput)
 */
export function sanitizeText(input: string): string {
  return sanitizeInput(input)
}

/**
 * Sanitize HTML content (allows safe HTML but removes dangerous scripts)
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }
  
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
    .trim()
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  // IPv6 regex (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === 'unknown'
}

/**
 * Get client IP from request
 */
export function getClientIP(request: { headers: { get: (key: string) => string | null } }): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIP || 'unknown'
  
  return isValidIP(ip) ? ip : 'unknown'
}
