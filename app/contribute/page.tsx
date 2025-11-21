'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { Heart, GraduationCap, Book } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export default function ContributePage() {
  const { t } = useLanguage()

  return (
    <div className="courses-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unified Page Header */}
        <PageHeader 
          title={t('contribute.title')} 
          icon={Heart}
          description={t('contribute.description')}
        />

        <div className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">{t('contribute.mainSources')}</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-cyber-neon" />
              </div>
              <div className="course-info">
                <h4>{t('contribute.courses')}</h4>
                <p className="course-description">{t('contribute.coursesDesc')}</p>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail flex items-center justify-center">
                <Book className="w-12 h-12 text-cyber-neon" />
              </div>
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
        </div>
      </div>
    </div>
  )
}
