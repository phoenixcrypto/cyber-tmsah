# دليل إضافة المقالات إلى شريط الأخبار

## كيفية إضافة مقالات جديدة

عند إضافة مقال جديد إلى الموقع، استخدم الدالة `addArticle()` من ملف `lib/articles.ts`:

```typescript
import { addArticle } from '@/lib/articles'

// مثال على إضافة مقال
addArticle({
  id: 'article-unique-id', // معرف فريد للمقال
  title: 'عنوان المقال', // عنوان المقال
  subjectId: 'mathematics', // معرف المادة (applied-physics, mathematics, etc.)
  subjectTitle: 'الرياضيات', // اسم المادة (سيتم تحديثه تلقائياً حسب اللغة)
  publishedAt: new Date().toISOString(), // تاريخ النشر
  status: 'published', // 'published' أو 'draft'
  excerpt: 'ملخص المقال (اختياري)' // ملخص المقال
})
```

## معرفات المواد المتاحة

- `applied-physics` - الفيزياء التطبيقية
- `mathematics` - الرياضيات
- `entrepreneurship` - ريادة الأعمال والتفكير الإبداعي
- `information-technology` - تكنولوجيا المعلومات
- `database-systems` - قواعد البيانات
- `english-language` - اللغة الإنجليزية
- `information-systems` - نظم المعلومات

## مثال كامل

```typescript
import { addArticle } from '@/lib/articles'

// إضافة مقال جديد
addArticle({
  id: 'math-basics-1',
  title: 'مقدمة في الجبر الخطي',
  subjectId: 'mathematics',
  subjectTitle: 'الرياضيات',
  publishedAt: '2024-01-15T10:00:00Z',
  status: 'published',
  excerpt: 'تعلم أساسيات الجبر الخطي والمصفوفات'
})
```

## ملاحظات مهمة

1. **المقالات المنشورة فقط** ستظهر في شريط الأخبار
2. **آخر 5 مقالات** فقط ستظهر في الشريط
3. المقالات مرتبة حسب تاريخ النشر (الأحدث أولاً)
4. الشريط يعرض المقالات تلقائياً مع حركة متحركة
5. عند التمرير فوق الشريط، يتوقف الحركة تلقائياً

## التكامل المستقبلي

في المستقبل، يمكن استبدال نظام المقالات الثابت هذا بـ:
- قاعدة بيانات (MongoDB, PostgreSQL, etc.)
- API endpoint
- CMS (Content Management System)
- نظام ملفات Markdown

