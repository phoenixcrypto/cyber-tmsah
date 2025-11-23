/**
 * Security utilities for XSS protection, CSRF, input sanitization
 */

import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span',
      'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'hr', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitize plain text (removes all HTML)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Only allow http, https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * CSRF token generation and validation
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

/**
 * Rate limiting helper (for use with Redis in production)
 */
export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

/**
 * Input validation schemas
 */
export const commonSchemas = {
  id: z.string().cuid(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  email: z.string().email().max(255),
  url: z.string().url().max(2048),
  htmlContent: z.string().max(100000), // ~100KB max
  textContent: z.string().max(10000),
}

/**
 * Validate and sanitize input
 */
export function validateAndSanitize<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Validation failed',
    }
  }
  return { success: true, data: result.data }
}

