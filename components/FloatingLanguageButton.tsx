'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'

export default function FloatingLanguageButton() {
  const { language, setLanguage } = useLanguage()
  const isEnglish = language === 'en'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    setLanguage(isEnglish ? 'ar' : 'en')
  }

  if (!mounted) return null

  return (
    <button
      className="floating-language-btn-modern"
      onClick={toggleLanguage}
      aria-label={isEnglish ? 'Switch to Arabic' : 'Switch to English'}
      title={isEnglish ? 'العربية' : 'English'}
    >
      <Languages className="floating-language-icon" />
      <span className="floating-language-text">{isEnglish ? 'AR' : 'EN'}</span>
    </button>
  )
}

