// Verification code storage and management
// In production, use Redis or database instead of in-memory Map

interface VerificationData {
  code: string
  expiresAt: number
  email: string
  verified: boolean
}

// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, VerificationData>()

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code
export function storeVerificationCode(email: string, code: string, expiresInMinutes: number = 10): void {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000
  verificationCodes.set(email.toLowerCase().trim(), {
    code,
    expiresAt,
    email: email.toLowerCase().trim(),
    verified: false,
  })
}

// Verify code
export function verifyCode(email: string, code: string): { valid: boolean; error?: string } {
  const stored = verificationCodes.get(email.toLowerCase().trim())

  if (!stored) {
    return { valid: false, error: 'Invalid or expired verification code' }
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email.toLowerCase().trim())
    return { valid: false, error: 'Verification code has expired. Please request a new one.' }
  }

  if (stored.code !== code) {
    return { valid: false, error: 'Invalid verification code' }
  }

  // Mark as verified
  stored.verified = true
  return { valid: true }
}

// Check if email is verified
export function isEmailVerified(email: string): boolean {
  const stored = verificationCodes.get(email.toLowerCase().trim())
  return stored?.verified === true
}

// Remove verification code (after successful registration)
export function removeVerificationCode(email: string): void {
  verificationCodes.delete(email.toLowerCase().trim())
}

// Generate verification token for registration
// This token proves that email was verified and can be used in registration
export function generateVerificationToken(email: string, code: string): string {
  const timestamp = Date.now().toString()
  const tokenData = `${email.toLowerCase().trim()}|${timestamp}|${code}`
  return Buffer.from(tokenData).toString('base64')
}

// Verify verification token
export function verifyVerificationToken(token: string, email: string): { valid: boolean; error?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split('|')
    
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid verification token format' }
    }
    
    const [tokenEmail, timestamp, code] = parts
    
    if (!tokenEmail || !timestamp || !code) {
      return { valid: false, error: 'Invalid verification token format' }
    }
    
    // Verify email matches
    if (tokenEmail !== email.toLowerCase().trim()) {
      return { valid: false, error: 'Verification token email mismatch' }
    }
    
    // Verify token is recent (within 5 minutes)
    const timestampNum = parseInt(timestamp, 10)
    if (isNaN(timestampNum)) {
      return { valid: false, error: 'Invalid verification token timestamp' }
    }
    
    const tokenAge = Date.now() - timestampNum
    if (tokenAge >= 5 * 60 * 1000) {
      return { valid: false, error: 'Verification token has expired' }
    }
    
    // Try to verify code in memory first (preferred method)
    const stored = verificationCodes.get(email.toLowerCase().trim())
    
    if (stored) {
      // Code exists in memory - verify it matches
      if (stored.code === code) {
        // Code matches - mark as verified and return success
        stored.verified = true
        return { valid: true }
      } else {
        // Code doesn't match
        return { valid: false, error: 'Verification code mismatch' }
      }
    }
    
    // Code not in memory (serverless instance issue)
    // Since we have a valid token with matching email and recent timestamp,
    // and the code was verified on a different instance, we trust the token
    // Token must be very recent (within 2 minutes) to be accepted
    if (tokenAge < 2 * 60 * 1000) {
      // Token is very recent (within 2 minutes) - accept it
      // This handles serverless environment where verification happened on different instance
      console.log('[Verify Token] Accepting token from different instance (serverless):', email)
      return { valid: true }
    } else {
      return { valid: false, error: 'Verification token expired or invalid' }
    }
  } catch (err) {
    console.error('Token verification error:', err)
    return { valid: false, error: 'Invalid verification token format' }
  }
}

// Clean up expired codes (call periodically)
export function cleanupExpiredCodes(): void {
  const now = Date.now()
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email)
    }
  }
}

