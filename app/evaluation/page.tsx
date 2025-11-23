'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function EvaluationPage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="hero-section">
        <div className="motivational-box">
          {t('home.motivational')}
        </div>
        <h1 className="page-title">{t('evaluation.title')}</h1>
        <p className="content-paragraph">{t('evaluation.description')}</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
    </>
  )
}
