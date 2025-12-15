/**
 * CSRF Protection
 */

import crypto from 'crypto'

const tokens = new Map<string, { token: string; expiresAt: number }>()

/**
 * Generate CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

  tokens.set(sessionId, { token, expiresAt })

  // Cleanup expired tokens
  cleanupExpiredTokens()

  return token
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const record = tokens.get(sessionId)
  
  if (!record) {
    return false
  }

  if (Date.now() > record.expiresAt) {
    tokens.delete(sessionId)
    return false
  }

  return record.token === token
}

/**
 * Cleanup expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, record] of tokens.entries()) {
    if (now > record.expiresAt) {
      tokens.delete(sessionId)
    }
  }
}

/**
 * Get CSRF token for session
 */
export function getCSRFToken(sessionId: string): string | null {
  const record = tokens.get(sessionId)
  if (!record || Date.now() > record.expiresAt) {
    return null
  }
  return record.token
}

