'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NewsTicker from './NewsTicker'

export default function Navbar() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)

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
      {/* News Ticker */}
      <NewsTicker />

      {/* Main Header - Logo & Navigation */}
      <div className="header-main-bar">
        <div className="header-main-content">
          {/* Left Actions - Empty */}
          <div className="header-left-actions"></div>

          {/* Center Section - Logo */}
          <div className="header-center-section">

            {/* Logo Center - SVG Logo with Color Gradient */}
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

          {/* Right Actions - Empty for now */}
          <div className="header-right-actions"></div>
        </div>
      </div>


    </nav>
  )
}
