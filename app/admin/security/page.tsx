import SectionPlaceholder from '@/components/admin/SectionPlaceholder'

const securityChecks = [
  { label: 'حماية تسجيل الدخول', value: 'JWT + Refresh Tokens', status: 'مفعل' },
  { label: 'الاتصال بقاعدة البيانات', value: 'SSL Required', status: 'مفعل' },
  { label: 'إخفاء مسار لوحة التحكم', value: 'ADMIN_PATH', status: 'مفعل' },
  { label: 'سياسات RLS', value: 'مطلوب تفعيل عبر المزود الحالي', status: 'قيد المراجعة' },
]

export default function AdminSecurityPage() {
  return (
    <SectionPlaceholder
      title="مركز الأمان"
      description="مراجعة إعدادات الحماية وكلمات المرور وعمليات التدقيق."
      actions={[{ label: 'تحديث كلمة مرور قاعدة البيانات', href: 'https://console.neon.tech/', variant: 'primary' }]}
      hint="يمكن إضافة تكامل مع خدمات مراقبة الأمان أو 2FA من هنا."
    >
      <div className="admin-section-grid">
        {securityChecks.map((check) => (
          <div key={check.label} className="admin-section-stat">
            <span className="admin-section-stat-label">{check.label}</span>
            <span className="admin-section-stat-value" style={{ fontSize: '1rem' }}>
              {check.value}
            </span>
            <span className="admin-section-stat-change">{check.status}</span>
          </div>
        ))}
      </div>
    </SectionPlaceholder>
  )
}


