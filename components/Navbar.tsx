'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Home, Calendar, BookOpen, Map, GraduationCap, Newspaper, Library, Video, Headphones, Globe, Heart, ChevronDown, Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import NewsTicker from './NewsTicker'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Handle scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const scrollOpacity = Math.min(1, lastScrollY / 200)
  const headerClass = `main-header-new ${scrollDirection === 'down' && isScrolled ? 'header-hidden' : ''} ${isScrolled ? 'header-scrolled' : ''}`

  // Navigation links
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

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav 
        className={headerClass} 
        style={{ opacity: isScrolled ? 1 - scrollOpacity * 0.3 : 1 }}
      >
        {/* News Ticker */}
        <NewsTicker />

        {/* Main Header - Logo & Navigation */}
        <div className="header-main-bar">
          <div className="header-main-content">
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div className="header-center-section">
              <Link href="/" className="logo-new" prefetch={false}>
                <svg className="logo-svg" viewBox="0 0 300 70" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <text 
                    x="80" 
                    y="40" 
                    fontFamily="Arial, sans-serif" 
                    fontSize="32" 
                    fontWeight="900" 
                    textAnchor="middle" 
                    fill="#ff3b40"
                    filter="url(#logoGlow)"
                    className="logo-text-cyber"
                    style={{ letterSpacing: '2px' }}
                  >
                    Cyber
                  </text>
                  <text 
                    x="200" 
                    y="40" 
                    fontFamily="Arial, sans-serif" 
                    fontSize="32" 
                    fontWeight="900" 
                    textAnchor="middle" 
                    fill="#f9fafb"
                    filter="url(#logoGlow)"
                    className="logo-text-tmsah"
                    style={{ letterSpacing: '2px' }}
                  >
                    TMSAH
                  </text>
                </svg>
                <div className="logo-sub-text">{t('logo.subtitle')}</div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav-links">
              <Link 
                href="/" 
                className={`nav-link-desktop ${isActive('/') ? 'active' : ''}`}
                prefetch={false}
              >
                <Home className="w-4 h-4" />
                <span>{t('nav.home')}</span>
              </Link>
              
              {primaryLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link-desktop nav-link-primary ${isActive(item.href) ? 'active' : ''}`}
                    prefetch={false}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {securityGuideLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link-desktop ${isActive(item.href) ? 'active' : ''}`}
                    prefetch={false}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Resources Dropdown */}
              <div 
                className="nav-dropdown-desktop"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`nav-link-desktop ${activeDropdown === 'resources' ? 'active' : ''}`}>
                  <Library className="w-4 h-4" />
                  <span>{resourcesDropdown.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'resources' && (
                  <div className="dropdown-menu-desktop">
                    {resourcesDropdown.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`dropdown-item-desktop ${isActive(item.href) ? 'active' : ''}`}
                          prefetch={false}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {additionalLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link-desktop ${isActive(item.href) ? 'active' : ''}`}
                    prefetch={false}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`mobile-nav-panel ${mobileMenuOpen ? 'is-open' : ''}`}>
          <ul className="mobile-nav-list">
            <li>
              <Link 
                href="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                prefetch={false}
              >
                <Home className="w-5 h-5" />
                <span>{t('nav.home')}</span>
              </Link>
            </li>
            
            {primaryLinks.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link mobile-nav-primary ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}

            {securityGuideLinks.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}

            <li>
              <button
                className="mobile-nav-dropdown-toggle"
                onClick={() => setActiveDropdown(activeDropdown === 'resources-mobile' ? null : 'resources-mobile')}
              >
                <Library className="w-5 h-5" />
                <span>{resourcesDropdown.label}</span>
                <ChevronDown className={`w-4 h-4 ${activeDropdown === 'resources-mobile' ? 'rotated' : ''}`} />
              </button>
              {activeDropdown === 'resources-mobile' && (
                <ul className="mobile-nav-dropdown">
                  {resourcesDropdown.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setActiveDropdown(null)
                          }}
                          prefetch={false}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>

            {additionalLinks.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className={`mobile-nav-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
