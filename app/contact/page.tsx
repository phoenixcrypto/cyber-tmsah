'use client'

import { MessageCircle, Mail } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              تواصل معنا
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto">
            لديك استفسار أو فكرة تطوير؟ يسعدنا سماعك. املأ النموذج التالي وسنعمل على الرد في أسرع وقت ممكن.
          </p>
        </div>

        {/* Contact Form */}
        <div className="enhanced-card p-8 animate-slide-up">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">الاسم الكامل</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="أدخل اسمك"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">الموضوع</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="كيف يمكننا مساعدتك؟"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">رسالتك</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="اكتب تفاصيل طلبك"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="form-submit-button">
              إرسال الرسالة
            </button>
          </form>

          <div className="contact-email-info">
            <Mail className="w-5 h-5" style={{ display: 'inline', marginLeft: '0.5rem' }} />
            أو راسلنا مباشرة عبر البريد: support@cyber-tmsah.com
          </div>
        </div>
      </div>
    </div>
  )
}

