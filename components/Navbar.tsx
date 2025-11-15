'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

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
  label: 'المصادر المصنفة',
  items: [
    { label: 'الدورات', href: '/courses' },
    { label: 'الكتب', href: '/books' },
    { label: 'الفيديوهات المقترحة', href: '/videos' },
    { label: 'البودكاست', href: '/podcasts' },
    { label: 'مواقع ومنصات تعليمية', href: '/platforms' },
  ],
}

const additionalLinks: NavItem[] = [
  { label: 'دليل الخبرات', href: '/expertise-guide' },
  { label: 'التقييم والأخبار', href: '/evaluation' },
  { label: 'ساهم معنا', href: '/contribute' },
]

// إعادة ترتيب الأقسام: الرئيسية، الجدول، المواد، ثم باقي الصفحات، وأخيراً About
const primaryLinks: NavItem[] = [
  { label: 'الجدول الدراسي', href: '/schedule' },
  { label: 'المواد التعليمية', href: '/materials' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <nav className="main-header">
      <div className="nav-container">
        <button className="mobile-menu-button" onClick={toggle} aria-label="القائمة">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* اسم الموقع */}
        <Link href="/" className="logo" prefetch={false} onClick={close}>
          <span>Cyber</span> TMSAH
        </Link>

        {/* جميع الأقسام في صف واحد أفقي */}
        <ul className="nav-links nav-links-horizontal">
          {/* الجدول الدراسي أولاً */}
          <li>
            <Link href="/schedule" prefetch={false} className="nav-link nav-link-primary" onClick={close}>
              الجدول الدراسي
            </Link>
          </li>
          
          {/* المواد التعليمية */}
          <li>
            <Link href="/materials" prefetch={false} className="nav-link nav-link-primary" onClick={close}>
              المواد التعليمية
            </Link>
          </li>
          
          {/* خريطة الطريق */}
          {securityGuideLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={false} className="nav-link" onClick={close}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Dropdown للمصادر المصنفة */}
          <li className="dropdown">
            <Link href="#" prefetch={false} className="nav-link" onClick={(e) => e.preventDefault()}>
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
          </li>
          
          {/* دليل الخبرات */}
          <li>
            <Link href="/expertise-guide" prefetch={false} className="nav-link" onClick={close}>
              دليل الخبرات
            </Link>
          </li>
          
          {/* التقييم والأخبار */}
          <li>
            <Link href="/evaluation" prefetch={false} className="nav-link" onClick={close}>
              التقييم والأخبار
            </Link>
          </li>
          
          {/* ساهم معنا */}
          <li>
            <Link href="/contribute" prefetch={false} className="nav-link" onClick={close}>
              ساهم معنا
            </Link>
          </li>
          
          {/* عن المنصة في النهاية */}
          <li>
            <Link href="/about" prefetch={false} className="nav-link" onClick={close}>
              عن المنصة
            </Link>
          </li>
        </ul>
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
