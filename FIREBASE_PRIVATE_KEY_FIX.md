# إصلاح مشكلة FIREBASE_PRIVATE_KEY

## المشكلة
```
Error: error:1E08010C:DECODER routines::unsupported
```

هذا الخطأ يحدث عندما يكون `FIREBASE_PRIVATE_KEY` بتنسيق غير صحيح في Vercel.

## الحل

### الطريقة الصحيحة لإضافة المفتاح في Vercel:

1. **افتح Firebase Console** → Project Settings → Service Accounts
2. **انقر على "Generate new private key"** (إذا لم يكن لديك مفتاح)
3. **انسخ المفتاح الخاص** من ملف JSON:
   ```json
   {
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   }
   ```
4. **في Vercel**:
   - افتح Environment Variables
   - ابحث عن `FIREBASE_PRIVATE_KEY`
   - **احذف القيمة الحالية**
   - **انسخ القيمة من `private_key` في JSON** (بما في ذلك `\n`)
   - **الصقها كما هي** - Vercel سيتعامل مع `\n` تلقائياً

### تنسيق صحيح:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcmwKR9K9hpgww\nncKpox1blGDh0ABXNiDR0R8lyZ2iNuUNq0qCQSVJ+B9DK63pCkT1w7Ey9Rwt/Rgr\nfUYWO1pyDLsCiIK8bD4TixygSxkIj4NmnXi/TVaJ07TUZtio0LhoNn8roYvgS8lJ\naY7HtejCycwKS2vw5f7kSrgrqKL5DJ4VQCES5LkrXl/gW77VKXc6MK7gRyhFJ36D\nU/ucSXMI38zCXxiuMsHc4jWdtC6T8z1SYke+bENEJKI3GDXn32ykMoBJmgSVxRjw\nY9UmP5+/lf7sms9R1DMgMcQz+qFZJGl8fsCYIBA2/C3xx4EUL4cKsJGjr9faQPmf\n7jqItkdLAgMBAAECggEAEAnwIXKl46JV7US7AxSplQ+FPJtI7aWlhtecEQqtEkf8\n/YFliCGT6Bd5XC/FB/D9Tw5Tv5xK3orlRs71tqEtijCzlnbUrOeJFAdTTzdhwPax\nxniqPS12h3cfNgGyftehi0rJi3ZoFPiuDM66yMlgpVJ1izhePbXQfSEJ667Bwi/X\ngaOzUKz6b8zhe3tKfRMJdEsA8JIloG/VrwGD7StbDrFDlFmhu2pf4buSj2YktLLe\nqExwkU+HkvDWEr4M974xAwrm+5/MfeTYFDD255qieqMP+jrimK+62LrPSV37qDQA\n8egVZpBehI+iCkrVmboW1M06qLgr5KJkr2H+IVz8gQKBgQDXWOaTSs5CWfakv4vq\n8NIFl1lShRdkG1mAwx05FgLzEPMb124E6r8isvPuhUUIncf2Ju4A/nUKuAC/xxxZ\nfBa7+O8slWKoKWjqXc5b0sQE9YCS2b9JqPvM2vNpcquQ37cF58lLC1G3WvVlRDdL\nMw9mxzw/XAoO48KC3j+alO714wKBgQC6K0sGI5018v64ECcrwQqbxNhhtk0ghIYN\nqVwtrHGDjUVlVnO+cOlGNzl62neJBNTMsZdVLTJhpSUQ/C8iEt89lvm27QQYd+dl\ndKROlj8cRDo+GmBfYfexUFFFisurPfDaqM7PnRAPcP+DpXGzuNxd8Ops52zbFkrY\n8GqtP/DleQKBgCwfdv7u8Nv/et2+sXht51pl7FNQGb7VK72KPM6Zh/ktm+I0fcJc\nJtWBPSG+BKsDSRlSWKmzeV+828pvjYt4NWBGXRsRcKlr8qcymTmPMcKiWrm8C8mX\n6h/LLNyKNkT00ZdQKppJs3CSHn2lQH8T8y/n2pxQy27Jk+0khHuz0FJpAoGAZRi/\nfAz5AWP8qO20p9EDtsU1kBJUXdU5is+ui+r6FaswxTAmWIOuWgABSdK7WP/zo1jJ\nSmrp0hbBQzD/U2yWKDcFUi3xrGvoj7LAyyBSE0KFslXWgdWMkZCBIdeWdF6FnehP\nrnSnVQtS5iWA0k0P9j+uvgcKmQrJCHe+Jmjzo1kCgYEAov83CSNy1RWnX1fcQ9N8\nCRpHjIQW/g0QFH4cIfvwJvA4zxfJHxbvDMnfoArsrLJEwHkfneRq80kBgjrUYx1N\nFeYBYEkeXRwme8DYiRmLbqrpbYIVA1CE4/ruj3c+5Ak7zb2VpuTgz9TmL/WqNF5r\n7fcRFS/wXtd0v18S3QRJEuE=\n-----END PRIVATE KEY-----\n
```

### ملاحظات مهمة:
- ✅ **يجب أن يبدأ بـ** `-----BEGIN PRIVATE KEY-----`
- ✅ **يجب أن ينتهي بـ** `-----END PRIVATE KEY-----`
- ✅ **يجب أن يحتوي على** `\n` بين الأسطر (ليس أسطر جديدة فعلية)
- ❌ **لا تستخدم** أسطر جديدة فعلية في Vercel
- ❌ **لا تحذف** `\n` من المفتاح

### بعد التعديل:
1. احفظ التغييرات في Vercel
2. انتظر حتى يكتمل إعادة النشر
3. جرب تسجيل الدخول مرة أخرى

