'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'

interface ContactMethod {
  id: string
  icon: string
  title: string
  value: string
  link?: string
  description: string
  order: number
}

interface ContactPage {
  title: string
  description: string
  contactMethods: ContactMethod[]
  formSettings: {
    enabled: boolean
    minMessageLength: number
    subjects: string[]
  }
}

export default function AdminContactPage() {
  const [page, setPage] = useState<ContactPage>({
    title: 'اتصل بنا',
    description: 'نحن هنا لمساعدتك',
    contactMethods: [],
    formSettings: {
      enabled: true,
      minMessageLength: 20,
      subjects: ['support', 'suggestion', 'complaint', 'partnership', 'other'],
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pages/contact')
      if (res.ok) {
        const data = await res.json()
        setPage(data.data.page || page)
      }
    } catch (error) {
      console.error('Error fetching contact page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/pages/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })

      if (res.ok) {
        alert('تم حفظ التغييرات بنجاح')
      } else {
        alert('حدث خطأ أثناء الحفظ')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة صفحة اتصل بنا</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة صفحة اتصل بنا</h1>
          <p className="admin-page-description">إدارة محتوى صفحة الاتصال وإعدادات النموذج</p>
        </div>
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
              <span>حفظ التغييرات</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Page Settings */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">إعدادات الصفحة</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">عنوان الصفحة</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="admin-navbar-search-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">وصف الصفحة</label>
            <textarea
              value={page.description}
              onChange={(e) => setPage({ ...page, description: e.target.value })}
              className="admin-navbar-search-input w-full min-h-[100px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Form Settings */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">إعدادات النموذج</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">تفعيل النموذج</label>
              <p className="text-sm text-dark-400">السماح للمستخدمين بإرسال الرسائل</p>
            </div>
            <button
              onClick={() => setPage({
                ...page,
                formSettings: { ...page.formSettings, enabled: !page.formSettings.enabled }
              })}
              className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                page.formSettings.enabled ? 'switch-track--active' : 'switch-track--inactive'
              } switch-track`}
            >
              <span
                className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                  page.formSettings.enabled ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                }`}
                style={{ top: '2px', left: '2px' }}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">الحد الأدنى لطول الرسالة</label>
            <input
              type="number"
              value={page.formSettings.minMessageLength}
              onChange={(e) => setPage({
                ...page,
                formSettings: { ...page.formSettings, minMessageLength: parseInt(e.target.value) || 20 }
              })}
              className="admin-navbar-search-input w-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

