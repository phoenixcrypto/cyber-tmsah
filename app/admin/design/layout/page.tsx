'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layout, Save, RefreshCw, Monitor, Smartphone, Tablet } from 'lucide-react'

interface LayoutSettings {
  containerWidth: string
  sidebarWidth: string
  headerHeight: string
  footerHeight: string
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  breakpoints: {
    mobile: string
    tablet: string
    desktop: string
  }
}

export default function AdminLayoutPage() {
  const [settings, setSettings] = useState<LayoutSettings>({
    containerWidth: '1280px',
    sidebarWidth: '280px',
    headerHeight: '80px',
    footerHeight: '120px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
    },
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch current layout settings
    const fetchSettings = async () => {
      try {
        // TODO: Implement API endpoint
      } catch (error) {
        console.error('Error fetching layout settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save layout settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ إعدادات التخطيط بنجاح')
    } catch (error) {
      console.error('Error saving layout settings:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
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
          <h1 className="admin-page-title">إعدادات التخطيط</h1>
          <p className="admin-page-description">تعديل تخطيط الصفحات والعناصر</p>
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
              <span>حفظ الإعدادات</span>
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        {/* Main Layout */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <Layout className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">الأبعاد الرئيسية</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">عرض الحاوية</label>
              <input
                type="text"
                value={settings.containerWidth}
                onChange={(e) => setSettings({ ...settings, containerWidth: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">عرض القائمة الجانبية</label>
              <input
                type="text"
                value={settings.sidebarWidth}
                onChange={(e) => setSettings({ ...settings, sidebarWidth: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">ارتفاع الهيدر</label>
              <input
                type="text"
                value={settings.headerHeight}
                onChange={(e) => setSettings({ ...settings, headerHeight: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">ارتفاع الفوتر</label>
              <input
                type="text"
                value={settings.footerHeight}
                onChange={(e) => setSettings({ ...settings, footerHeight: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Spacing */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Layout className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">المسافات</div>
          <div className="space-y-3">
            {Object.entries(settings.spacing).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-dark-200 mb-2">{key.toUpperCase()}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setSettings({
                    ...settings,
                    spacing: { ...settings.spacing, [key]: e.target.value }
                  })}
                  className="admin-navbar-search-input w-full"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Breakpoints */}
        <motion.div
          className="stat-card col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Monitor className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">نقاط التوقف (Breakpoints)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-cyber-neon" />
                <label className="text-sm font-semibold text-dark-200">الجوال</label>
              </div>
              <input
                type="text"
                value={settings.breakpoints.mobile}
                onChange={(e) => setSettings({
                  ...settings,
                  breakpoints: { ...settings.breakpoints, mobile: e.target.value }
                })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tablet className="w-4 h-4 text-cyber-neon" />
                <label className="text-sm font-semibold text-dark-200">التابلت</label>
              </div>
              <input
                type="text"
                value={settings.breakpoints.tablet}
                onChange={(e) => setSettings({
                  ...settings,
                  breakpoints: { ...settings.breakpoints, tablet: e.target.value }
                })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-cyber-neon" />
                <label className="text-sm font-semibold text-dark-200">سطح المكتب</label>
              </div>
              <input
                type="text"
                value={settings.breakpoints.desktop}
                onChange={(e) => setSettings({
                  ...settings,
                  breakpoints: { ...settings.breakpoints, desktop: e.target.value }
                })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
