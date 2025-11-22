import jwt from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'cyber-tmsah-super-secret-key-change-in-production-2026'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h'
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'cyber-tmsah-refresh-secret-key-change-in-production-2026'
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  iat?: number
  exp?: number
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as object, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string,
    issuer: 'cyber-tmsah',
    audience: 'cyber-tmsah-admin',
  } as jwt.SignOptions)
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as object, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as string,
    issuer: 'cyber-tmsah',
    audience: 'cyber-tmsah-admin',
  } as jwt.SignOptions)
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-admin',
    }) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-admin',
    }) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

