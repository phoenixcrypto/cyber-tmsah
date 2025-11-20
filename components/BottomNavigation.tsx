'use client'

import Link from 'next/link'
import { Home, Calendar, BookOpen, Library, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function BottomNavigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState(false)

  const primaryLinks = [
    { label: t('nav.schedule'), href: '/schedule', icon: Calendar },
    { label: t('nav.materials'), href: '/materials', icon: BookOpen },
  ]

  const resourcesDropdown = {
    label: t('nav.resources'),
    icon: Library,
    items: [
      { label: t('nav.courses'), href: '/courses' },
      { label: t('nav.books'), href: '/books' },
      { label: t('nav.videos'), href: '/videos' },
      { label: t('nav.podcasts'), href: '/podcasts' },
      { label: t('nav.platforms'), href: '/platforms' },
    ],
  }

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

        <div 
          className="bottom-nav-item bottom-nav-dropdown"
          onMouseEnter={() => setActiveDropdown(true)}
          onMouseLeave={() => setActiveDropdown(false)}
        >
          <button 
            className="bottom-nav-dropdown-btn"
            onClick={() => setActiveDropdown(!activeDropdown)}
          >
            <Library className="bottom-nav-icon" />
            <span className="bottom-nav-label">{resourcesDropdown.label}</span>
            <ChevronDown className={`bottom-nav-chevron ${activeDropdown ? 'rotated' : ''}`} />
          </button>
          {activeDropdown && (
            <div className="bottom-nav-dropdown-menu">
              {resourcesDropdown.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`bottom-nav-dropdown-item ${isActive(item.href) ? 'active' : ''}`}
                  prefetch={false}
                  onClick={() => setActiveDropdown(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
