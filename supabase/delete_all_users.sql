-- ============================================
-- Delete All Users Script
-- حذف جميع الحسابات المسجلة
-- ============================================
-- ⚠️ WARNING: This will delete ALL users except admins
-- ⚠️ تحذير: هذا سيحذف جميع المستخدمين ما عدا Admin

-- Option 1: Delete ALL users (including admins)
-- الخيار 1: حذف جميع المستخدمين (بما في ذلك Admin)
-- DELETE FROM users;

-- Option 2: Delete only students (keep admins)
-- الخيار 2: حذف الطلاب فقط (الاحتفاظ بـ Admin)
DELETE FROM users WHERE role = 'student';

-- Option 3: Delete only inactive students
-- الخيار 3: حذف الطلاب غير النشطين فقط
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

