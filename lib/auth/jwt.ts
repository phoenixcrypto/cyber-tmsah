import jwt from 'jsonwebtoken'

// JWT secrets - MUST be set in environment variables
// No fallback values to prevent hardcoded secrets (Snyk security requirement)
// Using lazy loading to avoid errors during module initialization
function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET']
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. Please set it in your .env file.'
    )
  }
  return secret
}

function getJwtRefreshSecret(): string {
  const secret = process.env['JWT_REFRESH_SECRET']
  if (!secret) {
    throw new Error(
      'JWT_REFRESH_SECRET environment variable is required. Please set it in your .env file.'
    )
  }
  return secret
}

// Lazy getters to avoid initialization errors
function getJwtSecretLazy(): string {
  return getJwtSecret()
}

function getJwtRefreshSecretLazy(): string {
  return getJwtRefreshSecret()
}

const JWT_EXPIRES_IN: string = process.env['JWT_EXPIRES_IN'] || '24h'
const JWT_REFRESH_EXPIRES_IN: string = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d'

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
  return jwt.sign(payload as object, getJwtSecretLazy(), {
    expiresIn: JWT_EXPIRES_IN as string,
    issuer: 'cyber-tmsah',
    audience: 'cyber-tmsah-admin',
  } as jwt.SignOptions)
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as object, getJwtRefreshSecretLazy(), {
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
    const decoded = jwt.verify(token, getJwtSecretLazy(), {
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
    const decoded = jwt.verify(token, getJwtRefreshSecretLazy(), {
      issuer: 'cyber-tmsah',
      audience: 'cyber-tmsah-admin',
    }) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

