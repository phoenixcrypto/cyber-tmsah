'use client'

import { motion } from 'framer-motion'
import { Settings, BarChart3, Image as ImageIcon, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAdminBasePath } from '@/lib/utils/admin-path'

const siteSections = [
  {
    id: 'general',
    title: 'الإعدادات العامة',
    description: 'اسم الموقع، الوصف، الروابط الأساسية',
    icon: Settings,
    href: '/site/general',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'إعدادات محركات البحث والتحسين',
    icon: BarChart3,
    href: '/site/seo',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'branding',
    title: 'الشعار والهوية',
    description: 'إدارة الشعار والألوان الأساسية',
    icon: ImageIcon,
    href: '/site/branding',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'menus',
    title: 'القوائم والروابط',
    description: 'إدارة القوائم والروابط في الموقع',
    icon: FileText,
    href: '/site/menus',
    color: 'from-orange-500 to-red-500',
  },
]

export default function AdminSitePage() {
  const basePath = getAdminBasePath()

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة الموقع</h1>
          <p className="admin-page-description">إدارة إعدادات الموقع بالكامل</p>
        </div>
      </motion.div>

      <div className="admin-metrics-grid" style={{ marginTop: '2rem' }}>
        {siteSections.map((section, index) => {
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

