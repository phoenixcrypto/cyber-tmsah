'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Calendar, BookOpen, Info, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const leftLinks: NavItem[] = [
    { href: '/schedule', label: 'الجدول الدراسي', icon: Calendar },
    { href: '/materials', label: 'المواد التعليمية', icon: BookOpen },
  ]

  const rightLinks: NavItem[] = [
    { href: '/about', label: 'عن المنصة', icon: Info },
  ]

  const mobileLinks: NavItem[] = [
    { href: '/', label: 'الرئيسية', icon: Home },
    ...leftLinks,
    ...rightLinks,
  ]

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const renderLinks = (links: NavItem[]) => (
    links.map((item) => {
      const Icon = item.icon
      return (
        <li key={item.href}>
          <Link
            href={item.href}
            prefetch={false}
            onClick={closeMenu}
            className="nav-link"
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        </li>
      )
    })
  )

  return (
    <header className="main-header">
      <nav className="nav-container">
        <button
          onClick={toggleMenu}
          className="mobile-menu-button"
          aria-label="فتح القائمة"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <ul className="nav-links nav-left">
          {renderLinks(leftLinks)}
        </ul>

        <Link href="/" className="logo" prefetch={false}>
          <span>Cyber</span>
          <span style={{ marginRight: '6px', color: 'inherit' }}>TMSAH</span>
        </Link>

        <ul className="nav-links nav-right">
          {renderLinks(rightLinks)}
        </ul>
      </nav>

      <div className={`mobile-menu-panel ${isOpen ? 'is-open' : ''}`}>
        <ul>
          {mobileLinks.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={closeMenu}
                  className="nav-link"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}