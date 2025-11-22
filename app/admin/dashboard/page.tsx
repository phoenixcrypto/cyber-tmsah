'use client'

import { useEffect, useState } from 'react'
import { LayoutDashboard, Calendar, BookOpen, Download, Users, Activity, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DashboardStats {
  scheduleItems: number
  materials: number
  downloads: number
  users: number
}

export default function AdminDashboardPage() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    scheduleItems: 0,
    materials: 0,
    downloads: 0,
    users: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats
    // For now, we'll use static data
    // In production, fetch from API
    setTimeout(() => {
      setStats({
        scheduleItems: 150, // Example
        materials: 7,
        downloads: 3,
        users: 1,
      })
      setLoading(false)
    }, 500)
  }, [])

  const statCards = [
    {
      title: language === 'ar' ? 'عناصر الجدول' : 'Schedule Items',
      value: stats.scheduleItems,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: language === 'ar' ? 'المواد التعليمية' : 'Materials',
      value: stats.materials,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
    },
    {
      title: language === 'ar' ? 'البرامج' : 'Downloads',
      value: stats.downloads,
      icon: Download,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: language === 'ar' ? 'المستخدمين' : 'Users',
      value: stats.users,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-cyber-neon" />
          {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-dark-300">
          {language === 'ar' ? 'نظرة عامة على الموقع وإحصائياته' : 'Overview of the site and its statistics'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-dark-300 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-dark-100">
                {loading ? '...' : stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <h2 className="text-xl font-bold text-dark-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-neon" />
          {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/schedule"
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-6 h-6 text-cyber-neon mb-2" />
            <h3 className="font-semibold text-dark-100 mb-1">
              {language === 'ar' ? 'إدارة الجداول' : 'Manage Schedule'}
            </h3>
            <p className="text-sm text-dark-300">
              {language === 'ar' ? 'تعديل وإدارة الجداول الدراسية' : 'Edit and manage study schedules'}
            </p>
          </a>
          <a
            href="/admin/materials"
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="w-6 h-6 text-cyber-neon mb-2" />
            <h3 className="font-semibold text-dark-100 mb-1">
              {language === 'ar' ? 'إدارة المواد' : 'Manage Materials'}
            </h3>
            <p className="text-sm text-dark-300">
              {language === 'ar' ? 'تعديل وإدارة المواد التعليمية' : 'Edit and manage educational materials'}
            </p>
          </a>
          <a
            href="/admin/downloads"
            className="p-4 bg-cyber-dark/50 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-105"
          >
            <Download className="w-6 h-6 text-cyber-neon mb-2" />
            <h3 className="font-semibold text-dark-100 mb-1">
              {language === 'ar' ? 'إدارة البرامج' : 'Manage Downloads'}
            </h3>
            <p className="text-sm text-dark-300">
              {language === 'ar' ? 'تعديل وإدارة برامج التنزيل' : 'Edit and manage download programs'}
            </p>
          </a>
        </div>
      </div>

      {/* Security Notice */}
      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-neon/20 to-cyber-violet/20 flex items-center justify-center border border-cyber-neon/30 flex-shrink-0">
            <Shield className="w-6 h-6 text-cyber-neon" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-100 mb-2">
              {language === 'ar' ? 'الأمان' : 'Security'}
            </h3>
            <p className="text-dark-300 text-sm mb-2">
              {language === 'ar' 
                ? 'لوحة التحكم محمية بنظام مصادقة قوي. تأكد من تغيير كلمة المرور الافتراضية بعد أول تسجيل دخول.'
                : 'The admin panel is protected by a strong authentication system. Make sure to change the default password after first login.'}
            </p>
            <ul className="text-dark-400 text-xs space-y-1 list-disc list-inside">
              <li>{language === 'ar' ? 'JWT Tokens للتشفير' : 'JWT Tokens for encryption'}</li>
              <li>{language === 'ar' ? 'Rate Limiting للحماية' : 'Rate Limiting for protection'}</li>
              <li>{language === 'ar' ? 'CSRF Protection' : 'CSRF Protection'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

