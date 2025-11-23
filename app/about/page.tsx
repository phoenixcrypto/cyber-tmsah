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
      color: 'from-cyber-violet to-cyber-blue',
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
      color: 'from-cyber-blue to-cyber-violet',
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

      {/* Team Members Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Users className="w-6 h-6 text-cyber-neon" />
          <h2 className="section-title mb-0">{t('team.title') || 'فريق العمل'}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'زياد محمد',
              role: 'قائد الدفعة - مؤسس ومطور المنصة',
              description: 'قائد دفعة سايبر ومؤسس منصة سايبر تمساح. متخصص في هندسة البرمجيات وتطوير الأنظمة التعليمية. قمت بتصميم الموقع بالكامل ونشر الجدول الدراسي وشرح المواد التعليمية لمساعدة زملائي في الدفعة على الوصول للمحتوى التعليمي بسهولة.',
              responsibilities: [
                'تصميم وتطوير المنصة',
                'نشر الجدول الدراسي',
                'شرح المواد التعليمية',
                'إدارة المحتوى',
              ],
              socials: [
                { icon: Github, href: 'https://github.com/phoenixcrypto', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
                { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
              ],
              image: '/images/zeyad-mohamed.jpg'
            },
            {
              name: 'يوسف وليد',
              role: 'قائد الدفعة - مطور المنصة',
              description: 'قائد دفعة سايبر ومطور متخصص في تحسين تجربة المستخدم. يمتلك مهارات قوية في تحسين UX ويساهم بشكل فعال في تطوير المنصة.',
              responsibilities: [
                'تحسين تجربة المستخدم',
                'تطوير الواجهات',
                'ضمان الجودة',
              ],
              socials: [
                { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
              ],
              image: '/images/youssef-waleed.jpg'
            },
            {
              name: 'مؤمن هيثم',
              role: 'طالب في الدفعة - مساهم',
              description: 'طالب في دفعة سايبر يمتلك بعض المهارات في التطوير والتصميم. يساهم في المنصة من خلال مشاركته في المحتوى التعليمي والموارد المتعلقة بالأمن السيبراني.',
              responsibilities: [
                'المساهمة في المحتوى',
                'دليل الأمن السيبراني',
                'الموارد التعليمية',
              ],
              socials: [
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
                { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
              ],
              image: '/images/moamen-haytham.jpg'
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className="team-member-card-2030 stagger-item"
              style={{ animationDelay: `${1.7 + index * 0.15}s` }}
            >
              <div className="team-member-image-container-2030">
                <div className="team-member-image-placeholder-2030">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="team-member-image-2030"
                    priority
                  />
                </div>
              </div>
              <div className="team-member-info-2030">
                <h3 className="team-member-name-2030">{member.name}</h3>
                <p className="team-member-role-2030">{member.role}</p>
                <p className="team-member-description-2030">
                  {member.description}
                </p>
                <div className="team-member-responsibilities-2030">
                  <div className="team-member-responsibility-title-2030">المسؤوليات</div>
                  {member.responsibilities.map((responsibility, idx) => (
                    <div key={idx} className="team-member-responsibility-item-2030">
                      {responsibility}
                    </div>
                  ))}
                </div>
                <div className="team-member-socials-2030">
                  {member.socials.map((social, idx) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-social-button-2030"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{social.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
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
