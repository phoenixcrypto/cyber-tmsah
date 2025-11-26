import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getNews() {
  try {
    const news = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 25,
    })
    return { news, error: null }
  } catch (error) {
    console.error('Failed to load news', error)
    return { news: [], error: 'تعذر تحميل الأخبار.' }
  }
}

export default async function AdminNewsPage() {
  const { news, error } = await getNews()

  return (
    <SectionPlaceholder
      title="الأخبار الأكاديمية"
      description="نشر الأخبار الرسمية، تحديثات الجداول، والتنبيهات الهامة."
      actions={[{ label: 'نشر خبر جديد', href: '#', variant: 'primary' }]}
      hint="يمكنك استخدام API الحالية /api/news لإدارة المحتوى آلياً."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : news.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لا توجد أخبار منشورة بعد.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>المادة</th>
                <th>الحالة</th>
                <th>تاريخ النشر</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.subjectTitle}</td>
                  <td>{item.status === 'published' ? 'منشور' : 'مسودة'}</td>
                  <td>{new Date(item.publishedAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


