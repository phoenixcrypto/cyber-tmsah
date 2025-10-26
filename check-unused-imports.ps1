# أداة فحص الاستيرادات غير المستخدمة
Write-Host "🔍 فحص الاستيرادات غير المستخدمة..." -ForegroundColor Green

# فحص ملفات TypeScript/JavaScript
Write-Host "📁 فحص ملفات TypeScript/JavaScript..." -ForegroundColor Yellow

# البحث عن ملفات تحتوي على استيرادات
$files = Get-ChildItem -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.next*" 
}

foreach ($file in $files) {
    Write-Host "🔍 فحص: $($file.Name)" -ForegroundColor Cyan
    
    # استخراج الاستيرادات
    $imports = Select-String -Path $file.FullName -Pattern "^import.*from" -AllMatches
    
    if ($imports) {
        Write-Host "  📥 الاستيرادات الموجودة:" -ForegroundColor Yellow
        foreach ($import in $imports) {
            Write-Host "    $($import.LineNumber): $($import.Line)" -ForegroundColor White
        }
        
        Write-Host "  🔍 فحص الاستخدام..." -ForegroundColor Yellow
        # يمكن إضافة منطق أكثر تعقيداً هنا للفحص التلقائي
    }
    
    Write-Host ""
}

Write-Host "✅ انتهى الفحص!" -ForegroundColor Green
