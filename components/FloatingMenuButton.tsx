'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingMenuButton() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen(!open)
  const close = () => setOpen(false)

  const primaryLinks = [
    { label: t('nav.schedule'), href: '/schedule' },
    { label: t('nav.materials'), href: '/materials' },
  ]

  const securityGuideLinks = [
    { label: t('nav.roadmap'), href: '/roadmap' },
    { label: t('nav.expertise'), href: '/expertise-guide' },
    { label: t('nav.news'), href: '/evaluation' },
  ]

  const resourcesDropdown = {
    label: t('nav.resources'),
    items: [
      { label: t('nav.courses'), href: '/courses' },
      { label: t('nav.books'), href: '/books' },
      { label: t('nav.videos'), href: '/videos' },
      { label: t('nav.podcasts'), href: '/podcasts' },
      { label: t('nav.platforms'), href: '/platforms' },
    ],
  }

  const additionalLinks = [
    { label: t('nav.contribute'), href: '/contribute' },
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
              {t('nav.home')}
            </Link>
          </li>
          
          {/* Primary Sections */}
          {primaryLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link nav-link-primary" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Other Sections */}
          <li className="mobile-section-title">{t('home.guide.title')}</li>
          {securityGuideLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Resources Dropdown */}
          <li className="mobile-dropdown-title">
            <span>{resourcesDropdown.label}</span>
            <ChevronDown className="w-4 h-4" />
          </li>
          <ul className="mobile-dropdown-list">
            {resourcesDropdown.items.map((item) => (
              <li key={`mobile-${item.href}`}>
                <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Additional Links */}
          {additionalLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      {open && (
        <div 
          className="floating-menu-overlay"
          onClick={close}
        />
      )}
    </>
  )
}

