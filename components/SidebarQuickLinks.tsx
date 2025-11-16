'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SidebarQuickLinks() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn"
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
      <div className={`sidebar-quick-links ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-links">
            <Link href="/about" prefetch={false} className="sidebar-link" onClick={() => setIsOpen(false)}>
              <User className="w-5 h-5" />
              <span>{t('nav.about')}</span>
            </Link>
            <Link href="/contact" prefetch={false} className="sidebar-link" onClick={() => setIsOpen(false)}>
              <Mail className="w-5 h-5" />
              <span>{t('nav.contact')}</span>
            </Link>
            <Link href="/team" prefetch={false} className="sidebar-link" onClick={() => setIsOpen(false)}>
              <Users className="w-5 h-5" />
              <span>{t('nav.team')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

