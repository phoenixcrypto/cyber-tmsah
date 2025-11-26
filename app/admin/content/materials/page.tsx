import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'
import { getAdminBasePath } from '@/lib/utils/admin-path'

async function getMaterials() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })
    return { materials, error: null }
  } catch (error) {
    console.error('Failed to load materials', error)
    return { materials: [], error: 'تعذر تحميل البيانات. تأكد من الاتصال بقاعدة البيانات.' }
  }
}

export default async function AdminMaterialsPage() {
  const { materials, error } = await getMaterials()
  const basePath = getAdminBasePath()

  return (
    <SectionPlaceholder
      title="المواد الدراسية"
      description="إدارة المواد، تخصيص الأيقونات، وربط المقالات التعليمية."
      actions={[
        { label: 'إضافة مادة جديدة', href: `${basePath}/content/materials`, variant: 'primary' },
        { label: 'إدارة المقالات', href: `${basePath}/content/articles`, variant: 'secondary' },
      ]}
      hint="يمكنك إضافة الأنشطة أو تعديل المحتوى من خلال واجهة التعديل القادمة."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لا توجد مواد مضافة حالياً. ابدأ بإضافة أول مادة تعليمية للمنصة.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>المادة</th>
                <th>الوصف المختصر</th>
                <th>عدد المقالات</th>
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>
                    <strong>{material.title}</strong>
                    <br />
                    <span style={{ color: 'var(--dark-400)' }}>{material.titleEn}</span>
                  </td>
                  <td>{material.description.slice(0, 80)}...</td>
                  <td>{material._count.articles}</td>
                  <td>{new Date(material.updatedAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


