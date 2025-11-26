# 🔍 كيفية التحقق من Logs على Vercel

## الخطوة 1: افتح Vercel Dashboard

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك: **cyber-tmsah**

## الخطوة 2: افتح آخر Deployment

1. اضغط على **Deployments** tab
2. اضغط على آخر deployment (الأول في القائمة)

## الخطوة 3: افتح Function Logs

1. في صفحة Deployment، اضغط على **Functions** tab
2. ابحث عن `/api/auth/login`
3. اضغط عليها لرؤية Logs

## الخطوة 4: ابحث عن الخطأ

ابحث عن رسائل خطأ مثل:
- `P1001: Can't reach database server`
- `Connection refused`
- `ETIMEDOUT`
- `DATABASE_URL is not set`
- أي خطأ يتعلق بـ Prisma أو Database

## الخطوة 5: تحقق من Environment Variables

1. من نفس صفحة المشروع، اضغط على **Settings** → **Environment Variables**
2. تأكد من أن `DATABASE_URL` يحتوي على `?sslmode=require` في النهاية

## 📋 مثال على ما يجب أن تراه:

✅ **صحيح:**
```
postgresql://postgres:...@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres?sslmode=require
```

❌ **خاطئ:**
```
postgresql://postgres:...@db.jcnznjdmhwhpauugpbge.supabase.co:5432/postgres
```

---

## ⚠️ ملاحظات مهمة:

1. **بعد تعديل Environment Variable، يجب إعادة Deployment:**
   - Deployments → ⋮ → Redeploy

2. **انتظر حتى ينتهي Build:**
   - عادة يستغرق 1-2 دقيقة
   - تأكد من أن Status = "Ready"

3. **إذا لم يتم إعادة Deployment تلقائياً:**
   - يجب عمل Redeploy يدوياً

---

## 🚨 إذا كان DATABASE_URL صحيحاً لكن الخطأ مستمر:

قد يكون السبب:
1. **Connection Pooling vs Direct Connection:**
   - جرب استخدام Direct Connection بدلاً من Pooling
   - أو العكس

2. **Region مختلف:**
   - تأكد من أن المنطقة (eu-central-1) صحيحة
   - قد تكون منطقتك مختلفة

3. **Firewall/Security على Supabase:**
   - تأكد من أن IP Whitelist على Supabase يسمح بالاتصالات من Vercel

---

**انسخ Logs من Vercel وأرسلها لي لأتمكن من مساعدتك بشكل أفضل!**

