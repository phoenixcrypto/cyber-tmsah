'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Home, Youtube, Send, Instagram, Facebook, MessageCircle, Users, Star, Mail, User } from 'lucide-react'

interface NavItem {
  label: string
  href: string
}

interface DropdownItem {
  label: string
  href: string
}

// تعريف البيانات خارج المكون لتجنب مشاكل hydration
const securityGuideLinks: NavItem[] = [
  { label: 'خريطة الطريق', href: '/roadmap' },
]

const resourcesDropdown: { label: string; items: DropdownItem[] } = {
  label: 'الموارد التعليمية',
  items: [
    { label: 'الدورات', href: '/courses' },
    { label: 'الكتب', href: '/books' },
    { label: 'الفيديوهات المقترحة', href: '/videos' },
    { label: 'البودكاست', href: '/podcasts' },
    { label: 'مواقع ومنصات تعليمية', href: '/platforms' },
  ],
}

const additionalLinks: NavItem[] = [
  { label: 'دليل المهارات المهنية', href: '/expertise-guide' },
  { label: 'الأخبار والتحديثات', href: '/evaluation' },
  { label: 'ساهم معنا', href: '/contribute' },
]

// إعادة ترتيب الأقسام: الرئيسية، الجدول، المواد، ثم باقي الصفحات، وأخيراً About
const primaryLinks: NavItem[] = [
  { label: 'الجدول الدراسي', href: '/schedule' },
  { label: 'المحتوى التعليمي', href: '/materials' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

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

  return (
    <nav 
      className={headerClass} 
      style={{ opacity: isScrolled ? 1 - scrollOpacity * 0.3 : 1 }}
    >
      {/* Top Bar - Social Links & Quick Links */}
      <div className="iTopBar">
        <div className="iTopBar-content">
          {/* Social Media Icons - Left Side */}
          <div className="iTopBar-social">
            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="iTopBar-social-icon" prefetch={false}>
              <Youtube className="w-5 h-5" />
            </Link>
            <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="iTopBar-social-icon" prefetch={false}>
              <Send className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="iTopBar-social-icon" prefetch={false}>
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="iTopBar-social-icon" prefetch={false}>
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="iTopBar-social-icon" prefetch={false}>
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>

          {/* Quick Links with Icons - Right Side */}
          <div className="iTopBar-links">
            <Link href="/team" prefetch={false} className="iTopBar-link">
              <Users className="w-4 h-4" />
              <span>فريق العمل</span>
            </Link>
            <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="iTopBar-link" prefetch={false}>
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </Link>
            <Link href="/contribute" prefetch={false} className="iTopBar-link">
              <Star className="w-4 h-4" />
              <span>خدماتنا</span>
            </Link>
            <Link href="/contact" prefetch={false} className="iTopBar-link">
              <Mail className="w-4 h-4" />
              <span>اتصل بنا</span>
            </Link>
            <Link href="/about" prefetch={false} className="iTopBar-link">
              <User className="w-4 h-4" />
              <span>من نحن</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Logo & Navigation */}
      <div className="header-main-bar">
        <div className="header-main-content">
          <button className="mobile-menu-button" onClick={toggle} aria-label="القائمة">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left Actions - Empty */}
          <div className="header-left-actions"></div>

          {/* Center Section - Logo */}
          <div className="header-center-section">

            {/* Logo Center - SVG Logo with Color Gradient */}
            <Link href="/" className="logo-new" prefetch={false} onClick={close}>
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
              <div className="logo-sub-text">منصة تعليمية متكاملة للأمن السيبراني</div>
            </Link>
          </div>

          {/* Right Actions - Empty for now */}
          <div className="header-right-actions"></div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="header-bottom-bar">
        <div className="header-bottom-content">
          <Link href="/" prefetch={false} className="bottom-nav-link bottom-nav-home" onClick={close}>
            <Home className="w-4 h-4" />
          </Link>
          <Link href="/schedule" prefetch={false} className="bottom-nav-link bottom-nav-primary" onClick={close}>
            الجدول الدراسي
          </Link>
          <Link href="/materials" prefetch={false} className="bottom-nav-link bottom-nav-primary" onClick={close}>
            المحتوى التعليمي
          </Link>
          {securityGuideLinks.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className="bottom-nav-link" onClick={close}>
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
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {additionalLinks.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className="bottom-nav-link" onClick={close}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={open ? 'mobile-menu-panel is-open' : 'mobile-menu-panel'}>
        <ul>
          {/* الصفحة الرئيسية أولاً */}
          <li>
            <Link href="/" prefetch={false} className="nav-link nav-link-primary" onClick={close}>
              الرئيسية
            </Link>
          </li>
          
          {/* الأقسام الرئيسية المميزة */}
          {primaryLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link nav-link-primary" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* باقي الأقسام */}
          <li className="mobile-section-title">دليل الأمن السيبراني</li>
          {securityGuideLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <span className="mobile-dropdown-title">{resourcesDropdown.label}</span>
            <ul className="mobile-dropdown-list">
              {resourcesDropdown.items.map((item) => (
                <li key={`mobile-${item.href}`}>
                  <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {additionalLinks.map((item) => (
            <li key={`mobile-${item.href}`}>
              <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* عن المنصة في النهاية */}
          <li>
            <Link href="/about" prefetch={false} className="nav-link" onClick={close}>
              عن المنصة
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
