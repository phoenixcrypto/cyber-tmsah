'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Save, RefreshCw, Globe, FileText } from 'lucide-react'

interface SEOSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  ogTitle: string
  ogDescription: string
  twitterCard: string
  robotsIndex: boolean
  sitemapEnabled: boolean
  googleAnalyticsId: string
  googleSearchConsole: string
}

export default function AdminSEOPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    metaTitle: 'Cyber TMSAH | المنصة الأكاديمية الشاملة',
    metaDescription: 'منصة أكاديمية شاملة تقدم مواد دراسية، مقالات تعليمية، وجدول دراسي',
    metaKeywords: 'تعليم، أكاديمي، مواد دراسية، مقالات',
    ogImage: '',
    ogTitle: 'Cyber TMSAH',
    ogDescription: 'المنصة الأكاديمية الشاملة',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    sitemapEnabled: true,
    googleAnalyticsId: '',
    googleSearchConsole: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch current SEO settings
    const fetchSettings = async () => {
      try {
        // TODO: Implement API endpoint
      } catch (error) {
        console.error('Error fetching SEO settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save SEO settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ إعدادات SEO بنجاح')
    } catch (error) {
      console.error('Error saving SEO settings:', error)
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
          <h1 className="admin-page-title">إعدادات SEO</h1>
          <p className="admin-page-description">تحسين محركات البحث والظهور في نتائج البحث</p>
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
        {/* Meta Tags */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Search className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">Meta Tags</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">عنوان الصفحة (Title)</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="عنوان يظهر في نتائج البحث"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">الوصف (Description)</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="admin-navbar-search-input w-full min-h-[100px]"
                placeholder="وصف يظهر تحت العنوان في نتائج البحث"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">الكلمات المفتاحية</label>
              <input
                type="text"
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="كلمات مفتاحية مفصولة بفواصل"
              />
            </div>
          </div>
        </motion.div>

        {/* Open Graph */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Globe className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">Open Graph (Social Media)</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">صورة المشاركة</label>
              <input
                type="url"
                value={settings.ogImage}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="رابط الصورة"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">عنوان المشاركة</label>
              <input
                type="text"
                value={settings.ogTitle}
                onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">وصف المشاركة</label>
              <textarea
                value={settings.ogDescription}
                onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                className="admin-navbar-search-input w-full min-h-[80px]"
              />
            </div>
          </div>
        </motion.div>

        {/* Advanced Settings */}
        <motion.div
          className="stat-card col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <FileText className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">إعدادات متقدمة</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">فهرسة محركات البحث</label>
                <p className="text-sm text-dark-400">السماح لمحركات البحث بفهرسة الموقع</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, robotsIndex: !settings.robotsIndex })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.robotsIndex ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.robotsIndex ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">خريطة الموقع</label>
                <p className="text-sm text-dark-400">تفعيل خريطة الموقع (Sitemap)</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, sitemapEnabled: !settings.sitemapEnabled })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.sitemapEnabled ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.sitemapEnabled ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">معرف Google Analytics</label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">Google Search Console</label>
              <input
                type="text"
                value={settings.googleSearchConsole}
                onChange={(e) => setSettings({ ...settings, googleSearchConsole: e.target.value })}
                className="admin-navbar-search-input w-full"
                placeholder="Meta verification code"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

