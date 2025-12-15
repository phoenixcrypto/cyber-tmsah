'use client'

import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

export default function AdminSEOPage() {
  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">SEO</h1>
          <p className="admin-page-description">إعدادات محركات البحث والتحسين</p>
        </div>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="stat-label" style={{ marginTop: '1rem' }}>إعدادات SEO</div>
        <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
          <p>سيتم إضافة إعدادات SEO قريباً</p>
        </div>
      </div>
    </div>
  )
}

