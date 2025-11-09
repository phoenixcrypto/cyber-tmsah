-- ============================================
-- Check Students in Database
-- Use this to verify students exist in the database
-- ============================================

-- 1. Check all users (including admin)
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

-- 2. Check only students
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
WHERE role = 'student'
ORDER BY created_at DESC;

-- 3. Count students by status
SELECT 
  COUNT(*) as total_students,
  COUNT(*) FILTER (WHERE is_active = TRUE) as active_students,
  COUNT(*) FILTER (WHERE is_active = FALSE) as inactive_students
FROM users
WHERE role = 'student';

-- 4. Check students by section
SELECT 
  section_number,
  COUNT(*) as count
FROM users
WHERE role = 'student'
GROUP BY section_number
ORDER BY section_number;

-- 5. Check students by group
SELECT 
  group_name,
  COUNT(*) as count
FROM users
WHERE role = 'student'
GROUP BY group_name
ORDER BY group_name;

-- 6. Check if any users exist at all
SELECT COUNT(*) as total_users FROM users;

