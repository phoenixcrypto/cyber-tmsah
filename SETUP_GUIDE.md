# دليل الإعداد - Cyber TMSAH

## 📋 **ما تم إضافته:**

### 1. ✅ **صفحة "اتصل بنا" - API Endpoint**
- تم إنشاء `/app/api/contact/route.ts`
- النموذج يعمل الآن ويرسل البيانات إلى API
- يمكنك إضافة خدمة إرسال بريد إلكتروني (Resend, SendGrid, Nodemailer)

### 2. ✅ **Sitemap.xml محدث**
- تم تحديث `public/sitemap.xml` بجميع الصفحات
- يحتوي على 17 صفحة مع أولويات وتواريخ محدثة
- جاهز لمحركات البحث

### 3. ✅ **Robots.txt محسّن**
- تم تحديث `public/robots.txt`
- إعدادات محسّنة لمحركات البحث
- إضافة Sitemap reference

### 4. ✅ **Google Analytics**
- تم إضافة `components/GoogleAnalytics.tsx`
- يحتاج إلى إضافة `NEXT_PUBLIC_GA_MEASUREMENT_ID` في `.env`

### 5. ✅ **Structured Data (JSON-LD)**
- تم إضافة `components/StructuredData.tsx`
- Schema.org markup لتحسين SEO
- Organization Schema و Website Schema

---

## 🚀 **خطوات الإعداد:**

### **1. إعداد Google Analytics:**

1. اذهب إلى [Google Analytics](https://analytics.google.com/)
2. أنشئ حساب جديد أو استخدم حساب موجود
3. أنشئ Property جديد للموقع
4. احصل على Measurement ID (يبدأ بـ `G-`)
5. أنشئ ملف `.env.local` في جذر المشروع:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
6. أعد تشغيل السيرفر

### **2. إعداد نموذج الاتصال (اختياري):**

#### **الخيار 1: استخدام Resend (موصى به)**
```bash
npm install resend
```

في `app/api/contact/route.ts`، قم بإلغاء التعليق عن الكود:
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
// ... كود الإرسال
```

أضف في `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

#### **الخيار 2: استخدام SendGrid**
```bash
npm install @sendgrid/mail
```

#### **الخيار 3: استخدام Nodemailer مع SMTP**
```bash
npm install nodemailer
```

#### **الخيار 4: استخدام Formspree (أسهل)**
- اذهب إلى [Formspree.io](https://formspree.io/)
- أنشئ حساب مجاني
- احصل على Form ID
- غيّر URL في `app/contact/page.tsx` إلى:
```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
})
```

---

## 📝 **ملفات مهمة:**

### `.env.local` (أنشئه بنفسك):
```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Service (اختر واحد)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# أو
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# أو
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### `public/sitemap.xml`:
- ✅ محدث بجميع الصفحات
- ✅ جاهز للفهرسة

### `public/robots.txt`:
- ✅ محسّن لمحركات البحث
- ✅ يحتوي على Sitemap reference

---

## ✅ **التحقق من الإعداد:**

1. **Google Analytics:**
   - افتح الموقع
   - افتح Developer Tools → Network
   - ابحث عن طلبات `gtag/js`
   - يجب أن ترى طلبات إلى Google Analytics

2. **Structured Data:**
   - افتح الموقع
   - View Page Source
   - ابحث عن `<script type="application/ld+json">`
   - يجب أن ترى JSON-LD schemas

3. **Contact Form:**
   - املأ النموذج
   - اضغط إرسال
   - تحقق من Console للأخطاء
   - يجب أن ترى رسالة نجاح

4. **Sitemap:**
   - افتح `https://cyber-tmsah.vercel.app/sitemap.xml`
   - يجب أن ترى جميع الصفحات

5. **Robots.txt:**
   - افتح `https://cyber-tmsah.vercel.app/robots.txt`
   - يجب أن ترى الإعدادات الصحيحة

---

## 🎯 **الخطوات التالية:**

1. ✅ أضف `NEXT_PUBLIC_GA_MEASUREMENT_ID` في Vercel Environment Variables
2. ✅ اختر خدمة إرسال بريد إلكتروني وأضف API Key
3. ✅ اختبر نموذج الاتصال
4. ✅ أرسل Sitemap إلى Google Search Console
5. ✅ تحقق من Structured Data في [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## 📚 **روابط مفيدة:**

- [Google Analytics Setup](https://support.google.com/analytics/answer/9304153)
- [Resend Documentation](https://resend.com/docs)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

**الموقع الآن جاهز 100% للنشر! 🎉**

