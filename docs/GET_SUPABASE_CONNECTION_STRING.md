# كيفية الحصول على Connection String الصحيح من Supabase

## الطريقة الأسهل والأصح

### 1. اذهب إلى Supabase Dashboard

1. افتح: https://app.supabase.com
2. سجل الدخول
3. اختر مشروعك (Project ID: `jcnznjdmhwhpauugpbge`)

### 2. احصل على Connection String مباشرة

1. اذهب إلى **Settings** → **Database**
2. ابحث عن قسم **Connection string** أو **Connection pooling**
3. ستجد Connection Strings جاهزة - انسخ واحدة منها

### 3. اختر النوع المناسب

**للاختبار المحلي (Direct Connection):**
- ابحث عن **Connection string** → **URI**
- انسخ الـ URL الكامل
- استبدل `[YOUR-PASSWORD]` بكلمة المرور: `ZXCVBNM123456789zxcvbnm@@12`

**للإنتاج (Connection Pooling - موصى به):**
- ابحث عن **Connection pooling** → **Session mode** أو **Transaction mode**
- انسخ الـ URL الكامل
- استبدل `[YOUR-PASSWORD]` بكلمة المرور: `ZXCVBNM123456789zxcvbnm@@12`

### 4. مثال على Connection String الصحيح

بعد استبدال كلمة المرور، يجب أن يبدو هكذا:

**Direct Connection:**
```
postgresql://postgres:ZXCVBNM123456789zxcvbnm@@12@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

**Connection Pooling (Session mode):**
```
postgresql://postgres.jcnznjdmhwhpauugpbge:ZXCVBNM123456789zxcvbnm@@12@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**ملاحظة:** استبدل `[REGION]` بالمنطقة الصحيحة (مثل: `eu-central-1`, `us-east-1`, إلخ)

### 5. تحديث ملف .env

افتح ملف `.env` واستبدل `DATABASE_URL` بالـ Connection String الذي نسخته.

### 6. إذا كانت كلمة المرور تحتوي على رموز خاصة

إذا كانت كلمة المرور تحتوي على رموز خاصة مثل `@`, `#`, `%`, إلخ، قد تحتاج إلى URL encoding:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

**مثال:** إذا كانت كلمة المرور: `ZXCVBNM123456789zxcvbnm@@12`
- `@@` → `%40%40`
- الكلمة المرور بعد encoding: `ZXCVBNM123456789zxcvbnm%40%40%4012`

**لكن:** Prisma عادة يتعامل مع الرموز الخاصة تلقائياً، لذا جرب بدون encoding أولاً.

### 7. التحقق من الاتصال

بعد تحديث `.env`:

```bash
npm run db:push
```

إذا نجح، ستظهر رسالة:
```
✅ Your database is now in sync with your Prisma schema.
```

## استكشاف الأخطاء

### خطأ: "Can't reach database server"
**الحل:**
- تحقق من أن Connection String صحيح
- تحقق من أن كلمة المرور صحيحة
- تأكد من أن المشروع موجود في Supabase

### خطأ: "Tenant or user not found"
**الحل:**
- استخدم Direct Connection بدلاً من Connection Pooling
- أو تحقق من أن Project ID صحيح

### خطأ: "password authentication failed"
**الحل:**
- كلمة المرور غير صحيحة
- قم بإعادة تعيين كلمة المرور من Supabase Dashboard

## نصيحة

**الأفضل:** استخدم Connection String مباشرة من Supabase Dashboard بدلاً من إنشائه يدوياً - هذا يضمن أن كل شيء صحيح.

