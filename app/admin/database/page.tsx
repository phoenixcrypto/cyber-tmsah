import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getDatabaseSummary() {
  try {
    const [users, materials, articles, pages, downloads] = await Promise.all([
      prisma.user.count(),
      prisma.material.count(),
      prisma.article.count(),
      prisma.page.count(),
      prisma.downloadSoftware.count(),
    ])

    return {
      stats: [
        { label: 'المستخدمون', value: users },
        { label: 'المواد', value: materials },
        { label: 'المقالات', value: articles },
        { label: 'الصفحات', value: pages },
        { label: 'التنزيلات', value: downloads },
      ],
      error: null,
    }
  } catch (error) {
    console.error('Failed to load database stats', error)
    return { stats: [], error: 'تعذر الوصول إلى قاعدة البيانات.' }
  }
}

function getDatabaseMeta() {
  try {
    const url = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null
    if (!url) {
      return { host: 'غير محدد', database: '—', provider: 'postgresql' }
    }

    return {
      host: url.host,
      database: url.pathname.replace('/', '') || 'postgres',
      provider: url.protocol.replace(':', ''),
    }
  } catch (error) {
    console.error('Failed to parse database URL', error)
    return { host: 'غير معروف', database: '—', provider: 'postgresql' }
  }
}

export default async function AdminDatabasePage() {
  const { stats, error } = await getDatabaseSummary()
  const meta = getDatabaseMeta()

  return (
    <SectionPlaceholder
      title="صحة قاعدة البيانات"
      description="متابعة الاتصال بقاعدة البيانات وعدد السجلات الأساسية."
      hint="تظهر هذه المعلومات للمسؤولين فقط."
    >
      <div className="admin-section-grid">
        <div className="admin-section-stat">
          <span className="admin-section-stat-label">المضيف</span>
          <span className="admin-section-stat-value" style={{ fontSize: '1.1rem' }}>
            {meta.host}
          </span>
          <span className="admin-section-stat-change">المزود: {meta.provider}</span>
        </div>
        <div className="admin-section-stat">
          <span className="admin-section-stat-label">قاعدة البيانات</span>
          <span className="admin-section-stat-value" style={{ fontSize: '1.1rem' }}>
            {meta.database}
          </span>
          <span className="admin-section-stat-change">الاتصال نشط</span>
        </div>
      </div>

      {error ? (
        <div className="admin-empty-state" style={{ marginTop: '1.5rem' }}>
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="admin-section-grid" style={{ marginTop: '1.5rem' }}>
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


