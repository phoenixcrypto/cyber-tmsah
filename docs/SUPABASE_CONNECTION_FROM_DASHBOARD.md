# كيفية الحصول على Database Connection String من Supabase

## الخطوات السريعة

### 1. اذهب إلى Supabase Dashboard

افتح: https://jcnznjdmhwhpauugpbge.supabase.co

أو اذهب إلى: https://app.supabase.com → اختر مشروعك

### 2. احصل على Database Password

1. اذهب إلى **Settings** (الإعدادات) → **Database**
2. ابحث عن **Database Password**
3. إذا لم تكن لديك كلمة مرور، اضغط **Reset Database Password**
4. **انسخ كلمة المرور واحفظها** (ستحتاجها)

### 3. احصل على Connection String

في نفس الصفحة (Settings → Database)، ستجد قسم **Connection string** أو **Connection info**

#### Option 1: Direct Connection (للاختبار المحلي)

ابحث عن **Connection string** → **URI** أو **Connection string**

ستجد شيء مثل:
```
postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

**استبدل `[YOUR-PASSWORD]` بكلمة المرور التي حصلت عليها**

#### Option 2: Connection Pooling (للإنتاج - موصى به)

ابحث عن **Connection pooling** → **Session mode** أو **Transaction mode**

ستجد شيء مثل:
```
postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**استبدل:**
- `[YOUR-PASSWORD]` بكلمة المرور
- `[REGION]` بالمنطقة الصحيحة (مثل: `eu-central-1`, `us-east-1`)

### 4. مثال على Connection String النهائي

إذا كانت كلمة المرور: `ZXCVBNM123456789zxcvbnm@@12`

**Direct Connection:**
```
postgresql://postgres:ZXCVBNM123456789zxcvbnm@@12@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

**Connection Pooling (إذا كانت المنطقة eu-central-1):**
```
postgresql://postgres.jcnznjdmhwhpauugpbge:ZXCVBNM123456789zxcvbnm@@12@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 5. تحديث ملف .env

افتح ملف `.env` في المشروع وأضف أو استبدل:

```
DATABASE_URL="postgresql://postgres:ZXCVBNM123456789zxcvbnm@@12@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"
```

### 6. إنشاء الجداول

```bash
npm run db:push
```

## ملاحظات مهمة

1. **JWT Token (anon key)** الذي أعطيته هو للـ API access وليس للـ Database connection
2. **Prisma يحتاج إلى PostgreSQL connection string** وليس API key
3. **احفظ كلمة المرور في مكان آمن** - ستحتاجها دائماً
4. **استخدم Connection Pooling للإنتاج** - أفضل للأداء

## استكشاف الأخطاء

### خطأ: "Can't reach database server"
- تحقق من أن Connection String صحيح
- تحقق من أن كلمة المرور صحيحة
- تأكد من أن المشروع موجود في Supabase

### خطأ: "password authentication failed"
- كلمة المرور غير صحيحة
- قم بإعادة تعيين كلمة المرور من Supabase Dashboard

### خطأ: "Tenant or user not found"
- استخدم Direct Connection بدلاً من Connection Pooling
- أو تحقق من أن Project ID صحيح

## نصيحة

**الأفضل:** انسخ Connection String مباشرة من Supabase Dashboard بدلاً من إنشائه يدوياً - هذا يضمن أن كل شيء صحيح.

