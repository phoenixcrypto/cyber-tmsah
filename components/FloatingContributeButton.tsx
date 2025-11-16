'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FloatingContributeButton() {
  const { t } = useLanguage()

  return (
    <Link
      href="/contact"
      className="floating-contribute-btn"
      prefetch={false}
      aria-label={t('home.contribute.button')}
      title={t('home.contribute.button')}
    >
      <Users className="w-4 h-4" />
      <span className="floating-contribute-text">{t('home.contribute.button')}</span>
    </Link>
  )
}

