'use client'

import { motion } from 'framer-motion'
import { Bell, Mail, Smartphone, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { getAdminBasePath } from '@/lib/utils/admin-path'
import Link from 'next/link'

const channels = [
  {
    label: 'البريد الإلكتروني',
    description: 'إرسال رسائل إعادة التعيين والإشعارات الدورية',
    status: 'مفعل جزئياً',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
    enabled: true,
  },
  {
    label: 'إشعارات المتصفح',
    description: 'دعم Web Push للمستخدمين المسجلين',
    status: 'قريباً',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    enabled: false,
  },
  {
    label: 'رسائل واتساب',
    description: 'تكامل مع واجهات WhatsApp Business',
    status: 'قيد الدراسة',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    enabled: false,
  },
]

export default function AdminNotificationsPage() {
  const basePath = getAdminBasePath()

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">مركز الإشعارات</h1>
          <p className="admin-page-description">إدارة قنوات الإبلاغ للمستخدمين والمشرفين</p>
        </div>
        <Link href={`${basePath}/settings`}>
          <motion.button
            className="admin-page-action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span>ضبط خدمة البريد</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Notification Channels Grid */}
      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {channels.map((channel, index) => {
          const Icon = channel.icon
          return (
            <motion.div
              key={channel.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`stat-icon bg-gradient-to-br ${channel.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="stat-label" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {channel.label}
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                {channel.description}
              </div>
              <div className={`admin-badge ${channel.enabled ? '' : 'opacity-50'}`} style={{ marginTop: '0.5rem' }}>
                {channel.status}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Info Message */}
      <motion.div
        className="admin-empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '2rem', background: 'rgba(255, 59, 64, 0.1)', border: '1px solid rgba(255, 59, 64, 0.3)', borderRadius: '12px', padding: '2rem' }}
      >
        <Bell className="w-12 h-12 mb-4 opacity-50" />
        <p style={{ fontSize: '1rem', color: 'var(--dark-200)' }}>
          يمكنك مزامنة الأحداث مع خدمات خارجية مثل Resend أو Firebase من صفحة الإعدادات.
        </p>
      </motion.div>
    </div>
  )
}
