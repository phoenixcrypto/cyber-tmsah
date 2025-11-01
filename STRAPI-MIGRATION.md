# Strapi CMS Migration Guide

هذا الدليل يوضح كيفية ربط المشروع بـ Strapi CMS والانتقال من النظام الحالي.

## 📋 محتويات الدليل

- [نظرة عامة](#نظرة-عامة)
- [إعداد Strapi](#إعداد-strapi)
- [ربط المشروع بـ Strapi](#ربط-المشروع-بـ-strapi)
- [التشغيل مع الحل البديل](#التشغيل-مع-الحل-البديل)
- [الهجرة التدريجية](#الهجرة-التدريجية)

## 🎯 نظرة عامة

المشروع يدعم الآن نظامين لمصدر البيانات:

1. **النظام الحالي**: قاعدة البيانات المحلية (`lib/articleDatabase.ts`)
2. **Strapi CMS**: نظام إدارة محتوى احترافي (اختياري)

يمكن للمشروع أن يعمل مع كلا النظامين أو أي منهما.

## 🚀 إعداد Strapi

### 1. تثبيت Strapi

```bash
# إنشاء مشروع Strapi جديد
npx create-strapi-app cyber-tmsah-cms --quickstart

# أو استخدام إصدار Node.js
npx create-strapi-app cyber-tmsah-cms --quickstart --use-npm
```

### 2. إنشاء المجموعات (Collections)

في لوحة تحكم Strapi، أنشئ المجموعات التالية:

#### **Material (المادة)**

- `name` (Text) - اسم المادة
- `slug` (UID based on name) - المعرف الفريد
- `description` (Text) - الوصف
- `instructor` (Text) - اسم المحاضر
- `icon` (Text) - اسم الأيقونة

#### **Article (المحاضرة)**

- `title` (Text) - عنوان المحاضرة
- `slug` (UID based on title) - المعرف الفريد
- `description` (Long text) - الوصف
- `content` (Rich text) - المحتوى الكامل
- `excerpt` (Text) - ملخص المحاضرة
- `type` (Enumeration) - النوع: lecture, lab, assignment
- `status` (Enumeration) - الحالة: published, draft, archived, scheduled
- `duration` (Text) - المدة
- `views` (Number) - عدد المشاهدات
- `likes` (Number) - عدد الإعجابات
- `featured` (Boolean) - محاضرة مميزة
- `tags` (JSON) - العلامات
- `instructor` (Text) - اسم المحاضر
- `scheduledFor` (Date) - تاريخ جدولة (اختياري)
- `imageUrl` (Text) - رابط الصورة (اختياري)
- `subject` (Relation - Many-to-One) - ارتباط بالمادة

#### **Post (مقال المدونة)**

- `title` (Text) - عنوان المقال
- `slug` (UID based on title) - المعرف الفريد
- `content` (Rich text) - المحتوى الكامل
- `excerpt` (Text) - ملخص المقال
- `author` (Text) - اسم الكاتب
- `published` (Boolean) - منشور
- `tags` (JSON) - العلامات
- `imageUrl` (Text) - رابط الصورة (اختياري)

### 3. إعداد الصلاحيات

1. اذهب إلى **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. سمح بـ:
   - `Article`: **find** و **findOne**
   - `Material`: **find** و **findOne**
   - `Post`: **find** و **findOne**
3. احفظ التغييرات

### 4. الحصول على API Token (اختياري)

للوصول الآمن:

1. اذهب إلى **Settings** → **API Tokens**
2. اضغط **Create new API Token**
3. اختر **Read-only** للنشر
4. انسخ الرمز المميز

## 🔗 ربط المشروع بـ Strapi

### 1. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
STRAPI_API_TOKEN=your_api_token_here
```

### 2. تحديث إعدادات النشر

#### **للنشر على Vercel:**

1. اذهب إلى **Project Settings** → **Environment Variables**
2. أضف المتغيرات:
   - `NEXT_PUBLIC_STRAPI_URL`
   - `STRAPI_API_TOKEN`

#### **للنشر على Cloudflare Pages:**

1. اذهب إلى **Settings** → **Environment Variables**
2. أضف المتغيرات في **Production** و **Preview**

### 3. اختبار الاتصال

شغّل المشروع محلياً:

```bash
npm run dev
```

افتح المتصفح وانتقل إلى:
- `http://localhost:3000/materials` - لعرض المواد
- `http://localhost:3000/materials/applied-physics` - لعرض محاضرات مادة معينة

تحقق من Console للأخطاء أو رسائل نجاح الاتصال.

## 🔄 التشغيل مع الحل البديل

إذا كان Strapi غير متاح أو لم يتم إعداده بعد، سيعمل المشروع تلقائياً مع النظام الحالي:

1. **النظام الحالي**: يستخدم `lib/articleDatabase.ts`
2. **Strapi غير متاح**: يعود تلقائياً للنظام الحالي
3. **لا يحتاج لإعداد**: يعمل مباشرة

## 📝 الهجرة التدريجية

### المرحلة 1: التشغيل المتوازي

- ✅ النظام الحالي يستمر في العمل
- ✅ Strapi يعمل كـ "read-only" للقراءة فقط
- ✅ يمكن إضافة محتوى جديد في Strapi بدون تأثير على الموجود

### المرحلة 2: نقل البيانات

انسخ البيانات من النظام الحالي إلى Strapi:

```bash
# يمكنك استخدام Strapi API لإنشاء البيانات
# أو استخدام واجهة Strapi يدوياً
```

### المرحلة 3: التبديل الكامل

بعد نقل جميع البيانات:

1. تأكد من أن جميع البيانات موجودة في Strapi
2. اختبر جميع الصفحات والوظائف
3. احذف قاعدة البيانات المحلية (اختياري)
4. حدّث التوثيق

## 🛠️ وظائف API المتوفرة

### للمواد (Materials)

```typescript
import { getMaterials, getMaterialBySlug } from '@/lib/api'

// جلب جميع المواد
const materials = await getMaterials()

// جلب مادة بمعرف محدد
const material = await getMaterialBySlug('applied-physics')
```

### للمحاضرات (Articles)

```typescript
import { getArticles, getArticleBySlug, getArticleById } from '@/lib/api'

// جلب جميع المحاضرات
const articles = await getArticles()

// جلب محاضرات مادة معينة
const physicsArticles = await getArticles({ 
  subjectId: 'applied-physics',
  status: 'published',
  limit: 10 
})

// جلب محاضرة بمعرف محدد
const article = await getArticleBySlug('introduction-to-physics')
```

### للمقالات (Posts)

```typescript
import { getPosts, getPostBySlug } from '@/lib/api'

// جلب جميع المقالات المنشورة
const posts = await getPosts({ published: true, limit: 10 })

// جلب مقال بمعرف محدد
const post = await getPostBySlug('welcome-post')
```

## 🐛 استكشاف الأخطاء

### المشكلة: لا تظهر البيانات من Strapi

**الحلول:**

1. **تحقق من URL**: تأكد من صحة `NEXT_PUBLIC_STRAPI_URL`
2. **تحقق من الصلاحيات**: تأكد من تفعيل `find` للمجموعات
3. **تحقق من CORS**: تأكد من إضافة domain المشروع في إعدادات Strapi
4. **تحقق من Token**: إذا كنت تستخدم token، تأكد من صحته
5. **افحص Console**: ابحث عن رسائل الخطأ في المتصفح

### المشكلة: يظهر خطأ CORS

**الحل:**

في Strapi، اذهب إلى **Settings** → **Server** → **CORS**:

1. أضف domain المشروع (مثل: `https://cyber-tmsah.vercel.app`)
2. أضف `http://localhost:3000` للتطوير المحلي
3. احفظ التغييرات

### المشكلة: البيانات تظهر من النظام الحالي فقط

**التحقق:**

افتح Developer Tools → Network وابحث عن requests إلى Strapi.
- **إذا لا توجد requests**: يعني أن Strapi غير مفعّل
- **إذا كانت failed**: يعني أن هناك مشكلة في الاتصال

## 📚 موارد إضافية

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api/rest)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🤝 المساعدة

إذا واجهت مشكلة، افتح Issue على GitHub مع تفاصيل:
- رسالة الخطأ
- خطوات إعادة الإنتاج
- إصدارات Strapi و Next.js
- إعدادات البيئة

---

**تم إنشاء هذا الدليل بواسطة: ZEYAD MOHAMED**

**للمشروع: Cyber TMSAH Platform**

