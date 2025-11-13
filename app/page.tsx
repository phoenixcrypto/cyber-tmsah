'use client'

import Link from 'next/link'
import {
  Calendar,
  BookOpen,
  Info,
  ArrowRight,
  Shield,
  Target,
  Star,
  Briefcase,
  Users,
  Award,
  MessageCircle,
  Mail,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatItem {
  icon: LucideIcon
  value: string
  label: string
}

interface FeatureItem {
  icon: string
  title: string
  description: string
}

interface TeamMember {
  name: string
  role: string
  initials: string
  socials: { href: string; label: string }[]
}

const stats: StatItem[] = [
  { icon: BookOpen, value: '7', label: 'مواد دراسية' },
  { icon: Calendar, value: '15', label: 'مجموعات طلابية' },
  { icon: Award, value: '6', label: 'أعضاء هيئة التدريس' },
  { icon: Target, value: '100%', label: 'جاهزية المنصة' },
]

const aboutFeatures: FeatureItem[] = [
  {
    icon: '✅',
    title: 'جدول واضح وذكي',
    description: 'تنظيم كامل للحصص النظرية والعملية مع فلاتر مرنة لكل مجموعة.'
  },
  {
    icon: '⭐',
    title: 'مصادر تعليم متجددة',
    description: 'مواد ومراجع يتم تحديثها باستمرار لدعم رحلة التعلم الذاتي.'
  },
  {
    icon: '💼',
    title: 'تجربة مخصصة للطلاب',
    description: 'تصميم متجاوب بالعربي يركز على سهولة الاستخدام وسرعة الوصول.'
  },
]

const teamMembers: TeamMember[] = [
  {
    name: 'زياد محمد',
    role: 'مؤسس ومطور المنصة',
    initials: 'ZM',
    socials: [
      { href: 'https://www.linkedin.com', label: 'LinkedIn' },
      { href: 'https://github.com', label: 'GitHub' },
    ],
  },
  {
    name: 'فريق Cyber TMSAH',
    role: 'إعداد المحتوى والمواد',
    initials: 'CT',
    socials: [
      { href: '/materials', label: 'المواد' },
    ],
  },
]

export default function HomePage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="bg-body text-body">
      {/* Hero */}
      <section className="hero-section">
        <div className="motivational-box">
          { 'وَأَنْ لَيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَى • وَأَنَّ سَعْيَهُ سَوْفَ يُرَى' }
        </div>

        <h1>
          مرجعك المتكامل لتنظيم <span className="gradient-text">الجدول والمواد التعليمية</span>
        </h1>
        <p>
          Cyber TMSAH هو مركزك الجامعي الحديث لعرض الجداول الدراسية، الوصول إلى المواد التعليمية، والبقاء مطلعًا على كل ما يخص محاضراتك ومعاملِك بأسلوب أنيق ومتوافق مع كل الأجهزة.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/schedule" className="cta-button">
            <Calendar className="w-5 h-5" />
            استعرض الجدول الآن
          </Link>
          <Link href="/materials" className="btn-tertiary">
            <BookOpen className="w-5 h-5" />
            حمل المواد التعليمية
          </Link>
          <Link href="/about" className="btn-secondary">
            <Info className="w-5 h-5" />
            تعرّف على المنصة
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="section-wrapper">
        <div className="stats-grid">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2>
            ما هي <strong className="gradient-text">Cyber TMSAH</strong>؟
          </h2>
          <p>
            نحن لسنا مجرد صفحة للجدول، بل منصة متكاملة تبني لك تجربة دراسية متناسقة. هدفنا أن يحصل الطالب على كل ما يحتاجه من مكان واحد: جدول محدّث، مواد جاهزة، ونصائح تنظيمية تساعده على التفوق. تم تصميم المنصة بالكامل باللغة العربية وبألوان مستوحاة من عالم الأمن السيبراني لتعكس هوية قوية وواضحة.
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

      {/* Focused Feature Cards */}
      <section className="section-wrapper">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="enhanced-card p-6 home-feature-card">
              <div className="stat-icon">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-dark-100 mb-3">تصميم سيبراني فاخر</h3>
              <p className="text-dark-300">
                ألوان داكنة مع لمسة حمراء جريئة مستوحاة من منصات الأمن السيبراني الحديثة تمنح الموقع حضورًا قويًا واحترافيًا.
              </p>
              <Link href="/" className="btn-secondary mt-4 inline-flex">
                اكتشف الواجهة
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="enhanced-card p-6 home-feature-card">
              <div className="stat-icon">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-dark-100 mb-3">تجربة مريحة للطالب</h3>
              <p className="text-dark-300">
                كل قسم مُرتب بعناية: جدول سهل التصفية، مواد مقسمة حسب المادة، وصفحات متوافقة مع الهواتف المحمولة.
              </p>
              <Link href="/schedule" className="btn-secondary mt-4 inline-flex">
                جرّب عرض الجدول
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="enhanced-card p-6 home-feature-card">
              <div className="stat-icon">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-dark-100 mb-3">جاهز للتطوير المستقبلي</h3>
              <p className="text-dark-300">
                البنية الآن واجهة أمامية بالكامل، مما يتيح دمج قواعد البيانات أو خدمات جديدة بسهولة عندما يحين الوقت.
              </p>
              <Link href="/about" className="btn-secondary mt-4 inline-flex">
                اعرف رؤيتنا
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="team-section">
        <div className="team-header">
          <h2>فريق العمل والمساهمون</h2>
          <p>مجتمع من الطلاب والمبدعين يعمل على تطوير Cyber TMSAH لتصبح المرجع الأول لطلاب الكلية.</p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-member">
              <div className="member-photo">{member.initials}</div>
              <h4>{member.name}</h4>
              <p className="member-role">{member.role}</p>
              <div className="member-social">
                {member.socials.map((social) => (
                  <Link key={social.href} href={social.href} prefetch={false}>
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contribute */}
      <section id="contribute" className="contribute-section">
        <div className="contribute-content">
          <h2>
            انضم إلينا و<strong> ساهم معنا</strong>
          </h2>
          <p>
            Cyber TMSAH مشروع مجتمعي. إذا كنت ترغب في المساهمة بالمواد، تحسين التصميم، أو دعم تجربة الطلاب، يسعدنا تواصلك معنا. كل مساهمة تُحدث فرقًا في بناء منصة عربية منظمة.
          </p>
          <Link href="#contact" className="cta-button">
            <Users className="w-5 h-5" />
            تواصل لبدء المساهمة
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="cyber-divider">
        <p>[ ENCRYPTED ] [ FIREWALL ] [ 010101 ] [ ACCESS GRANTED ] [ ENCRYPTED ] [ FIREWALL ] [ 010101 ] [ ACCESS GRANTED ]</p>
      </div>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <h2>
            <MessageCircle className="w-6 h-6" style={{ display: 'inline', marginLeft: '0.5rem' }} />
            تواصل <span className="gradient-text">معنا</span>
          </h2>
          <p className="contact-description">
            لديك اقتراح، مشكلة أو استفسار؟ املأ النموذج التالي وسيتم التواصل معك في أقرب وقت. يمكن أيضًا مراسلتنا مباشرة عبر البريد.
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
                <textarea id="message" name="message" rows={5} placeholder="اكتب تفاصيل استفسارك أو اقتراحك" required />
              </div>

              <button type="submit" className="form-submit-button">
                إرسال الرسالة
              </button>
            </form>

            <div className="mt-4 text-center text-dark-300">
              <Mail className="w-5 h-5" style={{ display: 'inline', marginLeft: '0.5rem' }} />
              يمكنك مراسلتنا عبر البريد: support@cyber-tmsah.com
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
