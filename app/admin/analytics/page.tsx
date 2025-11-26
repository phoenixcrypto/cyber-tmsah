import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getAnalytics() {
  try {
    const [users, materials, articles, schedule, downloads, apiLogs] = await Promise.all([
      prisma.user.count(),
      prisma.material.count(),
      prisma.article.count(),
      prisma.scheduleItem.count(),
      prisma.downloadSoftware.count(),
      prisma.apiLog.count(),
    ])

    return {
      stats: [
        { label: 'إجمالي المستخدمين', value: users },
        { label: 'عدد المواد', value: materials },
        { label: 'عدد المقالات', value: articles },
        { label: 'حصص الجدول', value: schedule },
        { label: 'برامج التنزيل', value: downloads },
        { label: 'سجلات API', value: apiLogs },
      ],
      error: null,
    }
  } catch (error) {
    console.error('Failed to load analytics', error)
    return { stats: [], error: 'تعذر تحميل الإحصائيات.' }
  }
}

export default async function AdminAnalyticsPage() {
  const { stats, error } = await getAnalytics()

  return (
    <SectionPlaceholder
      title="الإحصائيات والتحليلات"
      description="نظرة سريعة على أداء المنصة واستخدامها."
      hint="سيتم إضافة لوحات رسومية وتكامل مع أدوات التحليل قريباً."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="admin-section-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-section-stat">
              <span className="admin-section-stat-label">{stat.label}</span>
              <span className="admin-section-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </SectionPlaceholder>
  )
}


