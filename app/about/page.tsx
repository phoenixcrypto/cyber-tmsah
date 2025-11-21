'use client'

import { Users, BookOpen, Award, Target, Heart, Lightbulb, Info, Star, Github, Linkedin, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'

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
        {/* Unified Page Header */}
        <PageHeader 
          title={t('about.title')} 
          icon={Info}
          description={t('about.description')}
        />

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

        {/* Team Members Section */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-cyber-neon" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100">
              {t('team.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  { icon: 'github', href: 'https://github.com/phoenixcrypto', label: 'GitHub' },
                  { icon: 'linkedin', href: 'https://www.linkedin.com', label: 'LinkedIn' },
                  { icon: 'whatsapp', href: 'https://wa.me/', label: 'WhatsApp' },
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
                  { icon: 'whatsapp', href: 'https://wa.me/', label: 'WhatsApp' },
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
                  { icon: 'github', href: 'https://github.com', label: 'GitHub' },
                  { icon: 'linkedin', href: 'https://www.linkedin.com', label: 'LinkedIn' },
                  { icon: 'whatsapp', href: 'https://wa.me/', label: 'WhatsApp' },
                ],
                image: '/images/moamen-haytham.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="team-member-card-about">
                <div className="team-member-image-container-about">
                  <div className="team-member-image-placeholder-about">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="team-member-image-about"
                      priority
                    />
                  </div>
                </div>
                <div className="team-member-info-about">
                  <h3 className="team-member-name-about">{member.name}</h3>
                  <p className="team-member-role-about">{member.role}</p>
                  <p className="team-member-description-about">
                    {member.description}
                  </p>
                  <div className="team-member-responsibilities-about">
                    <div className="team-member-responsibility-title-about">{t('team.responsibilities')}</div>
                    {member.responsibilities.map((responsibility, idx) => (
                      <div key={idx} className="team-member-responsibility-item-about">
                        {responsibility}
                      </div>
                    ))}
                  </div>
                  <div className="team-member-socials-about">
                    {member.socials.map((social, idx) => {
                      const IconComponent = social.icon === 'github' ? Github : social.icon === 'linkedin' ? Linkedin : MessageCircle
                      return (
                        <Link
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`team-social-button-about ${
                            social.label === 'GitHub' ? 'team-social-github' :
                            social.label === 'LinkedIn' ? 'team-social-linkedin' :
                            'team-social-whatsapp'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
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
      </div>
    </div>
  )
}
