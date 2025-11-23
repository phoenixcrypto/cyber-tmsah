'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'

export default function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [darkMode, setDarkMode] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Fetch user data
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const notifications = [
    { id: 1, title: 'مستخدم جديد', message: 'تم تسجيل مستخدم جديد', time: 'منذ 5 دقائق', unread: true },
    { id: 2, title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح', time: 'منذ ساعة', unread: true },
    { id: 3, title: 'نسخة احتياطية', message: 'تم إنشاء نسخة احتياطية', time: 'منذ يوم', unread: false },
  ]

  return (
    <motion.nav
      className="admin-navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-navbar-content">
        {/* Left Section */}
        <div className="admin-navbar-left">
          <motion.button
            className="admin-navbar-menu-btn"
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Search Bar */}
          <div className="admin-navbar-search">
            <Search className="admin-navbar-search-icon" />
            <input
              type="text"
              placeholder="بحث سريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-navbar-search-input"
            />
            {searchQuery && (
              <motion.button
                className="admin-navbar-search-clear"
                onClick={() => setSearchQuery('')}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="admin-navbar-right">
          {/* Theme Toggle */}
          <motion.button
            className="admin-navbar-icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* Notifications */}
          <div className="admin-navbar-notifications">
            <motion.button
              className="admin-navbar-icon-btn admin-navbar-notifications-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <motion.span
                  className="admin-navbar-notification-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {notifications.filter((n) => n.unread).length}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  className="admin-navbar-notifications-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="admin-navbar-notifications-header">
                    <h3>الإشعارات</h3>
                    <span className="admin-navbar-notifications-count">
                      {notifications.filter((n) => n.unread).length} جديد
                    </span>
                  </div>
                  <div className="admin-navbar-notifications-list">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`admin-navbar-notification-item ${notification.unread ? 'unread' : ''}`}
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="admin-navbar-notification-dot"></div>
                        <div className="admin-navbar-notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="admin-navbar-notification-time">{notification.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="admin-navbar-notifications-footer">
                    <button>عرض الكل</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="admin-navbar-user-menu">
            <motion.button
              className="admin-navbar-user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="admin-navbar-user-avatar">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="admin-navbar-user-info">
                <span className="admin-navbar-user-name">{user?.name || 'المدير'}</span>
                <span className="admin-navbar-user-role">{user?.role || 'admin'}</span>
              </div>
              <ChevronDown
                className={`admin-navbar-user-chevron ${userMenuOpen ? 'open' : ''}`}
              />
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="admin-navbar-user-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="admin-navbar-user-dropdown-header">
                    <div className="admin-navbar-user-dropdown-avatar">
                      {user?.name?.[0] || 'A'}
                    </div>
                    <div>
                      <h4>{user?.name || 'المدير'}</h4>
                      <p>{user?.email || 'admin@cyber-tmsah.site'}</p>
                    </div>
                  </div>
                  <div className="admin-navbar-user-dropdown-menu">
                    <button>
                      <User className="w-4 h-4" />
                      <span>الملف الشخصي</span>
                    </button>
                    <button>
                      <Settings className="w-4 h-4" />
                      <span>الإعدادات</span>
                    </button>
                    <button>
                      <HelpCircle className="w-4 h-4" />
                      <span>المساعدة</span>
                    </button>
                    <div className="admin-navbar-user-dropdown-divider"></div>
                    <button onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notificationsOpen || userMenuOpen) && (
        <div
          className="admin-navbar-overlay"
          onClick={() => {
            setNotificationsOpen(false)
            setUserMenuOpen(false)
          }}
        />
      )}
    </motion.nav>
  )
}

