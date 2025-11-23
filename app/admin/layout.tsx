'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb'
import { motion, AnimatePresence } from 'framer-motion'
import { getAdminLoginPath, getAdminBasePath } from '@/lib/utils/admin-path'
import '../admin/admin-styles.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.push(getAdminLoginPath())
        }
      } catch (error) {
        router.push(getAdminLoginPath())
      } finally {
        setLoading(false)
      }
    }

    // Skip auth check for login page
    const loginPath = getAdminLoginPath()
    const registerPath = `${getAdminBasePath()}/register`
    if (pathname !== loginPath && pathname !== registerPath) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [pathname, router])

  // Don't show layout on login/register pages
  const loginPath = getAdminLoginPath()
  const registerPath = `${getAdminBasePath()}/register`
  if (pathname === loginPath || pathname === registerPath) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">جاري التحميل...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="admin-layout">
      {/* Animated Background Particles */}
      <div className="admin-background-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="admin-particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        {/* Top Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Breadcrumb */}
        <AdminBreadcrumb />

        {/* Page Content */}
        <main className="admin-page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="admin-footer">
          <p className="admin-footer-text">
            © {new Date().getFullYear()} Cyber TMSAH Admin Panel
          </p>
          <div className="admin-footer-glow"></div>
        </footer>
      </div>
    </div>
  )
}

