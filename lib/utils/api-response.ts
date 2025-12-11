/**
 * Standardized API response utilities
 */

import { NextResponse } from 'next/server'
import { logApiRequest } from './logger'
import { ErrorCode, getErrorCode, type ErrorResponse } from './error-codes'

export function getRequestContext(request: Request) {
  const headers = request.headers as Headers
  const ipAddress =
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    'unknown'
  const userAgent = headers.get('user-agent')

  return { ipAddress, userAgent }
}

interface ApiResponseOptions {
  status?: number
  headers?: Record<string, string>
  logRequest?: boolean
  logContext?: {
    method: string
    path: string
    ipAddress?: string
    userAgent?: string
    userId?: string
    startTime?: number
  }
}

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  options?: ApiResponseOptions
): NextResponse {
  const status = options?.status || 200
  const response = NextResponse.json({ success: true, data }, { status })

  // Log request if needed
  if (options?.logRequest && options?.logContext) {
    const responseTime = options.logContext.startTime
      ? Date.now() - options.logContext.startTime
      : 0
    logApiRequest(
      options.logContext.method,
      options.logContext.path,
      status,
      responseTime,
      {
        ...(options.logContext.ipAddress && { ipAddress: options.logContext.ipAddress }),
        ...(options.logContext.userAgent && { userAgent: options.logContext.userAgent }),
        ...(options.logContext.userId && { userId: options.logContext.userId }),
      }
    )
  }

  return response
}

/**
 * Error response with error code
 */
export function errorResponse(
  message: string,
  status: number = 400,
  options?: ApiResponseOptions & { code?: ErrorCode; details?: unknown }
): NextResponse {
  const errorCode = options?.code || getErrorCode(message, status)
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
    code: errorCode,
    ...(options?.details ? { details: options.details } : {}),
  }

  const response = NextResponse.json(errorResponse, { status })

  // Log error request
  if (options?.logRequest && options?.logContext) {
    const responseTime = options.logContext.startTime
      ? Date.now() - options.logContext.startTime
      : 0
    logApiRequest(
      options.logContext.method,
      options.logContext.path,
      status,
      responseTime,
      {
        ...(options.logContext.ipAddress && { ipAddress: options.logContext.ipAddress }),
        ...(options.logContext.userAgent && { userAgent: options.logContext.userAgent }),
        ...(options.logContext.userId && { userId: options.logContext.userId }),
        error: message,
      }
    )
  }

  return response
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: string[] | string
): NextResponse {
  const errorArray = Array.isArray(errors) ? errors : [errors]
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      code: ErrorCode.VALIDATION_FAILED,
      errors: errorArray,
    },
    { status: 400 }
  )
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401, { code: ErrorCode.AUTH_REQUIRED })
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403, { code: ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS })
}

/**
 * Not found response
 */
export function notFoundResponse(message: string = 'Not found'): NextResponse {
  return errorResponse(message, 404, { code: ErrorCode.RESOURCE_NOT_FOUND })
}

/**
 * Internal server error response
 */
export function serverErrorResponse(
  message: string = 'Internal server error',
  options?: ApiResponseOptions
): NextResponse {
  return errorResponse(message, 500, options)
}

