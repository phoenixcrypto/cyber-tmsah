'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LoadingScreen from '@/components/LoadingScreen'
import ParticlesBackground from '@/components/ParticlesBackground'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import SmartParticles from '@/components/SmartParticles'
import DynamicBackground from '@/components/DynamicBackground'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
