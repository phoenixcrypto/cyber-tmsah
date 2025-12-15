'use client'

import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'

export default function AdminBrandingPage() {
  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الشعار والهوية</h1>
          <p className="admin-page-description">إدارة الشعار والألوان الأساسية</p>
        </div>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div className="stat-label" style={{ marginTop: '1rem' }}>الهوية البصرية</div>
        <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
          <p>سيتم إضافة إدارة الشعار والهوية قريباً</p>
        </div>
      </div>
    </div>
  )
}

