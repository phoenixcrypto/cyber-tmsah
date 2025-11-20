'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Users, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'

export default function SidebarQuickLinks() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const quickLinks = [
    { label: t('nav.aboutPlatform'), href: '/about', icon: User },
    { label: t('nav.contact'), href: '/contact', icon: Mail },
    { label: t('nav.team'), href: '/team', icon: Users },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn-modern"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`sidebar-quick-links-modern ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-content-modern">
          <div className="sidebar-links-modern">
            {quickLinks.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`sidebar-link-modern ${active ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {active && (
                    <div className="sidebar-link-indicator">
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  )}
                  <Icon className="sidebar-link-icon" />
                  <span className="sidebar-link-text">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay-modern"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

