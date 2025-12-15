'use client'

import { MessageCircle, Mail, Send, User, Info, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '../../components/PageHeader'
import * as Icons from 'lucide-react'

interface ContactMethod {
  id: string
  icon: string
  title: string
  value: string
  link?: string
  description: string
  order: number
}

interface ContactPageData {
  title: string
  description: string
  contactMethods: ContactMethod[]
  formSettings: {
    enabled: boolean
    minMessageLength: number
    subjects: string[]
  }
}

export default function ContactPage() {
  const { t } = useLanguage()
  const [pageData, setPageData] = useState<ContactPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch('/api/pages/contact')
        if (res.ok) {
          const data = await res.json()
          setPageData(data.data.page)
        }
      } catch (error) {
        console.error('Error fetching contact page:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPageData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          })
          setSubmitStatus('idle')
        }, 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 5000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback contact methods
  const defaultContactMethods: ContactMethod[] = [
    {
      id: 'email',
      icon: 'Mail',
      title: 'البريد الإلكتروني',
      value: 'info@cyber-tmsah.site',
      link: 'mailto:info@cyber-tmsah.site?subject=استفسار من موقع Cyber TMSAH',
      description: 'أرسل لنا بريداً إلكترونياً مباشرة',
      order: 0
    },
    {
      id: 'form',
      icon: 'MessageCircle',
      title: 'نموذج الاتصال',
      value: 'استخدم النموذج أدناه',
      description: 'أرسل رسالتك مباشرة من هنا',
      order: 1
    }
  ]

  const contactMethods = pageData?.contactMethods && pageData.contactMethods.length > 0
    ? pageData.contactMethods.sort((a, b) => a.order - b.order)
    : defaultContactMethods

  const minMessageLength = pageData?.formSettings?.minMessageLength || 20
  const formEnabled = pageData?.formSettings?.enabled !== false

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return MessageCircle
    const Icon = (Icons as unknown as Record<string, typeof MessageCircle>)[iconName]
    return Icon || MessageCircle
  }

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader 
          title={t('contact.title')} 
          icon={MessageCircle}
          description={t('contact.description') || 'نحن هنا لمساعدتك. تواصل معنا بأي طريقة تفضلها'}
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
        title={pageData?.title || t('contact.title')} 
        icon={MessageCircle}
        description={pageData?.description || t('contact.description') || 'نحن هنا لمساعدتك. تواصل معنا بأي طريقة تفضلها'}
      />

      {/* Contact Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {contactMethods.map((method, index) => {
          const iconName = typeof method.icon === 'string' ? method.icon : 'MessageCircle'
          const Icon = getIconComponent(iconName)
          return (
            <a
              key={method.id || index}
              href={method.link || '#'}
              className="contact-method-card stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="contact-method-icon">
                <Icon className="w-6 h-6" />
              </div>
              <div className="contact-method-content">
                <h3 className="contact-method-title">{method.title}</h3>
                <p className="contact-method-value">{method.value}</p>
                <p className="contact-method-description">{method.description}</p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Introduction Section */}
      <div className="enhanced-card-2030 mb-8 stagger-item" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4 mb-4">
          <Info className="w-6 h-6 text-cyber-neon flex-shrink-0 mt-1" />
          <div>
            <h2 className="section-title mb-3">كيف يمكننا مساعدتك؟</h2>
            <p className="content-paragraph">
              نحن هنا للإجابة على جميع استفساراتك ومساعدتك في أي مشكلة قد تواجهها. 
              يمكنك التواصل معنا من خلال نموذج الاتصال أدناه أو عبر البريد الإلكتروني. 
              نسعى للرد على جميع الرسائل في أقرب وقت ممكن.
            </p>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="contact-note-box-2030 mb-8 stagger-item" style={{ animationDelay: '0.3s' }}>
        <div className="contact-note-header-2030">
          <AlertCircle className="w-5 h-5" />
          <span className="contact-note-label-2030">ملاحظة مهمة</span>
        </div>
        <p className="contact-note-text-2030">
          في بعض الحالات، قد نحتاج للتواصل معك عبر البريد الإلكتروني الذي توفره لنا. 
          يرجى التأكد من استخدام بريد إلكتروني صالح ومراجعة صندوق الوارد (والمجلدات الأخرى) بانتظام.
        </p>
      </div>

      {/* Contact Form */}
      {formEnabled && (
        <div className="contact-form-wrapper-2030 stagger-item" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title mb-6 text-center">أرسل لنا رسالة</h2>
          
          <form className="contact-form-2030" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="contact-field-group-2030">
              <label htmlFor="name" className="contact-field-label-2030">
                <User className="w-5 h-5" />
                <span>الاسم الكامل</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-2030"
              />
            </div>

            {/* Email Field */}
            <div className="contact-field-group-2030">
              <label htmlFor="email" className="contact-field-label-2030">
                <Mail className="w-5 h-5" />
                <span>البريد الإلكتروني</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-2030"
              />
            </div>

            {/* Subject Field */}
            <div className="contact-field-group-2030">
              <label htmlFor="subject" className="contact-field-label-2030">
                <MessageCircle className="w-5 h-5" />
                <span>الموضوع</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input-2030"
              >
                <option value="">اختر موضوع الرسالة</option>
                {(pageData?.formSettings?.subjects || ['support', 'suggestion', 'complaint', 'partnership', 'other']).map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'support' ? 'طلب دعم فني' :
                     subject === 'suggestion' ? 'اقتراح' :
                     subject === 'complaint' ? 'شكوى' :
                     subject === 'partnership' ? 'شراكة' : 'أخرى'}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Field */}
            <div className="contact-field-group-2030">
              <label htmlFor="message" className="contact-field-label-2030">
                <MessageCircle className="w-5 h-5" />
                <span>نص الرسالة</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={8}
                placeholder="اكتب رسالتك هنا... نرجو أن تكون واضحة ومفصلة قدر الإمكان"
                value={formData.message}
                onChange={handleChange}
                required
                className="input-2030"
                style={{ minHeight: '200px', resize: 'vertical' }}
              />
              <p className="contact-field-hint">الحد الأدنى: {minMessageLength} حرف</p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="button-2030 contact-submit-button-2030"
              disabled={isSubmitting || formData.message.length < minMessageLength}
            >
              {isSubmitting ? (
                <>
                  <div className="form-spinner"></div>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>إرسال الرسالة</span>
                </>
              )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="contact-status-message-2030 success">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <strong>تم الإرسال بنجاح!</strong>
                  <p>شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="contact-status-message-2030 error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <strong>حدث خطأ</strong>
                  <p>لم يتم إرسال رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا عبر البريد الإلكتروني.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Response Time Info */}
      <div className="enhanced-card-2030 mt-8 stagger-item" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-start gap-4">
          <Clock className="w-6 h-6 text-cyber-neon flex-shrink-0 mt-1" />
          <div>
            <h3 className="subsection-title mb-2">وقت الاستجابة</h3>
            <p className="content-paragraph">
              نسعى للرد على جميع الرسائل خلال <strong className="text-cyber-neon">24-48 ساعة</strong> خلال أيام العمل. 
              في حالات الطوارئ، يرجى التواصل معنا مباشرة عبر البريد الإلكتروني.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
