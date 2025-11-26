import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import Link from 'next/link'

const repoBase = 'https://github.com/phoenixcrypto/cyber-tmsah/blob/main'

const resources = [
  { label: 'دليل النشر على Vercel', href: `${repoBase}/GET_VERCEL_ERROR_LOGS.md` },
  { label: 'إرشادات قاعدة البيانات', href: `${repoBase}/FINAL_DATABASE_FIX.md` },
  { label: 'ملف supabase_schema.sql', href: `${repoBase}/supabase_schema.sql` },
]

export default function AdminHelpPage() {
  return (
    <SectionPlaceholder
      title="مركز المساعدة"
      description="مصادر سريعة لحل المشاكل التقنية وإدارة البنية التحتية."
      hint="يمكنك إضافة أسئلة متكررة أو ربط قناة دعم مباشرة."
    >
      <div className="admin-section-card" style={{ margin: 0 }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-white)' }}>روابط مهمة</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {resources.map((resource) => (
            <li key={resource.label}>
              <Link href={resource.href} className="admin-section-action admin-section-action-secondary">
                {resource.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionPlaceholder>
  )
}


