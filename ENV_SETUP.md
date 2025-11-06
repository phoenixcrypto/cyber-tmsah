# Environment Variables Setup

## إضافة هذه المتغيرات إلى `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uixhoqfcgfmjpaugvfny.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeGhvcWZjZ2ZtanBhdWd2Zm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjMwMTMsImV4cCI6MjA3NzkzOTAxM30.H1Eb7P68AVLYZqGmFHU4dnNNqogQJoYJLdEV9K26PqM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeGhvcWZjZ2ZtanBhdWd2Zm55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM2MzAxMywiZXhwIjoyMDc3OTM5MDEzfQ.DTDeXdsNU6rDm7TWFB1ZAt9JK3fYzPeHPZefAqnL2Wg

# JWT Secret (Change this to a strong random string)
JWT_SECRET=cyber-tmsah-super-secret-key-change-this-in-production-2024

# Gmail SMTP Configuration (for notifications)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

## ملاحظات:

1. **JWT_SECRET**: يجب تغييره إلى سلسلة عشوائية قوية (32+ حرف)
2. **GMAIL_APP_PASSWORD**: سيتم إضافته لاحقاً عند إعداد الإشعارات
3. **SUPABASE_SERVICE_ROLE_KEY**: لا تشارك هذا المفتاح مع أي شخص

## الخطوات التالية:

1. افتح ملف `.env.local`
2. أضف المتغيرات أعلاه
3. احفظ الملف
4. أعد تشغيل الـ dev server

