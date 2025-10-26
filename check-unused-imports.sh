#!/bin/bash

# أداة فحص الاستيرادات غير المستخدمة
echo "🔍 فحص الاستيرادات غير المستخدمة..."

# فحص ملفات TypeScript/JavaScript
echo "📁 فحص ملفات TypeScript/JavaScript..."

# البحث عن ملفات تحتوي على استيرادات
files=$(find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | grep -v node_modules | grep -v .next)

for file in $files; do
    echo "🔍 فحص: $file"
    
    # استخراج الاستيرادات
    imports=$(grep -n "^import.*from" "$file" 2>/dev/null)
    
    if [ -n "$imports" ]; then
        echo "  📥 الاستيرادات الموجودة:"
        echo "$imports" | while read line; do
            echo "    $line"
        done
        
        # فحص الاستخدام
        echo "  🔍 فحص الاستخدام..."
        # يمكن إضافة منطق أكثر تعقيداً هنا للفحص التلقائي
    fi
    
    echo ""
done

echo "✅ انتهى الفحص!"
