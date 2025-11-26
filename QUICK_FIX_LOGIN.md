# ⚡ إصلاح سريع لمشكلة تسجيل الدخول

## المشكلة الحالية
خطأ 500 عند محاولة تسجيل الدخول: "خطأ في الاتصال بقاعدة البيانات"

## الحل السريع (3 خطوات)

### 1️⃣ تأكد من DATABASE_URL على Vercel

اذهب إلى: **Vercel Dashboard** → **Project Settings** → **Environment Variables**

تأكد من أن `DATABASE_URL` يحتوي على `?sslmode=require` في النهاية:

```
postgresql://postgres:ZXCVBNM123456789zxcvbnm%40%4012@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres?sslmode=require
```

**ملاحظة:** `%40%40` = `@@` (URL encoded)

### 2️⃣ استخدم Username الصحيح

❌ **خطأ:** `Zeyad Eltmsah`
✅ **صحيح:** `zeyadeltmsah26`

### 3️⃣ أعد Deployment

بعد تعديل `DATABASE_URL`:
- **Deployments** → **⋮** → **Redeploy**

---

## ✅ البيانات الصحيحة لتسجيل الدخول

- **URL:** `https://www.cyber-tmsah.site/admin/login` أو `/eltmsah/login`
- **Username:** `zeyadeltmsah26`
- **Password:** `2610204ZEYAd@@`

---

## 🔍 إذا استمرت المشكلة

افتح **Vercel Logs**:
- **Deployments** → آخر deployment → **Functions** → `/api/auth/login`
- ابحث عن رسالة الخطأ الدقيقة

لكل التفاصيل: راجع `VERCEL_DATABASE_URL_FIX.md`

