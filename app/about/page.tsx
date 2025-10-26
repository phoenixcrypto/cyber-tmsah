'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, ThumbsUp, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [satisfactionRate, setSatisfactionRate] = useState(89)
  const [uptime, setUptime] = useState('99.9%')
  const [totalRatings, setTotalRatings] = useState(0)

  // محاكاة نظام التقييم التفاعلي
  useEffect(() => {
    const interval = setInterval(() => {
      // محاكاة تقييمات جديدة
      const newRatings = Math.floor(Math.random() * 3) + 1
      setTotalRatings(prev => prev + newRatings)
      
      // تحديث معدل الرضا بناءً على التقييمات الجديدة
      if (newRatings > 0) {
        const currentRate = satisfactionRate
        const newRate = Math.min(100, currentRate + (newRatings * 0.1))
        setSatisfactionRate(Math.round(newRate * 10) / 10)
      }
    }, 5000) // كل 5 ثوان

    return () => clearInterval(interval)
  }, [satisfactionRate])

  // محاكاة حساب مدة التشغيل
  useEffect(() => {
    const calculateUptime = () => {
      // محاكاة مدة تشغيل عالية
      const uptimePercentage = 99.9 + (Math.random() * 0.1)
      setUptime(`${uptimePercentage.toFixed(1)}%`)
    }

    calculateUptime()
    const interval = setInterval(calculateUptime, 10000) // كل 10 ثوان

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Users,
      title: 'مجتمع تعليمي',
      description: 'نحن نؤمن بقوة التعلم الجماعي وتبادل المعرفة',
      color: 'from-cyber-neon to-cyber-green'
    },
    {
      icon: BookOpen,
      title: 'محتوى عالي الجودة',
      description: 'نقدم مواد تعليمية متميزة ومحدثة باستمرار',
      color: 'from-cyber-violet to-cyber-blue'
    },
    {
      icon: Award,
      title: 'خبرة متميزة',
      description: 'فريق من الخبراء والمتخصصين في مجال التعليم',
      color: 'from-cyber-green to-cyber-neon'
    },
    {
      icon: Target,
      title: 'أهداف واضحة',
      description: 'نسعى لتحقيق أفضل النتائج التعليمية',
      color: 'from-cyber-blue to-cyber-violet'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'الشغف بالتعلم',
      description: 'نؤمن بأن التعلم هو رحلة مستمرة مدى الحياة'
    },
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'نستخدم أحدث التقنيات لتحسين تجربة التعلم'
    },
    {
      icon: Users,
      title: 'التعاون',
      description: 'نعمل معاً لتحقيق أهدافنا المشتركة'
    },
    {
      icon: Award,
      title: 'التميز',
      description: 'نسعى للتميز في كل ما نقدمه'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            حول منصة Cyber TMSAH
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            منصة تعليمية متطورة تجمع بين التكنولوجيا والتعليم لتحقيق أفضل تجربة تعلم
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-6">
              رسالتنا
            </h2>
            <p className="text-lg text-dark-300 leading-relaxed max-w-4xl mx-auto">
              نسعى لتوفير بيئة تعليمية متطورة ومحفزة تساعد الطلاب على تحقيق أقصى استفادة من تعلمهم. 
              نؤمن بأن التعليم يجب أن يكون تفاعلياً وممتعاً ومتاحاً للجميع، ولهذا نستخدم أحدث التقنيات 
              لإنشاء تجربة تعلم فريدة ومتميزة.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            مميزاتنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="enhanced-card p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-dark-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            قيمنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyber-dark" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-dark-300">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Interactive Stats Section */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            إحصائياتنا التفاعلية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-cyber-dark" />
              </div>
              <h3 className="text-3xl font-bold text-cyber-neon mb-2">700+</h3>
              <p className="text-dark-300">طالب نشط</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <ThumbsUp className="w-4 h-4 text-cyber-green" />
                <span className="text-sm text-cyber-green">+{totalRatings} تقييم جديد</span>
              </div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-dark-100" />
              </div>
              <h3 className="text-3xl font-bold text-cyber-violet mb-2">7</h3>
              <p className="text-dark-300">مادة تعليمية</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-cyber-dark" />
              </div>
              <h3 className="text-3xl font-bold text-cyber-green mb-2">{satisfactionRate}%</h3>
              <p className="text-dark-300">معدل الرضا</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">متجدد تلقائياً</span>
              </div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyber-violet rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-dark-100" />
              </div>
              <h3 className="text-3xl font-bold text-cyber-blue mb-2">{uptime}</h3>
              <p className="text-dark-300">وقت التشغيل</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">محدث تلقائياً</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            فريقنا
          </h2>
          <div className="enhanced-card p-8 text-center">
            <h3 className="text-xl font-semibold text-dark-100 mb-4">
              فريق من الخبراء والمتخصصين
            </h3>
            <p className="text-dark-300 leading-relaxed max-w-3xl mx-auto">
              نحن فريق من الخبراء والمتخصصين في مجال التعليم والتكنولوجيا، 
              نعمل معاً لتوفير أفضل تجربة تعلم ممكنة. فريقنا يتمتع بخبرة واسعة 
              في تطوير المنصات التعليمية وتصميم المحتوى التعليمي التفاعلي.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}