'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function ContributePage() {
  const { t } = useLanguage()

  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          📚 <span className="gradient-text">{t('contribute.title')}</span>
        </h1>
        <p>{t('contribute.description')}</p>
      </section>

      <main className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">{t('contribute.mainSources')}</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>🎓</div>
              <div className="course-info">
                <h4>{t('contribute.courses')}</h4>
                <p className="course-description">{t('contribute.coursesDesc')}</p>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>📖</div>
              <div className="course-info">
                <h4>{t('contribute.books')}</h4>
                <p className="course-description">{t('contribute.booksDesc')}</p>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>🎬</div>
              <div className="course-info">
                <h4>{t('contribute.videos')}</h4>
                <p className="course-description">{t('contribute.videosDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">{t('contribute.howTo')}</h2>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
            <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              {t('contribute.howToDesc')}
            </p>
            <Link href="/contact" className="course-link">
              {t('contribute.contactUs')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
