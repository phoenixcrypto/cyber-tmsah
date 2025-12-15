'use client'

import { motion } from 'framer-motion'
import { Palette, Type, Layout, Image as ImageIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAdminBasePath } from '@/lib/utils/admin-path'

const designSections = [
  {
    id: 'theme',
    title: 'الألوان والثيم',
    description: 'تعديل ألوان الموقع والثيمات',
    icon: Palette,
    href: '/design/theme',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'fonts',
    title: 'الخطوط',
    description: 'إدارة الخطوط المستخدمة في الموقع',
    icon: Type,
    href: '/design/fonts',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'layout',
    title: 'التخطيط',
    description: 'تعديل تخطيط الصفحات والعناصر',
    icon: Layout,
    href: '/design/layout',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'media',
    title: 'الصور والوسائط',
    description: 'إدارة الصور والملفات الوسائطية',
    icon: ImageIcon,
    href: '/design/media',
    color: 'from-orange-500 to-red-500',
  },
]

export default function AdminDesignPage() {
  const basePath = getAdminBasePath()

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة التصميم</h1>
          <p className="admin-page-description">تعديل تصميم الموقع بالكامل</p>
        </div>
      </motion.div>

      <div className="admin-metrics-grid" style={{ marginTop: '2rem' }}>
        {designSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Link key={section.id} href={`${basePath}${section.href}`}>
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`stat-icon bg-gradient-to-br ${section.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="stat-label" style={{ marginTop: '1rem' }}>{section.title}</div>
                <div style={{ color: 'var(--dark-400)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {section.description}
                </div>
                <ArrowRight className="w-5 h-5 mt-4 opacity-50" style={{ margin: '1rem auto 0' }} />
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

