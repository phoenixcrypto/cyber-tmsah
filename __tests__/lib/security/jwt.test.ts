import { describe, it, expect, beforeEach } from '@jest/globals'
import { generateAccessToken, verifyToken } from '@/lib/security/jwt'

// Set test JWT secret
beforeEach(() => {
  process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only'
})

describe('JWT Security', () => {
  const mockPayload = {
    userId: 'test-user-id',
    username: 'testuser',
    role: 'student' as const,
    sectionNumber: 5,
    groupName: 'Group 1',
  }

  describe('generateAccessToken', () => {
    it('should generate a valid token', () => {
      const token = generateAccessToken(mockPayload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateAccessToken(mockPayload)
      const verified = verifyToken(token)
      
      expect(verified).toBeDefined()
      expect(verified?.userId).toBe(mockPayload.userId)
      expect(verified?.username).toBe(mockPayload.username)
      expect(verified?.role).toBe(mockPayload.role)
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const verified = verifyToken(invalidToken)
      
      expect(verified).toBeNull()
    })

    it('should reject expired token', () => {
      // Create token with very short expiry (1ms)
      const oldDateNow = Date.now
      Date.now = jest.fn(() => 1000)
      
      const token = generateAccessToken(mockPayload)
      
      // Fast forward time
      Date.now = jest.fn(() => 2000)
      
      const verified = verifyToken(token)
      expect(verified).toBeNull()
      
      // Restore
      Date.now = oldDateNow
    })
  })
})

