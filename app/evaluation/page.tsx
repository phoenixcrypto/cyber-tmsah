'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Newspaper } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export default function EvaluationPage() {
  const { t } = useLanguage()

  return (
    <div className="page-container">
      <PageHeader 
        title={t('evaluation.title')} 
        icon={Newspaper}
        description={t('evaluation.description')}
        />

        <div className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">{t('evaluation.latestNews')}</h2>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
            <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.8' }}>
              {t('evaluation.comingSoon')}
            </p>
          </div>
        </section>
        </div>
    </div>
  )
}
