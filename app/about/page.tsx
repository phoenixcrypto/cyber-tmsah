'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, Info, Star, Github, Linkedin, MessageCircle, Rocket, Shield, Globe, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'

export default function AboutPage() {
  const { t } = useLanguage()

  const storySections = [
    {
      icon: Rocket,
      title: 'البداية',
      content: 'بدأت منصة سايبر تمساح كفكرة بسيطة من قائد الدفعة لمساعدة زملائه في الوصول للمحتوى التعليمي بسهولة. كانت البداية بنشر الجدول الدراسي وشرح المواد التعليمية.'
    },
    {
      icon: Target,
      title: 'الرؤية',
      content: 'نطمح لأن نكون المنصة التعليمية الرائدة في مجال الأمن السيبراني، حيث يمكن للطلاب الوصول لجميع الموارد التعليمية في مكان واحد بسهولة ويسر.'
    },
    {
      icon: Zap,
      title: 'التطور',
      content: 'تطورت المنصة بسرعة لتصبح منصة شاملة تحتوي على الجدول الدراسي، المواد التعليمية، خريطة الطريق، الكتب، الدورات، البودكاست، والكثير من الموارد التعليمية الأخرى.'
    }
  ]

  const features = [
    {
      icon: Users,
      title: 'منصة تعليمية شاملة',
      description: 'نوفر جميع الموارد التعليمية التي يحتاجها طلاب الأمن السيبراني في مكان واحد',
      color: 'from-cyber-neon to-cyber-green',
    },
    {
      icon: BookOpen,
      title: 'محتوى عالي الجودة',
      description: 'نحرص على تقديم محتوى تعليمي دقيق ومحدث من مصادر موثوقة',
      color: 'from-cyber-neon to-cyber-green',
    },
    {
      icon: Award,
      title: 'خريطة طريق واضحة',
      description: 'نقدم خريطة طريق مفصلة لمساعدة الطلاب على تحديد مسارهم التعليمي',
      color: 'from-cyber-green to-cyber-neon',
    },
    {
      icon: Target,
      title: 'سهولة الوصول',
      description: 'تصميم بسيط وواضح يسهل على الطلاب الوصول للمعلومات بسرعة',
      color: 'from-cyber-neon to-cyber-green',
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'الشغف',
      description: 'نؤمن بقوة التعليم وأثره في تغيير حياة الطلاب. نحن متحمسون لمساعدة كل طالب يريد التعلم.'
    },
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'نسعى دائماً لتطوير وتحسين المنصة باستخدام أحدث التقنيات وأفضل الممارسات.'
    },
    {
      icon: Users,
      title: 'المجتمع',
      description: 'نؤمن بقوة المجتمع التعليمي. نسعى لبناء مجتمع من الطلاب المتعاونين والمتعلمين.'
    },
    {
      icon: Shield,
      title: 'الجودة',
      description: 'نحرص على تقديم محتوى عالي الجودة وموثوق. كل ما نقدمه يتم مراجعته بعناية.'
    }
  ]

  const stats = [
    { icon: BookOpen, value: '7+', label: 'مواد تعليمية' },
    { icon: Users, value: '15+', label: 'مجموعة دراسية' },
    { icon: Award, value: '100+', label: 'مورد تعليمي' },
    { icon: Target, value: '24/7', label: 'متاح دائماً' }
  ]

  return (
    <div className="page-container">
      <PageHeader 
        title={t('about.title')} 
        icon={Info}
        description={t('about.description') || 'تعرف على منصة سايبر تمساح وفريق العمل ورؤيتنا للمستقبل'}
      />

      {/* Story Section */}
      <div className="mb-16">
        <h2 className="section-title text-center mb-8">قصتنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storySections.map((section, index) => {
            const Icon = section.icon
            return (
              <div
                key={index}
                className="enhanced-card-2030 stagger-item"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="subsection-title mb-0">{section.title}</h3>
                </div>
                <p className="content-paragraph">{section.content}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="enhanced-card-2030 mb-16 stagger-item" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-4 mb-6">
          <Target className="w-8 h-8 text-cyber-neon" />
          <h2 className="section-title mb-0">{t('about.mission') || 'مهمتنا'}</h2>
        </div>
        <p className="content-paragraph text-lg">
          {t('about.mission.text') || 'مهمتنا هي توفير منصة تعليمية شاملة وسهلة الاستخدام لطلاب الأمن السيبراني، حيث يمكنهم الوصول لجميع الموارد التعليمية التي يحتاجونها في مكان واحد. نسعى لتمكين الطلاب من تحقيق أهدافهم التعليمية والمهنية من خلال توفير محتوى عالي الجودة وموارد تعليمية متنوعة.'}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="enhanced-card-2030 text-center stagger-item"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-neon/30">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-cyber-neon mb-2">{stat.value}</div>
              <div className="text-dark-300">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Star className="w-6 h-6 text-cyber-neon" />
          <h2 className="section-title mb-0">{t('about.features') || 'مميزاتنا'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="enhanced-card-2030 stagger-item"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyber-neon/30`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="subsection-title mb-3">{feature.title}</h3>
                <p className="content-paragraph">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Heart className="w-6 h-6 text-cyber-neon" />
          <h2 className="section-title mb-0">{t('about.values') || 'قيمنا'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="enhanced-card-2030 stagger-item"
                style={{ animationDelay: `${1.3 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="subsection-title mb-2">{value.title}</h3>
                    <p className="content-paragraph">{value.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Team Members Section - Founder Only */}
      <div className="mb-16">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Users className="w-6 h-6 text-cyber-neon" />
          <h2 className="section-title mb-0">{t('team.title') || 'مؤسس المنصة'}</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className="team-member-card-2030-enhanced stagger-item"
            style={{ animationDelay: '1.7s' }}
          >
            <div className="team-member-hero-section-2030">
              <div className="team-member-image-container-hero-2030">
                <div className="team-member-image-placeholder-hero-2030">
                  <Image
                    src="/images/zeyad-mohamed.jpg"
                    alt="زياد محمد"
                    width={300}
                    height={300}
                    className="team-member-image-hero-2030"
                    priority
                  />
                  <div className="team-member-image-glow-2030"></div>
                </div>
              </div>
              <div className="team-member-hero-content-2030">
                <div className="team-member-badge-2030">
                  <Star className="w-5 h-5" />
                  <span>المؤسس والرئيس التنفيذي</span>
                </div>
                <h3 className="team-member-name-hero-2030">زياد محمد</h3>
                <p className="team-member-role-hero-2030">قائد الدفعة - مؤسس ومطور المنصة</p>
                <p className="team-member-description-hero-2030">
                  قائد دفعة سايبر ومؤسس منصة سايبر تمساح. أعمل في التدوين وإنشاء قوالب بلوجر والتطوير في قوالب ووردبريس الحديثة.
                  عملت كفريلانسر في الجرافيك ديزاين، وكنت منشئ محتوى في التدوين والمجال التقني.
                  أحب الأمن السيبراني وأسعى للتطور بداخله ونشر المعلومة، لأن طبعي هو نشر المعلومات وإفادة الجميع.
                  قمت بتطوير هذه المنصة لمساعدة زملائي في الدفعة على الوصول للمحتوى التعليمي بسهولة.
                </p>
                
                <div className="team-member-skills-2030">
                  <div className="team-member-skill-tag-2030">
                    <BookOpen className="w-4 h-4" />
                    <span>التدوين</span>
                  </div>
                  <div className="team-member-skill-tag-2030">
                    <Rocket className="w-4 h-4" />
                    <span>تطوير القوالب</span>
                  </div>
                  <div className="team-member-skill-tag-2030">
                    <Target className="w-4 h-4" />
                    <span>الجرافيك ديزاين</span>
                  </div>
                  <div className="team-member-skill-tag-2030">
                    <Zap className="w-4 h-4" />
                    <span>إنشاء المحتوى</span>
                  </div>
                  <div className="team-member-skill-tag-2030">
                    <Shield className="w-4 h-4" />
                    <span>الأمن السيبراني</span>
                  </div>
                </div>
                
                <div className="team-member-socials-enhanced-2030">
                  <Link
                    href="https://github.com/phoenixcrypto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-social-button-enhanced-2030 team-social-github-2030"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-social-button-enhanced-2030 team-social-linkedin-2030"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </Link>
                  <Link
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-social-button-enhanced-2030 team-social-whatsapp-2030"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="enhanced-card-2030 text-center stagger-item" style={{ animationDelay: '2.2s' }}>
        <Globe className="w-12 h-12 text-cyber-neon mx-auto mb-4" />
        <h2 className="section-title mb-4">انضم إلينا</h2>
        <p className="content-paragraph mb-6">
          هل تريد المساهمة في تطوير المنصة أو لديك اقتراحات لتحسينها؟ 
          نحن دائماً متحمسون للتعاون مع أعضاء المجتمع التعليمي.
        </p>
        <Link href="/contact" className="button-2030 inline-flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span>تواصل معنا</span>
        </Link>
      </div>
    </div>
  )
}
