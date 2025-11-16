'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, BookOpen, Target, Award, GraduationCap, Video, Headphones, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

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
      icon: '✅',
      titleKey: 'home.about.feature1.title',
      descriptionKey: 'home.about.feature1.desc',
    },
    {
      icon: '⭐',
      titleKey: 'home.about.feature2.title',
      descriptionKey: 'home.about.feature2.desc',
    },
    {
      icon: '💼',
      titleKey: 'home.about.feature3.title',
      descriptionKey: 'home.about.feature3.desc',
    },
  ]

const teamMembers = [
  {
    initials: 'ZM',
    name: 'زياد محمد',
    role: 'قائد الدفعة - مؤسس ومطور المنصة',
    image: '/images/zeyad-mohamed.jpg',
    description: 'قائد دفعة سايبر ومؤسس منصة سايبر تمساح. متخصص في هندسة البرمجيات وتطوير الأنظمة التعليمية. قمت بتصميم الموقع بالكامل ونشر الجدول الدراسي وشرح المواد التعليمية لمساعدة زملائي في الدفعة على الوصول للمحتوى التعليمي بسهولة.',
    responsibilities: [
      'تصميم وتطوير المنصة',
      'نشر الجدول الدراسي',
      'شرح المواد التعليمية',
      'إدارة المحتوى',
    ],
    socials: [
      { label: 'GitHub', href: 'https://github.com/phoenixcrypto', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
      { label: 'WhatsApp', href: 'https://wa.me/', icon: 'whatsapp' },
    ],
  },
  {
    initials: 'YW',
    name: 'يوسف وليد',
    role: 'قائد الدفعة - مطور المنصة',
    image: '/images/youssef-waleed.jpg',
    description: 'قائد دفعة سايبر ومطور متخصص في تحسين تجربة المستخدم. على الرغم من عدم مشاركته الفعلية في التطوير حتى الآن، إلا أنه يمتلك مهارات قوية في تحسين UX ويمكنه المساهمة بشكل فعال في تطوير المنصة.',
    responsibilities: [
      'تحسين تجربة المستخدم',
      'تطوير الواجهات',
      'ضمان الجودة',
    ],
    socials: [
      { label: 'WhatsApp', href: 'https://wa.me/', icon: 'whatsapp' },
    ],
  },
  {
    initials: 'MH',
    name: 'مؤمن هيثم',
    role: 'طالب في الدفعة - مساهم',
    image: '/images/moamen-haytham.jpg',
    description: 'طالب في دفعة سايبر يمتلك بعض المهارات في التطوير والتصميم. يساهم في المنصة من خلال مشاركته في المحتوى التعليمي والموارد المتعلقة بالأمن السيبراني.',
    responsibilities: [
      'المساهمة في المحتوى',
      'دليل الأمن السيبراني',
      'الموارد التعليمية',
    ],
    socials: [
      { label: 'GitHub', href: 'https://github.com', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
      { label: 'WhatsApp', href: 'https://wa.me/', icon: 'whatsapp' },
    ],
  },
]

  return (
    <>
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
            <Calendar className="w-5 h-5" />
            {t('home.viewSchedule')}
          </Link>
          <Link href="/materials" className="btn-secondary">
            <BookOpen className="w-5 h-5" />
            {t('home.viewMaterials')}
          </Link>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.labelKey} className="stat-card">
              <div className="stat-icon">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{t(item.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section-enhanced">
        <div className="about-content-enhanced">
          <div className="about-header-enhanced">
            <h2 className="about-title-enhanced">
              {t('home.about.title')}
            </h2>
            <div className="about-title-underline"></div>
          </div>
          <p className="about-description-enhanced">
            {t('home.about.description')}
          </p>

          <div className="about-features-enhanced">
            {aboutFeatures.map((feature, index) => (
              <div key={feature.titleKey} className="feature-item-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon-enhanced">{feature.icon}</div>
                <h4 className="feature-title-enhanced">{t(feature.titleKey)}</h4>
                <p className="feature-description-enhanced">{t(feature.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دليل الأمن السيبراني */}
      <section id="security-guide" className="security-guide-section-enhanced">
        <div className="security-guide-container">
          <div className="security-guide-header">
            <h2 className="security-guide-title">
              <span className="gradient-text">{t('home.guide.title')}</span>
            </h2>
            <div className="security-guide-title-underline"></div>
            <p className="security-guide-subtitle">
              {t('home.guide.subtitle')}
            </p>
          </div>

          <div className="security-guide-grid">
            {/* Roadmap */}
            <Link href="/roadmap" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">🗺️</div>
              <h3 className="security-card-title">{t('home.guide.roadmap')}</h3>
              <p className="security-card-description">
                {t('home.guide.roadmapDesc')}
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* Educational Resources */}
            <div className="security-card-enhanced security-card-dropdown">
              <div className="security-card-icon">📚</div>
              <h3 className="security-card-title">{t('home.guide.resources')}</h3>
              <div className="security-card-links">
                <Link href="/courses" prefetch={false} className="security-card-link">
                  <GraduationCap className="w-4 h-4" /> {t('nav.courses')}
                </Link>
                <Link href="/books" prefetch={false} className="security-card-link">
                  <BookOpen className="w-4 h-4" /> {t('nav.books')}
                </Link>
                <Link href="/videos" prefetch={false} className="security-card-link">
                  <Video className="w-4 h-4" /> {t('nav.videos')}
                </Link>
                <Link href="/podcasts" prefetch={false} className="security-card-link">
                  <Headphones className="w-4 h-4" /> {t('nav.podcasts')}
                </Link>
                <Link href="/platforms" prefetch={false} className="security-card-link">
                  <Globe className="w-4 h-4" /> {t('nav.platforms')}
                </Link>
              </div>
            </div>

            {/* Professional Skills Guide */}
            <Link href="/expertise-guide" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">💼</div>
              <h3 className="security-card-title">{t('home.guide.expertise')}</h3>
              <p className="security-card-description">
                {t('home.guide.expertiseDesc')}
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* News & Updates */}
            <Link href="/evaluation" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">📊</div>
              <h3 className="security-card-title">{t('home.guide.news')}</h3>
              <p className="security-card-description">
                {t('home.guide.newsDesc')}
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* Contribute */}
            <Link href="/contribute" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">🤝</div>
              <h3 className="security-card-title">{t('home.guide.contribute')}</h3>
              <p className="security-card-description">
                {t('home.guide.contributeDesc')}
              </p>
              <div className="security-card-arrow">→</div>
            </Link>
          </div>
        </div>
      </section>

      <section id="team" className="team-section-enhanced">
        <div className="team-container-enhanced">
          <div className="team-header-enhanced">
            <h2 className="team-title-enhanced">
              {t('home.team.title')}
            </h2>
            <div className="team-title-underline"></div>
            <p className="team-subtitle-enhanced">
              {t('home.team.subtitle')}
            </p>
          </div>

          <div className="team-cards-grid-enhanced">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="team-card-enhanced" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="team-card-header">
                  <div className="team-card-avatar">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={60}
                        height={60}
                        className="team-card-avatar-image"
                      />
                    ) : (
                      member.initials
                    )}
                  </div>
                  <div className="team-card-info">
                    <h3 className="team-card-name">{member.name}</h3>
                    <p className="team-card-role">{member.role}</p>
                  </div>
                </div>
                <p className="team-card-description">
                  {member.description}
                </p>
                {member.responsibilities && (
                  <div className="team-card-responsibilities">
                    <p className="team-card-responsibilities-title">{t('team.responsibilities')}</p>
                    <ul className="team-card-responsibilities-list">
                      {member.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="team-card-responsibility-item">
                          <span className="team-card-responsibility-bullet">•</span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="team-card-socials">
                  {member.socials.map((social) => (
                    <Link 
                      key={social.label} 
                      href={social.href} 
                      prefetch={false}
                      className="team-social-link-enhanced"
                    >
                      {social.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contribute" className="contribute-section">
        <div className="contribute-content">
          <h2>
            {t('home.contribute.title')}
          </h2>
          <p>
            {t('home.contribute.description')}
          </p>
        </div>
      </section>

    </>
  )
}
