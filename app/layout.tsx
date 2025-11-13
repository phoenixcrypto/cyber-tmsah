import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'
import { OfflineIndicator } from '@/components/OfflineIndicator'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  weight: ['300', '400', '600', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Cyber TMSAH - منصة الجدول والمواد التعليمية',
  description: 'منصة جامعية توفر الجدول الدراسي والمواد التعليمية بشكل منظم مع تصميم حديث وتجربة سلسة.',
  keywords: ['التعليم', 'الجدول', 'مواد تعليمية', 'منصة', 'سايبر تمساح', 'cyber tmsah'],
  authors: [{ name: 'ZEYAD MOHAMED' }],
  creator: 'ZEYAD MOHAMED',
  publisher: 'Cyber TMSAH',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cyber-tmsah.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-EG': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Cyber TMSAH - منصة الجدول والمواد التعليمية',
    description: 'منصة متكاملة للطلاب لعرض الجدول الدراسي والوصول للمواد التعليمية بسهولة.',
    url: 'https://cyber-tmsah.vercel.app',
    siteName: 'Cyber TMSAH',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cyber TMSAH - منصة الجدول والمواد التعليمية',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber TMSAH - منصة الجدول والمواد التعليمية',
    description: 'منصة متكاملة للطلاب لعرض الجدول الدراسي والوصول للمواد التعليمية بسهولة.',
    images: ['/og-image.jpg'],
    creator: '@cyber_tmsah',
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
  verification: {
    google: 'your-google-verification-code',
  },
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
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${cairo.className} bg-body text-body` }>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <OfflineIndicator />
      </body>
    </html>
  )
}