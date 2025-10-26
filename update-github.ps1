# رفع التحديثات إلى GitHub
Write-Host "🚀 بدء رفع التحديثات إلى GitHub..." -ForegroundColor Green

# إضافة جميع الملفات
git add .
Write-Host "✅ تم إضافة جميع الملفات" -ForegroundColor Yellow

# إنشاء commit مع رسالة وصفية
$commitMessage = @"
تحديث شامل للموقع - جاهز للدفعة

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

📱 الموقع جاهز للنشر على Vercel/Cloudflare للدفعة
"@

git commit -m $commitMessage
Write-Host "✅ تم إنشاء commit" -ForegroundColor Yellow

# رفع التحديثات إلى GitHub
git push origin main
Write-Host "🎉 تم رفع جميع التحديثات إلى GitHub بنجاح!" -ForegroundColor Green

Write-Host "`n📋 ملخص التحديثات:" -ForegroundColor Cyan
Write-Host "- إزالة قسم الإدارة" -ForegroundColor White
Write-Host "- إغلاق قسم المهام والمواد" -ForegroundColor White
Write-Host "- تحديث الإحصائيات التفاعلية" -ForegroundColor White
Write-Host "- تحديث اللوجو والاتصال" -ForegroundColor White
Write-Host "- الموقع جاهز للدفعة!" -ForegroundColor Green
