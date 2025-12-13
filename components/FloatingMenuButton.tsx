'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Calendar, BookOpen, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingMenuButton() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen(!open)
  const close = () => setOpen(false)

  const primaryLinks = [
    { label: t('nav.schedule'), href: '/schedule', icon: Calendar },
    { label: t('nav.materials'), href: '/materials', icon: BookOpen },
    { label: t('nav.downloads'), href: '/downloads', icon: Download },
  ]

  return (
    <>
      {/* Floating Menu Button */}
      <button
        className="floating-menu-btn"
        onClick={toggle}
        aria-label="القائمة"
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Panel */}
      <div className={open ? 'floating-mobile-menu-panel is-open' : 'floating-mobile-menu-panel'}>
        <ul>
          {/* Home Page First */}
          <li>
            <Link href="/" prefetch={false} className="nav-link nav-link-primary" onClick={close}>
              <Home className="w-5 h-5" />
              <span>{t('nav.home')}</span>
            </Link>
          </li>
          
          {/* Primary Sections */}
          {primaryLinks.map((item) => {
            const Icon = item.icon
            return (
              <li key={`mobile-${item.href}`}>
                <Link href={item.href} prefetch={false} className="nav-link nav-link-primary" onClick={close}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Overlay */}
      {open && (
        <div 
          className={`floating-menu-overlay ${open ? 'is-open' : ''}`}
          onClick={close}
        />
      )}
    </>
  )
}

