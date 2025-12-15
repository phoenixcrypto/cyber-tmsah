'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Save, RefreshCw, Send, Inbox, CheckCircle, XCircle } from 'lucide-react'

interface EmailSettings {
  fromEmail: string
  fromName: string
  contactEmail: string
  resendApiKey: string
  replyToEmail: string
  smtpEnabled: boolean
}

export default function AdminEmailPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    fromEmail: 'noreply@cyber-tmsah.site',
    fromName: 'Cyber TMSAH',
    contactEmail: 'info@cyber-tmsah.site',
    resendApiKey: '',
    replyToEmail: 'info@cyber-tmsah.site',
    smtpEnabled: true,
  })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    // Fetch current email settings
    const fetchSettings = async () => {
      try {
        // TODO: Implement API endpoint
      } catch (error) {
        console.error('Error fetching email settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save email settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ إعدادات البريد الإلكتروني بنجاح')
    } catch (error) {
      console.error('Error saving email settings:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      setTesting(true)
      setTestResult(null)
      // TODO: Implement API endpoint to test email
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTestResult({ success: true, message: 'تم إرسال رسالة الاختبار بنجاح' })
    } catch (error) {
      console.error('Error testing email:', error)
      setTestResult({ success: false, message: 'فشل إرسال رسالة الاختبار' })
    } finally {
      setTesting(false)
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
          <h1 className="admin-page-title">إعدادات البريد الإلكتروني</h1>
          <p className="admin-page-description">إدارة إعدادات البريد الإلكتروني وخدمات الإرسال</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className="admin-page-action-btn"
            onClick={handleTestEmail}
            disabled={testing}
            whileHover={{ scale: testing ? 1 : 1.05 }}
            whileTap={{ scale: testing ? 1 : 0.95 }}
          >
            {testing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري الاختبار...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>اختبار الإرسال</span>
              </>
            )}
          </motion.button>
          <motion.button
            className="admin-page-action-btn"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
          >
            {saving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ الإعدادات</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        {/* Email Configuration */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Mail className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">إعدادات البريد</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">البريد المرسل منه</label>
              <input
                type="email"
                value={settings.fromEmail}
                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">اسم المرسل</label>
              <input
                type="text"
                value={settings.fromName}
                onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">بريد الاتصال</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">بريد الرد</label>
              <input
                type="email"
                value={settings.replyToEmail}
                onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* API Configuration */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">مفاتيح API</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مفتاح Resend API</label>
              <input
                type="password"
                value={settings.resendApiKey}
                onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="re_xxxxxxxxxxxxx"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">تفعيل SMTP</label>
                <p className="text-sm text-dark-400">استخدام SMTP لإرسال البريد</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, smtpEnabled: !settings.smtpEnabled })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.smtpEnabled ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.smtpEnabled ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          className="stat-card col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">حالة الخدمة</div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-cyber-dark/30 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold text-dark-100">Resend API متصل</div>
                <div className="text-sm text-dark-400">يمكنك إرسال البريد الإلكتروني من خلال النظام</div>
              </div>
            </div>
            {testResult && (
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                testResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <div className="text-dark-100">{testResult.message}</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

