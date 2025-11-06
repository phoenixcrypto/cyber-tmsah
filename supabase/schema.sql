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

-- Verification List: Only admins can view
CREATE POLICY "Admins can view verification list"
  ON verification_list FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users: Users can view their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users: Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Articles: Students see their section content
CREATE POLICY "Students see their section content"
  ON articles FOR SELECT
  USING (
    -- Published articles only
    published_at IS NOT NULL
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (
      -- General content
      is_general = TRUE
      OR
      -- Section-specific content
      (
        (target_sections IS NULL OR (SELECT section_number FROM users WHERE id = auth.uid()) = ANY(target_sections))
        AND
        (target_groups IS NULL OR (SELECT group_name FROM users WHERE id = auth.uid()) = ANY(target_groups))
      )
    )
  );

-- Articles: Admins can view all
CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Tasks: Same as articles
CREATE POLICY "Students see their section tasks"
  ON tasks FOR SELECT
  USING (
    published_at IS NOT NULL
    AND (
      is_general = TRUE
      OR
      (
        (target_sections IS NULL OR (SELECT section_number FROM users WHERE id = auth.uid()) = ANY(target_sections))
        AND
        (target_groups IS NULL OR (SELECT group_name FROM users WHERE id = auth.uid()) = ANY(target_groups))
      )
    )
  );

-- Tasks: Admins can view all
CREATE POLICY "Admins can view all tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Task Submissions: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON task_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Task Submissions: Admins can view all
CREATE POLICY "Admins can view all submissions"
  ON task_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Article Views: Users can insert their own views
CREATE POLICY "Users can insert own views"
  ON article_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Article Views: Admins can view all
CREATE POLICY "Admins can view all article views"
  ON article_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Task Views: Same as article views
CREATE POLICY "Users can insert own task views"
  ON task_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all task views"
  ON task_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Notification Settings: Users can view and update their own
CREATE POLICY "Users can manage own notification settings"
  ON notification_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 10. Functions and Triggers
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

