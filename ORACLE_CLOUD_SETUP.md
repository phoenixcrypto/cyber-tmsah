# 🏆 دليل إعداد Oracle Cloud MySQL - مجاني مدى الحياة!

## لماذا Oracle Cloud؟

✅ **مجاني تماماً مدى الحياة** (ليس 12 شهراً فقط!)  
✅ **50 GB storage** - سخي جداً  
✅ **50 GB backup storage**  
✅ **MySQL HeatWave** - أسرع MySQL  
✅ **لا حدود زمنية**  

---

## الخطوة 1: إنشاء حساب Oracle Cloud

### 1.1 التسجيل
1. اذهب إلى: https://www.oracle.com/cloud/free/
2. اضغط "Start for free"
3. املأ البيانات:
   - **Email**: بريدك الإلكتروني
   - **Password**: كلمة مرور قوية
   - **Cloud Account Name**: اختر اسماً فريداً (مثلاً: `cyber-tmsah`)
   - **Home Region**: اختر الأقرب لك (مثلاً: `EU-Frankfurt-1`)

### 1.2 التحقق من الهوية
- ستحتاج بطاقة ائتمان للتحقق (لن يتم خصم أي مبلغ في Free Tier)
- أو يمكنك استخدام خيارات أخرى للتحقق

### 1.3 تسجيل الدخول
- بعد التسجيل، سجّل الدخول من: https://cloud.oracle.com/

---

## الخطوة 2: إنشاء MySQL Database

### 2.1 فتح MySQL Service
1. من القائمة الرئيسية، ابحث عن **"MySQL"**
2. أو اذهب إلى: **"Database" → "MySQL"**
3. اضغط **"Create MySQL DB System"**

### 2.2 إعداد MySQL Database

#### Basic Information:
- **Name**: `cyber-tmsah-mysql` (أو أي اسم)
- **Description**: قاعدة بيانات Cyber TMSAH

#### Create Administrator Credentials:
- **Username**: `admin` (أو أي اسم)
- **Password**: كلمة مرور قوية جداً (احفظها!)
- **Confirm Password**: نفس كلمة المرور

#### Configure Networking:
- **VCN**: اختر "Create new VCN" أو استخدم موجود
- **Subnet**: اختر "Create new subnet"
- **Assign a public IP address**: ✅ **نعم** (مهم جداً!)

#### Configure Placement:
- **Availability Domain**: اختر الأول (افتراضي)
- **Fault Domain**: اختر الأول

#### Configure Hardware:
- **Shape**: اختر **"MySQL.HeatWave.VM.Standard.E3"** (Free Tier)
- **Storage**: 
  - **Storage size**: `50` GB (المجاني)
  - **Storage auto-scaling**: يمكنك تفعيله (اختياري)

#### Configure Backup:
- ✅ **Enable automatic backups**
- **Backup retention**: `7` days (افتراضي)

#### Advanced Options:
- **MySQL version**: اختر الأحدث (8.0.x)
- **Character set**: `utf8mb4` (للنصوص العربية)

### 2.3 إنشاء Database
- اضغط **"Create MySQL DB System"**
- انتظر 10-15 دقيقة حتى التفعيل

---

## الخطوة 3: الحصول على Connection String

### 3.1 الوصول إلى MySQL Endpoint
1. بعد اكتمال الإنشاء، اضغط على MySQL DB System
2. اذهب إلى **"Endpoints"** في القائمة الجانبية
3. انسخ **"MySQL HeatWave Instance IP"** (Public IP)

### 3.2 إنشاء DATABASE_URL
```
mysql://admin:YOUR_PASSWORD@YOUR_PUBLIC_IP:3306/defaultdb?sslaccept=strict
```

**مثال:**
```
mysql://admin:MyStrongPassword123!@123.45.67.89:3306/defaultdb?sslaccept=strict
```

### 3.3 إنشاء Database مخصص (اختياري)
1. استخدم MySQL Workbench أو أي MySQL client
2. اتصل بـ MySQL باستخدام Public IP
3. أنشئ database جديدة:
```sql
CREATE DATABASE cyber_tmsah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
4. استخدم هذا الاسم في DATABASE_URL بدلاً من `defaultdb`

---

## الخطوة 4: فتح Port 3306 (مهم جداً!)

### 4.1 إعداد Security List
1. اذهب إلى **"Networking" → "Virtual Cloud Networks"**
2. اختر VCN الذي أنشأته
3. اضغط على **"Security Lists"**
4. اختر Security List الافتراضي
5. اضغط **"Add Ingress Rules"**

### 4.2 إضافة Rule
- **Source Type**: CIDR
- **Source CIDR**: `0.0.0.0/0` (للسماح من أي مكان)
- **IP Protocol**: TCP
- **Destination Port Range**: `3306`
- **Description**: Allow MySQL connections

### 4.3 حفظ
- اضغط **"Add Ingress Rules"**

---

## الخطوة 5: إضافة إلى Vercel

### 5.1 إعداد Environment Variables
1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. **Settings** → **Environment Variables**

### 5.2 إضافة المتغيرات:
```
DATABASE_URL = mysql://admin:YOUR_PASSWORD@YOUR_PUBLIC_IP:3306/defaultdb?sslaccept=strict

DEFAULT_ADMIN_USERNAME = zeyadeltmsah26
DEFAULT_ADMIN_PASSWORD = 2610204ZEYAd@@
JWT_SECRET = (نص عشوائي قوي، استخدم: openssl rand -base64 32)
JWT_REFRESH_SECRET = (نص عشوائي آخر)
```

### 5.3 إعادة النشر
- بعد إضافة المتغيرات، أعد نشر المشروع

---

## الخطوة 6: إنشاء الجداول

### 6.1 محلياً (للاختبار)
```bash
# إنشاء .env.local
DATABASE_URL="mysql://admin:password@IP:3306/database?sslaccept=strict"

# دفع Schema
npm run db:push

# أو Migration
npm run db:migrate
```

### 6.2 تلقائياً (على Vercel)
- بعد النشر، الكود سينشئ الجداول تلقائياً عند أول طلب

---

## 🔒 الأمان

### ✅ نصائح مهمة:
1. **استخدم SSL دائماً**: أضف `?sslaccept=strict` في DATABASE_URL
2. **كلمة مرور قوية**: استخدم كلمة مرور معقدة للـ admin
3. **لا تشارك DATABASE_URL**: احفظه في Environment Variables فقط
4. **Backup منتظم**: مفعّل تلقائياً (7 أيام retention)

---

## 🧪 اختبار الاتصال

### من Terminal:
```bash
mysql -h YOUR_PUBLIC_IP -u admin -p
```

### من Prisma Studio:
```bash
npm run db:studio
```

---

## 🆘 حل المشاكل

### مشكلة: "Can't connect to database"
**الحل:**
1. ✅ تحقق من Security List (Port 3306 مفتوح)
2. ✅ تحقق من Public IP صحيح
3. ✅ تحقق من Username و Password

### مشكلة: "SSL required"
**الحل:**
- أضف `?sslaccept=strict` في نهاية DATABASE_URL

### مشكلة: "Access denied"
**الحل:**
1. ✅ تحقق من Username و Password
2. ✅ تأكد من أنك تستخدم User الـ admin الصحيح

---

## 📊 الموارد المجانية

### ما تحصل عليه مجاناً:
- ✅ **50 GB Storage**
- ✅ **50 GB Backup Storage**
- ✅ **MySQL HeatWave Instance** (محدود الموارد لكن كافٍ للمشاريع الصغيرة)
- ✅ **Unlimited Database Instances** (في حدود الموارد)
- ✅ **SSL Connections**
- ✅ **Automatic Backups**

---

## 🎉 ممتاز!

الآن لديك قاعدة بيانات MySQL مجانية تماماً **مدى الحياة**! 🚀

---

## 📚 موارد إضافية

- Oracle Cloud Docs: https://docs.oracle.com/en-us/iaas/mysql-database/
- MySQL HeatWave: https://www.oracle.com/mysql/heatwave/
- Prisma MySQL Guide: https://www.prisma.io/docs/concepts/database-connectors/mysql

