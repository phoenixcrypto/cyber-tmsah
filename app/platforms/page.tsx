'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface Platform {
  logo: string
  title: string
  description: string
  tags: string[]
  link: string
}

interface Category {
  title: string
  platforms: Platform[]
}

const categories: Category[] = [
  {
    title: 'منصات التدريب العملي (Labs)',
    platforms: [
      {
        logo: 'HTB',
        title: 'Hack The Box',
        description: 'منصة تدريب عملي متقدمة تحتوي على آلات افتراضية وتحديات متنوعة لاختبار مهارات الاختراق.',
        tags: ['مختبرات', 'Red Team', 'مدفوع'],
        link: 'https://www.hackthebox.com',
      },
      {
        logo: 'THM',
        title: 'TryHackMe',
        description: 'منصة تعليمية تفاعلية مع مسارات منظمة ومختبرات عملية للمبتدئين والمحترفين.',
        tags: ['مختبرات', 'مسارات تعليمية', 'مجاني/مدفوع'],
        link: 'https://tryhackme.com',
      },
      {
        logo: 'VHL',
        title: 'VulnHub',
        description: 'مجموعة كبيرة من الآلات الافتراضية القابلة للتحميل لممارسة اختبارات الاختراق.',
        tags: ['مختبرات', 'VMs', 'مجاني'],
        link: 'https://www.vulnhub.com',
      },
    ],
  },
  {
    title: 'منصات الدورات المجمعة (MOOCs)',
    platforms: [
      {
        logo: 'CYB',
        title: 'Cybrary',
        description: 'منصة متخصصة في الأمن السيبراني تقدم دورات مجانية ومدفوعة مع مختبرات عملية.',
        tags: ['دورات', 'مختبرات', 'مجاني/مدفوع'],
        link: 'https://www.cybrary.it',
      },
      {
        logo: 'SEC',
        title: 'SecurityTube',
        description: 'يوتيوب الأمن السيبراني، يحتوي على آلاف الفيديوهات التعليمية في مختلف التخصصات.',
        tags: ['فيديوهات', 'تعليمي', 'مجاني'],
        link: 'http://www.securitytube.net',
      },
      {
        logo: 'INE',
        title: 'INE',
        description: 'منصة احترافية تقدم دورات متقدمة وتحضير لشهادات مثل eJPT، eCPPT، وغيرها.',
        tags: ['شهادات', 'متقدم', 'مدفوع'],
        link: 'https://ine.com',
      },
    ],
  },
]

export default function PlatformsPage() {
  const { t } = useLanguage()
  
  return (
    <>
      <section className="hero-section">
        <div className="motivational-box">
          {t('home.motivational')}
        </div>
        <h1 className="page-title">{t('platforms.title')}</h1>
        <p className="content-paragraph">{t('platforms.description')}</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="courses-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="category-title">{category.title}</h2>
            <div className="courses-grid">
              {category.platforms.map((platform, platformIndex) => (
                <div key={platformIndex} className="course-card">
                  <div className="course-thumbnail" style={{ fontSize: '2rem', fontWeight: '900' }}>
                    {platform.logo}
                  </div>
                  <div className="course-info">
                    <h4>{platform.title}</h4>
                    <p className="course-description">{platform.description}</p>
                    <div className="course-tags">
                      {platform.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="course-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={platform.link} target="_blank" rel="noopener noreferrer" className="course-link">
                      زيارة الموقع
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  )
}
