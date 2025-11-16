'use client'

import { FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              {t('terms.title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto">
            {t('terms.description')}
          </p>
        </div>

        <div className="enhanced-card p-8 animate-slide-up">
          <div className="prose prose-invert max-w-none">
            <p className="text-dark-300 leading-relaxed mb-6">
              {t('terms.content')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

