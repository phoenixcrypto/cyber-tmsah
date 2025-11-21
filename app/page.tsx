'use client'

import Link from 'next/link'
import { Calendar, BookOpen, Target, Award, CheckCircle2, Star, Briefcase } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Script from 'next/script'

export default function HomePage() {
  const { t } = useLanguage()

  const stats = [
    { icon: BookOpen, value: '7', labelKey: 'home.stats.subjects' },
    { icon: Calendar, value: '15', labelKey: 'home.stats.groups' },
    { icon: Award, value: '6', labelKey: 'home.stats.faculty' },
    { icon: Target, value: '100%', labelKey: 'home.stats.ready' },
  ]

  const aboutFeatures = [
    {
      icon: CheckCircle2,
      titleKey: 'home.about.feature1.title',
      descriptionKey: 'home.about.feature1.desc',
    },
    {
      icon: Star,
      titleKey: 'home.about.feature2.title',
      descriptionKey: 'home.about.feature2.desc',
    },
    {
      icon: Briefcase,
      titleKey: 'home.about.feature3.title',
      descriptionKey: 'home.about.feature3.desc',
    },
  ]

  // Homepage-specific Structured Data
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cyber TMSAH - المنصة الأكاديمية الشاملة',
    description: 'منصة تعليمية متكاملة للأمن السيبراني',
    url: 'https://www.cyber-tmsah.site',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Cyber TMSAH',
    },
  }

  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema),
        }}
      />
      <section className="hero-section">
        <div className="motivational-box">{t('home.motivational')}</div>
        <h1>
          {t('home.title')}
        </h1>
        <p>
          {t('home.description')}
        </p>
        <div className="hero-buttons">
          <Link href="/schedule" className="cta-button">
            {t('home.cta.schedule')}
          </Link>
          <Link href="/materials" className="cta-button-secondary">
            {t('home.cta.materials')}
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{t(stat.labelKey)}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* About Features Section */}
      <section className="about-section-enhanced">
        <div className="about-content-enhanced">
          <div className="about-header-enhanced">
            <h2 className="about-title-enhanced">{t('home.about.title')}</h2>
            <div className="about-title-underline"></div>
            <p className="about-description-enhanced">{t('home.about.description')}</p>
          </div>

          <div className="about-features-enhanced">
            {aboutFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="about-feature-card" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="feature-icon-large">
                    <Icon className="w-12 h-12 text-cyber-neon" />
                  </div>
                  <h3 className="feature-title">{t(feature.titleKey)}</h3>
                  <p className="feature-description">{t(feature.descriptionKey)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
