'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function EvaluationPage() {
  const { t } = useLanguage()

  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          📊 <span className="gradient-text">{t('evaluation.title')}</span>
        </h1>
        <p>{t('evaluation.description')}</p>
      </section>

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
