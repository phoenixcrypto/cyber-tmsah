'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Shield, LogOut, LayoutDashboard, Calendar, BookOpen, Download, Users, Settings, Database } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => {
        router.push('/admin/login')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-neon/20 to-cyber-violet/20 rounded-2xl mb-4 border-2 border-cyber-neon/30 animate-pulse">
            <Shield className="w-8 h-8 text-cyber-neon" />
          </div>
          <p className="text-dark-300">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
    { href: '/admin/migrate', icon: Database, label: language === 'ar' ? 'نقل البيانات' : 'Migrate Data' },
    { href: '/admin/schedule', icon: Calendar, label: language === 'ar' ? 'إدارة الجداول' : 'Schedule' },
    { href: '/admin/materials', icon: BookOpen, label: language === 'ar' ? 'إدارة المواد' : 'Materials' },
    { href: '/admin/downloads', icon: Download, label: language === 'ar' ? 'إدارة البرامج' : 'Downloads' },
    { href: '/admin/users', icon: Users, label: language === 'ar' ? 'إدارة المستخدمين' : 'Users' },
    { href: '/admin/settings', icon: Settings, label: language === 'ar' ? 'الإعدادات' : 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-cyber-dark/95 border-l border-cyber-neon/20 backdrop-blur-lg z-50">
        <div className="p-6 border-b border-cyber-neon/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-neon/20 to-cyber-violet/20 rounded-lg flex items-center justify-center border border-cyber-neon/30">
              <Shield className="w-6 h-6 text-cyber-neon" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-100">Admin Panel</h2>
              <p className="text-xs text-dark-400">{user.name}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border border-cyber-neon/30 text-cyber-neon'
                    : 'text-dark-300 hover:bg-cyber-dark/50 hover:text-dark-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyber-neon/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  )
}

