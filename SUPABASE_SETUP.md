# Supabase Setup Instructions

## 1. إنشاء حساب Supabase

1. اذهب إلى: https://supabase.com
2. اضغط على "Start your project"
3. سجل دخول بـ: **eltmsahzeyad@gmail.com**
4. أنشئ مشروع جديد

## 2. إعداد المشروع

1. اختر اسم المشروع: `cyber-tmsah`
2. اختر كلمة مرور قوية لقاعدة البيانات
3. اختر المنطقة الأقرب (مثلاً: Europe West)
4. اضغط "Create new project"

## 3. الحصول على API Keys

بعد إنشاء المشروع:

1. اذهب إلى **Settings** → **API**
2. انسخ:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (للـ admin فقط)

## 4. إعداد قاعدة البيانات

1. اذهب إلى **SQL Editor**
2. انسخ محتوى ملف `supabase/schema.sql`
3. الصق في SQL Editor
4. اضغط **Run**

## 5. إعداد Environment Variables

أنشئ ملف `.env.local` في جذر المشروع:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your-very-strong-random-secret-key
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

## 6. إنشاء Admin User

بعد إنشاء الجداول، يمكنك إنشاء حساب admin من SQL Editor:

```sql
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@example.com',
  '$2a$12$YourHashedPasswordHere',  -- استخدم bcrypt hash
  'Admin User',
  'admin'
);
```

**ملاحظة:** استخدم أداة online لإنشاء bcrypt hash لكلمة المرور.

## 7. إعداد Storage للملفات

1. اذهب إلى **Storage**
2. أنشئ bucket جديد باسم: `files`
3. عيّن الـ policies:
   - **Public**: للقراءة فقط
   - **Authenticated**: للكتابة (للـ admin فقط)

## 8. رفع قائمة الطلاب

بعد تسجيل الدخول كـ admin:
1. اذهب إلى `/admin/verification`
2. ارفع ملف Excel بقائمة الطلاب (703 طالب)
3. سيتم تحميل البيانات تلقائياً

---

## ملاحظات مهمة:

- **JWT_SECRET**: استخدم سلسلة عشوائية قوية (مثلاً: 32 حرف)
- **GMAIL_APP_PASSWORD**: اذهب إلى Gmail → Security → App passwords لإنشاء كلمة مرور للتطبيق
- **Backups**: Supabase يقوم بعمل backups تلقائية يومياً

