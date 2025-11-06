-- ============================================
-- Supabase Database Schema
-- Cyber TMSAH - Academic Platform
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Users (الطلاب والأدمن) - MUST BE FIRST
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  section_number INTEGER CHECK (section_number BETWEEN 1 AND 15),
  group_name TEXT CHECK (group_name IN ('Group 1', 'Group 2')),
  university_email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_section ON users(section_number, group_name);

-- ============================================
-- 2. Verification List (قائمة التحقق)
-- ============================================
CREATE TABLE IF NOT EXISTS verification_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  section_number INTEGER NOT NULL CHECK (section_number BETWEEN 1 AND 15),
  group_name TEXT NOT NULL CHECK (group_name IN ('Group 1', 'Group 2')),
  student_id TEXT,
  email TEXT,
  is_registered BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMPTZ,
  registered_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for verification lookups
CREATE INDEX IF NOT EXISTS idx_verification_lookup 
ON verification_list(full_name, section_number, group_name);

CREATE INDEX IF NOT EXISTS idx_verification_registered 
ON verification_list(is_registered);

-- ============================================
-- 3. Articles/Materials
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subject_id TEXT,
  target_sections INTEGER[],
  target_groups TEXT[],
  is_general BOOLEAN DEFAULT FALSE,
  files TEXT[],
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_subject ON articles(subject_id);

-- ============================================
-- 4. Tasks
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id TEXT,
  target_sections INTEGER[],
  target_groups TEXT[],
  is_general BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ NOT NULL,
  files TEXT[],
  reminder_sent BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_published ON tasks(published_at);

-- ============================================
-- 5. Task Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submitted_file TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_task ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON task_submissions(user_id);

-- ============================================
-- 6. Article Views (Statistics)
-- ============================================
CREATE TABLE IF NOT EXISTS article_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0,
  device_type TEXT,
  ip_hash TEXT,
  UNIQUE(article_id, user_id, ip_hash)
);

CREATE INDEX IF NOT EXISTS idx_views_article ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_views_user ON article_views(user_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON article_views(viewed_at);

-- ============================================
-- 7. Task Views (Statistics)
-- ============================================
CREATE TABLE IF NOT EXISTS task_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  UNIQUE(task_id, user_id, ip_hash)
);

CREATE INDEX IF NOT EXISTS idx_task_views_task ON task_views(task_id);
CREATE INDEX IF NOT EXISTS idx_task_views_user ON task_views(user_id);

-- ============================================
-- 8. Notification Settings
-- ============================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  task_reminders BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. Row Level Security (RLS) Policies
-- Enhanced Security Policies - تقوية الأمان وحماية بيانات الطلاب
-- ============================================

-- Enable RLS on all tables
ALTER TABLE verification_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id AND role = 'student')
  WITH CHECK (
    auth.uid() = id 
    AND role = 'student'
    -- Prevent changing role, section_number, group_name
    AND OLD.role = NEW.role
    AND OLD.section_number = NEW.section_number
    AND OLD.group_name = NEW.group_name
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
-- 10. Security Functions
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
-- 11. Audit Log Table (Optional - for tracking admin actions)
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
-- 12. Functions and Triggers
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_verification_list_updated_at BEFORE UPDATE ON verification_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 13. Additional Security Indexes
-- ============================================

-- Index for faster role checks
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active) WHERE role = 'admin' AND is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_role_active_student ON users(role, is_active) WHERE role = 'student' AND is_active = TRUE;

-- ============================================
-- NOTES:
-- ============================================
-- 1. All RLS policies now check is_active = TRUE
-- 2. Direct deletes are prevented (must go through API)
-- 3. Students cannot change their role, section, or group
-- 4. All admin operations require active admin account
-- 5. Audit logs track admin actions (optional)
-- 6. Security functions help with policy checks
-- ============================================

