# دفع التحديثات إلى GitHub
Write-Host "🚀 بدء دفع التحديثات إلى GitHub..." -ForegroundColor Green

# التحقق من حالة Git
Write-Host "📋 فحص حالة الملفات..." -ForegroundColor Yellow
git status

# إضافة جميع الملفات
Write-Host "`n📁 إضافة جميع الملفات..." -ForegroundColor Yellow
git add .

# إنشاء commit
Write-Host "`n💾 إنشاء commit..." -ForegroundColor Yellow
git commit -m "تحديث شامل للموقع - جاهز للدفعة

✅ التحديثات المنجزة:
- إزالة قسم الإدارة من الناف بار والصفحة الرئيسية
- إغلاق قسم المهام مع صفحة 'قريباً جداً'
- إغلاق قسم المواد مع صفحة 'قريباً جداً'
- تحديث صفحة حول بإحصائيات تفاعلية جديدة:
  * 700+ طالب نشط
  * 7 مواد تعليمية
  * نظام تقييم تفاعلي لمعدل الرضا
  * نظام حساب مدة التشغيل التلقائي
- تحديث اللوجو: إزالة حرف C وجعل اسم الموقع هو اللوجو
- تحديث صفحة اتصل بنا: إزالة النموذج وأوقات الاستجابة
- معلومات الاتصال 'قريباً' وساعات العمل 'طوال الأسبوع'

🎯 الميزات الجديدة:
- نظام إحصائيات تفاعلية محدثة تلقائياً
- صفحات 'قريباً' جذابة للميزات المستقبلية
- تصميم متجاوب محسن للهاتف
- نظام تقييم حي لمعدل الرضا

📱 الموقع جاهز للنشر على Vercel/Cloudflare للدفعة"

# دفع التحديثات
Write-Host "`n🚀 دفع التحديثات إلى GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n🎉 تم دفع جميع التحديثات إلى GitHub بنجاح!" -ForegroundColor Green
Write-Host "`n📋 ملخص التحديثات:" -ForegroundColor Cyan
Write-Host "- إزالة قسم الإدارة" -ForegroundColor White
Write-Host "- إغلاق قسم المهام والمواد" -ForegroundColor White
Write-Host "- تحديث الإحصائيات التفاعلية" -ForegroundColor White
Write-Host "- تحديث اللوجو والاتصال" -ForegroundColor White
Write-Host "- الموقع جاهز للدفعة!" -ForegroundColor Green

Write-Host "`n🌐 يمكنك الآن نشر الموقع على Vercel أو Cloudflare!" -ForegroundColor Magenta
