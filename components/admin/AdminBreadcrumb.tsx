'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ChevronLeft } from 'lucide-react'

const breadcrumbMap: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/users': 'المستخدمين',
  '/admin/content': 'المحتوى',
  '/admin/content/materials': 'المواد الدراسية',
  '/admin/content/articles': 'المقالات',
  '/admin/content/pages': 'الصفحات',
  '/admin/content/news': 'الأخبار',
  '/admin/schedule': 'الجدول الدراسي',
  '/admin/downloads': 'التنزيلات',
  '/admin/analytics': 'الإحصائيات',
  '/admin/database': 'قاعدة البيانات',
  '/admin/security': 'الأمان',
  '/admin/notifications': 'الإشعارات',
  '/admin/settings': 'الإعدادات',
  '/admin/help': 'المساعدة',
}

export default function AdminBreadcrumb() {
  const pathname = usePathname()
  const paths = pathname?.split('/').filter(Boolean) || []

  const breadcrumbs = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/')
    const label = breadcrumbMap[href] || path
    return { href, label }
  })

  return (
    <motion.nav
      className="admin-breadcrumb"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ol className="admin-breadcrumb-list">
        <li className="admin-breadcrumb-item">
          <Link href="/admin" className="admin-breadcrumb-link">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="admin-breadcrumb-item">
            <ChevronLeft className="admin-breadcrumb-separator" />
            {index === breadcrumbs.length - 1 ? (
              <span className="admin-breadcrumb-current">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="admin-breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}

