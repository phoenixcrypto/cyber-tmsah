import Link from 'next/link'
import { Calendar, CheckSquare, BookOpen, ArrowRight, Sparkles, Zap, Shield, Clock, MapPin, User } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'جدول الحصص',
      description: 'عرض جدول الحصص والأحداث المهمة',
      href: '/schedule',
      color: 'from-cyber-neon via-cyber-green to-cyber-neon'
    },
    {
      icon: CheckSquare,
      title: 'إدارة المهام',
      description: 'تنظيم المهام والواجبات',
      href: '/tasks',
      color: 'from-cyber-violet via-cyber-blue to-cyber-violet'
    },
    {
      icon: BookOpen,
      title: 'المواد التعليمية',
      description: 'الوصول للمواد والمحاضرات',
      href: '/materials',
      color: 'from-cyber-green via-cyber-neon to-cyber-green'
    }
  ]

  // جدول اليوم
  const todaySchedule = [
    {
      time: '09:00 - 10:30',
      subject: 'قواعد البيانات',
      instructor: 'د. أحمد محمد',
      room: 'قاعة 101',
      type: 'محاضرة'
    },
    {
      time: '11:00 - 12:30',
      subject: 'البرمجة المتقدمة',
      instructor: 'د. فاطمة علي',
      room: 'معمل 205',
      type: 'عملي'
    },
    {
      time: '14:00 - 15:30',
      subject: 'الشبكات',
      instructor: 'د. محمد حسن',
      room: 'قاعة 301',
      type: 'محاضرة'
    }
  ]

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyber-neon/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyber-violet/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyber-green/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold text-dark-100 mb-6 leading-tight">
              مرحباً بك في
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green">
                Cyber TMSAH
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              منصة تعليمية حديثة ومتطورة تجمع بين التكنولوجيا والتعليم لتحقيق أفضل تجربة تعلم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/schedule"
                className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold group"
              >
                ابدأ التعلم
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/materials"
                className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold group"
              >
                استكشف المواد
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">تعلم سريع</h3>
              <p className="text-dark-300">تقنيات متقدمة للتعلم السريع والفعال</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-violet via-cyber-blue to-cyber-violet rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-violet/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">آمن ومضمون</h3>
              <p className="text-dark-300">حماية كاملة لبياناتك ومعلوماتك</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-green via-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">تجربة مميزة</h3>
              <p className="text-dark-300">واجهة مستخدم حديثة وسهلة الاستخدام</p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyber-neon rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyber-neon rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-cyber-dark to-cyber-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
              الميزات الرئيسية
            </h2>
            <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
              اكتشف جميع الميزات المتاحة في منصتنا التعليمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group block"
                >
                  <div className="enhanced-card p-6 text-center h-full hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30`}>
                      <Icon className="w-8 h-8 text-white" />
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
        </div>
      </section>

      {/* Schedule Preview Section */}
      <section className="py-20 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-cyber-neon" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
                جدول اليوم
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
              {getCurrentDate()}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-6 h-6 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-full flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-cyber-neon font-semibold">{getCurrentTime()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {todaySchedule.map((schedule, index) => (
              <div
                key={index}
                className="enhanced-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-full flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-cyber-neon font-semibold">{schedule.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    schedule.type === 'محاضرة' 
                      ? 'bg-cyber-violet/20 text-cyber-violet' 
                      : 'bg-cyber-green/20 text-cyber-green'
                  }`}>
                    {schedule.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-dark-100 mb-3">
                  {schedule.subject}
                </h3>
                
                <div className="space-y-2">
                      <div className="flex items-center gap-3 text-dark-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyber-violet via-cyber-blue to-cyber-violet rounded-full flex items-center justify-center shadow-lg shadow-cyber-violet/30">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">{schedule.instructor}</span>
                      </div>
                      <div className="flex items-center gap-3 text-dark-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyber-green via-cyber-neon to-cyber-green rounded-full flex items-center justify-center shadow-lg shadow-cyber-green/30">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">{schedule.room}</span>
                      </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center animate-slide-up-delayed">
            <Link
              href="/schedule"
              className="btn-primary inline-flex items-center gap-2"
            >
              عرض الجدول الكامل
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}