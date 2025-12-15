'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Shield } from 'lucide-react'
import { getAdminLoginPath } from '@/lib/utils/admin-path'
import { getSidebarItemsSync } from '@/lib/admin/sidebar-items'

export default function AdminSidebar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [badges, setBadges] = useState<Record<string, number>>({})
  const sidebarItems = getSidebarItemsSync()

  // Fetch badges
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [usersRes, activitiesRes] = await Promise.all([
          fetch('/api/admin/users').catch(() => null),
          fetch('/api/admin/activities').catch(() => null),
        ])
        
        if (usersRes?.ok) {
          const usersData = await usersRes.json()
          setBadges(prev => ({ ...prev, users: usersData.data?.users?.length || 0 }))
        }
        
        if (activitiesRes?.ok) {
          const activitiesData = await activitiesRes.json()
          const activities = activitiesData.data?.activities || []
          const failedLogins = activities.filter((a: { type: string; success: boolean }) => a.type === 'login' && !a.success).length
          setBadges(prev => ({ ...prev, notifications: failedLogins }))
        }
      } catch (error) {
        console.error('Error fetching badges:', error)
      }
    }
    
    fetchBadges()
    const interval = setInterval(fetchBadges, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    )
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = getAdminLoginPath()
  }

  return (
    <motion.aside
      className={`admin-sidebar ${isOpen ? 'open' : 'collapsed'}`}
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="admin-sidebar-logo"
            >
              <div className="admin-logo-icon">
                <Shield className="w-8 h-8" />
              </div>
              <div className="admin-logo-text">
                <h2 className="admin-logo-title">Cyber TMSAH</h2>
                <p className="admin-logo-subtitle">Admin Panel</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="admin-sidebar-logo-icon-only"
            >
              <Shield className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="admin-sidebar-toggle"
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="admin-sidebar-nav">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const isExpanded = expandedItems.includes(item.href)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.href} className="admin-sidebar-item-wrapper">
              <motion.div
                className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                whileHover={{ x: isOpen ? 5 : 0 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className="admin-sidebar-link"
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault()
                      toggleExpand(item.href)
                    }
                  }}
                >
                  <div className="admin-sidebar-icon-wrapper">
                    <Icon className="admin-sidebar-icon" />
                    {isActive && (
                      <motion.div
                        className="admin-sidebar-active-indicator"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="admin-sidebar-label"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isOpen && (item.badge || badges[item.href]) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="admin-sidebar-badge"
                    >
                      {typeof item.badge === 'number' ? item.badge : badges[item.href] || 0}
                    </motion.span>
                  )}
                  {isOpen && hasChildren && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>

              {/* Submenu */}
              <AnimatePresence>
                {isOpen && hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="admin-sidebar-submenu"
                  >
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`admin-sidebar-submenu-item ${isChildActive ? 'active' : ''}`}
                        >
                          <ChildIcon className="w-4 h-4" />
                          <span>{child.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="admin-sidebar-footer">
        <motion.button
          className="admin-sidebar-logout"
          onClick={handleLogout}
          whileHover={{ x: isOpen ? 5 : 0 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="admin-sidebar-icon" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                تسجيل الخروج
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}

