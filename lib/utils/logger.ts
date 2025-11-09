/**
 * Logger utility that respects NODE_ENV
 * Only logs in development, errors always logged
 */

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Log info message (only in development)
 */
export function logInfo(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, ...args)
  }
}

/**
 * Log warning message (only in development)
 */
export function logWarn(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, ...args)
  }
}

/**
 * Log error message (always logged, even in production)
 */
export function logError(message: string, ...args: any[]): void {
  console.error(`[ERROR] ${message}`, ...args)
}

/**
 * Log debug message (only in development)
 */
export function logDebug(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, ...args)
  }
}

/**
 * Conditional logging based on environment
 */
export const logger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug,
}

