'use client'

import Link from 'next/link'

export default function Footer() {
  const quickLinks = [
    { label: 'عن المنصة', href: '/about' },
    { label: 'الفريق', href: '/#team' },
    { label: 'اتصل بنا', href: '/#contact' },
    { label: 'ساهم معنا', href: '/#contribute' },
  ]

  const resources = [
    { label: 'الجدول الدراسي', href: '/schedule' },
    { label: 'المواد التعليمية', href: '/materials' },
    { label: 'خريطة الطريق', href: '/roadmap' },
  ]

  const contact = [
    { label: 'support@cyber-tmsah.com', href: 'mailto:support@cyber-tmsah.com' },
    { label: 'WhatsApp', href: 'https://wa.me/201553450232' },
    { label: 'GitHub', href: 'https://github.com/phoenixcrypto/cyber-tmsah' },
  ]

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>روابط سريعة</h4>
          <ul className="footer-links">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>المصادر</h4>
          <ul className="footer-links">
            {resources.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>تواصل معنا</h4>
          <ul className="footer-links">
            {contact.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} سايبر تمساح. جميع الحقوق محفوظة. صُمم وطُوِّر بحُب.
        </p>
      </div>
    </footer>
  )
}
