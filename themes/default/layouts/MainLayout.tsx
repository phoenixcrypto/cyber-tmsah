/**
 * Main Layout for Default Theme
 * This layout wraps all theme pages
 */

'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  )
}

