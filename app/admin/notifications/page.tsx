import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import { getAdminBasePath } from '@/lib/utils/admin-path'

const channels = [
  { label: 'البريد الإلكتروني', description: 'إرسال رسائل إعادة التعيين والإشعارات الدورية', status: 'مفعل جزئياً' },
  { label: 'إشعارات المتصفح', description: 'دعم Web Push للمستخدمين المسجلين', status: 'قريباً' },
  { label: 'رسائل واتساب', description: 'تكامل مع واجهات WhatsApp Business', status: 'قيد الدراسة' },
]

export default function AdminNotificationsPage() {
  const basePath = getAdminBasePath()
  return (
    <SectionPlaceholder
      title="مركز الإشعارات"
      description="إدارة قنوات الإبلاغ للمستخدمين والمشرفين."
      actions={[{ label: 'ضبط خدمة البريد', href: `${basePath}/settings`, variant: 'primary' }]}
      hint="يمكنك مزامنة الأحداث مع خدمات خارجية مثل Resend أو Firebase."
    >
      <div className="admin-section-grid">
        {channels.map((channel) => (
          <div key={channel.label} className="admin-section-stat">
            <span className="admin-section-stat-label">{channel.label}</span>
            <span className="admin-section-stat-value" style={{ fontSize: '1rem' }}>
              {channel.description}
            </span>
            <span className="admin-section-stat-change">{channel.status}</span>
          </div>
        ))}
      </div>
    </SectionPlaceholder>
  )
}


