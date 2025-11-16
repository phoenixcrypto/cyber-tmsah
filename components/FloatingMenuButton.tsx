'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Home, Calendar, BookOpen, Map, GraduationCap, Newspaper, Library, Video, Headphones, Globe, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingMenuButton() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen(!open)
  const close = () => setOpen(false)

  const primaryLinks = [
    { label: t('nav.schedule'), href: '/schedule', icon: Calendar },
    { label: t('nav.materials'), href: '/materials', icon: BookOpen },
  ]

  const securityGuideLinks = [
    { label: t('nav.roadmap'), href: '/roadmap', icon: Map },
    { label: t('nav.expertise'), href: '/expertise-guide', icon: GraduationCap },
    { label: t('nav.news'), href: '/evaluation', icon: Newspaper },
  ]

  const resourcesDropdown = {
    label: t('nav.resources'),
    icon: Library,
    items: [
      { label: t('nav.courses'), href: '/courses', icon: GraduationCap },
      { label: t('nav.books'), href: '/books', icon: BookOpen },
      { label: t('nav.videos'), href: '/videos', icon: Video },
      { label: t('nav.podcasts'), href: '/podcasts', icon: Headphones },
      { label: t('nav.platforms'), href: '/platforms', icon: Globe },
    ],
  }

  const additionalLinks = [
    { label: t('nav.contribute'), href: '/contribute', icon: Heart },
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
          
          {/* Other Sections */}
          <li className="mobile-section-title">{t('home.guide.title')}</li>
          {securityGuideLinks.map((item) => {
            const Icon = item.icon
            return (
              <li key={`mobile-${item.href}`}>
                <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
          
          {/* Resources Dropdown */}
          <li>
            <div className="mobile-dropdown-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(() => {
                  const Icon = resourcesDropdown.icon
                  return Icon ? <Icon className="w-5 h-5" /> : null
                })()}
                <span>{resourcesDropdown.label}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </div>
            <ul className="mobile-dropdown-list">
              {resourcesDropdown.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={`mobile-${item.href}`}>
                    <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          {/* Additional Links */}
          {additionalLinks.map((item) => {
            const Icon = item.icon
            return (
              <li key={`mobile-${item.href}`}>
                <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
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
          className="floating-menu-overlay"
          onClick={close}
        />
      )}
    </>
  )
}

