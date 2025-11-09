-- ============================================
-- Debug Users - Check what's in the database
-- ============================================

-- 1. Check ALL users with their roles
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  is_active,
  section_number,
  group_name,
  created_at
FROM users
ORDER BY created_at DESC;

-- 2. Count users by role
SELECT 
  role,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_active = TRUE) as active_count,
  COUNT(*) FILTER (WHERE is_active = FALSE) as inactive_count
FROM users
GROUP BY role
ORDER BY role;

-- 3. Check if there are any users with role = 'student' (case-sensitive)
SELECT 
  COUNT(*) as student_count
FROM users
WHERE role = 'student';

-- 4. Check if there are any users with role LIKE 'student' (case-insensitive)
SELECT 
  COUNT(*) as student_like_count
FROM users
WHERE LOWER(role) LIKE '%student%';

-- 5. Show all distinct role values
SELECT DISTINCT role FROM users;

-- 6. Check users that are NOT admin
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  is_active,
  section_number,
  group_name
FROM users
WHERE role != 'admin'
ORDER BY created_at DESC;

