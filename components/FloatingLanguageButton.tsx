'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingLanguageButton() {
  const { language, setLanguage } = useLanguage()
  const isEnglish = language === 'en'

  const toggleLanguage = () => {
    setLanguage(isEnglish ? 'ar' : 'en')
  }

  return (
    <button
      className="floating-language-btn"
      onClick={toggleLanguage}
      aria-label={isEnglish ? 'Switch to Arabic' : 'Switch to English'}
      title={isEnglish ? 'العربية' : 'English'}
    >
      <Languages className="w-5 h-5" />
      <span className="floating-language-text">{isEnglish ? 'AR' : 'EN'}</span>
    </button>
  )
}

