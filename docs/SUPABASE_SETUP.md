# دليل إعداد Supabase - Supabase Setup Guide

## الخطوة 1: الحصول على كلمة المرور من Supabase

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك (Project ID: `jcnznjdmhwhpauugpbge`)
3. اذهب إلى **Settings** → **Database**
4. ابحث عن **Database Password** أو **Reset Database Password**
5. إذا لم تكن لديك كلمة مرور، اضغط **Reset Database Password**
6. **احفظ كلمة المرور في مكان آمن** - ستحتاجها لاحقاً

## الخطوة 2: إنشاء DATABASE_URL

بعد الحصول على كلمة المرور، استخدم أحد الصيغ التالية:

### Option 1: Connection Pooling (موصى به للإنتاج)

```
postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**ملاحظة:** قد تكون المنطقة مختلفة. للتحقق:
1. اذهب إلى Supabase Dashboard → Settings → Database
2. ابحث عن **Connection string** أو **Connection pooling**
3. انسخ المنطقة الصحيحة (مثل: `us-east-1`, `eu-west-1`, إلخ)

### Option 2: Direct Connection (للاختبار المحلي)

```
postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

## الخطوة 3: إضافة DATABASE_URL إلى Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Settings** → **Environment Variables**
4. اضغط **Add New**
5. أضف:
   - **Key:** `DATABASE_URL`
   - **Value:** (انسخ Connection String بعد استبدال `[YOUR-PASSWORD]`)
   - **Environment:** All Environments (Production, Preview, Development)
6. احفظ

## الخطوة 4: إنشاء الجداول في Supabase

بعد إضافة `DATABASE_URL`، يجب إنشاء الجداول. يمكنك القيام بذلك بطريقتين:

### الطريقة 1: استخدام Prisma Migrate (موصى به)

في Terminal المحلي:

```bash
# 1. تأكد من وجود DATABASE_URL في ملف .env
# أضف إلى .env:
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"

# 2. قم بإنشاء migration
npm run db:migrate

# أو إذا كنت تريد push مباشر بدون migration
npm run db:push
```

### الطريقة 2: استخدام Supabase SQL Editor

1. اذهب إلى Supabase Dashboard → **SQL Editor**
2. انسخ والصق محتوى ملف `prisma/schema.prisma`
3. أو استخدم Prisma Studio لإنشاء الجداول

### الطريقة 3: استخدام Prisma Studio (للاختبار)

```bash
npm run db:studio
```

هذا سيفتح واجهة رسومية حيث يمكنك:
- رؤية الجداول
- إضافة بيانات
- تعديل البيانات

## الخطوة 5: التحقق من الاتصال

بعد إضافة `DATABASE_URL` وإنشاء الجداول:

1. **في Vercel:**
   - اذهب إلى Deployments
   - اضغط على آخر deployment
   - اضغط **Redeploy** لإعادة النشر مع المتغيرات الجديدة

2. **تحقق من Logs:**
   - بعد إعادة النشر، اذهب إلى **Logs**
   - تأكد من عدم وجود أخطاء في الاتصال بقاعدة البيانات

## الخطوة 6: إنشاء المستخدم الافتراضي

بعد إنشاء الجداول، سيتم إنشاء المستخدم الافتراضي تلقائياً عند أول محاولة تسجيل دخول.

**تأكد من وجود هذه المتغيرات في Vercel:**
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`
- `DEFAULT_ADMIN_NAME`

## استكشاف الأخطاء

### خطأ: "Can't reach database server"

**الحل:**
1. تحقق من أن `DATABASE_URL` صحيح
2. تحقق من أن كلمة المرور صحيحة
3. تأكد من أن المنطقة (region) صحيحة في Connection String

### خطأ: "relation does not exist"

**الحل:**
- الجداول غير موجودة. قم بإنشاءها باستخدام `npm run db:push` أو `npm run db:migrate`

### خطأ: "password authentication failed"

**الحل:**
- كلمة المرور غير صحيحة. قم بإعادة تعيين كلمة المرور من Supabase Dashboard

## ملاحظات مهمة

1. **استخدم Connection Pooling للإنتاج** - أفضل للأداء والاستقرار
2. **احفظ كلمة المرور في مكان آمن** - ستحتاجها عند إعادة النشر
3. **لا تشارك كلمة المرور** - حساسة للغاية
4. **استخدم Environment Variables** - لا تضع `DATABASE_URL` في الكود

## الخطوات السريعة (Quick Start)

```bash
# 1. أضف DATABASE_URL إلى .env
echo 'DATABASE_URL="postgresql://postgres:[PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"' >> .env

# 2. أنشئ الجداول
npm run db:push

# 3. تحقق من الجداول
npm run db:studio

# 4. أضف DATABASE_URL إلى Vercel Environment Variables

# 5. أعد نشر المشروع في Vercel
```

## المساعدة

إذا واجهت مشاكل:
1. تحقق من Logs في Vercel
2. تحقق من Supabase Dashboard → Database → Connection Pooling
3. تأكد من أن جميع Environment Variables موجودة في Vercel

