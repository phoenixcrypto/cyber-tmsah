'use client'

import { Languages } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FloatingLanguageButton() {
  const [isEnglish, setIsEnglish] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('site-language')
    if (savedLang === 'en') {
      setIsEnglish(true)
      const html = document.documentElement
      html.lang = 'en'
      html.dir = 'ltr'
    } else {
      setIsEnglish(false)
      const html = document.documentElement
      html.lang = 'ar'
      html.dir = 'rtl'
    }
  }, [])

  // Handle language toggle
  const toggleLanguage = () => {
    setIsEnglish((prev) => {
      const newLang = !prev
      const html = document.documentElement
      
      if (newLang) {
        html.lang = 'en'
        html.dir = 'ltr'
        localStorage.setItem('site-language', 'en')
      } else {
        html.lang = 'ar'
        html.dir = 'rtl'
        localStorage.setItem('site-language', 'ar')
      }
      
      return newLang
    })
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

