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

  return (
    <footer className="border-t-2 border-cyber-neon/30">
      <div className="footer-content footer-content-two-columns">
        <div className="footer-section">
          <h4 className="text-cyber-neon mb-4 font-bold">روابط سريعة</h4>
          <ul className="footer-links">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false} className="hover:text-cyber-neon transition-colors active:scale-95">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="text-cyber-neon mb-4 font-bold">المصادر</h4>
          <ul className="footer-links">
            {resources.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false} className="hover:text-cyber-neon transition-colors active:scale-95">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom border-t border-cyber-neon/20 pt-4">
        <p className="text-center">
          © {new Date().getFullYear()} <span className="text-cyber-neon font-bold">سايبر تمساح</span>. جميع الحقوق محفوظة. صُمم وطُوِّر بحُب ❤️
        </p>
      </div>
    </footer>
  )
}
