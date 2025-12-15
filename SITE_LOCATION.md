# 🎯 موقع الموقع والمنصة

## ✅ الموقع الحقيقي (Active Website)

**الموقع موجود في:** `themes/default/pages/`

### الصفحات المتاحة:

| الصفحة | المسار | الملف |
|--------|-------|-------|
| 🏠 الصفحة الرئيسية | `/` | `themes/default/pages/home.tsx` |
| 📚 المواد الدراسية | `/materials` | `themes/default/pages/materials/page.tsx` |
| 📖 تفاصيل المادة | `/materials/[id]` | `themes/default/pages/materials/[id]/page.tsx` |
| 📅 الجدول الدراسي | `/schedule` | `themes/default/pages/schedule/page.tsx` |
| 💾 التنزيلات | `/downloads` | `themes/default/pages/downloads/page.tsx` |
| 📧 اتصل بنا | `/contact` | `themes/default/pages/contact/page.tsx` |
| ℹ️ من نحن | `/about` | `themes/default/pages/about/page.tsx` |
| 🔒 الخصوصية | `/privacy` | `themes/default/pages/privacy/page.tsx` |
| 📜 الشروط | `/terms` | `themes/default/pages/terms/page.tsx` |

### المكونات (Components):
- **Navbar:** `themes/default/components/Navbar.tsx`
- **Footer:** `themes/default/components/Footer.tsx`
- **PageHeader:** `themes/default/components/PageHeader.tsx`

### Layout:
- **MainLayout:** `themes/default/layouts/MainLayout.tsx`

---

## 🎛️ المنصة الإدارية (Admin Panel)

**المنصة موجودة في:** `app/admin/`

### الصفحات المتاحة:

| الصفحة | المسار | الملف |
|--------|-------|-------|
| 📊 لوحة التحكم | `/admin` | `app/admin/page.tsx` |
| 👥 إدارة المستخدمين | `/admin/users` | `app/admin/users/page.tsx` |
| 📝 إدارة المحتوى | `/admin/content` | `app/admin/content/page.tsx` |
| 🎨 إدارة الثيمات | `/admin/themes` | `app/admin/themes/page.tsx` |
| ⚙️ الإعدادات | `/admin/settings` | `app/admin/settings/page.tsx` |
| 🔐 الأمان | `/admin/security` | `app/admin/security/page.tsx` |

---

## 🔄 كيف يعمل التوجيه (Routing)?

### للموقع العام:
```
المستخدم يزور URL (مثل: /materials)
  ↓
app/[[...theme]]/page.tsx يستقبل الطلب
  ↓
يحدد الثيم النشط (default)
  ↓
يحمل الصفحة من themes/default/pages/materials/page.tsx
  ↓
يعرضها مع MainLayout (Navbar + Footer)
```

### للمنصة الإدارية:
```
المستخدم يزور /admin
  ↓
app/admin/layout.tsx يتحقق من المصادقة
  ↓
يعرض app/admin/page.tsx (لوحة التحكم)
```

---

## 📝 ملاحظات مهمة:

1. ✅ **الصفحات القديمة تم حذفها** من `app/about/`, `app/contact/`, إلخ
2. ✅ **الموقع الحقيقي** موجود في `themes/default/pages/`
3. ✅ **لإضافة صفحة جديدة:** أضفها في `themes/default/pages/`
4. ✅ **لتغيير التصميم:** عدل في `themes/default/components/` و `themes/default/styles/`

---

## 🚀 الوصول السريع:

- **الموقع:** `https://your-domain.com/`
- **لوحة التحكم:** `https://your-domain.com/admin`
- **API:** `https://your-domain.com/api/`

