import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingLanguageButton from '@/components/FloatingLanguageButton'
import PageTransition from '@/components/PageTransition'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  weight: ['300', '400', '600', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Cyber TMSAH | المنصة الأكاديمية الشاملة',
  description:
    'منصة Cyber TMSAH تجمع بين الجداول الدراسية والمصادر التعليمية ودليل الأمن السيبراني في تجربة عربية حديثة.',
  keywords: [
    'Cyber TMSAH',
    'الأمن السيبراني',
    'جدول المحاضرات',
    'مصادر تعليمية',
    'موارد جامعية',
  ],
  authors: [{ name: 'ZEYAD MOHAMED' }],
  creator: 'ZEYAD MOHAMED',
  publisher: 'Cyber TMSAH',
  metadataBase: new URL('https://www.cyber-tmsah.site'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-EG': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Cyber TMSAH | المنصة الأكاديمية الشاملة',
    description:
      'جميع أدوات الدراسة والأمن السيبراني في مكان واحد: جدول المحاضرات، المحتوى التعليمي، ومسارات التعلم.',
    url: 'https://cyber-tmsah.vercel.app',
    siteName: 'Cyber TMSAH',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber TMSAH | المنصة الأكاديمية الشاملة',
    description:
      'منصة عربية حديثة تجمع الجداول الدراسية والمصادر التعليمية ودليل الأمن السيبراني.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#07010d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="theme-color" content="#07010d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <StructuredData />
      </head>
      <body className="font-cairo bg-primary-black text-primary-white">
        <Providers>
          <div className="app-wrapper">
            <Navbar />
            <main className="main-content" role="main">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <FloatingLanguageButton />
          </div>
        </Providers>
        <OfflineIndicator />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
