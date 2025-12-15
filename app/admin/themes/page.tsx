/**
 * Theme Manager Page - Admin Panel
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Download, Trash2, Check, X, RefreshCw } from 'lucide-react'
import { getAdminBasePath } from '@/lib/utils/admin-path'

interface Theme {
  name: string
  version: string
  description: string
  author: string
  active?: boolean
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const basePath = getAdminBasePath()

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/themes')
      const data = await response.json()

      if (data.success) {
        setThemes(data.data.themes.map((theme: Theme) => ({
          ...theme,
          active: theme.name === data.data.activeTheme,
        })))
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    } finally {
      setLoading(false)
    }
  }

  const activateTheme = async (themeName: string) => {
    try {
      setActivating(themeName)
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeName }),
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setThemes((prev) =>
          prev.map((theme) => ({
            ...theme,
            active: theme.name === themeName,
          }))
        )
      } else {
        alert('فشل تفعيل القالب')
      }
    } catch (error) {
      console.error('Error activating theme:', error)
      alert('حدث خطأ أثناء تفعيل القالب')
    } finally {
      setActivating(null)
    }
  }

  const deleteTheme = async (themeName: string) => {
    if (!confirm(`هل أنت متأكد من حذف القالب "${themeName}"؟`)) {
      return
    }

    try {
      const response = await fetch(`/api/themes/${themeName}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setThemes((prev) => prev.filter((theme) => theme.name !== themeName))
      } else {
        alert(data.error || 'فشل حذف القالب')
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
      alert('حدث خطأ أثناء حذف القالب')
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة القوالب</h1>
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
          <h1 className="admin-page-title">إدارة القوالب</h1>
          <p className="admin-page-description">
            تثبيت، تفعيل، وإدارة قوالب الموقع
          </p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={fetchThemes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          <span>تحديث</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {themes.map((theme, index) => (
          <motion.div
            key={theme.name}
            className="admin-section-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="admin-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className="stat-icon"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-red) 0%, var(--primary-red-strong) 100%)',
                  }}
                >
                  <Palette className="w-8 h-8" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary-white)' }}>
                    {theme.name}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--dark-300)', fontSize: '0.875rem' }}>
                    {theme.description}
                  </p>
                </div>
              </div>
              {theme.active && (
                <span
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  نشط
                </span>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              {!theme.active && (
                <motion.button
                  className="admin-section-action admin-section-action-primary"
                  onClick={() => activateTheme(theme.name)}
                  disabled={activating === theme.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activating === theme.name ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>تفعيل</span>
                </motion.button>
              )}

              {theme.name !== 'default' && (
                <motion.button
                  className="admin-section-action admin-section-action-secondary"
                  onClick={() => deleteTheme(theme.name)}
                  disabled={theme.active}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </motion.button>
              )}
            </div>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 59, 64, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                color: 'var(--dark-400)',
              }}
            >
              <span>الإصدار: {theme.version}</span>
              <span>المؤلف: {theme.author}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {themes.length === 0 && (
        <div className="admin-empty-state">
          <div className="admin-empty-state-glow"></div>
          <p>لا توجد قوالب مثبتة</p>
          <span className="admin-empty-hint">
            يمكنك تثبيت قوالب جديدة من خلال رفع ملف ZIP
          </span>
        </div>
      )}
    </div>
  )
}

