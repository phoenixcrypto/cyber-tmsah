import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'
import { getAdminBasePath } from '@/lib/utils/admin-path'

async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        material: {
          select: { title: true },
        },
      },
      take: 25,
    })
    return { articles, error: null }
  } catch (error) {
    console.error('Failed to load articles', error)
    return { articles: [], error: 'تعذر جلب المقالات من قاعدة البيانات.' }
  }
}

export default async function AdminArticlesPage() {
  const { articles, error } = await getArticles()
  const basePath = getAdminBasePath()

  return (
    <SectionPlaceholder
      title="المقالات التعليمية"
      description="إدارة المحتوى الكتابي وربطه بالمواد الدراسية."
      actions={[
        { label: 'إنشاء مقال جديد', href: `${basePath}/content/articles`, variant: 'primary' },
        { label: 'إدارة المواد', href: `${basePath}/content/materials`, variant: 'secondary' },
      ]}
      hint="سيتم إضافة محرر متكامل قريباً للتحكم بنسخ المحتوى والترجمة."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لم يتم إضافة أي مقالات حتى الآن.</p>
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
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.material?.title || 'غير محددة'}</td>
                  <td>{article.status === 'published' ? 'منشور' : 'مسودة'}</td>
                  <td>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-EG') : '—'}</td>
                  <td>{new Date(article.updatedAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


