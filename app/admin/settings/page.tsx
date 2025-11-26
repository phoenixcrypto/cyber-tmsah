import SectionPlaceholder from '@/components/admin/SectionPlaceholder'

const settingsCategories = [
  { title: 'إعدادات عامة', description: 'اسم الموقع، الشعار، الروابط الأساسية.' },
  { title: 'المصادقة', description: 'إدارة كلمات المرور، سياسات تسجيل الدخول، الجلسات.' },
  { title: 'التكاملات', description: 'مفاتيح Resend، Google Analytics، وواجهات الدفع.' },
  { title: 'النسخ الاحتياطي', description: 'جدولة النسخ الاحتياطي للبيانات واستعادتها.' },
]

export default function AdminSettingsPage() {
  return (
    <SectionPlaceholder
      title="الإعدادات المتقدمة"
      description="تعديل إعدادات المنصة والتحكم في الخدمات المتصلة."
      hint="سيتوفر قريباً محرر كامل يتيح التعديل من دون لمس الشفرة."
    >
      <div className="admin-section-grid">
        {settingsCategories.map((category) => (
          <div key={category.title} className="admin-section-stat">
            <span className="admin-section-stat-label">{category.title}</span>
            <span className="admin-section-stat-value" style={{ fontSize: '1rem' }}>
              {category.description}
            </span>
            <span className="admin-section-stat-change">قريباً</span>
          </div>
        ))}
      </div>
    </SectionPlaceholder>
  )
}


