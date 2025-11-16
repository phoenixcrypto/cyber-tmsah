'use client'

import { Users, Github, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TeamPage() {
  const { t } = useLanguage()
  const teamMembers = [
    {
      name: 'زياد محمد',
      role: 'مؤسس ومطور المنصة',
      description: 'مؤسس المنصة ومطورها الرئيسي، متخصص في هندسة البرمجيات وتطوير الأنظمة التعليمية. أؤمن بقوة التكنولوجيا في تحويل التعليم وبناء منصات تعليمية مبتكرة تلبي احتياجات الطلاب العرب.',
      responsibilities: [
        'الجدول الدراسي',
        'المحتوى التعليمي',
        'نشر المقالات',
        'إدارة المنصة'
      ],
      socials: [
        { icon: Github, href: 'https://github.com/phoenixcrypto', label: 'GitHub' },
        { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
        { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' }
      ],
      image: '/images/zeyad-mohamed.jpg'
    },
    {
      name: 'يوسف وليد',
      role: 'مطور المنصة',
      description: 'مطور متخصص في تطوير الواجهات والتطبيقات التعليمية، أساهم في بناء تجارب مستخدم متميزة وتطوير حلول تقنية مبتكرة.',
      responsibilities: [
        'تطوير الواجهات',
        'تحسين الأداء',
        'ضمان الجودة',
        'اختبار الأنظمة'
      ],
      socials: [
        { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' }
      ],
      image: '/images/youssef-waleed.jpg'
    },
    {
      name: 'مؤمن هيثم',
      role: 'مطور ومصمم المنصة',
      description: 'مطور ومصمم واجهات مستخدم متخصص في إنشاء تجارب تفاعلية وجذابة. أركز على دمج الجمالية مع الوظيفية لضمان تجربة مستخدم سلسة وممتعة في بيئة تعليمية احترافية.',
      responsibilities: [
        'دليل الأمن السيبراني',
        'خريطة الطريق',
        'الموارد التعليمية',
        'تصميم الواجهات'
      ],
      socials: [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
        { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' }
      ],
      image: '/images/moamen-haytham.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              {t('team.title')}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            {t('team.description')}
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => {
            return (
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
                      const Icon = social.icon
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
                          <Icon className="w-5 h-5" />
                          <span>{social.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

