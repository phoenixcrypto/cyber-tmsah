'use client'

interface Video {
  title: string
  channel: string
  description: string
  tags: string[]
  link: string
}

interface Category {
  title: string
  videos: Video[]
}

const categories: Category[] = [
  {
    title: 'فيديوهات أساسيات الأمن السيبراني',
    videos: [
      {
        title: 'مقدمة شاملة للأمن السيبراني للمبتدئين',
        channel: 'Cyber Security Simplified',
        description: 'شرح مبسط للمفاهيم الأساسية في الأمن السيبراني وأهمية الحماية الرقمية.',
        tags: ['مبتدئ', 'مفاهيم أساسية', 'عربي'],
        link: 'https://youtube.com',
      },
      {
        title: 'كيف تبدأ رحلتك في الأمن السيبراني',
        channel: 'Tech Security Guide',
        description: 'دليل عملي للخطوات الأولى في مجال الأمن السيبراني والمهارات المطلوبة.',
        tags: ['مبتدئ', 'مسار تعليمي', 'إنجليزي'],
        link: 'https://youtube.com',
      },
      {
        title: 'أهم مصطلحات الأمن السيبراني التي يجب معرفتها',
        channel: 'Security Terms',
        description: 'شرح لأهم المصطلحات والمفاهيم التقنية في مجال الأمن السيبراني.',
        tags: ['مبتدئ', 'مصطلحات', 'عربي'],
        link: 'https://youtube.com',
      },
    ],
  },
  {
    title: 'دروس في اختبار الاختراق',
    videos: [
      {
        title: 'اختبار اختراق تطبيقات الويب - دورة كاملة',
        channel: 'Web Pentesting Pro',
        description: 'دورة شاملة تغطي جميع مراحل اختبار اختراق تطبيقات الويب.',
        tags: ['متوسط', 'Web App', 'Pentesting'],
        link: 'https://youtube.com',
      },
      {
        title: 'تعلم استخدام Burp Suite من الصفر',
        channel: 'Pentesting Tools',
        description: 'شرح مفصل لأداة Burp Suite وكيفية استخدامها في اختبارات الاختراق.',
        tags: ['متوسط', 'أدوات', 'Burp Suite'],
        link: 'https://youtube.com',
      },
    ],
  },
]

export default function VideosPage() {
  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          ▶️ <span className="gradient-text">فيديوهات الأمن السيبراني المقترحة</span>
        </h1>
        <p>مجموعة من أفضل الفيديوهات التعليمية وقوائم التشغيل من يوتيوب، مصنفة حسب الموضوع والمستوى.</p>
      </section>

      <div className="courses-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="category-title">{category.title}</h2>
            <div className="courses-grid">
              {category.videos.map((video, videoIndex) => (
                <div key={videoIndex} className="course-card">
                  <div className="course-thumbnail">صورة الفيديو</div>
                  <div className="course-info">
                    <h4>{video.title}</h4>
                    <p className="course-instructor">{video.channel}</p>
                    <p className="course-description">{video.description}</p>
                    <div className="course-tags">
                      {video.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="course-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="course-link">
                      مشاهدة على يوتيوب
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
