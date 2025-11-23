/**
 * Standardized API response utilities
 */

import { NextResponse } from 'next/server'
import { logApiRequest } from './logger'

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
        ipAddress: options.logContext.ipAddress,
        userAgent: options.logContext.userAgent,
        userId: options.logContext.userId,
      }
    )
  }

  return response
}

/**
 * Error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  options?: ApiResponseOptions
): NextResponse {
  const response = NextResponse.json(
    { success: false, error: message },
    { status }
  )

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
        ipAddress: options.logContext.ipAddress,
        userAgent: options.logContext.userAgent,
        userId: options.logContext.userId,
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
    { success: false, error: 'Validation failed', errors: errorArray },
    { status: 400 }
  )
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  )
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  )

}

/**
 * Not found response
 */
export function notFoundResponse(message: string = 'Not found'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 404 }
  )
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

