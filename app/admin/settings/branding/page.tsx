'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Save, RefreshCw, Upload, X } from 'lucide-react'

interface BrandingSettings {
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  siteName: string
  siteTagline: string
}

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<BrandingSettings>({
    logo: '',
    favicon: '',
    primaryColor: '#ff3b40',
    secondaryColor: '#1a1a1a',
    accentColor: '#00ff88',
    siteName: 'Cyber TMSAH',
    siteTagline: 'المنصة الأكاديمية الشاملة',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Fetch current branding settings
    const fetchSettings = async () => {
      try {
        // TODO: Implement API endpoint
      } catch (error) {
        console.error('Error fetching branding settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleImageUpload = async (type: 'logo' | 'favicon', file: File) => {
    try {
      setUploading(true)
      // TODO: Implement image upload to Firebase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSettings({ ...settings, [type]: result })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save branding settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ إعدادات الهوية البصرية بنجاح')
    } catch (error) {
      console.error('Error saving branding settings:', error)
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
          <h1 className="admin-page-title">الشعار والهوية البصرية</h1>
          <p className="admin-page-description">إدارة الشعار والألوان والهوية البصرية للموقع</p>
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
        {/* Logo & Favicon */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">الشعار والرمز</div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">شعار الموقع</label>
              <div className="flex items-center gap-4">
                {settings.logo && (
                  <div className="relative">
                    <img src={settings.logo} alt="Logo" className="w-32 h-32 object-contain bg-cyber-dark/50 rounded-lg p-2" />
                    <button
                      onClick={() => setSettings({ ...settings, logo: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="admin-page-action-btn cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>رفع شعار</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload('logo', file)
                    }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">رمز الموقع (Favicon)</label>
              <div className="flex items-center gap-4">
                {settings.favicon && (
                  <div className="relative">
                    <img src={settings.favicon} alt="Favicon" className="w-16 h-16 object-contain bg-cyber-dark/50 rounded-lg p-2" />
                    <button
                      onClick={() => setSettings({ ...settings, favicon: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="admin-page-action-btn cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>رفع رمز</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload('favicon', file)
                    }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">الألوان الأساسية</div>
          <div className="space-y-4">
            {Object.entries({
              primaryColor: 'اللون الأساسي',
              secondaryColor: 'اللون الثانوي',
              accentColor: 'لون التمييز',
            }).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-dark-200 mb-2">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings[key as keyof BrandingSettings] as string}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-16 h-16 rounded-lg border-2 border-cyber-neon/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings[key as keyof BrandingSettings] as string}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="admin-navbar-search-input flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Site Identity */}
        <motion.div
          className="stat-card col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="stat-label mb-4">هوية الموقع</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">اسم الموقع</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">شعار الموقع (Tagline)</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

