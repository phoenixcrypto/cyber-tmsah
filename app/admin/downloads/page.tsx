import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getDownloads() {
  try {
    const downloads = await prisma.downloadSoftware.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return { downloads, error: null }
  } catch (error) {
    console.error('Failed to load downloads', error)
    return { downloads: [], error: 'تعذر تحميل البرامج المتاحة للتنزيل.' }
  }
}

export default async function AdminDownloadsPage() {
  const { downloads, error } = await getDownloads()

  return (
    <SectionPlaceholder
      title="برامج التنزيل"
      description="إدارة البرامج والأدوات المتاحة للطلاب، روابط التحميل، والفيديوهات التوضيحية."
      actions={[{ label: 'إضافة برنامج', href: '#', variant: 'primary' }]}
      hint="يمكن ربط هذه القائمة مع صفحة /downloads العامة."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : downloads.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لا توجد برامج مسجلة حتى الآن.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>اسم البرنامج</th>
                <th>الوصف</th>
                <th>الفئة</th>
                <th>رابط التحميل</th>
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((download) => (
                <tr key={download.id}>
                  <td>{download.name}</td>
                  <td>{download.description.slice(0, 60)}...</td>
                  <td>{download.category || 'غير محدد'}</td>
                  <td>{download.downloadUrl ? 'متوفر' : '—'}</td>
                  <td>{new Date(download.updatedAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


