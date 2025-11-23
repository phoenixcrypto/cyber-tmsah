# دليل حل المشاكل - Troubleshooting Guide

## مشاكل تسجيل الدخول

### خطأ: "حدث خطأ أثناء تسجيل الدخول"

هذا الخطأ يحدث عادة بسبب أحد الأسباب التالية:

#### 1. متغيرات البيئة غير موجودة

تأكد من وجود جميع المتغيرات التالية في `.env` أو في Vercel Environment Variables:

```env
# JWT Secrets (مطلوب)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Admin Credentials (مطلوب)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_ADMIN_NAME=Admin User

# Database (مطلوب)
DATABASE_URL=your-postgresql-connection-string

# Optional
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ADMIN_PATH=admin
NODE_ENV=production
```

#### 2. مشكلة في قاعدة البيانات

- تأكد من أن `DATABASE_URL` صحيح
- تأكد من أن قاعدة البيانات متصلة
- تأكد من أن الجداول موجودة (قم بتشغيل `npx prisma migrate deploy`)

#### 3. المستخدم غير موجود

إذا لم يكن هناك مستخدمين في قاعدة البيانات، سيتم إنشاء مستخدم افتراضي تلقائياً عند أول محاولة تسجيل دخول.

**ملاحظة:** تأكد من وجود `DEFAULT_ADMIN_USERNAME` و `DEFAULT_ADMIN_PASSWORD` في متغيرات البيئة.

#### 4. مشكلة في JWT Secrets

إذا كانت `JWT_SECRET` أو `JWT_REFRESH_SECRET` غير موجودة، سيظهر خطأ واضح.

**الحل:** قم بإنشاء secrets قوية:

```bash
# في Terminal
node -e "const crypto = require('crypto'); console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64')); console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(32).toString('base64'))"
```

#### 5. مشكلة في Cookies

في بيئة الإنتاج (Vercel)، يجب أن تكون `secure: true` للـ cookies. الكود يتعامل مع هذا تلقائياً.

### كيفية التحقق من المشكلة

1. **تحقق من Console Logs:**
   - في Vercel، اذهب إلى Logs
   - ابحث عن رسائل الخطأ التفصيلية

2. **تحقق من Environment Variables:**
   - في Vercel Dashboard → Settings → Environment Variables
   - تأكد من وجود جميع المتغيرات المطلوبة

3. **تحقق من قاعدة البيانات:**
   ```bash
   npx prisma studio
   ```
   - افتح Prisma Studio
   - تحقق من وجود المستخدمين في جدول `User`

### حلول سريعة

#### إعادة إنشاء المستخدم الافتراضي

إذا كان المستخدم الافتراضي غير موجود أو تالف:

1. احذف جميع المستخدمين من قاعدة البيانات
2. أعد تشغيل الموقع
3. سيتم إنشاء مستخدم افتراضي تلقائياً عند أول محاولة تسجيل دخول

#### إعادة تعيين كلمة المرور

إذا نسيت كلمة المرور:

1. استخدم API endpoint لإعادة تعيين كلمة المرور
2. أو قم بإنشاء مستخدم جديد من Prisma Studio

### طلب المساعدة

إذا استمرت المشكلة:

1. تحقق من Logs في Vercel
2. تحقق من Environment Variables
3. تحقق من اتصال قاعدة البيانات
4. شارك رسالة الخطأ الكاملة (من Console Logs)

