import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'Cyber Tmsah - Your Cyber Fortress for the Future',
  description: 'Your Cyber Fortress for the Future - Cybersecurity Learning Platform',
  keywords: ['cybersecurity', 'learning', 'education', 'cyber tmsah', 'security'],
  authors: [{ name: 'Cyber Tmsah Team' }],
  creator: 'Cyber Tmsah',
  publisher: 'Cyber Tmsah',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cyber-tmsah.com'),
  openGraph: {
    title: 'Cyber Tmsah - Your Cyber Fortress for the Future',
    description: 'Your Cyber Fortress for the Future - Cybersecurity Learning Platform',
    url: 'https://cyber-tmsah.com',
    siteName: 'Cyber Tmsah',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cyber Tmsah - Cybersecurity Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Tmsah - Your Cyber Fortress for the Future',
    description: 'Your Cyber Fortress for the Future - Cybersecurity Learning Platform',
    images: ['/images/og-image.jpg'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="font-inter bg-cyber-dark text-dark-100 overflow-x-hidden">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
