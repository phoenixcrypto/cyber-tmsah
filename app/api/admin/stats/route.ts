import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireAdmin } from '@/lib/middleware/auth'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/admin/stats
 * Get dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const db = getFirestoreDB()

    // Fetch all data in parallel
    const [
      usersSnapshot,
      materialsSnapshot,
      articlesSnapshot,
      scheduleSnapshot,
      downloadsSnapshot,
      newsSnapshot,
      loginAttemptsSnapshot,
      blockedIPsSnapshot,
    ] = await Promise.all([
      db.collection('users').get(),
      db.collection('materials').get(),
      db.collection('articles').get(),
      db.collection('scheduleItems').get(),
      db.collection('downloads').get(),
      db.collection('news').get(),
      db.collection('loginAttempts')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get(),
      db.collection('blockedIPs')
        .where('blockedUntil', '>', new Date())
        .get(),
    ])

    // Calculate statistics
    // Get published articles count (only count articles with status === 'published')
    const publishedArticles = articlesSnapshot.docs.filter(
      (doc) => {
        const data = doc.data()
        return data['status'] === 'published'
      }
    ).length
    
    // Count only published articles for totalArticles
    const publishedArticlesCount = publishedArticles
    
    const totalUsers = usersSnapshot.size
    const totalMaterials = materialsSnapshot.size
    const totalArticles = publishedArticlesCount // Only published articles
    const totalSchedule = scheduleSnapshot.size
    const totalDownloads = downloadsSnapshot.size
    const totalNews = newsSnapshot.size
    const totalContent = totalMaterials + totalArticles + totalNews

    // Get recent login attempts
    const recentAttempts = loginAttemptsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ipAddress: data['ipAddress'],
        username: data['username'],
        success: data['success'],
        timestamp: data['timestamp']?.toDate?.() || data['timestamp'],
      }
    })

    // Get blocked IPs
    const blockedIPs = blockedIPsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ipAddress: data['ipAddress'],
        blockedUntil: data['blockedUntil']?.toDate?.() || data['blockedUntil'],
        attempts: data['attempts'],
        reason: data['reason'],
      }
    })

    // Calculate growth (simplified - can be enhanced with historical data)
    const now = new Date()
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get users created in last month
    const recentUsers = usersSnapshot.docs.filter((doc) => {
      const createdAt = doc.data()['createdAt']?.toDate?.() || doc.data()['createdAt']
      return createdAt && new Date(createdAt) > lastMonth
    }).length

    // Get content created in last month
    const recentArticles = articlesSnapshot.docs.filter((doc) => {
      const createdAt = doc.data()['createdAt']?.toDate?.() || doc.data()['createdAt']
      return createdAt && new Date(createdAt) > lastMonth
    }).length

    const userGrowth = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0
    const contentGrowth = totalContent > 0 ? Math.round((recentArticles / totalContent) * 100) : 0

    // Get failed login attempts in last 24 hours
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const failedAttempts24h = await db.collection('loginAttempts')
      .where('success', '==', false)
      .where('timestamp', '>', last24Hours)
      .get()

    return successResponse({
      metrics: {
        totalUsers,
        totalContent,
        totalSchedule,
        totalDownloads,
        totalArticles,
        totalNews,
        publishedArticles,
        userGrowth,
        contentGrowth,
        scheduleGrowth: 0, // TODO: Calculate from historical data
        downloadGrowth: 0, // TODO: Calculate from historical data
      },
      security: {
        failedLoginAttempts24h: failedAttempts24h.size,
        blockedIPs: blockedIPs.length,
        recentAttempts: recentAttempts.slice(0, 10),
        blockedIPsList: blockedIPs,
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Get stats error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب الإحصائيات', 500)
  }
}

