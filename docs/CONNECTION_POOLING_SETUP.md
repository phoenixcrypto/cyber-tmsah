# إعداد Connection Pooling في Supabase

## ما هو Connection Pooling؟

Connection Pooling يسمح بعدة اتصالات متزامنة لقاعدة البيانات، مما يحسن الأداء والاستقرار.

## الإعدادات الحالية (من Supabase Dashboard)

- **Pool Size:** 15 (الحد الأقصى للاتصالات لكل مستخدم+قاعدة بيانات)
- **Max Client Connections:** 200 (ثابت - لا يمكن تغييره)
- **Type:** Shared Pooler

## كيفية الحصول على Connection String للـ Pooling

### الخطوة 1: اذهب إلى Supabase Dashboard

1. افتح: https://app.supabase.com
2. اختر مشروعك (Project ID: `jcnznjdmhwhpauugpbge`)
3. اذهب إلى **Settings** → **Database**

### الخطوة 2: احصل على Connection String

في صفحة Database Settings، ابحث عن قسم **Connection pooling**

ستجد Connection Strings جاهزة:

#### Session Mode (موصى به لـ Prisma):
```
postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### Transaction Mode:
```
postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&pgbouncer-mode=transaction
```

### الخطوة 3: استبدل كلمة المرور

استبدل `[YOUR-PASSWORD]` بكلمة المرور: `ZXCVBNM123456789zxcvbnm@@12`

**مثال:**
```
postgresql://postgres.jcnznjdmhwhpauugpbge:ZXCVBNM123456789zxcvbnm@@12@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**ملاحظة:** استبدل `[REGION]` بالمنطقة الصحيحة (مثل: `eu-central-1`, `us-east-1`)

### الخطوة 4: إذا كانت كلمة المرور تحتوي على رموز خاصة

إذا كانت كلمة المرور تحتوي على `@`, `#`, `%`, إلخ، قد تحتاج إلى URL encoding:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`

**لكن:** Prisma عادة يتعامل مع الرموز الخاصة تلقائياً، لذا جرب بدون encoding أولاً.

## تحديث ملف .env

افتح ملف `.env` واستبدل `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres.jcnznjdmhwhpauugpbge:ZXCVBNM123456789zxcvbnm@@12@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## إنشاء الجداول

بعد تحديث `.env`:

```bash
npm run db:push
```

## الفرق بين Session Mode و Transaction Mode

### Session Mode (موصى به):
- يدعم جميع ميزات PostgreSQL
- يعمل مع Prisma بشكل أفضل
- مناسب للتطبيقات التي تحتاج إلى sessions طويلة

### Transaction Mode:
- أسرع قليلاً
- قد لا يعمل مع بعض ميزات Prisma
- مناسب للاستعلامات السريعة

## استكشاف الأخطاء

### خطأ: "Tenant or user not found"
**الحل:**
- استخدم Direct Connection بدلاً من Pooling
- أو تحقق من أن Project ID صحيح

### خطأ: "Can't reach database server"
**الحل:**
- تحقق من أن Connection String صحيح
- تحقق من أن المنطقة (Region) صحيحة
- جرب Direct Connection أولاً للتأكد من أن كلمة المرور صحيحة

### خطأ: "password authentication failed"
**الحل:**
- كلمة المرور غير صحيحة
- قم بإعادة تعيين كلمة المرور من Supabase Dashboard

## نصيحة

**الأفضل:** انسخ Connection String مباشرة من Supabase Dashboard بدلاً من إنشائه يدوياً - هذا يضمن أن كل شيء صحيح، بما في ذلك المنطقة (Region).

