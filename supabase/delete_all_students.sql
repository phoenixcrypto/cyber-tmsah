-- ============================================
-- Delete All Students Script
-- حذف جميع الطلاب المسجلين من قاعدة البيانات
-- ============================================
-- ⚠️ WARNING: This will delete ALL students from the users table
-- ⚠️ تحذير: هذا سيحذف جميع الطلاب من جدول users

-- Option 1: Delete ALL students (keep admins)
-- الخيار 1: حذف جميع الطلاب (الاحتفاظ بـ Admin)
DELETE FROM users WHERE role = 'student';

-- Option 2: Delete only inactive students
-- الخيار 2: حذف الطلاب غير النشطين فقط
-- DELETE FROM users WHERE role = 'student' AND is_active = FALSE;

-- Reset verification list registration status
-- إعادة تعيين حالة التسجيل في قائمة التحقق
UPDATE verification_list 
SET 
  is_registered = FALSE,
  registered_at = NULL,
  registered_by = NULL,
  updated_at = NOW()
WHERE is_registered = TRUE;

-- Verify deletion
-- التحقق من الحذف
SELECT 
  role,
  COUNT(*) as count
FROM users
GROUP BY role;

-- Show remaining users
-- عرض المستخدمين المتبقين
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM users
ORDER BY created_at DESC;

