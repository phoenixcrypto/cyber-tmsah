# 🔍 دليل حل مشكلة عدم وصول الإيميل

## 📋 **التحقق من المشكلة (خطوة بخطوة):**

### **1. التحقق من Gmail Credentials في Vercel** ⚠️ **مهم جداً**

1. **اذهب إلى Vercel:**
   - https://vercel.com/dashboard
   - اختر مشروعك: `cyber-tmsah`
   - **Settings** → **Environment Variables**

2. **تحقق من المتغيرات التالية:**
   - ✅ `GMAIL_USER` - يجب أن يكون موجوداً
   - ✅ `GMAIL_APP_PASSWORD` - يجب أن يكون موجوداً

3. **إذا لم تكن موجودة:**
   - اذهب إلى: https://myaccount.google.com/apppasswords
   - أنشئ App Password جديد
   - أضفه في Vercel Environment Variables
   - **Redeploy** الموقع

---

### **2. التحقق من وجود المستخدم في قاعدة البيانات**

#### **الطريقة أ: من Supabase Dashboard**

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. **Table Editor** → **users**
4. ابحث عن الإيميل الخاص بك
5. تحقق من:
   - ✅ الإيميل موجود
   - ✅ `is_active` = `true`
   - ✅ `username` موجود

#### **الطريقة ب: من API (للمسؤول فقط)**

1. سجّل دخول كـ admin
2. افتح Console في المتصفح (F12)
3. نفّذ هذا الكود:
   ```javascript
   // احصل على access_token من cookies
   const cookies = document.cookie.split(';')
   const accessToken = cookies.find(c => c.trim().startsWith('access_token='))?.split('=')[1]
   
   // تحقق من الإيميل
   fetch('/api/auth/check-email', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`
     },
     body: JSON.stringify({ email: 'YOUR_EMAIL_HERE' })
   })
   .then(r => r.json())
   .then(data => console.log('Check Email Result:', data))
   ```
4. استبدل `YOUR_EMAIL_HERE` بإيميلك
5. تحقق من النتيجة:
   - `userExists`: يجب أن يكون `true`
   - `user.isActive`: يجب أن يكون `true`
   - `gmailConfigured`: يجب أن يكون `true`

---

### **3. التحقق من Logs في Vercel**

1. اذهب إلى Vercel Dashboard
2. **Deployments** → آخر deployment
3. **Functions** → `api/auth/forgot-username`
4. **View Logs**
5. ابحث عن:
   - `[Forgot Username] Request for email:`
   - `[Forgot Username] Gmail configured:`
   - `[Forgot Username] User found:`
   - `[Forgot Username] Email sent successfully:`

---

## 🔧 **الحلول الشائعة:**

### **المشكلة 1: Gmail credentials غير موجودة**

**الأعراض:**
- Logs تظهر: `Gmail configured: false`
- Logs تظهر: `Gmail credentials not configured`

**الحل:**
1. أضف `GMAIL_USER` و `GMAIL_APP_PASSWORD` في Vercel
2. Redeploy الموقع

---

### **المشكلة 2: المستخدم غير موجود**

**الأعراض:**
- Logs تظهر: `User found: false`
- API check-email يظهر: `userExists: false`

**الحل:**
1. تحقق من الإيميل في Supabase
2. تأكد من أن الإيميل مطابق تماماً (case-sensitive)
3. إذا لم يكن موجوداً، سجّل حساب جديد

---

### **المشكلة 3: المستخدم غير نشط**

**الأعراض:**
- Logs تظهر: `User not found or inactive`
- API check-email يظهر: `user.isActive: false`

**الحل:**
1. اذهب إلى Supabase
2. Table Editor → users
3. ابحث عن المستخدم
4. غيّر `is_active` إلى `true`

---

### **المشكلة 4: Gmail App Password غير صحيح**

**الأعراض:**
- Logs تظهر: `Email sending error:`
- Gmail يرفض الإرسال

**الحل:**
1. اذهب إلى: https://myaccount.google.com/apppasswords
2. احذف App Password القديم
3. أنشئ واحد جديد
4. حدّثه في Vercel
5. Redeploy

---

### **المشكلة 5: الإيميل في Spam**

**الأعراض:**
- Logs تظهر: `Email sent successfully`
- لكن الإيميل لا يصل

**الحل:**
1. تحقق من صندوق البريد المزعج (Spam)
2. تحقق من "All Mail" في Gmail
3. انتظر بضع دقائق (قد يتأخر)

---

## ✅ **قائمة التحقق السريعة:**

- [ ] GMAIL_USER موجود في Vercel Environment Variables
- [ ] GMAIL_APP_PASSWORD موجود في Vercel Environment Variables
- [ ] المستخدم موجود في قاعدة البيانات
- [ ] `is_active` = `true` للمستخدم
- [ ] الإيميل مطابق تماماً (case-sensitive)
- [ ] تم Redeploy بعد تحديث Environment Variables
- [ ] تحقق من صندوق البريد المزعج

---

## 🆘 **إذا لم تحل المشكلة:**

1. **تحقق من Logs في Vercel:**
   - Deployments → Functions → api/auth/forgot-username → View Logs
   - ابحث عن أخطاء أو تحذيرات

2. **جرّب API مباشرة:**
   - استخدم `/api/auth/check-email` (يحتاج admin)
   - تحقق من النتيجة

3. **تحقق من Gmail:**
   - تأكد من أن App Password صحيح
   - تأكد من أن 2-Step Verification مفعل

---

**ملاحظة**: Logs الآن تحتوي على معلومات مفصلة لمساعدتك في التشخيص.

