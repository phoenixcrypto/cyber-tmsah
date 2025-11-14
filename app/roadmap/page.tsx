'use client'

interface Course {
  order?: number
  status: 'required' | 'optional'
  icon: string
  title: string
  description: string
  link: string
  instructor: string
}

interface Phase {
  number: string
  title: string
  description: string
  courses?: Course[]
  alternativeNote?: string
  subsections?: {
    title: string
    courses: Course[]
  }[]
}

const phases: Phase[] = [
  {
    number: '1',
    title: 'Computer Science',
    description: 'الأساسيات التقنية لأجهزة الحاسوب والأنظمة',
    courses: [
      {
        status: 'required',
        icon: '💻',
        title: 'CompTIA A+',
        description: 'دورة شاملة لأساسيات الحاسوب والأجهزة وأنظمة التشغيل',
        link: 'https://www.youtube.com/playlist?list=PLH-n8YK76vIiDdOMRB-ylvns-_8Zl1euV',
        instructor: 'Sameh Ramadan',
      },
    ],
  },
  {
    number: '2',
    title: 'Network',
    description: 'فهم الشبكات والبروتوكولات والاتصالات',
    alternativeNote: '💡 ملحوظة: يجب عليك اختيار دورة واحدة فقط من الدورات المعروضة أدناه (إما CompTIA Network+ أو CCNA) كمسار أساسي لفهم الشبكات',
    courses: [
      {
        status: 'required',
        icon: '🌐',
        title: 'CompTIA Network+',
        description: 'أساسيات الشبكات والبروتوكولات وإعداد وصيانة الشبكات',
        link: 'https://www.youtube.com/playlist?list=PLH-n8YK76vIiuIZoWvHL7AvtrDV7hR3He',
        instructor: 'Sameh Ramadan',
      },
      {
        status: 'required',
        icon: '⚙️',
        title: 'CCNA (Cisco)',
        description: 'أساسيات شبكات سيسكو، توجيه، تبديل، وأمن الشبكات. (مسار بديل لـ Network+)',
        link: 'https://www.youtube.com/watch?v=kYv_zW81hA0',
        instructor: 'Placeholder Instructor',
      },
    ],
  },
  {
    number: '3',
    title: 'Servers',
    description: 'إدارة الخوادم وأنظمة التشغيل المختلفة',
    courses: [
      {
        order: 1,
        status: 'required',
        icon: '🪟',
        title: 'Windows Server 2019',
        description: 'إدارة وتكوين خوادم Windows Server 2019',
        link: 'https://www.youtube.com/playlist?list=PLDxVq3TlR9y2sMXaL_yLp-r6pUpevgC-w',
        instructor: 'Mohamed Zohdy',
      },
      {
        order: 2,
        status: 'required',
        icon: '🐧',
        title: 'Linux System Administration',
        description: 'إدارة أنظمة Linux والخوادم وأساسيات الأوامر',
        link: 'https://www.youtube.com/playlist?list=PLy1Fx2HfcmWBpD_PI4AQpjeDK5-5q6TG7',
        instructor: 'Arab Linux Community',
      },
    ],
  },
  {
    number: '4',
    title: 'Windows Commands & PowerShell',
    description: 'إتقان أوامر Windows و PowerShell للأتمتة والإدارة',
    courses: [
      {
        status: 'required',
        icon: '⚡',
        title: 'PowerShell',
        description: 'تعلم PowerShell للأتمتة وإدارة الأنظمة',
        link: 'https://www.youtube.com/watch?v=6hgBFDTTwEk',
        instructor: 'تكنيا دوت نت',
      },
    ],
  },
  {
    number: '5',
    title: 'Programming',
    description: 'تعلم البرمجة وتطوير تطبيقات الويب الآمنة',
    alternativeNote: '💡 ملحوظة: يشمل هذا القسم مسارين مختلفين: برمجة الويب (الضرورية لاختبار تطبيقات الويب) والبرمجة العامة (Python) (اللازمة للأتمتة والأمن السيبراني). يُنصح بإتقان المسارين لضمان التخصص الشامل في المجال',
    subsections: [
      {
        title: 'برمجة الويب (Web Programming)',
        courses: [
          {
            order: 1,
            status: 'required',
            icon: '🌍',
            title: 'HTML & CSS',
            description: 'أساسيات تطوير الويب والتصميم',
            link: 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAypWmEHEy3awR6Ek9sUe5ZS',
            instructor: 'Elzero Web School',
          },
          {
            order: 2,
            status: 'required',
            icon: '📜',
            title: 'JavaScript',
            description: 'لغة البرمجة الأساسية للويب التفاعلي',
            link: 'https://www.youtube.com/watch?v=6hgBFDTTwEk',
            instructor: 'Nour Homsi',
          },
          {
            order: 3,
            status: 'required',
            icon: '🐘',
            title: 'PHP',
            description: 'تطوير الواجهة الخلفية لتطبيقات الويب',
            link: 'https://www.youtube.com/watch?v=N-WPYk417yE',
            instructor: 'Korsat X Parmaga',
          },
          {
            order: 4,
            status: 'required',
            icon: '🗄️',
            title: 'MySQL',
            description: 'إدارة قواعد البيانات وكتابة استعلامات SQL',
            link: 'https://www.youtube.com/watch?v=pszZMzI9a7A',
            instructor: 'Nour Homsi',
          },
        ],
      },
      {
        title: 'برمجة عامة (General Programming)',
        courses: [
          {
            order: 1,
            status: 'required',
            icon: '🐍',
            title: 'Python',
            description: 'لغة برمجة قوية للأمن السيبراني والأتمتة',
            link: 'https://www.youtube.com/playlist?list=PLknwEmKsW8OsG8dnisr_-2WGyx7lpgGEE',
            instructor: 'Abdelrahman Gamal',
          },
        ],
      },
    ],
  },
  {
    number: '6',
    title: 'Security Basics',
    description: 'أساسيات الأمن السيبراني والمفاهيم الأساسية',
    courses: [
      {
        status: 'required',
        icon: '🛡️',
        title: 'Security+ SY0-601',
        description: 'دورة مجانية مع شهادة لأساسيات الأمن السيبراني',
        link: 'https://netriders.academy/courses/security/',
        instructor: 'Ahmed Sultan - Netriders Academy',
      },
    ],
  },
  {
    number: '7',
    title: 'Penetration Testing',
    description: 'اختبار الاختراق واكتشاف الثغرات الأمنية',
    courses: [
      {
        status: 'required',
        icon: '🎯',
        title: 'eJPTv1 Prep',
        description: 'دورة مجانية مع شهادة للتحضير لشهادة eJPT',
        link: 'https://netriders.academy/courses/penetration-testing-student',
        instructor: 'Ahmed Sultan - Netriders Academy',
      },
    ],
  },
  {
    number: '8',
    title: 'Web Application Penetration Testing (WAPT)',
    description: 'اختبار اختراق تطبيقات الويب وأدوات الاختبار',
    courses: [
      {
        order: 1,
        status: 'required',
        icon: '🔓',
        title: 'Web App Basics + Burp Suite + ZAProxy',
        description: 'أساسيات تطبيقات الويب وأدوات اختبار الاختراق',
        link: 'https://www.youtube.com/playlist?list=PLX621demLUSaA7ngeN7UfVzYJihHnEfv0',
        instructor: 'GenTiL Security',
      },
      {
        order: 2,
        status: 'required',
        icon: '🌐',
        title: 'WAPT Course',
        description: 'دورة متكاملة لاختبار اختراق تطبيقات الويب',
        link: 'https://www.youtube.com/watch?v=MFanMkTGJSo',
        instructor: 'GenTiL Security',
      },
    ],
  },
  {
    number: '🔵',
    title: 'Blue Team - المسار الدفاعي',
    description: 'حماية الأنظمة والاستجابة للحوادث الأمنية',
    courses: [
      {
        order: 1,
        status: 'required',
        icon: '🚨',
        title: 'Incident Response (eCIR)',
        description: 'دورة مجانية مع شهادة للاستجابة للحوادث الأمنية',
        link: 'https://netriders.academy/courses/incident-response',
        instructor: 'Ahmed Sultan - Netriders Academy',
      },
      {
        order: 2,
        status: 'required',
        icon: '🔐',
        title: 'Network Security (CCNP SCOR)',
        description: 'دورة مجانية مع شهادة لأمن الشبكات',
        link: 'https://netriders.academy/courses/scor',
        instructor: 'Ahmed Sultan - Netriders Academy',
      },
    ],
  },
  {
    number: '🔴',
    title: 'Red Team - المسار الهجومي المتقدم',
    description: 'الاختراق الأخلاقي المتقدم وعمليات Red Team',
    courses: [
      {
        status: 'required',
        icon: '⚔️',
        title: 'Offensive Security (OSCP)',
        description: 'التحضير لشهادة OSCP واختبار الاختراق المتقدم',
        link: 'https://www.youtube.com/playlist?list=PL_yseowcuqYJc7wXtGIsshYp1B_W0M-ZK',
        instructor: 'Nakerah Network',
      },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="roadmap-page">
      <section className="page-hero">
        <div className="motivational-box">
          لا تنتظر الظروف المثالية؛ ابدأ الآن واصنع ظروفك بنفسك
        </div>
        <h1>
          خريطة طريق <span className="gradient-text">الأمن السيبراني</span>
        </h1>
        <p className="page-hero-subtitle">مسارات منظمة ومهارات متسلسلة للوصول إلى الاحتراف</p>
      </section>

      <section className="instruction-video">
        <h3>شرح استخدام خريطة الطريق</h3>
        <p>شاهد هذا الفيديو لتعرف كيفية التنقل بين المراحل واختيار المسار المناسب لك لتحقيق أقصى استفادة.</p>
        <div className="video-placeholder">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/vZrF0yBaJAk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      <main className="roadmap-content">
        {phases.map((phase, phaseIndex) => (
          <section key={phaseIndex} className="phase-section">
            <div className="phase-header">
              <div className="phase-number">{phase.number}</div>
              <div className="phase-title">
                <h2>{phase.title}</h2>
                <p>{phase.description}</p>
              </div>
            </div>

            {phase.alternativeNote && (
              <div className="alternative-track-note">
                <p dangerouslySetInnerHTML={{ __html: phase.alternativeNote.replace(/<span class="cyber">(.*?)<\/span>/g, '<span class="gradient-text">$1</span>') }} />
              </div>
            )}

            {phase.subsections ? (
              phase.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h3 className="subsection-title">{subsection.title}</h3>
                  <div className="skill-cards-grid">
                    {subsection.courses.map((course, courseIndex) => (
                      <div key={courseIndex} className="skill-card">
                        {course.order && <div className="course-order">{course.order}</div>}
                        <div className={`course-status ${course.status}`}>إجباري</div>
                        <div className="skill-icon">{course.icon}</div>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link">
                          مشاهدة الدورة
                        </a>
                        <div className="instructor">المدرب: {course.instructor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : phase.courses ? (
              <div className="skill-cards-grid">
                {phase.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="skill-card">
                    {course.order && <div className="course-order">{course.order}</div>}
                    <div className={`course-status ${course.status}`}>إجباري</div>
                    <div className="skill-icon">{course.icon}</div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link">
                      مشاهدة الدورة
                    </a>
                    <div className="instructor">المدرب: {course.instructor}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </main>
    </div>
  )
}
