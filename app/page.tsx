'use client'

import Link from 'next/link'
import { Calendar, BookOpen, Target, Users, Award, MessageCircle, Mail, GraduationCap, Video, Headphones, Globe } from 'lucide-react'

const stats = [
  { icon: BookOpen, value: '7', label: 'مواد دراسية' },
  { icon: Calendar, value: '15', label: 'مجموعات دراسية' },
  { icon: Award, value: '6', label: 'أعضاء هيئة التدريس' },
  { icon: Target, value: '100%', label: 'جاهزية المنصة' },
]

const aboutFeatures = [
  {
    icon: '✅',
    title: 'مسارات تعليمية منظمة',
    description: 'ابدأ من الأساسيات ووصولاً إلى الاحتراف مع تغطية شاملة لمجالات الأمن السيبراني.',
  },
  {
    icon: '⭐',
    title: 'مصادر ومراجع منتقاة',
    description: 'أفضل الدورات، الكتب، المنصات، والمختبرات العملية مجمعة في مكان واحد.',
  },
  {
    icon: '💼',
    title: 'توجيه مهني واضح',
    description: 'تعرف على المهارات المطلوبة في سوق العمل عبر دليل الخبرات والمسارات الوظيفية.',
  },
]

const teamMembers = [
  {
    initials: 'ZM',
    name: 'زياد محمد',
    role: 'مؤسس ومطور المنصة',
    description: 'مطور ومصمم متخصص في مجال التعليم والتكنولوجيا، أعمل على تطوير منصات تعليمية متقدمة وتصميم تجارب مستخدم استثنائية.',
    responsibilities: [
      'الجدول الدراسي',
      'المواد التعليمية',
      'نشر المقالات',
    ],
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com' },
      { label: 'GitHub', href: 'https://github.com/phoenixcrypto' },
    ],
  },
  {
    initials: 'MH',
    name: 'مؤمن هيثم',
    role: 'مطور ومصمم المنصة',
    description: 'مطور ومصمم متخصص في مجال التعليم والتكنولوجيا، أعمل على تطوير منصات تعليمية متقدمة وتصميم تجارب مستخدم استثنائية.',
    responsibilities: [
      'دليل الأمن السيبراني',
      'خريطة الطريق',
      'المصادر المصنفة',
      'المحتوى التعليمي الشامل',
    ],
    socials: [
      { label: 'المواد التعليمية', href: '/materials' },
      { label: 'خريطة الطريق', href: '/roadmap' },
    ],
  },
]

export default function HomePage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <>
      <section className="hero-section">
        <div className="motivational-box">{`وَأَنْ لَيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَى • وَأَنَّ سَعْيَهُ سَوْفَ يُرَى`}</div>
        <h1>
          منصة <span className="gradient-text">سايبر تمساح</span> الأكاديمية
        </h1>
        <p>
          مركز متكامل يوفّر لك الجداول الدراسية، المصادر التعليمية، والمسارات المتخصصة في الأمن السيبراني.
          صُمم بالكامل باللغة العربية مع تجربة حديثة ومتجاوبة على جميع الأجهزة.
        </p>
        <div className="hero-buttons">
          <Link href="/schedule" className="cta-button">
            <Calendar className="w-5 h-5" />
            استعرض الجدول الدراسي
          </Link>
          <Link href="/materials" className="btn-secondary">
            <BookOpen className="w-5 h-5" />
            تصفح المواد التعليمية
          </Link>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="stat-card">
              <div className="stat-icon">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <h2>
            ما هي <strong className="gradient-text">سايبر تمساح</strong>؟
          </h2>
          <p>
            سايبر تمساح ليست مجرد صفحة لعرض الجداول، بل هي مرجع متكامل لتنظيم الدراسة وتحفيز التعلم الذاتي. تجمع المنصة بين
            واجهة مرنة للجدول، مكتبة مواد تعليمية جاهزة، وبين دليل الأمن السيبراني المستوحى من المجتمع العربي المتخصص.
          </p>

          <div className="about-features">
            {aboutFeatures.map((feature) => (
              <div key={feature.title} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دليل الأمن السيبراني */}
      <section id="security-guide" className="security-guide-section" style={{ padding: '5rem 2rem', backgroundColor: 'var(--card-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-white)', marginBottom: '1rem' }}>
              <span className="gradient-text">دليل الأمن السيبراني</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary-gray)', maxWidth: '800px', margin: '0 auto' }}>
              مسارات تعليمية منظمة ومصادر شاملة لمساعدتك في رحلتك في مجال الأمن السيبراني
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {/* خريطة الطريق */}
            <Link href="/roadmap" className="security-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-dark)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'block'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '0.5rem' }}>
                خريطة الطريق
              </h3>
              <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.6' }}>
                مسار تعليمي منظم من الأساسيات إلى الاحتراف في الأمن السيبراني
              </p>
            </Link>

            {/* المصادر المصنفة */}
            <div className="security-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-dark)', 
              borderRadius: '12px', 
              padding: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '1rem' }}>
                المصادر المصنفة
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/courses" style={{ color: 'var(--accent-silver)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap className="w-4 h-4" /> الدورات
                </Link>
                <Link href="/books" style={{ color: 'var(--accent-silver)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen className="w-4 h-4" /> الكتب
                </Link>
                <Link href="/videos" style={{ color: 'var(--accent-silver)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Video className="w-4 h-4" /> الفيديوهات المقترحة
                </Link>
                <Link href="/podcasts" style={{ color: 'var(--accent-silver)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Headphones className="w-4 h-4" /> البودكاست
                </Link>
                <Link href="/platforms" style={{ color: 'var(--accent-silver)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe className="w-4 h-4" /> مواقع ومنصات تعليمية
                </Link>
              </div>
            </div>

            {/* دليل الخبرات */}
            <Link href="/expertise-guide" className="security-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-dark)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'block'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '0.5rem' }}>
                دليل الخبرات
              </h3>
              <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.6' }}>
                تعلم من تجارب المحترفين ونصائح عملية من خبراء ميدانيين
              </p>
            </Link>

            {/* التقييم والأخبار */}
            <Link href="/evaluation" className="security-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-dark)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'block'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '0.5rem' }}>
                التقييم والأخبار
              </h3>
              <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.6' }}>
                تابع آخر الأخبار والتقييمات في مجال الأمن السيبراني
              </p>
            </Link>

            {/* ساهم معنا */}
            <Link href="/contribute" className="security-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-dark)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'block'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '0.5rem' }}>
                ساهم معنا
              </h3>
              <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.6' }}>
                انضم إلينا وساهم في إثراء المحتوى التعليمي العربي
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section id="team" className="team-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-white)', marginBottom: '1rem' }}>
              فريق العمل <span className="gradient-text">والمساهمون</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary-gray)', maxWidth: '800px', margin: '0 auto' }}>
              مجموعة من المطورين والطلاب المتحمسين يعملون معاً لتوفير أفضل تجربة دراسية عربية رقمية.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {teamMembers.map((member) => (
              <div key={member.name} className="about-me-card" style={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--border-dark)', 
                borderRadius: '12px', 
                padding: '2.5rem',
                boxShadow: '0 16px 30px rgba(0, 0, 0, 0.45)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(224, 59, 59, 0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary-white)',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-white)', marginBottom: '0.25rem' }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-silver)' }}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--secondary-gray)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  {member.description}
                </p>
                {member.responsibilities && (
                  <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-silver)', marginBottom: '0.75rem', fontWeight: '600' }}>
                      مسؤولياتي:
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {member.responsibilities.map((responsibility, index) => (
                        <li key={index} style={{ color: 'var(--secondary-gray)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--primary-red)' }}>•</span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {member.socials.map((social) => (
                    <Link 
                      key={social.label} 
                      href={social.href} 
                      prefetch={false}
                      className="team-social-link"
                    >
                      {social.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contribute" className="contribute-section">
        <div className="contribute-content">
          <h2>
            انضم إلينا و<strong> ساهم معنا</strong>
          </h2>
          <p>
            المنصة مشروع مجتمعي مفتوح. إذا كانت لديك مصادر، أفكار تطوير، أو ترغب في المساهمة بالمحتوى يمكننا التعاون
            لبناء مرجع عربي حقيقي للأمن السيبراني والتعليم الأكاديمي.
          </p>
          <Link href="#contact" className="cta-button">
            <Users className="w-5 h-5" />
            تواصل لبدء المساهمة
          </Link>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <h2>
            <MessageCircle className="w-6 h-6" style={{ display: 'inline', marginLeft: '0.5rem' }} />
            تواصل معنا
          </h2>
          <p className="contact-description">
            لديك استفسار أو فكرة تطوير؟ يسعدنا سماعك. املأ النموذج التالي وسنعمل على الرد في أسرع وقت ممكن.
          </p>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">الاسم الكامل</label>
                  <input id="name" name="name" type="text" placeholder="أدخل اسمك" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input id="email" name="email" type="email" placeholder="name@example.com" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">الموضوع</label>
                <input id="subject" name="subject" type="text" placeholder="كيف يمكننا مساعدتك؟" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">رسالتك</label>
                <textarea id="message" name="message" rows={5} placeholder="اكتب تفاصيل طلبك" required />
              </div>

              <button type="submit" className="form-submit-button">
                إرسال الرسالة
              </button>
            </form>

            <div className="contact-email-info">
              <Mail className="w-5 h-5" style={{ display: 'inline', marginLeft: '0.5rem' }} />
              أو راسلنا مباشرة عبر البريد: support@cyber-tmsah.com
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
