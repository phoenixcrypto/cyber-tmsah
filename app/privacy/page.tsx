'use client'

import { Shield, FileText, Lock, Eye, Cookie, Users, Database, Globe, List, ArrowUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { useState, useEffect } from 'react'

export default function PrivacyPage() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const privacySections = [
    {
      id: 'introduction',
      icon: Shield,
      title: 'مقدمة',
      content: 'نحن في منصة سايبر تمساح نولي أهمية كبيرة لخصوصيتك وحماية بياناتك الشخصية. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك عند استخدام موقعنا. باستخدام موقعنا، فإنك توافق على ممارسات جمع المعلومات واستخدامها الموضحة في هذه السياسة.'
    },
    {
      id: 'data-collection',
      icon: Database,
      title: 'جمع المعلومات',
      content: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك لخدماتنا، مثل المعلومات التي تدخلها في نماذج الاتصال أو عند التسجيل في خدماتنا. قد نقوم أيضاً بجمع معلومات تلقائياً عند زيارتك لموقعنا، بما في ذلك عنوان IP، نوع المتصفح، صفحات الويب التي تزورها، والوقت والتاريخ.'
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم ملفات تعريف الارتباط لتوفير تجربة أفضل لك وتحسين خدماتنا. قد نستخدم أيضاً خدمات طرف ثالث مثل Google AdSense التي تستخدم ملفات تعريف الارتباط لعرض الإعلانات المخصصة بناءً على زياراتك لمواقعنا ومواقع أخرى على الإنترنت.'
    },
    {
      id: 'data-usage',
      icon: Eye,
      title: 'استخدام المعلومات',
      content: 'نستخدم المعلومات التي نجمعها لتقديم وتحسين خدماتنا، والرد على استفساراتك، وإرسال التحديثات المهمة، وتحليل كيفية استخدام موقعنا. قد نستخدم أيضاً معلوماتك لأغراض التسويق والترويج، ولكن يمكنك إلغاء الاشتراك في أي وقت.'
    },
    {
      id: 'data-protection',
      icon: Lock,
      title: 'حماية المعلومات',
      content: 'نحن ملتزمون بحماية معلوماتك الشخصية. نستخدم تدابير أمنية تقنية وإدارية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. ومع ذلك، لا يمكن ضمان الأمان المطلق لأي معلومات يتم إرسالها عبر الإنترنت.'
    },
    {
      id: 'data-sharing',
      icon: Users,
      title: 'مشاركة المعلومات',
      content: 'لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا، بشرط أن يحافظوا على سرية هذه المعلومات. قد نشارك أيضاً معلومات مجمعة وغير شخصية لأغراض إحصائية أو تحليلية.'
    },
    {
      id: 'adsense',
      icon: Globe,
      title: 'إعلانات Google AdSense',
      content: 'يستخدم موقعنا Google AdSense لعرض الإعلانات. قد تستخدم Google ملفات تعريف الارتباط لعرض إعلانات مخصصة بناءً على زياراتك لموقعنا ومواقع أخرى. يمكنك إلغاء الاشتراك في الإعلانات المخصصة من Google من خلال زيارة إعدادات الإعلانات في Google.'
    },
    {
      id: 'user-rights',
      icon: FileText,
      title: 'حقوقك',
      content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها أو تقييد معالجتها. يمكنك أيضاً الاعتراض على معالجة معلوماتك أو طلب نقلها. لتنفيذ أي من هذه الحقوق، يرجى الاتصال بنا عبر نموذج الاتصال الموجود على الموقع.'
    },
    {
      id: 'changes',
      icon: Shield,
      title: 'التغييرات على سياسة الخصوصية',
      content: 'نحتفظ بالحق في تحديث أو تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ "آخر تحديث". ننصحك بمراجعة هذه السياسة بانتظام للبقاء على اطلاع بآخر التحديثات.'
    }
  ]

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
      const sections = privacySections.map(s => s.id)
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
  }, [])

  return (
    <div className="page-container">
      <PageHeader 
        title={t('privacy.title')} 
        icon={Shield}
        description={t('privacy.description') || 'سياسة الخصوصية لمنصة سايبر تمساح - كيف نحمي بياناتك'}
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
              {privacySections.map((section) => {
                const Icon = section.icon
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

          {/* Privacy Sections */}
          <article className="space-y-6">
            {privacySections.map((section, index) => {
              const Icon = section.icon
              return (
                <section 
                  key={section.id}
                  id={section.id}
                  className="enhanced-card-2030 stagger-item"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
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
          <div className="enhanced-card-2030 mt-8 stagger-item" style={{ animationDelay: '1.0s' }}>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-cyber-neon flex-shrink-0 mt-1" />
              <div>
                <h3 className="subsection-title mb-3">هل لديك أسئلة أو مخاوف؟</h3>
                <p className="content-paragraph">
                  إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارساتنا، يرجى{' '}
                  <Link href="/contact" className="text-cyber-neon hover:text-cyber-green font-semibold transition-colors underline">
                    الاتصال بنا
                  </Link>
                  {' '}من خلال صفحة الاتصال.
                </p>
              </div>
            </div>
          </div>
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
