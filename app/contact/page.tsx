'use client'

import { MessageCircle, Mail, Send, User, Info } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            message: ''
          })
          setSubmitStatus('idle')
        }, 3000)
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

  return (
    <div className="contact-page-2026">
      {/* Unified Page Header */}
      <PageHeader 
        title={t('contact.title')} 
        icon={MessageCircle}
      />

      {/* Main Content */}
      <div className="contact-content-wrapper">
        <div className="contact-intro-section">
          <p className="contact-greeting">عملائنا الكرام،</p>
          <p className="contact-intro-text">
            لتقديم الشكاوى، وللاستفسار عن المشاكل التي تواجهونها أثناء تصفح المدونة، وكذلك لتقديم الاقتراحات التي ستساعدنا على تطوير المدونة وتحسين محتوانا نحو الأفضل، يمكنكم التواصل معنا من خلال نموذج الاتصال الموجود في الأسفل.
          </p>
        </div>

        {/* Important Note Box */}
        <div className="contact-note-box">
          <div className="contact-note-header">
            <Info className="w-5 h-5" />
            <span className="contact-note-label">ملاحظة</span>
          </div>
          <p className="contact-note-text">
            في بعض الحالات لنتمكن من تلبية طلباتكم أو حل مشاكلكم قد نضطر للتواصل معكم عبر البريد الإلكتروني الذي تضعونه لنا في النموذج، لذلك نرجو منكم استخدام بريد إلكتروني صالح.
          </p>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper-2026">
          <form className="contact-form-2026" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="contact-field-group">
              <label htmlFor="name" className="contact-field-label">
                <User className="w-4 h-4" />
                <span>الاسم</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="الاسم الأول الاسم الأخير"
                value={formData.name}
                onChange={handleChange}
                required
                className="contact-field-input"
              />
            </div>

            {/* Email Field */}
            <div className="contact-field-group">
              <label htmlFor="email" className="contact-field-label">
                <Mail className="w-4 h-4" />
                <span>البريد الإلكتروني</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-field-input"
              />
            </div>

            {/* Message Field */}
            <div className="contact-field-group">
              <label htmlFor="message" className="contact-field-label">
                <MessageCircle className="w-4 h-4" />
                <span>نص الرسالة</span>
                <span className="contact-required-asterisk">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="ضع هنا نص الرسالة التي تريد"
                value={formData.message}
                onChange={handleChange}
                required
                className="contact-field-textarea"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="contact-submit-button-2026"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="form-spinner"></div>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>إرسال</span>
                </>
              )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="contact-success-message-2026">
                ✓ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="contact-error-message-2026">
                ✗ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
