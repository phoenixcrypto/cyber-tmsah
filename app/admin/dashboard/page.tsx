'use client'

import { useEffect, useState } from 'react'
import { LayoutDashboard, Calendar, BookOpen, Download, Users, Activity, Shield, FileText, File, TrendingUp, Clock, AlertCircle, CheckCircle, ArrowRight, BarChart3, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

interface DashboardStats {
  scheduleItems: number
  materials: number
  downloads: number
  users: number
  articles: number
  pages: number
}

interface RecentActivity {
  type: 'created' | 'updated' | 'deleted'
  entity: string
  name: string
  time: string
}

export default function AdminDashboardPage() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    scheduleItems: 0,
    materials: 0,
    downloads: 0,
    users: 0,
    articles: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    // Auto-migrate data on first load
    const autoMigrate = async () => {
      try {
        const statusRes = await fetch('/api/admin/auto-migrate')
        const statusData = await statusRes.json()
        
        if (statusData.status?.needsMigration) {
          // Auto-migrate silently
          await fetch('/api/admin/auto-migrate', { method: 'POST' })
        }
      } catch (error) {
        console.error('Auto-migration error:', error)
      }
    }

    // Fetch dashboard stats from APIs
    const fetchStats = async () => {
      try {
        const [scheduleRes, materialsRes, downloadsRes, articlesRes, pagesRes, usersRes] = await Promise.all([
          fetch('/api/schedule'),
          fetch('/api/materials'),
          fetch('/api/downloads'),
          fetch('/api/admin/articles'),
          fetch('/api/admin/pages'),
          fetch('/api/admin/users'),
        ])

        const scheduleData = await scheduleRes.json()
        const materialsData = await materialsRes.json()
        const downloadsData = await downloadsRes.json()
        const articlesData = await articlesRes.json()
        const pagesData = await pagesRes.json()
        const usersData = await usersRes.json()

        const newStats = {
          scheduleItems: scheduleData.schedule?.length || 0,
          materials: materialsData.materials?.length || 0,
          downloads: downloadsData.software?.length || 0,
          users: usersData.users?.length || 0,
          articles: articlesData.articles?.length || 0,
          pages: pagesData.pages?.length || 0,
        }

        setStats(newStats)
        
        // Generate recent activity from stats
        const activity: RecentActivity[] = []
        if (newStats.articles > 0) {
          activity.push({
            type: 'created',
            entity: 'article',
            name: language === 'ar' ? 'مقال جديد' : 'New Article',
            time: new Date().toISOString(),
          })
        }
        if (newStats.pages > 0) {
          activity.push({
            type: 'created',
            entity: 'page',
            name: language === 'ar' ? 'صفحة جديدة' : 'New Page',
            time: new Date().toISOString(),
          })
        }
        setRecentActivity(activity.slice(0, 5))
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }

    // Run auto-migration first, then fetch stats
    autoMigrate().then(() => fetchStats())
  }, [language])

  const statCards = [
    {
      title: language === 'ar' ? 'عناصر الجدول' : 'Schedule Items',
      value: stats.scheduleItems,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      link: '/admin/schedule',
      trend: '+12%',
    },
    {
      title: language === 'ar' ? 'المواد التعليمية' : 'Materials',
      value: stats.materials,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      link: '/admin/materials',
      trend: '+5%',
    },
    {
      title: language === 'ar' ? 'المقالات' : 'Articles',
      value: stats.articles,
      icon: FileText,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-500/10 to-cyan-600/10',
      link: '/admin/articles',
      trend: '+8%',
    },
    {
      title: language === 'ar' ? 'الصفحات' : 'Pages',
      value: stats.pages,
      icon: File,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-500/10 to-indigo-600/10',
      link: '/admin/pages',
      trend: '+3%',
    },
    {
      title: language === 'ar' ? 'البرامج' : 'Downloads',
      value: stats.downloads,
      icon: Download,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      link: '/admin/downloads',
      trend: '+15%',
    },
    {
      title: language === 'ar' ? 'المستخدمين' : 'Users',
      value: stats.users,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10',
      link: '/admin/users',
      trend: '+2%',
    },
  ]

  const quickActions = [
    {
      title: language === 'ar' ? 'إدارة الجداول' : 'Manage Schedule',
      description: language === 'ar' ? 'تعديل وإدارة الجداول الدراسية' : 'Edit and manage study schedules',
      icon: Calendar,
      href: '/admin/schedule',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: language === 'ar' ? 'إدارة المواد' : 'Manage Materials',
      description: language === 'ar' ? 'تعديل وإدارة المواد التعليمية' : 'Edit and manage educational materials',
      icon: BookOpen,
      href: '/admin/materials',
      color: 'from-green-500 to-green-600',
    },
    {
      title: language === 'ar' ? 'إدارة المقالات' : 'Manage Articles',
      description: language === 'ar' ? 'إضافة وتعديل وحذف المقالات' : 'Add, edit and delete articles',
      icon: FileText,
      href: '/admin/articles',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: language === 'ar' ? 'إدارة الصفحات' : 'Manage Pages',
      description: language === 'ar' ? 'إضافة وتعديل وحذف الصفحات' : 'Add, edit and delete pages',
      icon: File,
      href: '/admin/pages',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: language === 'ar' ? 'إدارة البرامج' : 'Manage Downloads',
      description: language === 'ar' ? 'تعديل وإدارة برامج التنزيل' : 'Edit and manage download programs',
      icon: Download,
      href: '/admin/downloads',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users',
      description: language === 'ar' ? 'إضافة وتعديل وحذف المستخدمين' : 'Add, edit and delete users',
      icon: Users,
      href: '/admin/users',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return CheckCircle
      case 'updated':
        return TrendingUp
      case 'deleted':
        return AlertCircle
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'text-green-400'
      case 'updated':
        return 'text-blue-400'
      case 'deleted':
        return 'text-red-400'
      default:
        return 'text-cyber-neon'
    }
  }

  const formatTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return language === 'ar' ? 'الآن' : 'Just now'
    if (minutes < 60) return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`
    if (hours < 24) return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`
    return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`
  }

  const totalItems = stats.scheduleItems + stats.materials + stats.articles + stats.pages + stats.downloads

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="enhanced-card p-8 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-dark-100 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              {language === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Dashboard'}
            </h1>
            <p className="text-dark-300 text-lg">
              {language === 'ar' 
                ? `إجمالي العناصر: ${totalItems} • آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')}`
                : `Total Items: ${totalItems} • Last Update: ${new Date().toLocaleTimeString('en-US')}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-cyber-neon/20 to-cyber-green/20 rounded-lg border border-cyber-neon/30">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-neon" />
                <span className="text-sm font-semibold text-dark-100">
                  {language === 'ar' ? 'نظام متزامن' : 'Real-time Sync'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              href={stat.link}
              className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-bold text-green-400">{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-dark-300 mb-2">{stat.title}</h3>
              <div className="flex items-baseline justify-between">
                <p className="text-4xl font-bold text-dark-100">
                  {loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-cyber-neon/30 border-t-cyber-neon rounded-full animate-spin"></span>
                  ) : (
                    stat.value
                  )}
                </p>
                <ArrowRight className="w-5 h-5 text-cyber-neon opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Enhanced */}
        <div className="lg:col-span-2 enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="group p-5 bg-gradient-to-br from-cyber-dark/50 to-cyber-dark/30 rounded-xl border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-neon/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-dark-100 mb-1 group-hover:text-cyber-neon transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-dark-300 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-cyber-neon opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
            <h2 className="text-xl font-bold text-dark-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyber-neon" />
              {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-cyber-dark/30 rounded-lg border border-cyber-neon/10">
                      <ActivityIcon className={`w-4 h-4 ${getActivityColor(activity.type)} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-100 truncate">{activity.name}</p>
                        <p className="text-xs text-dark-400">{formatTime(activity.time)}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-dark-400">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{language === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
            <h2 className="text-xl font-bold text-dark-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyber-neon" />
              {language === 'ar' ? 'حالة النظام' : 'System Status'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-dark-100">{language === 'ar' ? 'قاعدة البيانات' : 'Database'}</span>
                </div>
                <span className="text-xs font-bold text-green-400">{language === 'ar' ? 'متصل' : 'Online'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-dark-100">{language === 'ar' ? 'API' : 'API'}</span>
                </div>
                <span className="text-xs font-bold text-green-400">{language === 'ar' ? 'يعمل' : 'Active'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-dark-100">{language === 'ar' ? 'المصادقة' : 'Authentication'}</span>
                </div>
                <span className="text-xs font-bold text-green-400">{language === 'ar' ? 'آمن' : 'Secure'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice - Enhanced */}
      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-neon/20 to-cyber-violet/20 flex items-center justify-center border border-cyber-neon/30 flex-shrink-0">
            <Shield className="w-7 h-7 text-cyber-neon" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark-100 mb-3">
              {language === 'ar' ? 'الأمان والحماية' : 'Security & Protection'}
            </h3>
            <p className="text-dark-300 mb-4 leading-relaxed">
              {language === 'ar' 
                ? 'لوحة التحكم محمية بنظام مصادقة قوي ومتقدم. تأكد من تغيير كلمة المرور الافتراضية بعد أول تسجيل دخول للحفاظ على أمان حسابك.'
                : 'The admin panel is protected by a strong and advanced authentication system. Make sure to change the default password after first login to keep your account secure.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-cyber-dark/30 rounded-lg border border-cyber-neon/10">
                <Shield className="w-4 h-4 text-cyber-neon" />
                <span className="text-sm text-dark-200">{language === 'ar' ? 'JWT Tokens' : 'JWT Tokens'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cyber-dark/30 rounded-lg border border-cyber-neon/10">
                <Shield className="w-4 h-4 text-cyber-neon" />
                <span className="text-sm text-dark-200">{language === 'ar' ? 'Rate Limiting' : 'Rate Limiting'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cyber-dark/30 rounded-lg border border-cyber-neon/10">
                <Shield className="w-4 h-4 text-cyber-neon" />
                <span className="text-sm text-dark-200">{language === 'ar' ? 'CSRF Protection' : 'CSRF Protection'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
