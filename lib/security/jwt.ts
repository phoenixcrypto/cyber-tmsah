import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Get JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET

// Validate JWT_SECRET strength
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('⚠️ SECURITY WARNING: JWT_SECRET is too weak or missing!')
  console.error('⚠️ Minimum length: 32 characters')
  console.error('⚠️ Generate with: openssl rand -base64 32')
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: JWT_SECRET must be at least 32 characters in production!')
  }
}

const JWT_EXPIRES_IN = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d' // 7 days

export interface JWTPayload {
  userId: string
  username: string
  role: 'student' | 'admin'
  sectionNumber?: number
  groupName?: string
  iat?: number
  exp?: number
}

/**
 * Generate JWT access token with enhanced security
 */
export function generateAccessToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(
    {
      ...payload,
      // Add random nonce to prevent token reuse
      nonce: crypto.randomBytes(16).toString('hex'),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-users',
    }
  )
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(
    {
      ...payload,
      nonce: crypto.randomBytes(16).toString('hex'),
      type: 'refresh',
    },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-users',
    }
  )
}

/**
 * Verify JWT token with enhanced security checks
 */
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured')
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-users',
    }) as JWTPayload & { nonce?: string; type?: string }

    // Remove internal fields
    const { nonce, type, iat, exp, ...payload } = decoded

    return payload as JWTPayload
  } catch (error: any) {
    // Log specific error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Token verification failed:', {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Unknown',
      })
    }
    return null
  }
}

/**
 * Decode JWT token without verification (for debugging only)
 * WARNING: Do not use for authentication!
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Check if token is expired (without verification)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null
    if (!decoded || !decoded.exp) {
      return true
    }
    return decoded.exp < Date.now() / 1000
  } catch {
    return true
  }
}
