# Cyber TMSAH API Documentation

## Authentication

جميع طلبات API تحتاج إلى مصادقة عبر JWT Token في Cookie.

### الحصول على Token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-password"
}
```

---

## Articles API

### GET /api/admin/articles
جلب جميع المقالات

**Query Parameters:**
- `materialId` (optional): تصفية حسب Material ID

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "id": "article-123",
      "materialId": "material-456",
      "title": "عنوان المقال",
      "titleEn": "Article Title",
      "content": "<p>محتوى المقال</p>",
      "contentEn": "<p>Article Content</p>",
      "author": "Admin",
      "status": "published",
      "publishedAt": "2025-01-01T00:00:00.000Z",
      "views": 0
    }
  ]
}
```

### POST /api/admin/articles
إضافة مقال جديد

**Request Body:**
```json
{
  "materialId": "material-456",
  "title": "عنوان المقال",
  "titleEn": "Article Title",
  "content": "<p>محتوى المقال</p>",
  "contentEn": "<p>Article Content</p>",
  "author": "Admin",
  "status": "published",
  "excerpt": "ملخص المقال",
  "tags": ["tag1", "tag2"]
}
```

### PUT /api/admin/articles
تحديث مقال

**Request Body:**
```json
{
  "id": "article-123",
  "title": "عنوان جديد",
  "content": "<p>محتوى جديد</p>",
  "status": "published"
}
```

### DELETE /api/admin/articles?id={id}
حذف مقال

---

## Pages API

### GET /api/admin/pages
جلب جميع الصفحات

### POST /api/admin/pages
إضافة صفحة جديدة

**Request Body:**
```json
{
  "slug": "about",
  "title": "من نحن",
  "titleEn": "About Us",
  "content": "<p>محتوى الصفحة</p>",
  "contentEn": "<p>Page Content</p>",
  "metaDescription": "وصف الصفحة",
  "status": "published",
  "order": 1
}
```

### PUT /api/admin/pages
تحديث صفحة

### DELETE /api/admin/pages?id={id}
حذف صفحة

---

## Materials API

### GET /api/admin/materials
جلب جميع المواد

### POST /api/admin/materials
إضافة مادة جديدة

### PUT /api/admin/materials
تحديث مادة

### DELETE /api/admin/materials?id={id}
حذف مادة

---

## Schedule API

### GET /api/admin/schedule
جلب جميع عناصر الجدول

**Query Parameters:**
- `group` (optional): تصفية حسب المجموعة (Group 1/Group 2)

### POST /api/admin/schedule
إضافة عنصر جدول جديد

### PUT /api/admin/schedule
تحديث عنصر جدول

### DELETE /api/admin/schedule?id={id}
حذف عنصر جدول

---

## Downloads API

### GET /api/admin/downloads
جلب جميع البرامج

### POST /api/admin/downloads
إضافة برنامج جديد

### PUT /api/admin/downloads
تحديث برنامج

### DELETE /api/admin/downloads?id={id}
حذف برنامج

---

## Users API

### GET /api/admin/users
جلب جميع المستخدمين

### POST /api/admin/users
إضافة مستخدم جديد

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "name": "اسم المستخدم",
  "password": "password123",
  "role": "editor"
}
```

### PUT /api/admin/users
تحديث مستخدم

### DELETE /api/admin/users?id={id}
حذف مستخدم

---

## Examples

### Using cURL:
```bash
# Login
curl -X POST https://cyber-tmsah.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -c cookies.txt

# Add Article
curl -X POST https://cyber-tmsah.site/api/admin/articles \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "materialId": "material-123",
    "title": "عنوان المقال",
    "titleEn": "Article Title",
    "content": "<p>محتوى</p>",
    "contentEn": "<p>Content</p>",
    "author": "Admin"
  }'
```

### Using JavaScript:
```javascript
// Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' }),
  credentials: 'include'
})

// Add Article
const articleRes = await fetch('/api/admin/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    materialId: 'material-123',
    title: 'عنوان المقال',
    titleEn: 'Article Title',
    content: '<p>محتوى</p>',
    contentEn: '<p>Content</p>',
    author: 'Admin'
  })
})
```

---

## Error Responses

جميع الأخطاء تعيد JSON بهذا الشكل:

```json
{
  "error": "رسالة الخطأ"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

