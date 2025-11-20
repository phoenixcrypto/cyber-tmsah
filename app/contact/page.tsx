'use client'

import { MessageCircle, Mail, Send, MapPin, Clock, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
            subject: '',
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

  const contactMethods = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'support@cyber-tmsah.com',
      href: 'mailto:support@cyber-tmsah.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Github,
      title: 'GitHub',
      value: 'phoenixcrypto',
      href: 'https://github.com/phoenixcrypto',
      color: 'from-gray-600 to-gray-800'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'Cyber TMSAH',
      href: 'https://www.linkedin.com',
      color: 'from-blue-600 to-blue-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              {t('contact.title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
            {t('contact.description')}
          </p>
          <p className="text-base text-dark-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            نحن هنا لمساعدتك في أي استفسار أو اقتراح. فريقنا متاح للرد على استفساراتك في أقرب وقت ممكن.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="enhanced-card p-6">
              <h3 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyber-neon" />
                طرق التواصل
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <Link
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-surface-2 to-surface-3 border border-border-dark hover:border-cyber-neon transition-all duration-300">
                        <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-dark-400 mb-1">{method.title}</p>
                          <p className="text-dark-100 font-semibold truncate">{method.value}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="enhanced-card p-6">
              <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyber-neon" />
                أوقات الاستجابة
              </h3>
              <div className="space-y-3 text-dark-300">
                <p className="flex items-center justify-between">
                  <span>الأيام العادية</span>
                  <span className="text-cyber-neon font-semibold">24-48 ساعة</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>الاستفسارات العاجلة</span>
                  <span className="text-cyber-neon font-semibold">12-24 ساعة</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="enhanced-card p-8 animate-slide-up">
              <form className="contact-form-modern" onSubmit={handleSubmit}>
                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label htmlFor="name" className="form-label-modern">
                      {t('contact.name')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input-modern"
                    />
                  </div>
                  <div className="form-group-modern">
                    <label htmlFor="email" className="form-label-modern">
                      {t('contact.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input-modern"
                    />
                  </div>
                </div>

                <div className="form-group-modern">
                  <label htmlFor="subject" className="form-label-modern">
                    {t('contact.subject')}
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={t('contact.subjectPlaceholder')}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input-modern"
                  />
                </div>

                <div className="form-group-modern">
                  <label htmlFor="message" className="form-label-modern">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea-modern"
                  />
                </div>

                <button 
                  type="submit" 
                  className="form-submit-button-modern"
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
                      <span>{t('contact.send')}</span>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="form-success-message">
                    ✓ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="form-error-message">
                    ✗ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
