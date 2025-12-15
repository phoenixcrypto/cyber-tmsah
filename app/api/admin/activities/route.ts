import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireAdmin } from '@/lib/middleware/auth'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/admin/activities
 * Get recent activities (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const db = getFirestoreDB()
    const limit = 10

    // Get recent login attempts
    const loginAttemptsSnapshot = await db.collection('loginAttempts')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get()

    // Get recent API logs
    const apiLogsSnapshot = await db.collection('apiLogs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    const activities: Array<{
      id: string
      user: string
      action: string
      target: string
      time: string
      avatar: string
      type: 'login' | 'api' | 'system'
    }> = []

    // Process login attempts
    loginAttemptsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      const timestamp = data['timestamp']?.toDate?.() || data['timestamp']
      const timeAgo = getTimeAgo(timestamp)
      
      activities.push({
        id: `login-${doc.id}`,
        user: data['username'] || 'مستخدم',
        action: data['success'] ? 'سجل دخول' : 'فشل تسجيل الدخول',
        target: data['ipAddress'] || '',
        time: timeAgo,
        avatar: (data['username']?.[0] || 'U').toUpperCase(),
        type: 'login',
      })
    })

    // Process API logs
    apiLogsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      const timestamp = data['createdAt']?.toDate?.() || data['createdAt']
      const timeAgo = getTimeAgo(timestamp)
      const method = data['method'] || 'GET'
      const path = data['path'] || '/'
      
      activities.push({
        id: `api-${doc.id}`,
        user: 'النظام',
        action: `${method} ${path}`,
        target: data['statusCode'] ? `Status: ${data['statusCode']}` : '',
        time: timeAgo,
        avatar: 'S',
        type: 'api',
      })
    })

    // Sort by time (most recent first)
    activities.sort((a, b) => {
      const timeA = getTimeValue(a.time)
      const timeB = getTimeValue(b.time)
      return timeB - timeA
    })

    return successResponse({
      activities: activities.slice(0, limit),
    })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Get activities error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب الأنشطة', 500)
  }
}

/**
 * Helper function to get time ago string
 */
function getTimeAgo(timestamp: Date | string | unknown): string {
  if (!timestamp) return 'غير معروف'
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp as string)
  if (isNaN(date.getTime())) return 'غير معروف'
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'الآن'
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 7) return `منذ ${diffDays} يوم`
  
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Helper function to get time value for sorting
 */
function getTimeValue(timeStr: string): number {
  if (timeStr === 'الآن') return Date.now()
  if (timeStr.includes('دقيقة')) {
    const mins = parseInt(timeStr.match(/\d+/)?.[0] || '0')
    return Date.now() - mins * 60000
  }
  if (timeStr.includes('ساعة')) {
    const hours = parseInt(timeStr.match(/\d+/)?.[0] || '0')
    return Date.now() - hours * 3600000
  }
  if (timeStr.includes('يوم')) {
    const days = parseInt(timeStr.match(/\d+/)?.[0] || '0')
    return Date.now() - days * 86400000
  }
  return 0
}

