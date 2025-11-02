/**
 * Security utilities for sanitizing HTML content
 * Prevents XSS attacks when using dangerouslySetInnerHTML
 */

/**
 * Basic HTML sanitization - remove dangerous scripts and events
 * For production, use a library like DOMPurify
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol in href/src
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""')
  
  // Remove iframe tags (except from trusted sources like YouTube)
  // Allow YouTube iframes
  const youtubeRegex = /<iframe[^>]*src\s*=\s*["']https?:\/\/(www\.)?youtube\.com[^"']*["'][^>]*>.*?<\/iframe>/gi
  const youtubeIframes = html.match(youtubeRegex) || []
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  
  // Re-add YouTube iframes
  youtubeIframes.forEach(iframe => {
    sanitized += iframe
  })
  
  return sanitized
}

/**
 * Validate YouTube URL before embedding
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return youtubeRegex.test(url)
}

