'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const quickLinks = [
    { labelKey: 'nav.aboutPlatform', href: '/about' },
    { labelKey: 'nav.team', href: '/team' },
    { labelKey: 'nav.contact', href: '/contact' },
    { labelKey: 'nav.contribute', href: '/contribute' },
  ]

  const resources = [
    { labelKey: 'nav.schedule', href: '/schedule' },
    { labelKey: 'nav.materials', href: '/materials' },
    { labelKey: 'nav.roadmap', href: '/roadmap' },
  ]

  return (
    <footer>
      <div className="footer-content footer-content-two-columns">
        <div className="footer-section">
          <h4 className="text-cyber-neon mb-4 font-bold">{t('footer.quickLinks')}</h4>
          <ul className="footer-links">
            {quickLinks.map((item) => (
              <li key={item.labelKey}>
                <Link href={item.href} prefetch={false} className="hover:text-cyber-neon transition-colors active:scale-95">{t(item.labelKey)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="text-cyber-neon mb-4 font-bold">{t('footer.resources')}</h4>
          <ul className="footer-links">
            {resources.map((item) => (
              <li key={item.labelKey}>
                <Link href={item.href} prefetch={false} className="hover:text-cyber-neon transition-colors active:scale-95">{t(item.labelKey)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <Link href="/" prefetch={false} className="text-cyber-neon font-bold hover:text-cyber-green transition-colors active:scale-95 inline-block">Cyber TMSAH</Link>. {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}
