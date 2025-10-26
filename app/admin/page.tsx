import Link from 'next/link'
import { Settings, Users, BookOpen, BarChart3, Shield, Database } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminPage() {
  const adminFeatures = [
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'إدارة حسابات المستخدمين والصلاحيات',
      href: '/admin/users',
      color: 'from-cyber-neon to-cyber-green'
    },
    {
      icon: BookOpen,
      title: 'إدارة المحتوى',
      description: 'إضافة وتعديل المواد التعليمية',
      href: '/admin/content',
      color: 'from-cyber-violet to-cyber-blue'
    },
    {
      icon: BarChart3,
      title: 'التقارير والإحصائيات',
      description: 'عرض التقارير والإحصائيات التفصيلية',
      href: '/admin/reports',
      color: 'from-cyber-green to-cyber-neon'
    },
    {
      icon: Settings,
      title: 'إعدادات النظام',
      description: 'تكوين إعدادات النظام العامة',
      href: '/admin/settings',
      color: 'from-cyber-blue to-cyber-violet'
    },
    {
      icon: Shield,
      title: 'الأمان والصلاحيات',
      description: 'إدارة الأمان والصلاحيات',
      href: '/admin/security',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Database,
      title: 'إدارة قاعدة البيانات',
      description: 'صيانة وإدارة قاعدة البيانات',
      href: '/admin/database',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            لوحة الإدارة
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            إدارة شاملة لمنصة التعلم الإلكتروني
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-cyber-dark" />
            </div>
            <h3 className="text-2xl font-bold text-cyber-neon mb-2">1,234</h3>
            <p className="text-dark-300">المستخدمين النشطين</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-dark-100" />
            </div>
            <h3 className="text-2xl font-bold text-cyber-violet mb-2">567</h3>
            <p className="text-dark-300">المواد التعليمية</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-cyber-dark" />
            </div>
            <h3 className="text-2xl font-bold text-cyber-green mb-2">89%</h3>
            <p className="text-dark-300">معدل الإنجاز</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyber-violet rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-dark-100" />
            </div>
            <h3 className="text-2xl font-bold text-cyber-blue mb-2">99.9%</h3>
            <p className="text-dark-300">وقت التشغيل</p>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group block"
              >
                <div className="enhanced-card p-6 text-center h-full hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-8 h-8 text-dark-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-100 mb-2 group-hover:text-cyber-neon transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 group-hover:text-dark-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 animate-slide-up">
          <h2 className="text-2xl font-semibold text-dark-100 mb-6 text-center">
            إجراءات سريعة
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/admin/new"
              className="btn-primary flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              إضافة مادة جديدة
            </Link>
            
            <Link
              href="/admin/users"
              className="btn-secondary flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              إدارة المستخدمين
            </Link>
            
            <Link
              href="/admin/reports"
              className="btn-tertiary flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              عرض التقارير
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}