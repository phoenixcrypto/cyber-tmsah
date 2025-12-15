'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Type, Save, RefreshCw } from 'lucide-react'

interface Font {
  id: string
  name: string
  family: string
  category: 'sans-serif' | 'serif' | 'monospace' | 'display'
  weights: number[]
  isActive: boolean
}

export default function AdminFontsPage() {
  const [fonts, setFonts] = useState<Font[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      setLoading(true)
      // TODO: Implement API endpoint to fetch fonts
      // Default fonts
      setFonts([
        { id: '1', name: 'Cairo', family: 'Cairo, sans-serif', category: 'sans-serif', weights: [400, 600, 700], isActive: true },
        { id: '2', name: 'Inter', family: 'Inter, sans-serif', category: 'sans-serif', weights: [400, 500, 600, 700], isActive: true },
        { id: '3', name: 'Roboto Mono', family: 'Roboto Mono, monospace', category: 'monospace', weights: [400, 700], isActive: false },
      ])
    } catch (error) {
      console.error('Error fetching fonts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save fonts
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ إعدادات الخطوط بنجاح')
    } catch (error) {
      console.error('Error saving fonts:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleFont = (id: string) => {
    setFonts(fonts.map(font => 
      font.id === id ? { ...font, isActive: !font.isActive } : font
    ))
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الخطوط</h1>
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
          <h1 className="admin-page-title">إدارة الخطوط</h1>
          <p className="admin-page-description">إدارة الخطوط المستخدمة في الموقع</p>
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
        {fonts.map((font, index) => (
          <motion.div
            key={font.id}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <Type className="w-8 h-8" />
            </div>
            <div className="stat-label mb-4">{font.name}</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-dark-400 mb-2">العائلة</div>
                <div className="font-semibold text-dark-100" style={{ fontFamily: font.family }}>
                  {font.family}
                </div>
              </div>
              <div>
                <div className="text-sm text-dark-400 mb-2">الأوزان المتاحة</div>
                <div className="flex gap-2 flex-wrap">
                  {font.weights.map(weight => (
                    <span key={weight} className="px-2 py-1 bg-cyber-dark/50 rounded text-xs">
                      {weight}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-dark-400">الحالة</span>
                <button
                  onClick={() => handleToggleFont(font.id)}
                  className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                    font.isActive ? 'switch-track--active' : 'switch-track--inactive'
                  } switch-track`}
                >
                  <span
                    className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                      font.isActive ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                    }`}
                    style={{ top: '2px', left: '2px' }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
