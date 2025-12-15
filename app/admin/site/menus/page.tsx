'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function AdminMenusPage() {
  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">القوائم والروابط</h1>
          <p className="admin-page-description">إدارة القوائم والروابط في الموقع</p>
        </div>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
          <FileText className="w-8 h-8" />
        </div>
        <div className="stat-label" style={{ marginTop: '1rem' }}>إدارة القوائم</div>
        <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
          <p>سيتم إضافة إدارة القوائم والروابط قريباً</p>
        </div>
      </div>
    </div>
  )
}

