import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'

/**
 * POST /api/auth/logout
 * Logout user and clear cookies
 */
export async function POST(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const response = successResponse({ success: true })

    // Clear cookies
    response.cookies.delete('admin-token')
    response.cookies.delete('admin-refresh-token')

    await logger.info('User logged out', {
      method: 'POST',
      path: '/api/auth/logout',
      ipAddress: context.ipAddress,
    })

    return response
  } catch (error) {
    await logger.error('Logout error', error as Error, {
      method: 'POST',
      path: '/api/auth/logout',
      ipAddress: context.ipAddress,
    })
    return successResponse({ success: true }) // Always return success for logout
  }
}
