/**
 * JSON Helper Functions for MySQL JSON fields
 * Type-safe utilities for converting between JSON and Array types
 */

/**
 * Type guard to check if value is a valid JSON-serializable value
 */
function isJsonSerializable(value: unknown): value is string | number | boolean | null | object {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    (typeof value === 'object' && value !== null)
  )
}

/**
 * Parse tags from JSON to string array
 * Handles various input types safely
 */
export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
  }
  
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  if (tags === null || tags === undefined) {
    return []
  }
  
  return []
}

/**
 * Stringify tags array to JSON string
 */
export function stringifyTags(tags: string[] | null | undefined): string {
  if (!tags || !Array.isArray(tags)) {
    return '[]'
  }
  return JSON.stringify(tags)
}

/**
 * Parse any JSON field to its original type
 * Type-safe JSON parsing with fallback
 */
export function parseJsonField<T>(field: unknown): T {
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field)
      return parsed as T
    } catch {
      // If parsing fails, return as-is (might be a string representation)
      return field as T
    }
  }
  return field as T
}

/**
 * Stringify any value to JSON string
 * Type-safe JSON stringification
 */
export function stringifyJsonField(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  return JSON.stringify(value)
}

