# إصلاح DATABASE_URL في ملف .env

## المشكلة
`DATABASE_URL` في ملف `.env` يشير إلى `localhost:5432` بدلاً من Supabase.

## الحل

### الخطوة 1: الحصول على كلمة المرور من Supabase

1. اذهب إلى: https://app.supabase.com
2. اختر مشروعك (Project ID: `jcnznjdmhwhpauugpbge`)
3. اذهب إلى **Settings** → **Database**
4. اضغط **Reset Database Password** (إذا لم تكن لديك كلمة مرور)
5. **انسخ كلمة المرور واحفظها**

### الخطوة 2: تحديث ملف .env

افتح ملف `.env` في المشروع وحدّث `DATABASE_URL`:

**استبدل هذا:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/cyber_tmsah"
```

**بهذا (استبدل [YOUR-PASSWORD] بكلمة المرور من Supabase):**
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"
```

**أو للاستخدام مع Connection Pooling (موصى به):**
```
DATABASE_URL="postgresql://postgres.jcnznjdmhwhpauugpbge:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

### الخطوة 3: إنشاء الجداول

بعد تحديث `DATABASE_URL`، قم بإنشاء الجداول:

```bash
npm run db:push
```

### الخطوة 4: التحقق من الجداول

```bash
npm run db:check
```

## ملاحظات

- **لا ترفع ملف `.env` إلى GitHub** - إنه في `.gitignore`
- **احفظ كلمة المرور في مكان آمن**
- **استخدم Connection Pooling للإنتاج** (URL يحتوي على `pooler.supabase.com`)

## مثال كامل

إذا كانت كلمة المرور: `MyPassword123!`

```
DATABASE_URL="postgresql://postgres:MyPassword123!@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres"
```

