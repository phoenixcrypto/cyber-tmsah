'use client'

import { FileText, AlertCircle, CheckCircle, XCircle, BookOpen, Shield, Users, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function TermsPage() {
  const { t } = useLanguage()

  const termsSections = [
    {
      icon: BookOpen,
      title: 'قبول الشروط',
      content: 'باستخدام موقع منصة سايبر تمساح، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك عدم استخدام موقعنا.'
    },
    {
      icon: Users,
      title: 'استخدام الموقع',
      content: 'يُسمح لك باستخدام موقعنا للأغراض التعليمية والشخصية فقط. يجب ألا تستخدم الموقع لأي غرض غير قانوني أو غير مصرح به. أنت مسؤول عن الحفاظ على سرية أي معلومات حساب قد تكون لديك.'
    },
    {
      icon: Shield,
      title: 'الملكية الفكرية',
      content: 'جميع المحتويات الموجودة على موقعنا، بما في ذلك النصوص والصور والتصاميم والشعارات، محمية بحقوق الطبع والنشر والملكية الفكرية. لا يجوز لك نسخ أو توزيع أو تعديل أو إنشاء أعمال مشتقة من محتوى موقعنا دون الحصول على إذن كتابي منا.'
    },
    {
      icon: AlertCircle,
      title: 'المحتوى المقدم من المستخدمين',
      content: 'إذا قمت بتقديم أي محتوى إلى موقعنا (مثل التعليقات أو المقالات)، فإنك تمنحنا ترخيصاً غير حصري ودائماً لاستخدام وتعديل ونشر هذا المحتوى. أنت تضمن أن المحتوى الذي تقدمه لا ينتهك حقوق أي طرف ثالث.'
    },
    {
      icon: XCircle,
      title: 'القيود والمسؤوليات',
      content: 'نحن لا نضمن دقة أو اكتمال أو فائدة أي معلومات على موقعنا. لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدامك لموقعنا. أنت تستخدم الموقع على مسؤوليتك الخاصة.'
    },
    {
      icon: CheckCircle,
      title: 'روابط لمواقع خارجية',
      content: 'قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لسنا مسؤولين عن محتوى أو ممارسات الخصوصية لهذه المواقع الخارجية. ننصحك بمراجعة سياسات الخصوصية وشروط الاستخدام لأي موقع خارجي تزوره.'
    },
    {
      icon: Globe,
      title: 'التعديلات على الشروط',
      content: 'نحتفظ بالحق في تعديل أو تحديث هذه الشروط والأحكام في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة. استمرار استخدامك للموقع بعد نشر التغييرات يعني موافقتك على الشروط المحدثة.'
    },
    {
      icon: FileText,
      title: 'إنهاء الاستخدام',
      content: 'نحتفظ بالحق في إنهاء أو تعليق وصولك إلى موقعنا في أي وقت، دون إشعار مسبق، لأي سبب كان، بما في ذلك انتهاك هذه الشروط والأحكام.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              {t('terms.title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
            {t('terms.description')}
          </p>
          <p className="text-base text-dark-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="enhanced-card p-8 mb-8 animate-slide-up">
          <p className="text-dark-300 leading-relaxed text-lg mb-4">
            مرحباً بك في منصة سايبر تمساح. تشرح هذه الاتفاقية الشروط والأحكام التي تحكم استخدامك لموقعنا وخدماتنا.
          </p>
          <p className="text-dark-300 leading-relaxed">
            يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا. باستخدام موقعنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام موقعنا.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={index} className="enhanced-card p-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-dark-100 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-dark-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="enhanced-card p-8 mt-8 animate-slide-up">
          <p className="text-dark-300 leading-relaxed">
            إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى{' '}
            <Link href="/contact" className="text-cyber-neon hover:text-cyber-green font-semibold transition-colors underline">
              الاتصال بنا
            </Link>
            {' '}من خلال صفحة الاتصال.
          </p>
        </div>

        {/* Agreement Section */}
        <div className="enhanced-card p-8 mt-8 animate-slide-up border-2 border-cyber-neon/30">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyber-neon flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-dark-100 mb-3">
                الموافقة على الشروط
              </h3>
              <p className="text-dark-300 leading-relaxed">
                باستخدام موقع منصة سايبر تمساح، فإنك تقر وتوافق على أنك قد قرأت وفهمت هذه الشروط والأحكام وأنك توافق على الالتزام بها. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك التوقف عن استخدام موقعنا فوراً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
