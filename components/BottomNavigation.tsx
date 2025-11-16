'use client'

import Link from 'next/link'
import { Home, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BottomNavigation() {
  const { t } = useLanguage()

  const securityGuideLinks = [
    { label: t('nav.roadmap'), href: '/roadmap' },
    { label: t('nav.expertise'), href: '/expertise-guide' },
    { label: t('nav.evaluation'), href: '/evaluation' },
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
    <div className="bottom-navigation-separate">
      <div className="bottom-navigation-content">
        <Link href="/" prefetch={false} className="bottom-nav-link bottom-nav-home">
          <Home className="w-4 h-4" />
        </Link>
        <Link href="/schedule" prefetch={false} className="bottom-nav-link bottom-nav-primary">
          {t('nav.schedule')}
        </Link>
        <Link href="/materials" prefetch={false} className="bottom-nav-link bottom-nav-primary">
          {t('nav.materials')}
        </Link>
        {securityGuideLinks.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false} className="bottom-nav-link">
            {item.label}
          </Link>
        ))}
        <div className="bottom-nav-dropdown">
          <Link href="#" prefetch={false} className="bottom-nav-link" onClick={(e) => e.preventDefault()}>
            {resourcesDropdown.label}
            <ChevronDown className="w-4 h-4" style={{ marginRight: '0.25rem', display: 'inline' }} />
          </Link>
          <div className="dropdown-content">
            {resourcesDropdown.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="dropdown-link"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {additionalLinks.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false} className="bottom-nav-link">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

