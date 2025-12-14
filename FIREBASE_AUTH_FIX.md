# إصلاح خطأ مصادقة Firebase (UNAUTHENTICATED)

## المشكلة
```
Error: 16 UNAUTHENTICATED: Request had invalid authentication credentials
```

هذا الخطأ يعني أن Firebase Admin SDK لا يمكنه المصادقة مع Firebase.

## الحل

### 1. التحقق من متغيرات البيئة في Vercel:

تأكد من وجود هذه المتغيرات في Vercel Environment Variables:

#### ✅ FIREBASE_PROJECT_ID
- يجب أن يكون مطابقاً لـ Project ID في Firebase Console
- مثال: `cyber-tmsah`

#### ✅ FIREBASE_CLIENT_EMAIL
- يجب أن يكون email Service Account من Firebase Console
- يجب أن يبدأ بـ `firebase-adminsdk-` وينتهي بـ `@[project-id].iam.gserviceaccount.com`
- مثال: `firebase-adminsdk-xxxxx@cyber-tmsah.iam.gserviceaccount.com`

#### ✅ FIREBASE_PRIVATE_KEY
- **هذا هو الأهم!** يجب نسخه بشكل صحيح
- يجب أن يبدأ بـ `-----BEGIN PRIVATE KEY-----` وينتهي بـ `-----END PRIVATE KEY-----`
- **في Vercel، يجب استخدام `\n` للأسطر الجديدة (ليس أسطر جديدة فعلية)**

### 2. كيفية الحصول على المفتاح الصحيح:

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Project Settings** → **Service Accounts**
4. انقر على **Generate new private key**
5. سيتم تحميل ملف JSON

### 3. نسخ المفتاح إلى Vercel:

من ملف JSON، انسخ قيمة `private_key` **كما هي** (بما في ذلك `\n`):

```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcmwKR9K9hpgww\\nncKpox1blGDh0ABXNiDR0R8lyZ2iNuUNq0qCQSVJ+B9DK63pCkT1w7Ey9Rwt/Rgr\\n...\\n-----END PRIVATE KEY-----\\n"
}
```

**مهم جداً:**
- ✅ استخدم `\\n` (backslash + n) وليس أسطر جديدة فعلية
- ✅ انسخ المفتاح الكامل من `-----BEGIN PRIVATE KEY-----` إلى `-----END PRIVATE KEY-----`
- ✅ تأكد من عدم وجود مسافات إضافية في البداية أو النهاية

### 4. التحقق من القيم:

في Vercel، تأكد من:
- `FIREBASE_PROJECT_ID` = نفس Project ID في Firebase Console
- `FIREBASE_CLIENT_EMAIL` = نفس `client_email` من ملف JSON
- `FIREBASE_PRIVATE_KEY` = نفس `private_key` من ملف JSON (مع `\n`)

### 5. بعد التعديل:

1. احفظ التغييرات في Vercel
2. انتظر حتى يكتمل إعادة النشر
3. جرّب تسجيل الدخول مرة أخرى

## ملاحظات مهمة:

- إذا كان المفتاح يحتوي على أسطر جديدة فعلية، Vercel قد يحذفها
- استخدم دائماً `\n` (backslash + n) في Vercel
- تأكد من نسخ المفتاح الكامل بدون قطع

