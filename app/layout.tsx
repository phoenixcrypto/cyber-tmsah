import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import AnimatedLayout from '@/components/AnimatedLayout'
import LoadingScreen from '@/components/LoadingScreen'
import ParticlesBackground from '@/components/ParticlesBackground'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import SmartParticles from '@/components/SmartParticles'

import DynamicBackground from '@/components/DynamicBackground'

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
            <LoadingScreen />
            <ParticlesBackground />
            <SmartParticles />
            <DynamicBackground />
            <ScrollProgress />
            <BackToTop />
            
            {/* Enhanced Background Grid */}
            <div className="fixed inset-0 enhanced-grid pointer-events-none z-0" />
            
            {/* Enhanced Grid with Pulse */}
            <div className="enhanced-grid-pulse" />
            
            {/* Grid Pulse with Glow */}
            <div className="grid-pulse-glow" />
            
            {/* Additional Grid Layers */}
            <div className="grid-layer-1" />
            <div className="grid-layer-2" />
            
            {/* Particles Overlay */}
            <div className="particles-overlay" />
            
            {/* Enhanced Particles Interaction */}
            <div className="particles-interaction" />
        
        <Navbar />
        <AnimatedLayout>
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </AnimatedLayout>
      </body>
    </html>
  )
}
