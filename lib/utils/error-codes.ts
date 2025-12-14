/**
 * Standardized Error Codes for API responses
 */

export enum ErrorCode {
  // Authentication & Authorization (1000-1999)
  AUTH_REQUIRED = 'AUTH_1001',
  AUTH_INVALID_TOKEN = 'AUTH_1002',
  AUTH_EXPIRED_TOKEN = 'AUTH_1003',
  AUTH_INVALID_CREDENTIALS = 'AUTH_1004',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_1005',
  AUTH_ACCOUNT_LOCKED = 'AUTH_1006',

  // Validation Errors (2000-2999)
  VALIDATION_FAILED = 'VALID_2001',
  VALIDATION_REQUIRED_FIELD = 'VALID_2002',
  VALIDATION_INVALID_FORMAT = 'VALID_2003',
  VALIDATION_INVALID_LENGTH = 'VALID_2004',

  // Resource Errors (3000-3999)
  RESOURCE_NOT_FOUND = 'RES_3001',
  RESOURCE_ALREADY_EXISTS = 'RES_3002',
  RESOURCE_CONFLICT = 'RES_3003',
  RESOURCE_DELETED = 'RES_3004',

  // Database Errors (4000-4999)
  DB_CONNECTION_ERROR = 'DB_4001',
  DB_QUERY_ERROR = 'DB_4002',
  DB_TRANSACTION_ERROR = 'DB_4003',
  DB_CONSTRAINT_VIOLATION = 'DB_4004',

  // Server Errors (5000-5999)
  SERVER_INTERNAL_ERROR = 'SRV_5001',
  SERVER_CONFIG_ERROR = 'SRV_5002',
  SERVER_TIMEOUT = 'SRV_5003',
  SERVER_MAINTENANCE = 'SRV_5004',

  // Rate Limiting (6000-6999)
  RATE_LIMIT_EXCEEDED = 'RATE_6001',

  // External Service Errors (7000-7999)
  EXTERNAL_SERVICE_ERROR = 'EXT_7001',
  EXTERNAL_SERVICE_UNAVAILABLE = 'EXT_7002',
}

export interface ErrorResponse {
  success: false
  error: string
  code: ErrorCode
  details?: unknown
}

/**
 * Get error code from error message or type
 */
export function getErrorCode(error: Error | string, statusCode?: number): ErrorCode {
  const errorMessage = error instanceof Error ? error.message : error

  // Authentication errors
  if (errorMessage.includes('Unauthorized') || statusCode === 401) {
    return ErrorCode.AUTH_REQUIRED
  }
  if (errorMessage.includes('Forbidden') || statusCode === 403) {
    return ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS
  }
  if (errorMessage.includes('token') || errorMessage.includes('Token')) {
    return ErrorCode.AUTH_INVALID_TOKEN
  }
  if (errorMessage.includes('credentials') || errorMessage.includes('password')) {
    return ErrorCode.AUTH_INVALID_CREDENTIALS
  }

  // Validation errors
  if (errorMessage.includes('Validation') || errorMessage.includes('validation')) {
    return ErrorCode.VALIDATION_FAILED
  }
  if (errorMessage.includes('required') || errorMessage.includes('مطلوب')) {
    return ErrorCode.VALIDATION_REQUIRED_FIELD
  }

  // Resource errors
  if (errorMessage.includes('Not found') || errorMessage.includes('غير موجود') || statusCode === 404) {
    return ErrorCode.RESOURCE_NOT_FOUND
  }
  if (errorMessage.includes('already exists') || errorMessage.includes('موجود')) {
    return ErrorCode.RESOURCE_ALREADY_EXISTS
  }

  // Database errors
  if (
    errorMessage.includes('database') ||
    errorMessage.includes('Database') ||
    errorMessage.includes('Firebase') ||
    errorMessage.includes('Firestore') ||
    errorMessage.includes('Connection')
  ) {
    return ErrorCode.DB_CONNECTION_ERROR
  }

  // Rate limiting
  if (errorMessage.includes('Too many requests') || statusCode === 429) {
    return ErrorCode.RATE_LIMIT_EXCEEDED
  }

  // Default to internal server error
  return ErrorCode.SERVER_INTERNAL_ERROR
}

