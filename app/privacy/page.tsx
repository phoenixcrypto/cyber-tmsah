'use client'

import { Shield, FileText, Lock, Eye, Cookie, Users, Database, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export default function PrivacyPage() {
  const { t } = useLanguage()

  const privacySections = [
    {
      icon: Database,
      title: 'جمع المعلومات',
      content: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك لخدماتنا، مثل المعلومات التي تدخلها في نماذج الاتصال أو عند التسجيل في خدماتنا. قد نقوم أيضاً بجمع معلومات تلقائياً عند زيارتك لموقعنا، بما في ذلك عنوان IP، نوع المتصفح، صفحات الويب التي تزورها، والوقت والتاريخ.'
    },
    {
      icon: Cookie,
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم ملفات تعريف الارتباط لتوفير تجربة أفضل لك وتحسين خدماتنا. قد نستخدم أيضاً خدمات طرف ثالث مثل Google AdSense التي تستخدم ملفات تعريف الارتباط لعرض الإعلانات المخصصة بناءً على زياراتك لمواقعنا ومواقع أخرى على الإنترنت.'
    },
    {
      icon: Eye,
      title: 'استخدام المعلومات',
      content: 'نستخدم المعلومات التي نجمعها لتقديم وتحسين خدماتنا، والرد على استفساراتك، وإرسال التحديثات المهمة، وتحليل كيفية استخدام موقعنا. قد نستخدم أيضاً معلوماتك لأغراض التسويق والترويج، ولكن يمكنك إلغاء الاشتراك في أي وقت.'
    },
    {
      icon: Lock,
      title: 'حماية المعلومات',
      content: 'نحن ملتزمون بحماية معلوماتك الشخصية. نستخدم تدابير أمنية تقنية وإدارية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. ومع ذلك، لا يمكن ضمان الأمان المطلق لأي معلومات يتم إرسالها عبر الإنترنت.'
    },
    {
      icon: Users,
      title: 'مشاركة المعلومات',
      content: 'لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا، بشرط أن يحافظوا على سرية هذه المعلومات. قد نشارك أيضاً معلومات مجمعة وغير شخصية لأغراض إحصائية أو تحليلية.'
    },
    {
      icon: Globe,
      title: 'إعلانات Google AdSense',
      content: 'يستخدم موقعنا Google AdSense لعرض الإعلانات. قد تستخدم Google ملفات تعريف الارتباط لعرض إعلانات مخصصة بناءً على زياراتك لموقعنا ومواقع أخرى. يمكنك إلغاء الاشتراك في الإعلانات المخصصة من Google من خلال زيارة إعدادات الإعلانات في Google.'
    },
    {
      icon: FileText,
      title: 'حقوقك',
      content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها أو تقييد معالجتها. يمكنك أيضاً الاعتراض على معالجة معلوماتك أو طلب نقلها. لتنفيذ أي من هذه الحقوق، يرجى الاتصال بنا عبر نموذج الاتصال الموجود على الموقع.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unified Page Header */}
        <PageHeader 
          title={t('privacy.title')} 
          icon={Shield}
          description={t('privacy.description')}
        />
        <p className="text-base text-dark-400 max-w-2xl mx-auto mt-4 mb-8 text-center leading-relaxed">
          آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Introduction - Article Style */}
        <article className="enhanced-card p-8 mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-dark-100 mb-6">مقدمة</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-dark-300 leading-relaxed text-lg mb-4">
              نحن في منصة سايبر تمساح نولي أهمية كبيرة لخصوصيتك وحماية بياناتك الشخصية. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك عند استخدام موقعنا.
            </p>
            <p className="text-dark-300 leading-relaxed text-lg">
              باستخدام موقعنا، فإنك توافق على ممارسات جمع المعلومات واستخدامها الموضحة في هذه السياسة. إذا كنت لا توافق على هذه السياسة، يرجى عدم استخدام موقعنا.
            </p>
          </div>
        </article>

        {/* Privacy Sections - Article Style for AdSense */}
        <article className="space-y-8">
          {privacySections.map((section, index) => {
            const Icon = section.icon
            return (
              <section key={index} className="enhanced-card p-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-100 flex-1">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-dark-300 leading-relaxed text-lg mb-4">
                    {section.content}
                  </p>
                </div>
              </section>
            )
          })}
        </article>

        {/* Contact Section */}
        <div className="enhanced-card p-8 mt-8 animate-slide-up">
          <p className="text-dark-300 leading-relaxed">
            إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارساتنا، يرجى{' '}
            <Link href="/contact" className="text-cyber-neon hover:text-cyber-green font-semibold transition-colors underline">
              الاتصال بنا
            </Link>
            {' '}من خلال صفحة الاتصال.
          </p>
        </div>

        {/* Changes Section - Article Style */}
        <article className="enhanced-card p-8 mt-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-dark-100 mb-4">
            التغييرات على سياسة الخصوصية
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-dark-300 leading-relaxed text-lg">
              نحتفظ بالحق في تحديث أو تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ "آخر تحديث". ننصحك بمراجعة هذه السياسة بانتظام للبقاء على اطلاع بآخر التحديثات.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
