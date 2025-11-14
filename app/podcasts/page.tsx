'use client'

interface Podcast {
  cover: string
  title: string
  host: string
  description: string
  tags: string[]
  links: { label: string; url: string }[]
}

interface Category {
  title: string
  podcasts: Podcast[]
}

const categories: Category[] = [
  {
    title: '🇸🇦 برامج باللغة العربية',
    podcasts: [
      {
        cover: '🎧',
        title: 'بودكاست الأمن السيبراني',
        host: 'مقدم البرنامج: أحمد محمد',
        description: 'برنامج أسبوعي يناقش أحدث الأخبار والتهديدات في عالم الأمن السيبراني باللغة العربية، مع تحليلات عميقة للهجمات الإلكترونية والحلول الأمنية.',
        tags: ['مبتدئ', 'أخبار', 'تحليلات'],
        links: [
          { label: '🟢 Spotify', url: '#' },
          { label: '🎵 Apple Podcasts', url: '#' },
          { label: '🎙️ Google Podcasts', url: '#' },
        ],
      },
      {
        cover: '🔒',
        title: 'حديث التقنية الآمنة',
        host: 'مقدم البرنامج: سارة العلي',
        description: 'حوارات مع خبراء الأمن السيبراني العرب، مناقشة التحديات الأمنية في المنطقة وأفضل الممارسات لحماية البيانات والشبكات.',
        tags: ['متوسط', 'مقابلات', 'استراتيجيات'],
        links: [
          { label: '🟢 Spotify', url: '#' },
          { label: '🎵 Apple Podcasts', url: '#' },
        ],
      },
    ],
  },
  {
    title: '🌐 برامج باللغة الإنجليزية',
    podcasts: [
      {
        cover: '🔐',
        title: 'Darknet Diaries',
        host: 'Host: Jack Rhysider',
        description: 'قصص حقيقية عن الهاكرز، الاختراقات، والجرائم الإلكترونية. أحد أشهر البودكاست في مجال الأمن السيبراني مع سرد قصصي مشوق.',
        tags: ['قصص', 'حقيقية', 'مشوق'],
        links: [
          { label: '🟢 Spotify', url: '#' },
          { label: '🎵 Apple Podcasts', url: '#' },
        ],
      },
    ],
  },
]

export default function PodcastsPage() {
  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>🎙️ استمع وتعلّم: بودكاست الأمن السيبراني</h1>
        <p>أفضل البرامج الصوتية العربية والأجنبية التي تناقش أحدث التهديدات، التقنيات، وتجارب الخبراء في المجال.</p>
      </section>

      <main className="courses-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="category-title">{category.title}</h2>
            <div className="courses-grid">
              {category.podcasts.map((podcast, podcastIndex) => (
                <div key={podcastIndex} className="course-card">
                  <div className="course-thumbnail" style={{ fontSize: '4rem' }}>
                    {podcast.cover}
                  </div>
                  <div className="course-info">
                    <h4>{podcast.title}</h4>
                    <p className="course-instructor">{podcast.host}</p>
                    <p className="course-description">{podcast.description}</p>
                    <div className="course-tags">
                      {podcast.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="course-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {podcast.links.map((link, linkIndex) => (
                        <a key={linkIndex} href={link.url} className="course-link" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
