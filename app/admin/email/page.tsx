'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Inbox } from 'lucide-react'

export default function AdminEmailPage() {
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: process.env['NEXT_PUBLIC_FROM_EMAIL'] || '',
    contactEmail: process.env['NEXT_PUBLIC_CONTACT_EMAIL'] || '',
    resendApiKey: '',
  })

  const handleSave = async () => {
    try {
      // TODO: Implement API endpoint to save email settings
      alert('سيتم حفظ الإعدادات قريباً')
    } catch (error) {
      console.error('Error saving email settings:', error)
      alert('حدث خطأ أثناء الحفظ')
    }
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">البريد الإلكتروني</h1>
          <p className="admin-page-description">إدارة إعدادات البريد الإلكتروني</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-5 h-5" />
          <span>حفظ الإعدادات</span>
        </motion.button>
      </motion.div>

      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Mail className="w-8 h-8" />
          </div>
          <div className="stat-label" style={{ marginTop: '1rem' }}>إعدادات البريد</div>
          <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>البريد المرسل منه:</label>
              <input
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                className="admin-navbar-search-input"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>بريد الاتصال:</label>
              <input
                type="email"
                value={emailSettings.contactEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, contactEmail: e.target.value })}
                className="admin-navbar-search-input"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>مفتاح Resend API:</label>
              <input
                type="password"
                value={emailSettings.resendApiKey}
                onChange={(e) => setEmailSettings({ ...emailSettings, resendApiKey: e.target.value })}
                className="admin-navbar-search-input"
                style={{ width: '100%' }}
                placeholder="سيتم عرضه كـ ****"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="stat-label" style={{ marginTop: '1rem' }}>حالة الخدمة</div>
          <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
              <span>Resend API متصل</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>
              يمكنك إرسال البريد الإلكتروني من خلال النظام
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

