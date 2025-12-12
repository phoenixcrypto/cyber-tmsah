'use client'

import { motion } from 'framer-motion'
import { HelpCircle, Book, ExternalLink, Github, FileText, Database } from 'lucide-react'
import Link from 'next/link'

const resources = [
  {
    label: 'دليل النشر على Vercel',
    href: 'https://github.com/phoenixcrypto/cyber-tmsah',
    icon: ExternalLink,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'إرشادات قاعدة البيانات',
    href: 'https://github.com/phoenixcrypto/cyber-tmsah',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'مستودع GitHub',
    href: 'https://github.com/phoenixcrypto/cyber-tmsah',
    icon: Github,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'وثائق Prisma',
    href: 'https://www.prisma.io/docs',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
  },
  {
    label: 'وثائق Next.js',
    href: 'https://nextjs.org/docs',
    icon: Book,
    color: 'from-indigo-500 to-blue-500',
  },
]

export default function AdminHelpPage() {
  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">مركز المساعدة</h1>
          <p className="admin-page-description">مصادر سريعة لحل المشاكل التقنية وإدارة البنية التحتية</p>
        </div>
      </motion.div>

      {/* Help Resources Grid */}
      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {resources.map((resource, index) => {
          const Icon = resource.icon
          return (
            <Link
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className={`stat-icon bg-gradient-to-br ${resource.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="stat-label" style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1rem' }}>
                  {resource.label}
                </div>
                <div className="stat-label" style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>
                  انقر للفتح
                </div>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        className="admin-empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '2rem', background: 'rgba(255, 59, 64, 0.1)', border: '1px solid rgba(255, 59, 64, 0.3)', borderRadius: '12px', padding: '2rem' }}
      >
        <HelpCircle className="w-12 h-12 mb-4 opacity-50" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-white)' }}>
          نصائح سريعة
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--dark-200)' }}>
          <li>• استخدم لوحة التحكم لإدارة جميع المحتويات بدون الحاجة لتعديل الكود</li>
          <li>• جميع التغييرات يتم حفظها مباشرة في قاعدة البيانات</li>
          <li>• يمكنك إضافة، تعديل، وحذف أي محتوى من خلال الواجهة</li>
          <li>• استخدم محرر Rich Text لإنشاء محتوى غني ومتقدم</li>
        </ul>
      </motion.div>
    </div>
  )
}
