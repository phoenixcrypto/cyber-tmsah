# دليل سريع لإعداد Supabase - Quick Start Guide

## الخطوات السريعة (5 دقائق)

### 1. الحصول على كلمة المرور من Supabase

1. اذهب إلى: https://app.supabase.com
2. اختر مشروعك (Project ID: `jcnznjdmhwhpauugpbge`)
3. اذهب إلى **Settings** → **Database**
4. اضغط **Reset Database Password** (إذا لم تكن لديك كلمة مرور)
5. **انسخ كلمة المرور واحفظها**

### 2. إنشاء DATABASE_URL

استبدل `[YOUR-PASSWORD]` بكلمة المرور التي حصلت عليها:

**للإنتاج (Vercel) - استخدم هذا:**
```
postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**للاختبار المحلي:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

### 3. إضافة DATABASE_URL إلى Vercel

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك
3. **Settings** → **Environment Variables**
4. اضغط **Add New**
5. أضف:
   - **Key:** `DATABASE_URL`
   - **Value:** (انسخ Connection String بعد استبدال `[YOUR-PASSWORD]`)
   - **Environment:** All Environments
6. احفظ

### 4. إنشاء الجداول (اختياري - يمكنك القيام بذلك محلياً)

**الطريقة الأسهل - من Terminal المحلي:**

```bash
# 1. أضف DATABASE_URL إلى ملف .env
# افتح .env وأضف:
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"

# 2. أنشئ الجداول
npm run db:push

# 3. تحقق من الجداول
npm run db:check
```

**أو استخدم Prisma Studio لرؤية الجداول:**
```bash
npm run db:studio
```

### 5. إعادة نشر المشروع في Vercel

1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اضغط **Deployments**
4. اضغط على آخر deployment
5. اضغط **Redeploy**

### 6. التحقق من أن كل شيء يعمل

1. بعد إعادة النشر، اذهب إلى موقعك
2. جرب تسجيل الدخول باستخدام:
   - **Username:** (من `DEFAULT_ADMIN_USERNAME` في Vercel)
   - **Password:** (من `DEFAULT_ADMIN_PASSWORD` في Vercel)

## ملاحظات مهمة

- ✅ **استخدم Connection Pooling للإنتاج** (الـ URL الذي يحتوي على `pooler.supabase.com`)
- ✅ **احفظ كلمة المرور في مكان آمن**
- ✅ **تأكد من وجود جميع Environment Variables في Vercel**

## استكشاف الأخطاء

### المشكلة: "Can't reach database server"
**الحل:** تحقق من أن `DATABASE_URL` صحيح وأن كلمة المرور صحيحة

### المشكلة: "relation does not exist"
**الحل:** قم بإنشاء الجداول باستخدام `npm run db:push`

### المشكلة: "password authentication failed"
**الحل:** كلمة المرور غير صحيحة. قم بإعادة تعيينها من Supabase Dashboard

## المساعدة

إذا واجهت مشاكل:
1. تحقق من `docs/SUPABASE_SETUP.md` للدليل التفصيلي
2. تحقق من Logs في Vercel
3. تحقق من Supabase Dashboard → Database → Connection Pooling

