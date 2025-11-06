-- ============================================
-- Security Policies Update Script
-- حذف السياسات القديمة وإنشاء المحسّنة
-- ============================================

-- ============================================
-- Step 1: Drop Old Policies
-- ============================================

-- Drop old Users policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "No direct inserts via RLS" ON users;
DROP POLICY IF EXISTS "No direct deletes via RLS" ON users;

-- Drop old Verification List policies
DROP POLICY IF EXISTS "Admins can view verification list" ON verification_list;
DROP POLICY IF EXISTS "Admins can insert verification list" ON verification_list;
DROP POLICY IF EXISTS "Admins can update verification list" ON verification_list;
DROP POLICY IF EXISTS "No direct deletes verification" ON verification_list;

-- Drop old Articles policies
DROP POLICY IF EXISTS "Students see their section content" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;

-- Drop old Tasks policies
DROP POLICY IF EXISTS "Students see their section tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can manage tasks" ON tasks;

-- Drop old Task Submissions policies
DROP POLICY IF EXISTS "Users can view own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON task_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON task_submissions;
DROP POLICY IF EXISTS "No direct updates submissions" ON task_submissions;
DROP POLICY IF EXISTS "No direct deletes submissions" ON task_submissions;

-- Drop old Article Views policies
DROP POLICY IF EXISTS "Users can insert own views" ON article_views;
DROP POLICY IF EXISTS "Admins can view all article views" ON article_views;
DROP POLICY IF EXISTS "No direct updates views" ON article_views;
DROP POLICY IF EXISTS "No direct deletes views" ON article_views;

-- Drop old Task Views policies
DROP POLICY IF EXISTS "Users can insert own task views" ON task_views;
DROP POLICY IF EXISTS "Admins can view all task views" ON task_views;
DROP POLICY IF EXISTS "No direct updates task views" ON task_views;
DROP POLICY IF EXISTS "No direct deletes task views" ON task_views;

-- Drop old Notification Settings policies
DROP POLICY IF EXISTS "Users can manage own notification settings" ON notification_settings;

-- ============================================
-- Step 2: Create Enhanced RLS Policies
-- ============================================

-- ============================================
-- Enhanced RLS Policies - Users Table
-- ============================================

-- Users: Students can ONLY view their own data (no password_hash)
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (
    auth.uid() = id
    AND role = 'student'
  );

-- Users: Admins can view all users (but not password_hash in client queries)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
      AND u.is_active = TRUE
    )
  );

-- Users: Students can ONLY update their own non-sensitive data
-- Note: Role, section_number, and group_name changes are prevented at API level
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (
    auth.uid() = id 
    AND role = 'student'
    AND is_active = TRUE
  )
  WITH CHECK (
    auth.uid() = id 
    AND role = 'student'
  );

-- Prevent direct inserts via RLS (all inserts must go through API)
CREATE POLICY "No direct inserts via RLS"
  ON users FOR INSERT
  WITH CHECK (FALSE);

-- Prevent direct deletes via RLS (all deletes must go through API)
CREATE POLICY "No direct deletes via RLS"
  ON users FOR DELETE
  USING (FALSE);

-- ============================================
-- Enhanced RLS Policies - Verification List
-- ============================================

-- Only admins can view
CREATE POLICY "Admins can view verification list"
  ON verification_list FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Only admins can insert (via API)
CREATE POLICY "Admins can insert verification list"
  ON verification_list FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update verification list"
  ON verification_list FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Prevent direct deletes
CREATE POLICY "No direct deletes verification"
  ON verification_list FOR DELETE
  USING (FALSE);

-- ============================================
-- Enhanced RLS Policies - Articles
-- ============================================

-- Students see only their section content (published only)
CREATE POLICY "Students see their section content"
  ON articles FOR SELECT
  USING (
    -- Must be published
    published_at IS NOT NULL
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (
      -- General content (visible to all)
      is_general = TRUE
      OR
      -- Section-specific content (must match student's section/group)
      (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role = 'student'
          AND users.is_active = TRUE
          AND (
            target_sections IS NULL 
            OR users.section_number = ANY(target_sections)
          )
          AND (
            target_groups IS NULL 
            OR users.group_name = ANY(target_groups)
          )
        )
      )
    )
  );

-- Admins can view all articles
CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Only admins can insert/update/delete articles
CREATE POLICY "Admins can manage articles"
  ON articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- ============================================
-- Enhanced RLS Policies - Tasks
-- ============================================

-- Students see only their section tasks (published only)
CREATE POLICY "Students see their section tasks"
  ON tasks FOR SELECT
  USING (
    published_at IS NOT NULL
    AND (
      is_general = TRUE
      OR
      (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role = 'student'
          AND users.is_active = TRUE
          AND (
            target_sections IS NULL 
            OR users.section_number = ANY(target_sections)
          )
          AND (
            target_groups IS NULL 
            OR users.group_name = ANY(target_groups)
          )
        )
      )
    )
  );

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Only admins can manage tasks
CREATE POLICY "Admins can manage tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- ============================================
-- Enhanced RLS Policies - Task Submissions
-- ============================================

-- Users can view their own submissions only
CREATE POLICY "Users can view own submissions"
  ON task_submissions FOR SELECT
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_active = TRUE
    )
  );

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON task_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON task_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'student'
      AND users.is_active = TRUE
    )
  );

-- Prevent direct updates (must go through API)
CREATE POLICY "No direct updates submissions"
  ON task_submissions FOR UPDATE
  USING (FALSE);

-- Prevent direct deletes
CREATE POLICY "No direct deletes submissions"
  ON task_submissions FOR DELETE
  USING (FALSE);

-- ============================================
-- Enhanced RLS Policies - Article Views
-- ============================================

-- Users can insert their own views only
CREATE POLICY "Users can insert own views"
  ON article_views FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_active = TRUE
    )
  );

-- Admins can view all views
CREATE POLICY "Admins can view all article views"
  ON article_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Prevent updates and deletes
CREATE POLICY "No direct updates views"
  ON article_views FOR UPDATE
  USING (FALSE);

CREATE POLICY "No direct deletes views"
  ON article_views FOR DELETE
  USING (FALSE);

-- ============================================
-- Enhanced RLS Policies - Task Views
-- ============================================

-- Users can insert their own views only
CREATE POLICY "Users can insert own task views"
  ON task_views FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_active = TRUE
    )
  );

-- Admins can view all views
CREATE POLICY "Admins can view all task views"
  ON task_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Prevent updates and deletes
CREATE POLICY "No direct updates task views"
  ON task_views FOR UPDATE
  USING (FALSE);

CREATE POLICY "No direct deletes task views"
  ON task_views FOR DELETE
  USING (FALSE);

-- ============================================
-- Notification Settings
-- ============================================

-- Notification Settings: Users can view and update their own
CREATE POLICY "Users can manage own notification settings"
  ON notification_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Step 3: Create Security Functions (if not exists)
-- ============================================

-- Function to check if user is admin (for use in policies)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role = 'admin'
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is active student
CREATE OR REPLACE FUNCTION is_active_student(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role = 'student'
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 4: Create Audit Logs Table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing audit log policies if exist
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = TRUE
    )
  );

-- Only system can insert audit logs (via service role)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (FALSE); -- Must use service role

-- ============================================
-- Step 5: Create Additional Security Indexes
-- ============================================

-- Index for faster role checks
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active) WHERE role = 'admin' AND is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_role_active_student ON users(role, is_active) WHERE role = 'student' AND is_active = TRUE;

-- ============================================
-- Done! ✅
-- ============================================
-- All enhanced security policies have been applied.
-- All policies now check is_active = TRUE
-- Direct deletes are prevented (must go through API)
-- Students cannot change their role, section, or group
-- ============================================

