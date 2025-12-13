'use client'

import Link from 'next/link'
import { Home, Calendar, BookOpen, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const { t } = useLanguage()
  const pathname = usePathname()

  const primaryLinks = [
    { label: t('nav.schedule'), href: '/schedule', icon: Calendar },
    { label: t('nav.materials'), href: '/materials', icon: BookOpen },
    { label: t('nav.downloads'), href: '/downloads', icon: Download },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bottom-navigation-modern">
      <div className="bottom-nav-container">
        <Link 
          href="/" 
          className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
          prefetch={false}
        >
          <Home className="bottom-nav-icon" />
          <span className="bottom-nav-label">{t('nav.home')}</span>
        </Link>

        {primaryLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item bottom-nav-primary ${isActive(item.href) ? 'active' : ''}`}
              prefetch={false}
            >
              <Icon className="bottom-nav-icon" />
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
