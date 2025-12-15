'use client'

import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'

export default function AdminMediaPage() {
  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الصور والوسائط</h1>
          <p className="admin-page-description">إدارة الصور والملفات الوسائطية</p>
        </div>
      </motion.div>

      <div className="stat-card" style={{ marginTop: '2rem' }}>
        <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div className="stat-label" style={{ marginTop: '1rem' }}>مكتبة الوسائط</div>
        <div style={{ marginTop: '1.5rem', color: 'var(--dark-300)' }}>
          <p>سيتم إضافة إدارة الوسائط قريباً</p>
        </div>
      </div>
    </div>
  )
}

