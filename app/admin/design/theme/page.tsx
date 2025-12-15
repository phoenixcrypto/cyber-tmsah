'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Save } from 'lucide-react'

export default function AdminThemePage() {
  const [theme, setTheme] = useState({
    primaryColor: '#ff3b40',
    secondaryColor: '#1a1a1a',
    accentColor: '#00ff88',
    backgroundColor: '#0a0a0a',
  })

  const handleSave = async () => {
    try {
      // TODO: Implement API endpoint to save theme
      alert('سيتم حفظ الألوان قريباً')
    } catch (error) {
      console.error('Error saving theme:', error)
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
          <h1 className="admin-page-title">الألوان والثيم</h1>
          <p className="admin-page-description">تعديل ألوان الموقع والثيمات</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="w-5 h-5" />
          <span>حفظ التغييرات</span>
        </motion.button>
      </motion.div>

      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        {Object.entries(theme).map(([key, value], index) => (
          <motion.div
            key={key}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
              <Palette className="w-8 h-8" />
            </div>
            <div className="stat-label" style={{ marginTop: '1rem' }}>
              {key === 'primaryColor' ? 'اللون الأساسي' :
               key === 'secondaryColor' ? 'اللون الثانوي' :
               key === 'accentColor' ? 'لون التمييز' :
               'لون الخلفية'}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="color"
                value={value}
                onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                style={{ width: '60px', height: '60px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                className="admin-navbar-search-input"
                style={{ flex: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

