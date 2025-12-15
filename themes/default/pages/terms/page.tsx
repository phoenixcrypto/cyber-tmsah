'use client'

import { FileText, List, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import PageHeader from '../../components/PageHeader'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'

interface LegalSection {
  id: string
  icon: string
  title: string
  content: string
  order: number
}

interface TermsPageData {
  title: string
  description: string
  sections: LegalSection[]
}

export default function TermsPage() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [pageData, setPageData] = useState<TermsPageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch('/api/pages/legal?type=terms')
        if (res.ok) {
          const data = await res.json()
          setPageData(data.data.page)
        }
      } catch (error) {
        console.error('Error fetching terms page:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPageData()
  }, [])

  // Fallback sections
  const defaultSections: LegalSection[] = [
    {
      id: 'acceptance',
      icon: 'BookOpen',
      title: 'قبول الشروط',
      content: 'باستخدام موقع منصة سايبر تمساح، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك عدم استخدام موقعنا.',
      order: 0
    },
    {
      id: 'usage',
      icon: 'Users',
      title: 'استخدام الموقع',
      content: 'يُسمح لك باستخدام موقعنا للأغراض التعليمية والشخصية فقط. يجب ألا تستخدم الموقع لأي غرض غير قانوني أو غير مصرح به. أنت مسؤول عن الحفاظ على سرية أي معلومات حساب قد تكون لديك.',
      order: 1
    },
    {
      id: 'intellectual',
      icon: 'Shield',
      title: 'الملكية الفكرية',
      content: 'جميع المحتويات الموجودة على موقعنا، بما في ذلك النصوص والصور والتصاميم والشعارات، محمية بحقوق الطبع والنشر والملكية الفكرية. لا يجوز لك نسخ أو توزيع أو تعديل أو إنشاء أعمال مشتقة من محتوى موقعنا دون الحصول على إذن كتابي منا.',
      order: 2
    },
    {
      id: 'user-content',
      icon: 'AlertCircle',
      title: 'المحتوى المقدم من المستخدمين',
      content: 'إذا قمت بتقديم أي محتوى إلى موقعنا (مثل التعليقات أو المقالات)، فإنك تمنحنا ترخيصاً غير حصري ودائماً لاستخدام وتعديل ونشر هذا المحتوى. أنت تضمن أن المحتوى الذي تقدمه لا ينتهك حقوق أي طرف ثالث.',
      order: 3
    },
    {
      id: 'limitations',
      icon: 'XCircle',
      title: 'القيود والمسؤوليات',
      content: 'نحن لا نضمن دقة أو اكتمال أو فائدة أي معلومات على موقعنا. لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدامك لموقعنا. أنت تستخدم الموقع على مسؤوليتك الخاصة.',
      order: 4
    },
    {
      id: 'external-links',
      icon: 'CheckCircle',
      title: 'روابط لمواقع خارجية',
      content: 'قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لسنا مسؤولين عن محتوى أو ممارسات الخصوصية لهذه المواقع الخارجية. ننصحك بمراجعة سياسات الخصوصية وشروط الاستخدام لأي موقع خارجي تزوره.',
      order: 5
    },
    {
      id: 'modifications',
      icon: 'Globe',
      title: 'التعديلات على الشروط',
      content: 'نحتفظ بالحق في تعديل أو تحديث هذه الشروط والأحكام في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة. استمرار استخدامك للموقع بعد نشر التغييرات يعني موافقتك على الشروط المحدثة.',
      order: 6
    },
    {
      id: 'termination',
      icon: 'FileText',
      title: 'إنهاء الاستخدام',
      content: 'نحتفظ بالحق في إنهاء أو تعليق وصولك إلى موقعنا في أي وقت، دون إشعار مسبق، لأي سبب كان، بما في ذلك انتهاك هذه الشروط والأحكام.',
      order: 7
    }
  ]

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return FileText
    const Icon = (Icons as unknown as Record<string, typeof FileText>)[iconName]
    return Icon || FileText
  }

  const termsSections = pageData?.sections && pageData.sections.length > 0
    ? pageData.sections.sort((a, b) => a.order - b.order)
    : defaultSections

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = termsSections.map(s => s.id)
      const current = sections.find(id => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [termsSections])

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader 
          title={t('terms.title')} 
          icon={FileText}
          description={t('terms.description') || 'شروط وأحكام استخدام منصة سايبر تمساح'}
        />
        <div className="text-center py-16">
          <p className="text-dark-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <PageHeader 
        title={pageData?.title || t('terms.title')} 
        icon={FileText}
        description={pageData?.description || t('terms.description') || 'شروط وأحكام استخدام منصة سايبر تمساح'}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="enhanced-card-2030 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <List className="w-6 h-6 text-cyber-neon" />
              <h3 className="subsection-title mb-0">جدول المحتويات</h3>
            </div>
            <nav className="space-y-2">
              {termsSections.map((section) => {
                const iconName = typeof section.icon === 'string' ? section.icon : 'FileText'
                const Icon = getIconComponent(iconName)
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`terms-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Last Updated */}
          <div className="enhanced-card-2030 mb-8 stagger-item" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 text-dark-400">
              <FileText className="w-5 h-5" />
              <span>آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Introduction */}
          <article className="enhanced-card-2030 mb-8 stagger-item" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title mb-6">مقدمة</h2>
            <div className="prose prose-invert max-w-none">
              <p className="content-paragraph text-lg mb-4">
                مرحباً بك في منصة سايبر تمساح. تشرح هذه الاتفاقية الشروط والأحكام التي تحكم استخدامك لموقعنا وخدماتنا.
              </p>
              <p className="content-paragraph text-lg">
                يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا. باستخدام موقعنا، فإنك توافق على الالتزام بهذه الشروط. 
                إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام موقعنا.
              </p>
            </div>
          </article>

          {/* Terms Sections */}
          <article className="space-y-6">
            {termsSections.map((section, index) => {
              const iconName = typeof section.icon === 'string' ? section.icon : 'FileText'
              const Icon = getIconComponent(iconName)
              return (
                <section 
                  key={section.id}
                  id={section.id}
                  className="enhanced-card-2030 stagger-item"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="section-title mb-0">{section.title}</h2>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="content-paragraph text-lg">
                      {section.content}
                    </p>
                  </div>
                </section>
              )
            })}
          </article>

          {/* Contact Section */}
          <div className="enhanced-card-2030 mt-8 stagger-item" style={{ animationDelay: '1.1s' }}>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-cyber-neon flex-shrink-0 mt-1" />
              <div>
                <h3 className="subsection-title mb-3">هل لديك أسئلة؟</h3>
                <p className="content-paragraph">
                  إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى{' '}
                  <Link href="/contact" className="text-cyber-neon hover:text-cyber-green font-semibold transition-colors underline">
                    الاتصال بنا
                  </Link>
                  {' '}من خلال صفحة الاتصال.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          <article className="enhanced-card-2030 mt-8 stagger-item border-2 border-cyber-neon/30" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-cyber-neon flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="section-title mb-4">الموافقة على الشروط</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="content-paragraph text-lg">
                    باستخدام موقع منصة سايبر تمساح، فإنك تقر وتوافق على أنك قد قرأت وفهمت هذه الشروط والأحكام 
                    وأنك توافق على الالتزام بها. إذا كنت لا توافق على أي جزء من هذه الشروط، 
                    فيجب عليك التوقف عن استخدام موقعنا فوراً.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="scroll-to-top-button visible"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
