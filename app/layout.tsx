import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  fallback: ['monospace'],
  preload: true,
})

export const metadata: Metadata = {
  title: 'Cyber TMSAH - Advanced Academic Learning Platform',
  description: 'A comprehensive university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences',
  keywords: ['education', 'programming', 'technology', 'learning', 'university', 'academic', 'cyber', 'tmsah', 'computer science'],
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
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Cyber TMSAH - Advanced Academic Learning Platform',
    description: 'A comprehensive university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences',
    url: 'https://cyber-tmsah.vercel.app',
    siteName: 'Cyber TMSAH',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cyber TMSAH - Advanced Academic Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber TMSAH - Advanced Academic Learning Platform',
    description: 'A comprehensive university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences',
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
    <html lang="en" dir="ltr" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
            <body className={`${inter.className} bg-cyber-dark text-dark-100 antialiased`}>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Analytics />
              <SpeedInsights />
            </body>
    </html>
  )
}