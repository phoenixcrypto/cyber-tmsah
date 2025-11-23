'use client'

import { motion } from 'framer-motion'
import { Plus, Upload, Download, Settings, RefreshCw, Trash2 } from 'lucide-react'

interface QuickActionsProps {
  delay?: number
}

const quickActions = [
  { label: 'إضافة مستخدم', icon: Plus, color: 'from-blue-500 to-cyan-500' },
  { label: 'رفع ملف', icon: Upload, color: 'from-purple-500 to-pink-500' },
  { label: 'تنزيل تقرير', icon: Download, color: 'from-green-500 to-emerald-500' },
  { label: 'إعدادات سريعة', icon: Settings, color: 'from-orange-500 to-red-500' },
  { label: 'تحديث البيانات', icon: RefreshCw, color: 'from-cyan-500 to-blue-500' },
  { label: 'تنظيف النظام', icon: Trash2, color: 'from-red-500 to-pink-500' },
]

export default function QuickActions({ delay = 0 }: QuickActionsProps) {
  return (
    <motion.div
      className="admin-quick-actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="admin-quick-actions-bg"></div>
      <div className="admin-quick-actions-glow"></div>

      <div className="admin-quick-actions-header">
        <h3 className="admin-quick-actions-title">إجراءات سريعة</h3>
      </div>

      <div className="admin-quick-actions-grid">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              className="admin-quick-action-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`admin-quick-action-icon bg-gradient-to-br ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="admin-quick-action-label">{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

