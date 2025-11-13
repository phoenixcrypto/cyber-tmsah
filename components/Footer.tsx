'use client'

import Link from 'next/link'
import { Mail, MessageCircle, Phone } from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { href: '#about', label: 'عن المنصة' },
    { href: '#team', label: 'الفريق' },
    { href: '#contact', label: 'اتصل بنا' },
    { href: '#contribute', label: 'ساهم معنا' },
  ]

  const resourceLinks = [
    { href: '/materials', label: 'المواد التعليمية' },
    { href: '/schedule', label: 'الجدول الدراسي' },
    { href: '/materials#applied-physics', label: 'المقررات العلمية' },
    { href: '/materials#information-technology', label: 'تقنية المعلومات' },
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
            {resourceLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} prefetch={false}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>تواصل معنا</h4>
          <ul className="footer-links">
            <li>
              <Link href="mailto:support@cyber-tmsah.com" prefetch={false}>
                <Mail className="w-4 h-4" style={{ marginLeft: '0.5rem', display: 'inline' }} />
                support@cyber-tmsah.com
              </Link>
            </li>
            <li>
              <Link href="https://wa.me/201553450232" prefetch={false}>
                <MessageCircle className="w-4 h-4" style={{ marginLeft: '0.5rem', display: 'inline' }} />
                تواصل عبر واتساب
              </Link>
            </li>
            <li>
              <Link href="tel:+201553450232" prefetch={false}>
                <Phone className="w-4 h-4" style={{ marginLeft: '0.5rem', display: 'inline' }} />
                +20 155 345 0232
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Cyber TMSAH. جميع الحقوق محفوظة. طور بحُب من قبل <Link href="https://github.com/phoenixcrypto" prefetch={false}>Zeyad Mohamed</Link>.
        </p>
      </div>
    </footer>
  )
}