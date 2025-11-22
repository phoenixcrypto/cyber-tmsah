'use client'

import { useState } from 'react'
import { Database, Download, Calendar, BookOpen, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MigrateDataPage() {
  const { language } = useLanguage()
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; migrated: number; errors?: string[] } | null>(null)

  const handleMigrate = async (type: 'schedule' | 'materials' | 'downloads' | 'all') => {
    setMigrating(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('Migration error:', error)
      setResult({
        success: false,
        migrated: 0,
        errors: [language === 'ar' ? 'حدث خطأ أثناء نقل البيانات' : 'Error migrating data'],
      })
    } finally {
      setMigrating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-cyber-neon" />
          {language === 'ar' ? 'نقل البيانات' : 'Data Migration'}
        </h1>
        <p className="text-dark-300">
          {language === 'ar' ? 'نقل البيانات الحالية من الكود إلى قاعدة البيانات' : 'Migrate current data from code to database'}
        </p>
      </div>

      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <h2 className="text-xl font-bold text-dark-100 mb-4">
          {language === 'ar' ? 'نقل البيانات' : 'Migrate Data'}
        </h2>
        <p className="text-dark-300 mb-6">
          {language === 'ar' 
            ? 'سيتم نقل جميع البيانات الحالية (hardcoded) إلى قاعدة البيانات. يمكنك نقل كل نوع على حدة أو جميعها معاً.'
            : 'This will migrate all current hardcoded data to the database. You can migrate each type separately or all at once.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleMigrate('schedule')}
            disabled={migrating}
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all disabled:opacity-50 flex flex-col items-center gap-2"
          >
            <Calendar className="w-8 h-8 text-cyber-neon" />
            <span className="font-semibold text-dark-100">
              {language === 'ar' ? 'الجداول' : 'Schedule'}
            </span>
          </button>

          <button
            onClick={() => handleMigrate('materials')}
            disabled={migrating}
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all disabled:opacity-50 flex flex-col items-center gap-2"
          >
            <BookOpen className="w-8 h-8 text-cyber-neon" />
            <span className="font-semibold text-dark-100">
              {language === 'ar' ? 'المواد' : 'Materials'}
            </span>
          </button>

          <button
            onClick={() => handleMigrate('downloads')}
            disabled={migrating}
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all disabled:opacity-50 flex flex-col items-center gap-2"
          >
            <Download className="w-8 h-8 text-cyber-neon" />
            <span className="font-semibold text-dark-100">
              {language === 'ar' ? 'البرامج' : 'Downloads'}
            </span>
          </button>

          <button
            onClick={() => handleMigrate('all')}
            disabled={migrating}
            className="p-4 bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 rounded-xl border-2 border-cyber-neon/40 hover:border-cyber-neon/60 transition-all disabled:opacity-50 flex flex-col items-center gap-2"
          >
            <RefreshCw className={`w-8 h-8 text-cyber-neon ${migrating ? 'animate-spin' : ''}`} />
            <span className="font-bold text-dark-100">
              {language === 'ar' ? 'الكل' : 'All'}
            </span>
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border-2 ${
            result.success 
              ? 'bg-green-500/20 border-green-500/50' 
              : 'bg-red-500/20 border-red-500/50'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`font-bold mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success 
                    ? (language === 'ar' ? 'تم النقل بنجاح!' : 'Migration Successful!')
                    : (language === 'ar' ? 'فشل النقل' : 'Migration Failed')}
                </h3>
                <p className="text-dark-300 text-sm">
                  {language === 'ar' 
                    ? `تم نقل ${result.migrated} عنصر`
                    : `Migrated ${result.migrated} items`}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-300 text-sm font-semibold mb-1">
                      {language === 'ar' ? 'الأخطاء:' : 'Errors:'}
                    </p>
                    <ul className="text-red-300 text-xs list-disc list-inside">
                      {result.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

