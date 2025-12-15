# 🔗 روابط سريعة - Quick Links Guide

## 📍 روابط الموقع العام

### الصفحات الرئيسية:
```
🏠 الصفحة الرئيسية
   URL: /
   الملف: themes/default/pages/home.tsx

📚 المواد الدراسية
   URL: /materials
   الملف: themes/default/pages/materials/page.tsx

📖 تفاصيل مادة (مثال: مادة الأمن السيبراني)
   URL: /materials/cybersecurity-101
   الملف: themes/default/pages/materials/[id]/page.tsx

📅 الجدول الدراسي
   URL: /schedule
   الملف: themes/default/pages/schedule/page.tsx

💾 التنزيلات
   URL: /downloads
   الملف: themes/default/pages/downloads/page.tsx

📧 اتصل بنا
   URL: /contact
   الملف: themes/default/pages/contact/page.tsx

ℹ️ من نحن
   URL: /about
   الملف: themes/default/pages/about/page.tsx

🔒 الخصوصية
   URL: /privacy
   الملف: themes/default/pages/privacy/page.tsx

📜 الشروط
   URL: /terms
   الملف: themes/default/pages/terms/page.tsx
```

---

## 🎛️ روابط لوحة التحكم

### الصفحات الرئيسية:
```
📊 لوحة التحكم
   URL: /admin
   الملف: app/admin/page.tsx

🔐 تسجيل الدخول
   URL: /admin/login
   الملف: app/admin/login/page.tsx

👥 إدارة المستخدمين
   URL: /admin/users
   الملف: app/admin/users/page.tsx

📝 إدارة المحتوى
   URL: /admin/content
   الملف: app/admin/content/page.tsx
   
   ├── المواد الدراسية: /admin/content/materials
   ├── المقالات: /admin/content/articles
   ├── الصفحات: /admin/content/pages
   ├── من نحن: /admin/content/about
   ├── اتصل بنا: /admin/content/contact
   ├── الصفحات القانونية: /admin/content/legal
   └── الأخبار: /admin/content/news

📅 إدارة الجدول
   URL: /admin/schedule
   الملف: app/admin/schedule/page.tsx

💾 إدارة التنزيلات
   URL: /admin/downloads
   الملف: app/admin/downloads/page.tsx

🎨 إدارة الثيمات
   URL: /admin/themes
   الملف: app/admin/themes/page.tsx

🎨 التصميم
   URL: /admin/design
   الملف: app/admin/design/page.tsx
   
   ├── الألوان والثيم: /admin/design/theme
   ├── الخطوط: /admin/design/fonts
   ├── التخطيط: /admin/design/layout
   └── الصور والوسائط: /admin/design/media

⚙️ إعدادات الموقع
   URL: /admin/site
   الملف: app/admin/site/page.tsx
   
   ├── الإعدادات العامة: /admin/site/general
   ├── SEO: /admin/site/seo
   ├── العلامة التجارية: /admin/site/branding
   └── القوائم: /admin/site/menus

⚙️ الإعدادات
   URL: /admin/settings
   الملف: app/admin/settings/page.tsx
   
   ├── البريد الإلكتروني: /admin/settings/email
   ├── SEO: /admin/settings/seo
   ├── العلامة التجارية: /admin/settings/branding
   └── القوائم: /admin/settings/menus

📊 التحليلات
   URL: /admin/analytics
   الملف: app/admin/analytics/page.tsx

🔐 الأمان
   URL: /admin/security
   الملف: app/admin/security/page.tsx

👤 الملف الشخصي
   URL: /admin/profile
   الملف: app/admin/profile/page.tsx

📋 النشاطات
   URL: /admin/activity
   الملف: app/admin/activity/page.tsx

🔔 الإشعارات
   URL: /admin/notifications
   الملف: app/admin/notifications/page.tsx

❓ المساعدة
   URL: /admin/help
   الملف: app/admin/help/page.tsx

📧 البريد
   URL: /admin/email
   الملف: app/admin/email/page.tsx

💾 قاعدة البيانات
   URL: /admin/database
   الملف: app/admin/database/page.tsx
```

---

## 🔌 روابط API

### Authentication:
```javascript
POST   /api/auth/login          // تسجيل الدخول
POST   /api/auth/logout         // تسجيل الخروج
GET    /api/auth/me             // معلومات المستخدم
POST   /api/auth/password-reset // إعادة تعيين كلمة المرور
```

### Content:
```javascript
// المواد
GET    /api/materials           // الحصول على جميع المواد
POST   /api/materials           // إنشاء مادة جديدة
GET    /api/materials/[id]      // الحصول على مادة معينة
PUT    /api/materials/[id]      // تحديث مادة
DELETE /api/materials/[id]      // حذف مادة

// المقالات
GET    /api/articles           // الحصول على جميع المقالات
POST   /api/articles           // إنشاء مقال جديد
GET    /api/articles/[id]     // الحصول على مقال معين
PUT    /api/articles/[id]     // تحديث مقال
DELETE /api/articles/[id]     // حذف مقال

// الأخبار
GET    /api/news               // الحصول على جميع الأخبار
POST   /api/news               // إنشاء خبر جديد
GET    /api/news/[id]          // الحصول على خبر معين
PUT    /api/news/[id]          // تحديث خبر
DELETE /api/news/[id]          // حذف خبر

// التنزيلات
GET    /api/downloads           // الحصول على جميع التنزيلات
POST   /api/downloads          // إنشاء تنزيل جديد
GET    /api/downloads/[id]     // الحصول على تنزيل معين
PUT    /api/downloads/[id]     // تحديث تنزيل
DELETE /api/downloads/[id]     // حذف تنزيل

// الجدول
GET    /api/schedule           // الحصول على الجدول
POST   /api/schedule           // إنشاء عنصر جدول
GET    /api/schedule/[id]      // الحصول على عنصر معين
PUT    /api/schedule/[id]      // تحديث عنصر
DELETE /api/schedule/[id]      // حذف عنصر

// الصفحات
GET    /api/pages              // الحصول على جميع الصفحات
POST   /api/pages              // إنشاء صفحة جديدة
GET    /api/pages/[id]         // الحصول على صفحة معينة
PUT    /api/pages/[id]         // تحديث صفحة
DELETE /api/pages/[id]         // حذف صفحة
GET    /api/pages/about        // صفحة من نحن
PUT    /api/pages/about        // تحديث صفحة من نحن
GET    /api/pages/contact      // صفحة اتصل بنا
PUT    /api/pages/contact      // تحديث صفحة اتصل بنا
GET    /api/pages/legal        // الصفحات القانونية
PUT    /api/pages/legal        // تحديث الصفحات القانونية
```

### Admin:
```javascript
GET    /api/admin/stats        // إحصائيات لوحة التحكم
GET    /api/admin/users        // الحصول على جميع المستخدمين
POST   /api/admin/users        // إنشاء مستخدم جديد
GET    /api/admin/users/[id]   // الحصول على مستخدم معين
PUT    /api/admin/users/[id]   // تحديث مستخدم
DELETE /api/admin/users/[id]   // حذف مستخدم
PUT    /api/admin/profile      // تحديث الملف الشخصي
GET    /api/admin/activities   // سجل النشاطات
PUT    /api/admin/schedule/[id] // تحديث عنصر جدول
DELETE /api/admin/schedule/[id] // حذف عنصر جدول
```

### Other:
```javascript
POST   /api/contact            // إرسال رسالة تواصل
GET    /api/ai/suggestions     // اقتراحات AI
POST   /api/ai/suggestions     // إنشاء اقتراحات AI
POST   /api/analytics/track    // تتبع التحليلات
GET    /api/workflows          // الحصول على سير العمل
POST   /api/workflows          // إنشاء سير عمل
POST   /api/workflows/[id]/execute // تنفيذ سير عمل
GET    /api/themes             // الحصول على الثيمات
POST   /api/themes             // إنشاء ثيم جديد
GET    /api/themes/[name]      // الحصول على ثيم معين
PUT    /api/themes/[name]      // تحديث ثيم
DELETE /api/themes/[name]      // حذف ثيم
```

---

## 💡 أمثلة عملية

### مثال 1: الوصول إلى صفحة المواد
```javascript
// في المتصفح:
https://cyber-tmsah.site/materials

// في الكود:
import Link from 'next/link'
<Link href="/materials">المواد الدراسية</Link>
```

### مثال 2: جلب البيانات من API
```javascript
// جلب جميع المواد
const response = await fetch('/api/materials')
const data = await response.json()
console.log(data.data.materials)

// جلب مادة معينة
const materialId = 'cybersecurity-101'
const response = await fetch(`/api/materials/${materialId}`)
const material = await response.json()
```

### مثال 3: إنشاء مادة جديدة (من لوحة التحكم)
```javascript
// POST /api/materials
const newMaterial = {
  title: 'الأمن السيبراني',
  description: 'مقدمة في الأمن السيبراني',
  icon: 'Shield',
  color: 'blue'
}

const response = await fetch('/api/materials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(newMaterial)
})
```

### مثال 4: تسجيل الدخول
```javascript
// POST /api/auth/login
const credentials = {
  username: 'admin',
  password: 'password123'
}

const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
})

const { accessToken, refreshToken } = await response.json()
// حفظ التوكن في localStorage أو cookie
```

---

## 🗺️ خريطة الموقع الكاملة

```
الموقع العام (/)
├── / (الصفحة الرئيسية)
├── /materials (المواد الدراسية)
│   └── /materials/[id] (تفاصيل مادة)
├── /schedule (الجدول الدراسي)
├── /downloads (التنزيلات)
├── /contact (اتصل بنا)
├── /about (من نحن)
├── /privacy (الخصوصية)
└── /terms (الشروط)

لوحة التحكم (/admin)
├── /admin (لوحة التحكم)
├── /admin/login (تسجيل الدخول)
├── /admin/users (المستخدمين)
├── /admin/content (المحتوى)
│   ├── /admin/content/materials
│   ├── /admin/content/articles
│   ├── /admin/content/pages
│   ├── /admin/content/about
│   ├── /admin/content/contact
│   ├── /admin/content/legal
│   └── /admin/content/news
├── /admin/schedule (الجدول)
├── /admin/downloads (التنزيلات)
├── /admin/themes (الثيمات)
├── /admin/design (التصميم)
│   ├── /admin/design/theme
│   ├── /admin/design/fonts
│   ├── /admin/design/layout
│   └── /admin/design/media
├── /admin/site (إعدادات الموقع)
│   ├── /admin/site/general
│   ├── /admin/site/seo
│   ├── /admin/site/branding
│   └── /admin/site/menus
└── /admin/settings (الإعدادات)
    ├── /admin/settings/email
    ├── /admin/settings/seo
    ├── /admin/settings/branding
    └── /admin/settings/menus

API (/api)
├── /api/auth/* (المصادقة)
├── /api/articles/* (المقالات)
├── /api/materials/* (المواد)
├── /api/news/* (الأخبار)
├── /api/downloads/* (التنزيلات)
├── /api/schedule/* (الجدول)
├── /api/pages/* (الصفحات)
├── /api/admin/* (لوحة التحكم)
├── /api/themes/* (الثيمات)
└── /api/workflows/* (سير العمل)
```

---

## 📝 ملاحظات مهمة:

1. **جميع صفحات الموقع العام** تستخدم نظام الثيمات من `themes/default/pages/`
2. **جميع صفحات لوحة التحكم** تتطلب تسجيل دخول
3. **جميع APIs** تتطلب مصادقة (باستثناء بعض APIs العامة)
4. **المسارات الديناميكية** مثل `/materials/[id]` تستخدم `[id]` كمعامل

---

## 🚀 روابط التطوير المحلي:

- **الموقع:** `http://localhost:3000/`
- **لوحة التحكم:** `http://localhost:3000/admin`
- **API:** `http://localhost:3000/api/`

---

## 📚 ملفات إضافية للفهم:

- `PROJECT_STRUCTURE.md` - البنية الكاملة للمشروع
- `SITE_LOCATION.md` - مواقع الملفات
- `ROUTES_AND_LINKS.md` - دليل شامل للروابط

