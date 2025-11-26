import SectionPlaceholder from '@/components/admin/SectionPlaceholder'
import ProfileDetails from './profile-details'

export default function AdminProfilePage() {
  return (
    <SectionPlaceholder
      title="الملف الشخصي"
      description="عرض معلومات الحساب الحالية وتحديثها قريباً."
      hint="سيتم توفير إمكانية تعديل البيانات وتغيير كلمة المرور لاحقاً."
    >
      <ProfileDetails />
    </SectionPlaceholder>
  )
}


