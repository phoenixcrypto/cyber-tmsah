'use client'

import { motion } from 'framer-motion'
import { Type } from 'lucide-react'

export default function AdminFontsPage() {
  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الخطوط</h1>
          <p className="admin-page-description">إدارة الخطوط المستخدمة في الموقع</p>
        </div>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
          <Type className="w-8 h-8" />
        </div>
        <div className="stat-label" style={{ marginTop: '1rem' }}>الخطوط الحالية</div>
        <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
          <p>سيتم إضافة إدارة الخطوط قريباً</p>
        </div>
      </div>
    </div>
  )
}

