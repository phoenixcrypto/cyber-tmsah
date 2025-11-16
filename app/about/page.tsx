'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, Info, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Users,
      titleKey: 'about.feature1.title',
      descriptionKey: 'about.feature1.desc',
      color: 'from-cyber-neon to-cyber-green',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/10 to-cyber-neon/10'
    },
    {
      icon: BookOpen,
      titleKey: 'about.feature2.title',
      descriptionKey: 'about.feature2.desc',
      color: 'from-cyber-violet to-cyber-blue',
      bgGradient: 'from-cyber-violet/20 to-cyber-blue/20',
      cardBg: 'bg-gradient-to-br from-cyber-violet/10 to-cyber-blue/10'
    },
    {
      icon: Award,
      titleKey: 'about.feature3.title',
      descriptionKey: 'about.feature3.desc',
      color: 'from-cyber-green to-cyber-neon',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/15 to-cyber-neon/15'
    },
    {
      icon: Target,
      titleKey: 'about.feature4.title',
      descriptionKey: 'about.feature4.desc',
      color: 'from-cyber-blue to-cyber-violet',
      bgGradient: 'from-cyber-blue/20 to-cyber-violet/20',
      cardBg: 'bg-gradient-to-br from-cyber-blue/15 to-cyber-violet/15'
    }
  ]

  const values = [
    {
      icon: Heart,
      titleKey: 'about.value1.title',
      descriptionKey: 'about.value1.desc'
    },
    {
      icon: Lightbulb,
      titleKey: 'about.value2.title',
      descriptionKey: 'about.value2.desc'
    },
    {
      icon: Users,
      titleKey: 'about.value3.title',
      descriptionKey: 'about.value3.desc'
    },
    {
      icon: Award,
      titleKey: 'about.value4.title',
      descriptionKey: 'about.value4.desc'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Info className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              {t('about.title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Target className="w-6 h-6 text-cyber-neon" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
                {t('about.mission')}
              </h2>
            </div>
            <p className="text-lg text-dark-300 leading-relaxed max-w-4xl mx-auto">
              {t('about.mission.text')}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Star className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              {t('about.features')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`glass-card ${feature.cardBg} p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up-delayed`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-neon/30`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-100 mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-dark-300">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heart className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              {t('about.values')}
            </h2>
          </div>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2">
                        {t(value.titleKey)}
                      </h3>
                      <p className="text-dark-300">
                        {t(value.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Faculty Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              فريقنا
            </h2>
          </div>
          
          {/* Professors Section */}
          <div className="mb-8">
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-dark-100">أعضاء هيئة التدريس</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-dark-300">د. سيمون عزت - الرياضيات</div>
                <div className="text-dark-300">د. أحمد بكر - الفيزياء التطبيقية</div>
                <div className="text-dark-300">د. عبير حسن - قواعد البيانات وريادة الأعمال</div>
                <div className="text-dark-300">د. شيماء أحمد - تكنولوجيا المعلومات</div>
                <div className="text-dark-300">د. صابرين - اللغة الإنجليزية</div>
                <div className="text-dark-300">د. هند زيادة - نظم المعلومات</div>
              </div>
            </div>
          </div>

          {/* Teaching Assistants Section */}
          <div className="mb-8">
            <div className="enhanced-card p-6 bg-gradient-to-br from-cyber-violet/10 to-cyber-blue/10 border border-cyber-violet/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-xl flex items-center justify-center shadow-lg shadow-cyber-violet/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-dark-100">المعيدون</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-dark-300 font-medium">م. محمد مصطفى</div>
                <div className="text-dark-300 font-medium">م. إيهاب محمد</div>
                <div className="text-dark-300 font-medium">م. كريم عادل</div>
                <div className="text-dark-300 font-medium">م. محمود محمد</div>
                <div className="text-dark-300 font-medium">م. مريم أشرف</div>
                <div className="text-dark-300 font-medium">م. نجلة سعيد</div>
                <div className="text-dark-300 font-medium">م. أمنية إبراهيم</div>
                <div className="text-dark-300 font-medium">م. ياسمين إبراهيم</div>
                <div className="text-dark-300 font-medium">م. أحمد نشأت</div>
                <div className="text-dark-300 font-medium">م. محمد عمار</div>
                <div className="text-dark-300 font-medium">م. دينا علي</div>
                <div className="text-dark-300 font-medium">م. آية جمال</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
