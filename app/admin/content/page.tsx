import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import { getAdminBasePath } from '@/lib/utils/admin-path'

async function getContentStats() {
  try {
    const [materials, articles, staticPages, news, downloads] = await Promise.all([
      prisma.material.count(),
      prisma.article.count(),
      prisma.page.count(),
      prisma.newsArticle.count(),
      prisma.downloadSoftware.count(),
    ])

    return {
      stats: [
        { label: 'المواد الدراسية', value: materials, path: '/content/materials' },
        { label: 'المقالات التعليمية', value: articles, path: '/content/articles' },
        { label: 'الصفحات الثابتة', value: staticPages, path: '/content/pages' },
        { label: 'الأخبار', value: news, path: '/content/news' },
        { label: 'برامج التنزيل', value: downloads, path: '/downloads' },
      ],
      error: null,
    }
  } catch (error) {
    console.error('Failed to load content stats', error)
    return { stats: [], error: 'تعذر تحميل إحصائيات المحتوى.' }
  }
}

export default async function AdminContentOverviewPage() {
  const { stats, error } = await getContentStats()
  const basePath = getAdminBasePath()

  return (
    <SectionPlaceholder
      title="إدارة المحتوى"
      description="نظرة شاملة على جميع الوحدات والمصادر التعليمية داخل المنصة."
      actions={[{ label: 'إضافة محتوى', href: '/admin/content/materials', variant: 'primary' }]}
      hint="يمكنك الانتقال لأي قسم عبر البطاقات التالية."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="admin-section-grid">
          {stats.map((stat) => (
            <Link key={stat.label} href={`${basePath}${stat.path}`} className="admin-section-stat">
              <span className="admin-section-stat-label">{stat.label}</span>
              <span className="admin-section-stat-value">{stat.value}</span>
              <span className="admin-section-stat-change">عرض التفاصيل →</span>
            </Link>
          ))}
        </div>
      )}
    </SectionPlaceholder>
  )
}


