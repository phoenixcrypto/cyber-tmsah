'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save } from 'lucide-react'

export default function AdminSiteGeneralPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Cyber TMSAH',
    siteDescription: 'المنصة الأكاديمية الشاملة',
    siteUrl: 'https://www.cyber-tmsah.site',
    contactEmail: 'info@cyber-tmsah.site',
  })

  const handleSave = async () => {
    try {
      // TODO: Implement API endpoint to save site settings
      alert('سيتم حفظ الإعدادات قريباً')
    } catch (error) {
      console.error('Error saving site settings:', error)
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
          <h1 className="admin-page-title">الإعدادات العامة</h1>
          <p className="admin-page-description">إدارة الإعدادات الأساسية للموقع</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="w-5 h-5" />
          <span>حفظ الإعدادات</span>
        </motion.button>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
          <Settings className="w-8 h-8" />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          {Object.entries(siteSettings).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-300)' }}>
                {key === 'siteName' ? 'اسم الموقع' :
                 key === 'siteDescription' ? 'وصف الموقع' :
                 key === 'siteUrl' ? 'رابط الموقع' :
                 'بريد الاتصال'}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setSiteSettings({ ...siteSettings, [key]: e.target.value })}
                className="admin-navbar-search-input"
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

