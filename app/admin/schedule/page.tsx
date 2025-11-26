import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { prisma } from '@/lib/db/prisma'

async function getSchedule() {
  try {
    const schedule = await prisma.scheduleItem.findMany({
      orderBy: [{ day: 'asc' }, { time: 'asc' }],
    })
    return { schedule, error: null }
  } catch (error) {
    console.error('Failed to load schedule', error)
    return { schedule: [], error: 'تعذر تحميل الجدول الدراسي.' }
  }
}

export default async function AdminSchedulePage() {
  const { schedule, error } = await getSchedule()

  return (
    <SectionPlaceholder
      title="الجدول الدراسي"
      description="إدارة الجداول الزمنية والمواد لكل المجموعات."
      actions={[{ label: 'إضافة حصة', href: '#', variant: 'primary' }]}
      hint="يمكن مزامنة هذا الجدول مع تطبيقات خارجية بعد تفعيل التكاملات."
    >
      {error ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>{error}</p>
        </div>
      ) : schedule.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow" />
          <p>لا توجد عناصر في الجدول حالياً.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>اليوم</th>
                <th>الوقت</th>
                <th>المجموعة</th>
                <th>المادة</th>
                <th>المكان</th>
                <th>المحاضر</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td>{item.day}</td>
                  <td>{item.time}</td>
                  <td>{item.group}</td>
                  <td>{item.title}</td>
                  <td>{item.location}</td>
                  <td>{item.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionPlaceholder>
  )
}


