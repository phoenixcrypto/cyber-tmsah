'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, Search, Settings, Bookmark, Home, Youtube, Send, Instagram, Facebook, MessageCircle } from 'lucide-react'

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

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <nav className="main-header-new">
      {/* Top Bar - Social Links & Quick Links */}
      <div className="header-top-bar">
        <div className="header-top-content">
          {/* Social Media Links */}
          <div className="header-social-links">
            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" prefetch={false}>
              <Youtube className="w-4 h-4" />
            </Link>
            <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-icon-link" prefetch={false}>
              <Send className="w-4 h-4" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" prefetch={false}>
              <Instagram className="w-4 h-4" />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" prefetch={false}>
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-icon-link" prefetch={false}>
              <MessageCircle className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="header-quick-links">
            <Link href="/about" prefetch={false} className="quick-link">من نحن</Link>
            <Link href="/#contact" prefetch={false} className="quick-link">اتصل بنا</Link>
            <Link href="/#team" prefetch={false} className="quick-link">فريق العمل</Link>
            <Link href="/contribute" prefetch={false} className="quick-link">خدماتنا</Link>
          </div>
        </div>
      </div>

      {/* Main Header - Logo & Navigation */}
      <div className="header-main-bar">
        <div className="header-main-content">
          <button className="mobile-menu-button" onClick={toggle} aria-label="القائمة">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left Actions */}
          <div className="header-left-actions">
            <button className="header-action-btn" aria-label="بحث">
              <Search className="w-5 h-5" />
            </button>
            <button className="header-action-btn" aria-label="الإعدادات">
              <Settings className="w-5 h-5" />
            </button>
            <button className="header-action-btn" aria-label="المفضلة">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Logo Center */}
          <Link href="/" className="logo-new" prefetch={false} onClick={close}>
            <div className="logo-main-text">Cyber TMSAH</div>
            <div className="logo-sub-text">منصة تعليمية متكاملة للأمن السيبراني</div>
          </Link>

          {/* Right Actions */}
          <div className="header-right-actions">
            <Link href="/" prefetch={false} className="header-action-link">
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="header-bottom-bar">
        <div className="header-bottom-content">
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
          <Link href="/about" prefetch={false} className="bottom-nav-link" onClick={close}>
            عن المنصة
          </Link>
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
