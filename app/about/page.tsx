'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, Info, GraduationCap, UserCheck, Star } from 'lucide-react'

export default function AboutPage() {

  const features = [
    {
      icon: Users,
      title: 'مجتمع تعليمي',
      description: 'نحن نؤمن بقوة التعلم الجماعي وتبادل المعرفة',
      color: 'from-cyber-neon to-cyber-green',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/10 to-cyber-neon/10'
    },
    {
      icon: BookOpen,
      title: 'محتوى عالي الجودة',
      description: 'نقدم مواد تعليمية متميزة ومحدثة باستمرار',
      color: 'from-cyber-violet to-cyber-blue',
      bgGradient: 'from-cyber-violet/20 to-cyber-blue/20',
      cardBg: 'bg-gradient-to-br from-cyber-violet/10 to-cyber-blue/10'
    },
    {
      icon: Award,
      title: 'خبرة متميزة',
      description: 'فريق من الخبراء والمتخصصين في مجال التعليم',
      color: 'from-cyber-green to-cyber-neon',
      bgGradient: 'from-cyber-green/20 to-cyber-neon/20',
      cardBg: 'bg-gradient-to-br from-cyber-green/15 to-cyber-neon/15'
    },
    {
      icon: Target,
      title: 'أهداف واضحة',
      description: 'نسعى لتحقيق أفضل النتائج التعليمية',
      color: 'from-cyber-blue to-cyber-violet',
      bgGradient: 'from-cyber-blue/20 to-cyber-violet/20',
      cardBg: 'bg-gradient-to-br from-cyber-blue/15 to-cyber-violet/15'
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <Info className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              حول منصة Cyber TMSAH
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            منصة تعليمية متطورة تجمع بين التكنولوجيا والتعليم لتحقيق أفضل تجربة تعلم
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Target className="w-6 h-6 text-cyber-neon" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
                رسالتنا
              </h2>
            </div>
            <p className="text-lg text-dark-300 leading-relaxed max-w-4xl mx-auto">
              نسعى لتوفير بيئة تعليمية متطورة ومحفزة تساعد الطلاب على تحقيق أقصى استفادة من تعلمهم. 
              نؤمن بأن التعليم يجب أن يكون تفاعلياً وممتعاً ومتاحاً للجميع، ولهذا نستخدم أحدث التقنيات 
              لإنشاء تجربة تعلم فريدة ومتميزة.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Star className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              مميزاتنا
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
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heart className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              قيمنا
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

        {/* Faculty Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              أعضاء هيئة التدريس
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Doctors */}
            <div className="enhanced-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-neon/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">الدكاترة</h3>
              <div className="space-y-2 text-dark-300">
                <p>د. أحمد محمد - فيزياء تطبيقية</p>
                <p>د. سارة أحمد - رياضيات</p>
                <p>د. محمد علي - مهارات الريادة</p>
                <p>د. فاطمة حسن - تكنولوجيا المعلومات</p>
                <p>د. نور الدين - إنجليزي</p>
              </div>
            </div>

            {/* Teaching Assistants */}
            <div className="enhanced-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-violet/30">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">المعيدين</h3>
              <div className="space-y-2 text-dark-300">
                <p>م. علي محمود - نظم قواعد البيانات</p>
                <p>م. مريم أحمد - انفورميشن سيستيم</p>
                <p>م. أحمد علي - تكنولوجيا المعلومات</p>
                <p>م. فاطمة علي - نظم قواعد البيانات</p>
                <p>م. محمد حسن - انفورميشن سيستيم</p>
              </div>
            </div>

            {/* Support Staff */}
            <div className="enhanced-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-green/30">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">الموظفين المساعدين</h3>
              <div className="space-y-2 text-dark-300">
                <p>أ. سارة محمد - إدارة الطلاب</p>
                <p>أ. خالد محمد - الدعم التقني</p>
                <p>أ. نورا أحمد - شؤون أكاديمية</p>
                <p>أ. محمود حسن - التنسيق</p>
                <p>أ. ياسمين علي - المتابعة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-8 text-center">
            عني
          </h2>
          <div className="enhanced-card p-8 text-center">
            <h3 className="text-xl font-semibold text-dark-100 mb-4">
              مطور ومصمم المنصة
            </h3>
            <p className="text-dark-300 leading-relaxed max-w-3xl mx-auto">
              أنا مطور ومصمم متخصص في مجال التعليم والتكنولوجيا، 
              أعمل على تطوير منصات تعليمية متطورة وتصميم تجارب مستخدم متميزة. 
              لدي خبرة واسعة في تطوير المنصات التعليمية وتصميم المحتوى التعليمي التفاعلي.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}