'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Shield, Database, Bell, Save, Key, RefreshCw } from 'lucide-react'

interface SettingsData {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    contactEmail: string
    adminPath: string
  }
  auth: {
    jwtSecret: string
    jwtRefreshSecret: string
    sessionDuration: number
    maxLoginAttempts: number
  }
  integrations: {
    resendApiKey: string
    googleAnalyticsId: string
    firebaseProjectId: string
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    lastBackup: string
  }
  notifications: {
    emailNotifications: boolean
    systemNotifications: boolean
    notificationEmail: string
  }
}

export default function AdminSettingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: 'Cyber TMSAH',
      siteDescription: 'المنصة الأكاديمية الشاملة',
      siteUrl: 'https://www.cyber-tmsah.site',
      contactEmail: 'info@cyber-tmsah.site',
      adminPath: 'admin',
    },
    auth: {
      jwtSecret: '••••••••••••••••',
      jwtRefreshSecret: '••••••••••••••••',
      sessionDuration: 24,
      maxLoginAttempts: 5,
    },
    integrations: {
      resendApiKey: '••••••••••••••••',
      googleAnalyticsId: '',
      firebaseProjectId: 'cyber-tmsah',
    },
    backup: {
      autoBackup: false,
      backupFrequency: 'daily',
      lastBackup: 'لم يتم إنشاء نسخة احتياطية',
    },
    notifications: {
      emailNotifications: true,
      systemNotifications: true,
      notificationEmail: 'admin@cyber-tmsah.site',
    },
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch current settings from API
    const fetchSettings = async () => {
      try {
        // TODO: Implement API endpoint to fetch settings
        // For now, use defaults
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('تم حفظ الإعدادات بنجاح')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const settingsCategories = [
    {
      id: 'general',
      title: 'إعدادات عامة',
      description: 'اسم الموقع، الشعار، الروابط الأساسية',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'auth',
      title: 'المصادقة والأمان',
      description: 'إدارة كلمات المرور، سياسات تسجيل الدخول، الجلسات',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'integrations',
      title: 'التكاملات',
      description: 'مفاتيح API، Google Analytics، Firebase',
      icon: Key,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'backup',
      title: 'النسخ الاحتياطي',
      description: 'جدولة النسخ الاحتياطي للبيانات واستعادتها',
      icon: Database,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      description: 'إعدادات الإشعارات والتذكيرات',
      icon: Bell,
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">اسم الموقع</label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">وصف الموقع</label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteDescription: e.target.value } })}
                className="admin-navbar-search-input w-full min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">رابط الموقع</label>
              <input
                type="url"
                value={settings.general.siteUrl}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteUrl: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">بريد الاتصال</label>
              <input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, contactEmail: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مسار لوحة التحكم</label>
              <input
                type="text"
                value={settings.general.adminPath}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, adminPath: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        )
      case 'auth':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مفتاح JWT</label>
              <input
                type="password"
                value={settings.auth.jwtSecret}
                onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, jwtSecret: e.target.value } })}
                className="admin-navbar-search-input w-full"
                placeholder="سيتم عرضه كـ ****"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مفتاح JWT للتحديث</label>
              <input
                type="password"
                value={settings.auth.jwtRefreshSecret}
                onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, jwtRefreshSecret: e.target.value } })}
                className="admin-navbar-search-input w-full"
                placeholder="سيتم عرضه كـ ****"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مدة الجلسة (ساعة)</label>
              <input
                type="number"
                value={settings.auth.sessionDuration}
                onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, sessionDuration: parseInt(e.target.value) || 24 } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">الحد الأقصى لمحاولات تسجيل الدخول</label>
              <input
                type="number"
                value={settings.auth.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, maxLoginAttempts: parseInt(e.target.value) || 5 } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        )
      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">مفتاح Resend API</label>
              <input
                type="password"
                value={settings.integrations.resendApiKey}
                onChange={(e) => setSettings({ ...settings, integrations: { ...settings.integrations, resendApiKey: e.target.value } })}
                className="admin-navbar-search-input w-full"
                placeholder="سيتم عرضه كـ ****"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">معرف Google Analytics</label>
              <input
                type="text"
                value={settings.integrations.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, integrations: { ...settings.integrations, googleAnalyticsId: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">معرف مشروع Firebase</label>
              <input
                type="text"
                value={settings.integrations.firebaseProjectId}
                onChange={(e) => setSettings({ ...settings, integrations: { ...settings.integrations, firebaseProjectId: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        )
      case 'backup':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">النسخ الاحتياطي التلقائي</label>
                <p className="text-sm text-dark-400">إنشاء نسخ احتياطية تلقائية للبيانات</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, backup: { ...settings.backup, autoBackup: !settings.backup.autoBackup } })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.backup.autoBackup ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.backup.autoBackup ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">تكرار النسخ الاحتياطي</label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backup: { ...settings.backup, backupFrequency: e.target.value } })}
                className="admin-navbar-search-input w-full"
              >
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">آخر نسخة احتياطية</label>
              <p className="text-dark-300">{settings.backup.lastBackup}</p>
              <button
                onClick={() => alert('سيتم إنشاء نسخة احتياطية قريباً')}
                className="mt-2 admin-page-action-btn"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إنشاء نسخة احتياطية الآن</span>
              </button>
            </div>
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">إشعارات البريد الإلكتروني</label>
                <p className="text-sm text-dark-400">إرسال إشعارات عبر البريد الإلكتروني</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, emailNotifications: !settings.notifications.emailNotifications } })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.notifications.emailNotifications ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.notifications.emailNotifications ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">إشعارات النظام</label>
                <p className="text-sm text-dark-400">عرض إشعارات في لوحة التحكم</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, systemNotifications: !settings.notifications.systemNotifications } })}
                className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                  settings.notifications.systemNotifications ? 'switch-track--active' : 'switch-track--inactive'
                } switch-track`}
              >
                <span
                  className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                    settings.notifications.systemNotifications ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                  }`}
                  style={{ top: '2px', left: '2px' }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">بريد الإشعارات</label>
              <input
                type="email"
                value={settings.notifications.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, notificationEmail: e.target.value } })}
                className="admin-navbar-search-input w-full"
              />
            </div>
          </div>
        )
      default:
        return null
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
          <h1 className="admin-page-title">الإعدادات المتقدمة</h1>
          <p className="admin-page-description">تعديل إعدادات المنصة والتحكم في الخدمات المتصلة</p>
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
        {/* Categories Sidebar */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-label mb-4">الفئات</div>
          <div className="space-y-2">
            {settingsCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border-2 border-cyber-neon/50'
                      : 'bg-cyber-dark/30 border-2 border-transparent hover:border-cyber-neon/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-right flex-1">
                    <div className="font-semibold text-dark-100">{category.title}</div>
                    <div className="text-xs text-dark-400">{category.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          className="stat-card col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-label mb-6">
            {settingsCategories.find(c => c.id === activeCategory)?.title}
          </div>
          {renderSettingsContent()}
        </motion.div>
      </div>
    </div>
  )
}
