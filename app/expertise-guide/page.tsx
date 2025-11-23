'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { GraduationCap, User } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export default function ExpertiseGuidePage() {
  const { t, language } = useLanguage()

  return (
    <div className="page-container">
      <PageHeader 
        title={t('expertise.title')} 
        icon={GraduationCap}
        description={t('expertise.description')}
      />

        <div className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">{t('expertise.beginners')}</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>👨‍💻</div>
              <div className="course-info">
                <h4>{language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud'}</h4>
                <p className="course-instructor">{t('expertise.securityAnalyst')} - 6 {t('expertise.experience')}</p>
                <p className="course-description">
                  {language === 'ar' 
                    ? '"أكبر خطأ ارتكبته في بدايتي هو القفز مباشرة إلى الأدوات المتقدمة دون فهم الأساسيات. أنصح كل مبتدئ بأن يبدأ بتعلم الشبكات وأنظمة التشغيل جيداً، ثم ينتقل إلى الأدوات."'
                    : '"The biggest mistake I made at the beginning was jumping directly to advanced tools without understanding the basics. I advise every beginner to start by learning networks and operating systems well, then move on to tools."'}
                </p>
                <div className="course-tags">
                  <span className="course-tag">{language === 'ar' ? 'أساسيات' : 'Basics'}</span>
                  <span className="course-tag">{language === 'ar' ? 'مسار تعليمي' : 'Learning Path'}</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail flex items-center justify-center">
                <User className="w-12 h-12 text-cyber-neon" />
              </div>
              <div className="course-info">
                <h4>{language === 'ar' ? 'فاطمة عبدالرحمن' : 'Fatima Abdelrahman'}</h4>
                <p className="course-instructor">{t('expertise.securityEngineer')} - 4 {t('expertise.experience')}</p>
                <p className="course-description">
                  {language === 'ar'
                    ? '"لا تخف من ارتكاب الأخطاء في المختبرات. كل خطأ هو فرصة للتعلم. أنشئ مختبرك الخاص وكرر التجارب حتى تفهم تماماً ما يحدث."'
                    : '"Don\'t be afraid to make mistakes in labs. Every mistake is a learning opportunity. Create your own lab and repeat experiments until you fully understand what\'s happening."'}
                </p>
                <div className="course-tags">
                  <span className="course-tag">{language === 'ar' ? 'مختبرات' : 'Labs'}</span>
                  <span className="course-tag">{language === 'ar' ? 'تعلم عملي' : 'Practical Learning'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
    </div>
  )
}
