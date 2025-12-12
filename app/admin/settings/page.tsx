'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Shield, Database, Bell, Save } from 'lucide-react'

const settingsCategories = [
  {
    id: 'general',
    title: 'إعدادات عامة',
    description: 'اسم الموقع، الشعار، الروابط الأساسية',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'auth',
    title: 'المصادقة',
    description: 'إدارة كلمات المرور، سياسات تسجيل الدخول، الجلسات',
    icon: Shield,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'integrations',
    title: 'التكاملات',
    description: 'مفاتيح Resend، Google Analytics، وواجهات الدفع',
    icon: Settings,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'backup',
    title: 'النسخ الاحتياطي',
    description: 'جدولة النسخ الاحتياطي للبيانات واستعادتها',
    icon: Database,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'notifications',
    title: 'الإشعارات',
    description: 'إعدادات الإشعارات والتذكيرات',
    icon: Bell,
    color: 'from-indigo-500 to-blue-500',
  },
]

export default function AdminSettingsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الإعدادات المتقدمة</h1>
          <p className="admin-page-description">تعديل إعدادات المنصة والتحكم في الخدمات المتصلة</p>
        </div>
      </motion.div>

      {/* Settings Categories Grid */}
      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {settingsCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.id}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`stat-icon bg-gradient-to-br ${category.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="stat-label" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {category.title}
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {category.description}
              </div>
              {activeCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 59, 64, 0.2)' }}
                >
                  <p style={{ color: 'var(--dark-300)', fontSize: '0.875rem' }}>
                    سيتم إضافة واجهة الإعدادات الكاملة قريباً
                  </p>
                </motion.div>
              )}
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
        <Settings className="w-12 h-12 mb-4 opacity-50" />
        <p style={{ fontSize: '1rem', color: 'var(--dark-200)' }}>
          واجهة الإعدادات الكاملة قيد التطوير. سيتم إضافة جميع خيارات التعديل بدون الحاجة لتعديل الكود.
        </p>
      </motion.div>
    </div>
  )
}
