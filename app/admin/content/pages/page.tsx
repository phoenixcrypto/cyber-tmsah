import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 25,
    })
    return { pages, error: null }
  } catch (error) {
    console.error('Failed to load pages', error)
    return { pages: [], error: 'تعذر تحميل الصفحات الثابتة.' }
  }
}

export default async function AdminPagesPage() {
  const { pages, error } = await getPages()

  return (
    <SectionPlaceholder
      title="الصفحات الثابتة"
      description="إدارة صفحات من نحن، الشروط، الخصوصية وغيرها من المحتوى الرسمي."
      actions={[{ label: 'إضافة صفحة', href: '#', variant: 'primary' }]}
      hint="إدارة المحتوى سيتم ربطها بمحرر بصري قريباً."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لا توجد صفحات مخصصة حتى الآن.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>الرابط</th>
                <th>الحالة</th>
                <th>الترتيب</th>
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>/{page.slug}</td>
                  <td>{page.status === 'published' ? 'منشورة' : 'مسودة'}</td>
                  <td>{page.order ?? '—'}</td>
                  <td>{new Date(page.updatedAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


