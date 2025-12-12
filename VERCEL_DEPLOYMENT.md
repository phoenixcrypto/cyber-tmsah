# تعليمات النشر على Vercel

## متغيرات البيئة المطلوبة

يجب إضافة المتغيرات التالية في Vercel Dashboard → Settings → Environment Variables:

### متغيرات مطلوبة (Required)

```env
DATABASE_URL=mysql://user:password@host:port/database?sslaccept=strict
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
CSRF_SECRET=your-csrf-secret-key-min-32-chars
RESEND_API_KEY=re_your_resend_api_key
```

### متغيرات اختيارية (Optional)

```env
ADMIN_PATH=admin
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NODE_ENV=production
```

## خطوات النشر

1. **ربط المشروع مع GitHub**
   - اذهب إلى Vercel Dashboard
   - اضغط "Add New Project"
   - اختر المستودع من GitHub

2. **إضافة متغيرات البيئة**
   - في صفحة إعدادات المشروع
   - اذهب إلى "Environment Variables"
   - أضف جميع المتغيرات المطلوبة أعلاه

3. **إعدادات Build**
   - Build Command: `npm run build` (يتم تلقائياً)
   - Output Directory: `.next` (يتم تلقائياً)
   - Install Command: `npm install` (يتم تلقائياً)

4. **إعدادات Database**
   - تأكد من أن `DATABASE_URL` يحتوي على `sslaccept=strict` للإنتاج
   - مثال: `mysql://user:pass@host:3306/db?sslaccept=strict`

5. **Deploy**
   - اضغط "Deploy"
   - انتظر اكتمال البناء

## ملاحظات مهمة

- ✅ تأكد من أن قاعدة البيانات متاحة من Vercel
- ✅ استخدم SSL في اتصال قاعدة البيانات
- ✅ لا ترفع ملفات `.env` على GitHub
- ✅ استخدم `prisma generate` قبل البناء (موجود في build script)
- ✅ تأكد من أن `package.json` يحتوي على `engines.node >= 18.0.0`

## حل المشاكل الشائعة

### خطأ: DATABASE_URL is not set
- تأكد من إضافة `DATABASE_URL` في Environment Variables

### خطأ: Prisma Client not generated
- تأكد من أن `build` script يحتوي على `prisma generate`

### خطأ: Connection timeout
- تأكد من أن قاعدة البيانات متاحة من Vercel
- تحقق من إعدادات Firewall

### خطأ: SSL connection required
- أضف `?sslaccept=strict` إلى `DATABASE_URL`

