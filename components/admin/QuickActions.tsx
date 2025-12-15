'use client'

import { motion } from 'framer-motion'
import { Plus, Upload, Download, Settings, RefreshCw, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAdminBasePath } from '@/lib/utils/admin-path'

interface QuickActionsProps {
  delay?: number
}

export default function QuickActions({ delay = 0 }: QuickActionsProps) {
  const router = useRouter()
  const basePath = getAdminBasePath()

  const quickActions = [
    { 
      label: 'إضافة مستخدم', 
      icon: Plus, 
      color: 'from-blue-500 to-cyan-500',
      onClick: () => router.push(`${basePath}/users`)
    },
    { 
      label: 'رفع ملف', 
      icon: Upload, 
      color: 'from-purple-500 to-pink-500',
      onClick: () => router.push(`${basePath}/downloads`)
    },
    { 
      label: 'تنزيل تقرير', 
      icon: Download, 
      color: 'from-green-500 to-emerald-500',
      onClick: () => window.open('/api/admin/stats', '_blank')
    },
    { 
      label: 'إعدادات سريعة', 
      icon: Settings, 
      color: 'from-orange-500 to-red-500',
      onClick: () => router.push(`${basePath}/settings`)
    },
    { 
      label: 'تحديث البيانات', 
      icon: RefreshCw, 
      color: 'from-cyan-500 to-blue-500',
      onClick: () => window.location.reload()
    },
    { 
      label: 'تنظيف النظام', 
      icon: Trash2, 
      color: 'from-red-500 to-pink-500',
      onClick: () => {
        if (confirm('هل أنت متأكد من تنظيف النظام؟')) {
          alert('ميزة تنظيف النظام قيد التطوير')
        }
      }
    },
  ]
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
              onClick={action.onClick}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: delay + index * 0.1,
                type: "spring",
                stiffness: 150,
                damping: 12
              }}
              whileHover={{ scale: 1.08, y: -6 }}
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

