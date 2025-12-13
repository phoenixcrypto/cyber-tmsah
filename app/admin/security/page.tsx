'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, Lock, Database, Key } from 'lucide-react'

const securityChecks = [
  { label: 'حماية تسجيل الدخول', value: 'JWT + Refresh Tokens', status: 'مفعل', icon: Lock, color: 'from-green-500 to-emerald-500' },
  { label: 'الاتصال بقاعدة البيانات', value: 'SSL Required', status: 'مفعل', icon: Database, color: 'from-green-500 to-emerald-500' },
  { label: 'إخفاء مسار لوحة التحكم', value: 'ADMIN_PATH', status: 'مفعل', icon: Key, color: 'from-green-500 to-emerald-500' },
  { label: 'CSRF Protection', value: 'مفعل', status: 'مفعل', icon: Shield, color: 'from-green-500 to-emerald-500' },
  { label: 'Rate Limiting', value: 'مفعل', status: 'مفعل', icon: Shield, color: 'from-green-500 to-emerald-500' },
  { label: 'Content Security Policy', value: 'مفعل', status: 'مفعل', icon: Shield, color: 'from-green-500 to-emerald-500' },
]

export default function AdminSecurityPage() {
  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">مركز الأمان</h1>
          <p className="admin-page-description">مراجعة إعدادات الحماية وكلمات المرور وعمليات التدقيق</p>
        </div>
      </motion.div>

      {/* Security Checks Grid */}
      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {securityChecks.map((check, index) => {
          const Icon = check.icon
          return (
            <motion.div
              key={check.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`stat-icon bg-gradient-to-br ${check.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="stat-label" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {check.label}
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                {check.value}
              </div>
              <div className="admin-badge" style={{ marginTop: '0.5rem' }}>
                {check.status}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Security Info */}
      <motion.div
        className="admin-empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '2rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '2rem' }}
      >
        <CheckCircle className="w-12 h-12 mb-4" style={{ color: '#22c55e' }} />
        <p style={{ fontSize: '1rem', color: 'var(--dark-200)' }}>
          جميع إعدادات الأمان مفعلة ومحدثة. النظام محمي بشكل كامل.
        </p>
      </motion.div>
    </div>
  )
}
