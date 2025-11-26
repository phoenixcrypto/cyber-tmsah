# 🔧 إصلاح خطأ الاتصال بقاعدة البيانات على Vercel

## المشكلة
عند محاولة تسجيل الدخول، يظهر الخطأ: **"خطأ في الاتصال بقاعدة البيانات"**

## الحل

### الخطوة 1: التحقق من DATABASE_URL على Vercel

1. اذهب إلى: [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك: **cyber-tmsah**
3. اضغط على **Settings** → **Environment Variables**
4. ابحث عن `DATABASE_URL`

### الخطوة 2: تأكد من صيغة DATABASE_URL الصحيحة

يجب أن يحتوي `DATABASE_URL` على `?sslmode=require` في النهاية للاتصال بـ Supabase.

#### Option 1: Connection Pooling (موصى به)
```
postgresql://postgres.jcnznjdmhwhpauugpbge:ZXCVBNM123456789zxcvbnm%40%4012@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

#### Option 2: Direct Connection (إذا لم يعمل Option 1)
```
postgresql://postgres:ZXCVBNM123456789zxcvbnm%40%4012@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres?sslmode=require
```

**ملاحظات مهمة:**
- لاحظ أن `@@` تم تحويلها إلى `%40%40` (URL encoding)
- `?sslmode=require` **ضروري** في النهاية

### الخطوة 3: إذا كان DATABASE_URL موجوداً ولكن بصيغة خاطئة

1. اضغط على `DATABASE_URL` الموجود
2. احذفه (Delete)
3. أضف `DATABASE_URL` جديد بالصيغة الصحيحة أعلاه
4. تأكد من اختيار **All Environments** (Production, Preview, Development)
5. احفظ

### الخطوة 4: إعادة Deployment

بعد تعديل `DATABASE_URL`:

1. اذهب إلى **Deployments** tab
2. اضغط على **⋮** (ثلاث نقاط) بجانب آخر deployment
3. اختر **Redeploy**
4. انتظر حتى ينتهي Build

### الخطوة 5: التحقق من تسجيل الدخول

بعد إعادة الـ Deployment:

1. اذهب إلى: `https://www.cyber-tmsah.site/admin/login` أو `/eltmsah/login`
2. استخدم البيانات التالية:
   - **Username:** `zeyadeltmsah26`
   - **Password:** `2610204ZEYAd@@`

## ✅ التحقق من أن كل شيء يعمل

### 1. التحقق من Environment Variables على Vercel

تأكد من وجود جميع المتغيرات التالية:

- ✅ `DATABASE_URL` (مع `?sslmode=require`)
- ✅ `JWT_SECRET`
- ✅ `JWT_REFRESH_SECRET`
- ✅ `DEFAULT_ADMIN_USERNAME` = `zeyadeltmsah26`
- ✅ `DEFAULT_ADMIN_PASSWORD` = `2610204ZEYAd@@`
- ✅ `DEFAULT_ADMIN_NAME` = `Zeyad Eltmsah` (اختياري)
- ✅ `ADMIN_PATH` = `eltmsah` (إذا كنت تريد استخدام `/eltmsah`)

### 2. التحقق من Logs على Vercel

1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. اضغط على **Functions** tab
4. ابحث عن `/api/auth/login`
5. اضغط عليها لرؤية Logs

إذا رأيت أخطاء مثل:
- `P1001: Can't reach database server`
- `Connection refused`
- `ETIMEDOUT`

فهذا يعني أن `DATABASE_URL` غير صحيح أو مفقود.

## 🚨 مشاكل شائعة

### المشكلة 1: "Can't reach database server"
**الحل:** تأكد من إضافة `?sslmode=require` في نهاية `DATABASE_URL`

### المشكلة 2: "Tenant or user not found"
**الحل:** 
- استخدم **Direct Connection** (Option 2) بدلاً من Connection Pooling
- تأكد من Project ID صحيح: `jcnznjdmhwhpauugpbge`

### المشكلة 3: "Invalid password"
**الحل:**
- تأكد من URL encoding للأحرف الخاصة:
  - `@` → `%40`
  - `#` → `%23`
  - `&` → `%26`

### المشكلة 4: "Username or password incorrect"
**الحل:**
- تأكد من استخدام Username الصحيح: `zeyadeltmsah26` (وليس "Zeyad Eltmsah")
- تأكد من Password: `2610204ZEYAd@@`

## 📝 ملاحظات إضافية

1. **Prisma Client**: Vercel يقوم بـ `prisma generate` تلقائياً أثناء Build (مذكور في `package.json`)
2. **Database Schema**: الجداول موجودة بالفعل في Supabase (تم إنشاؤها عبر SQL Editor)
3. **Default Admin**: سيتم إنشاء المستخدم الافتراضي تلقائياً عند أول محاولة تسجيل دخول إذا لم يكن موجوداً

---

إذا استمرت المشكلة، تحقق من:
- ✅ Vercel Logs للخطأ الدقيق
- ✅ Supabase Dashboard → Database → Connection Pooling (للتأكد من أن الاتصال مسموح)
- ✅ Supabase Dashboard → Settings → Database → Connection String (للمقارنة)

