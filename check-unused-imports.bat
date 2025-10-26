@echo off
chcp 65001 >nul
echo 🔍 فحص الاستيرادات غير المستخدمة...

echo.
echo 📁 فحص ملفات TypeScript/JavaScript...

REM البحث عن ملفات تحتوي على استيرادات
for /r %%f in (*.tsx *.ts *.jsx *.js) do (
    if not "%%f"=="%%f:node_modules" (
        if not "%%f"=="%%f:.next" (
            echo 🔍 فحص: %%~nxf
            findstr /n "^import.*from" "%%f" 2>nul
            echo.
        )
    )
)

echo ✅ انتهى الفحص!
pause
