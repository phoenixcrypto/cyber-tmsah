'use client'

import { memo } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'

function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const quickLinks = [
    { labelKey: 'nav.contact', href: '/contact' },
    { labelKey: 'nav.aboutPlatform', href: '/about' },
    { labelKey: 'footer.privacy', href: '/privacy' },
    { labelKey: 'footer.terms', href: '/terms' },
  ]

  return (
    <footer>
      <div className="footer-content footer-content-horizontal">
        <ul className="footer-links-horizontal">
          {quickLinks.map((item, index) => (
            <li key={item.labelKey}>
              <Link 
                href={item.href} 
                prefetch={false} 
                className="footer-link-horizontal hover:text-cyber-neon transition-colors active:scale-95"
              >
                {t(item.labelKey)}
              </Link>
              {index < quickLinks.length - 1 && <span className="footer-link-separator">|</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <Link href="/" prefetch={false} className="text-cyber-neon font-bold hover:text-cyber-green transition-colors active:scale-95 inline-block">Cyber TMSAH</Link>. {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

export default memo(Footer)
