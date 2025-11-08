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

// Clean up expired codes (call periodically)
export function cleanupExpiredCodes(): void {
  const now = Date.now()
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email)
    }
  }
}

