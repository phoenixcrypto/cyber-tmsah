# 🔗 روابط ومسارات المشروع - Routes & Links

## 🌐 روابط الموقع العام (Public Website Routes)

### الصفحات الرئيسية:

| الرابط | المسار الكامل | الملف | الوصف |
|--------|---------------|-------|-------|
| `/` | الصفحة الرئيسية | `themes/default/pages/home.tsx` | الصفحة الرئيسية للموقع |
| `/materials` | المواد الدراسية | `themes/default/pages/materials/page.tsx` | قائمة جميع المواد الدراسية |
| `/materials/[id]` | تفاصيل المادة | `themes/default/pages/materials/[id]/page.tsx` | صفحة تفاصيل مادة معينة |
| `/schedule` | الجدول الدراسي | `themes/default/pages/schedule/page.tsx` | جدول المحاضرات |
| `/downloads` | التنزيلات | `themes/default/pages/downloads/page.tsx` | قائمة البرامج والأدوات |
| `/contact` | اتصل بنا | `themes/default/pages/contact/page.tsx` | صفحة التواصل |
| `/about` | من نحن | `themes/default/pages/about/page.tsx` | معلومات عن المنصة |
| `/privacy` | سياسة الخصوصية | `themes/default/pages/privacy/page.tsx` | سياسة الخصوصية |
| `/terms` | الشروط والأحكام | `themes/default/pages/terms/page.tsx` | الشروط والأحكام |

### كيف تعمل:
```
المستخدم يزور: https://your-domain.com/materials
  ↓
app/[[...theme]]/page.tsx يستقبل الطلب
  ↓
يحدد الثيم النشط (default)
  ↓
يحمل: themes/default/pages/materials/page.tsx
  ↓
يعرضها مع: themes/default/layouts/MainLayout.tsx
```

---

## 🎛️ روابط لوحة التحكم (Admin Panel Routes)

### الصفحات الرئيسية:

| الرابط | المسار الكامل | الملف | الوصف |
|--------|---------------|-------|-------|
| `/admin` | لوحة التحكم | `app/admin/page.tsx` | Dashboard الرئيسي |
| `/admin/login` | تسجيل الدخول | `app/admin/login/page.tsx` | صفحة تسجيل الدخول |
| `/admin/users` | إدارة المستخدمين | `app/admin/users/page.tsx` | إدارة جميع المستخدمين |
| `/admin/content` | إدارة المحتوى | `app/admin/content/page.tsx` | نظرة عامة على المحتوى |
| `/admin/content/articles` | إدارة المقالات | `app/admin/content/articles/page.tsx` | إدارة المقالات |
| `/admin/content/materials` | إدارة المواد | `app/admin/content/materials/page.tsx` | إدارة المواد الدراسية |
| `/admin/content/news` | إدارة الأخبار | `app/admin/content/news/page.tsx` | إدارة الأخبار |
| `/admin/content/pages` | إدارة الصفحات | `app/admin/content/pages/page.tsx` | إدارة الصفحات الثابتة |
| `/admin/content/about` | صفحة من نحن | `app/admin/content/about/page.tsx` | تحرير صفحة من نحن |
| `/admin/content/contact` | صفحة اتصل بنا | `app/admin/content/contact/page.tsx` | تحرير صفحة اتصل بنا |
| `/admin/schedule` | إدارة الجدول | `app/admin/schedule/page.tsx` | إدارة الجدول الدراسي |
| `/admin/downloads` | إدارة التنزيلات | `app/admin/downloads/page.tsx` | إدارة البرامج والأدوات |
| `/admin/themes` | إدارة الثيمات | `app/admin/themes/page.tsx` | إدارة قوالب الموقع |
| `/admin/design` | التصميم | `app/admin/design/page.tsx` | إعدادات التصميم |
| `/admin/design/theme` | الألوان والثيم | `app/admin/design/theme/page.tsx` | إعدادات الألوان |
| `/admin/design/fonts` | الخطوط | `app/admin/design/fonts/page.tsx` | إدارة الخطوط |
| `/admin/design/layout` | التخطيط | `app/admin/design/layout/page.tsx` | إعدادات التخطيط |
| `/admin/design/media` | الصور والوسائط | `app/admin/design/media/page.tsx` | إدارة الوسائط |
| `/admin/site` | إعدادات الموقع | `app/admin/site/page.tsx` | إعدادات عامة |
| `/admin/site/general` | الإعدادات العامة | `app/admin/site/general/page.tsx` | إعدادات الموقع العامة |
| `/admin/site/seo` | SEO | `app/admin/site/seo/page.tsx` | إعدادات SEO |
| `/admin/site/branding` | العلامة التجارية | `app/admin/site/branding/page.tsx` | إعدادات العلامة التجارية |
| `/admin/site/menus` | القوائم | `app/admin/site/menus/page.tsx` | إدارة القوائم |
| `/admin/settings` | الإعدادات | `app/admin/settings/page.tsx` | إعدادات النظام |
| `/admin/settings/email` | إعدادات البريد | `app/admin/settings/email/page.tsx` | إعدادات البريد الإلكتروني |
| `/admin/settings/seo` | SEO | `app/admin/settings/seo/page.tsx` | إعدادات SEO |
| `/admin/settings/branding` | العلامة التجارية | `app/admin/settings/branding/page.tsx` | إعدادات العلامة التجارية |
| `/admin/settings/menus` | القوائم | `app/admin/settings/menus/page.tsx` | إدارة القوائم |
| `/admin/analytics` | التحليلات | `app/admin/analytics/page.tsx` | إحصائيات وتحليلات |
| `/admin/security` | الأمان | `app/admin/security/page.tsx` | إعدادات الأمان |
| `/admin/profile` | الملف الشخصي | `app/admin/profile/page.tsx` | ملف المستخدم الشخصي |
| `/admin/activity` | النشاطات | `app/admin/activity/page.tsx` | سجل النشاطات |
| `/admin/notifications` | الإشعارات | `app/admin/notifications/page.tsx` | الإشعارات |
| `/admin/help` | المساعدة | `app/admin/help/page.tsx` | دليل المساعدة |
| `/admin/email` | البريد | `app/admin/email/page.tsx` | إدارة البريد الإلكتروني |
| `/admin/database` | قاعدة البيانات | `app/admin/database/page.tsx` | إدارة قاعدة البيانات |

---

## 🔌 روابط API (API Routes)

### Authentication APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/auth/login` | POST | `app/api/auth/login/route.ts` | تسجيل الدخول |
| `/api/auth/logout` | POST | `app/api/auth/logout/route.ts` | تسجيل الخروج |
| `/api/auth/me` | GET | `app/api/auth/me/route.ts` | معلومات المستخدم الحالي |
| `/api/auth/password-reset` | POST | `app/api/auth/password-reset/route.ts` | إعادة تعيين كلمة المرور |

### Content APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/articles` | GET, POST | `app/api/articles/route.ts` | الحصول على/إنشاء مقالات |
| `/api/articles/[id]` | GET, PUT, DELETE | `app/api/articles/[id]/route.ts` | إدارة مقال معين |
| `/api/materials` | GET, POST | `app/api/materials/route.ts` | الحصول على/إنشاء مواد |
| `/api/materials/[id]` | GET, PUT, DELETE | `app/api/materials/[id]/route.ts` | إدارة مادة معينة |
| `/api/news` | GET, POST | `app/api/news/route.ts` | الحصول على/إنشاء أخبار |
| `/api/news/[id]` | GET, PUT, DELETE | `app/api/news/[id]/route.ts` | إدارة خبر معين |
| `/api/downloads` | GET, POST | `app/api/downloads/route.ts` | الحصول على/إنشاء تنزيلات |
| `/api/downloads/[id]` | GET, PUT, DELETE | `app/api/downloads/[id]/route.ts` | إدارة تنزيل معين |
| `/api/schedule` | GET, POST | `app/api/schedule/route.ts` | الحصول على/إنشاء جدول |
| `/api/schedule/[id]` | GET, PUT, DELETE | `app/api/schedule/[id]/route.ts` | إدارة عنصر جدول |

### Pages APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/pages` | GET, POST | `app/api/pages/route.ts` | الحصول على/إنشاء صفحات |
| `/api/pages/[id]` | GET, PUT, DELETE | `app/api/pages/[id]/route.ts` | إدارة صفحة معينة |
| `/api/pages/about` | GET, PUT | `app/api/pages/about/route.ts` | صفحة من نحن |
| `/api/pages/contact` | GET, PUT | `app/api/pages/contact/route.ts` | صفحة اتصل بنا |
| `/api/pages/legal` | GET, PUT | `app/api/pages/legal/route.ts` | الصفحات القانونية |

### Admin APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/admin/stats` | GET | `app/api/admin/stats/route.ts` | إحصائيات لوحة التحكم |
| `/api/admin/users` | GET, POST | `app/api/admin/users/route.ts` | إدارة المستخدمين |
| `/api/admin/users/[id]` | GET, PUT, DELETE | `app/api/admin/users/[id]/route.ts` | إدارة مستخدم معين |
| `/api/admin/profile` | PUT | `app/api/admin/profile/route.ts` | تحديث الملف الشخصي |
| `/api/admin/schedule/[id]` | PUT, DELETE | `app/api/admin/schedule/[id]/route.ts` | إدارة عنصر جدول |
| `/api/admin/activities` | GET | `app/api/admin/activities/route.ts` | سجل النشاطات |

### Theme APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/themes` | GET, POST | `app/api/themes/route.ts` | الحصول على/إنشاء ثيمات |
| `/api/themes/[name]` | GET, PUT, DELETE | `app/api/themes/[name]/route.ts` | إدارة ثيم معين |

### Other APIs:

| الرابط | Method | الملف | الوصف |
|--------|--------|-------|-------|
| `/api/contact` | POST | `app/api/contact/route.ts` | إرسال رسالة تواصل |
| `/api/ai/suggestions` | GET, POST | `app/api/ai/suggestions/route.ts` | اقتراحات AI |
| `/api/analytics/track` | POST | `app/api/analytics/track/route.ts` | تتبع التحليلات |
| `/api/workflows` | GET, POST | `app/api/workflows/route.ts` | إدارة سير العمل |
| `/api/workflows/[id]/execute` | POST | `app/api/workflows/[id]/execute/route.ts` | تنفيذ سير عمل |

---

## 📂 هيكل الملفات والمسارات

### الموقع العام:
```
themes/default/
├── pages/
│   ├── home.tsx                    → /
│   ├── materials/
│   │   ├── page.tsx                → /materials
│   │   └── [id]/page.tsx           → /materials/[id]
│   ├── schedule/page.tsx           → /schedule
│   ├── downloads/page.tsx          → /downloads
│   ├── contact/page.tsx            → /contact
│   ├── about/page.tsx              → /about
│   ├── privacy/page.tsx            → /privacy
│   └── terms/page.tsx              → /terms
├── components/
│   ├── Navbar.tsx                  → شريط التنقل
│   ├── Footer.tsx                  → التذييل
│   └── PageHeader.tsx              → رأس الصفحة
└── layouts/
    └── MainLayout.tsx             → Layout الرئيسي
```

### لوحة التحكم:
```
app/admin/
├── page.tsx                        → /admin
├── login/page.tsx                  → /admin/login
├── users/page.tsx                  → /admin/users
├── content/
│   ├── page.tsx                    → /admin/content
│   ├── articles/page.tsx           → /admin/content/articles
│   └── materials/page.tsx         → /admin/content/materials
└── themes/page.tsx                 → /admin/themes
```

### API:
```
app/api/
├── auth/
│   ├── login/route.ts              → POST /api/auth/login
│   └── me/route.ts                → GET /api/auth/me
├── articles/
│   ├── route.ts                    → GET, POST /api/articles
│   └── [id]/route.ts              → GET, PUT, DELETE /api/articles/[id]
└── admin/
    └── stats/route.ts             → GET /api/admin/stats
```

---

## 🔄 أمثلة على الاستخدام

### مثال 1: الوصول إلى صفحة المواد
```
URL: https://cyber-tmsah.site/materials
  ↓
app/[[...theme]]/page.tsx
  ↓
themes/default/pages/materials/page.tsx
  ↓
MainLayout (Navbar + Footer)
```

### مثال 2: API للحصول على المواد
```javascript
// Frontend
fetch('/api/materials')
  .then(res => res.json())
  .then(data => console.log(data))

// Backend
app/api/materials/route.ts
  ↓
lib/content/api.ts
  ↓
Firebase Firestore
```

### مثال 3: لوحة التحكم
```
URL: https://cyber-tmsah.site/admin/users
  ↓
app/admin/layout.tsx (التحقق من المصادقة)
  ↓
app/admin/users/page.tsx
  ↓
components/admin/UserTable.tsx
```

---

## 📝 ملاحظات مهمة:

1. **جميع صفحات الموقع العام** موجودة في `themes/default/pages/`
2. **جميع صفحات لوحة التحكم** موجودة في `app/admin/`
3. **جميع APIs** موجودة في `app/api/`
4. **التوجيه الديناميكي** يتم عبر `app/[[...theme]]/page.tsx`
5. **المصادقة** مطلوبة لجميع صفحات `/admin/*`

---

## 🚀 روابط سريعة للتطوير:

- **الموقع المحلي:** `http://localhost:3000/`
- **لوحة التحكم:** `http://localhost:3000/admin`
- **API:** `http://localhost:3000/api/`
- **API Docs:** (يمكن إضافتها لاحقاً)

