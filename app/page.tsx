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

      <section id="about" className="about-section-enhanced">
        <div className="about-content-enhanced">
          <div className="about-header-enhanced">
            <h2 className="about-title-enhanced">
              ما هي <strong className="gradient-text">سايبر تمساح</strong>؟
            </h2>
            <div className="about-title-underline"></div>
          </div>
          <p className="about-description-enhanced">
            سايبر تمساح ليست مجرد صفحة لعرض الجداول، بل هي مرجع متكامل لتنظيم الدراسة وتحفيز التعلم الذاتي. تجمع المنصة بين
            واجهة مرنة للجدول، مكتبة مواد تعليمية جاهزة، وبين دليل الأمن السيبراني المستوحى من المجتمع العربي المتخصص.
          </p>

          <div className="about-features-enhanced">
            {aboutFeatures.map((feature, index) => (
              <div key={feature.title} className="feature-item-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon-enhanced">{feature.icon}</div>
                <h4 className="feature-title-enhanced">{feature.title}</h4>
                <p className="feature-description-enhanced">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دليل الأمن السيبراني */}
      <section id="security-guide" className="security-guide-section-enhanced">
        <div className="security-guide-container">
          <div className="security-guide-header">
            <h2 className="security-guide-title">
              <span className="gradient-text">دليل الأمن السيبراني</span>
            </h2>
            <div className="security-guide-title-underline"></div>
            <p className="security-guide-subtitle">
              مسارات تعليمية منظمة ومصادر شاملة لمساعدتك في رحلتك في مجال الأمن السيبراني
            </p>
          </div>

          <div className="security-guide-grid">
            {/* خريطة الطريق */}
            <Link href="/roadmap" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">🗺️</div>
              <h3 className="security-card-title">خريطة الطريق</h3>
              <p className="security-card-description">
                مسار تعليمي منظم من الأساسيات إلى الاحتراف في الأمن السيبراني
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* المصادر المصنفة */}
            <div className="security-card-enhanced security-card-dropdown">
              <div className="security-card-icon">📚</div>
              <h3 className="security-card-title">المصادر المصنفة</h3>
              <div className="security-card-links">
                <Link href="/courses" prefetch={false} className="security-card-link">
                  <GraduationCap className="w-4 h-4" /> الدورات
                </Link>
                <Link href="/books" prefetch={false} className="security-card-link">
                  <BookOpen className="w-4 h-4" /> الكتب
                </Link>
                <Link href="/videos" prefetch={false} className="security-card-link">
                  <Video className="w-4 h-4" /> الفيديوهات المقترحة
                </Link>
                <Link href="/podcasts" prefetch={false} className="security-card-link">
                  <Headphones className="w-4 h-4" /> البودكاست
                </Link>
                <Link href="/platforms" prefetch={false} className="security-card-link">
                  <Globe className="w-4 h-4" /> مواقع ومنصات تعليمية
                </Link>
              </div>
            </div>

            {/* دليل الخبرات */}
            <Link href="/expertise-guide" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">💼</div>
              <h3 className="security-card-title">دليل الخبرات</h3>
              <p className="security-card-description">
                تعلم من تجارب المحترفين ونصائح عملية من خبراء ميدانيين
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* التقييم والأخبار */}
            <Link href="/evaluation" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">📊</div>
              <h3 className="security-card-title">التقييم والأخبار</h3>
              <p className="security-card-description">
                تابع آخر الأخبار والتقييمات في مجال الأمن السيبراني
              </p>
              <div className="security-card-arrow">→</div>
            </Link>

            {/* ساهم معنا */}
            <Link href="/contribute" className="security-card-enhanced security-card-hover" prefetch={false}>
              <div className="security-card-icon">🤝</div>
              <h3 className="security-card-title">ساهم معنا</h3>
              <p className="security-card-description">
                انضم إلينا وساهم في إثراء المحتوى التعليمي العربي
              </p>
              <div className="security-card-arrow">→</div>
            </Link>
          </div>
        </div>
      </section>

      <section id="team" className="team-section-enhanced">
        <div className="team-container-enhanced">
          <div className="team-header-enhanced">
            <h2 className="team-title-enhanced">
              فريق العمل <span className="gradient-text">والمساهمون</span>
            </h2>
            <div className="team-title-underline"></div>
            <p className="team-subtitle-enhanced">
              مجموعة من المطورين والطلاب المتحمسين يعملون معاً لتوفير أفضل تجربة دراسية عربية رقمية.
            </p>
          </div>

          <div className="team-cards-grid-enhanced">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="team-card-enhanced" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="team-card-header">
                  <div className="team-card-avatar">
                    {member.initials}
                  </div>
                  <div className="team-card-info">
                    <h3 className="team-card-name">{member.name}</h3>
                    <p className="team-card-role">{member.role}</p>
                  </div>
                </div>
                <p className="team-card-description">
                  {member.description}
                </p>
                {member.responsibilities && (
                  <div className="team-card-responsibilities">
                    <p className="team-card-responsibilities-title">مسؤولياتي:</p>
                    <ul className="team-card-responsibilities-list">
                      {member.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="team-card-responsibility-item">
                          <span className="team-card-responsibility-bullet">•</span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="team-card-socials">
                  {member.socials.map((social) => (
                    <Link 
                      key={social.label} 
                      href={social.href} 
                      prefetch={false}
                      className="team-social-link-enhanced"
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
