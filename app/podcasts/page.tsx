'use client'

import { Headphones, Globe, Music, Mic, Lock, Key, Radio } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

// Emoji to Icon mapping
const emojiToIcon: Record<string, LucideIcon> = {
  '🌐': Globe,
  '🎙️': Mic,
  '🟢': Radio,
  '🎵': Music,
  '🔒': Lock,
  '🔐': Key,
  '🎧': Headphones,
}

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
  const { t } = useLanguage()
  
  return (
    <div className="page-container">
      <PageHeader 
        title={t('podcasts.title')} 
        icon={Headphones}
        description={t('podcasts.description')}
        />

        <div className="courses-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="category-title flex items-center gap-3">
              {category.title.startsWith('🌐') && <Globe className="w-6 h-6 text-cyber-neon" />}
              {category.title.replace(/^🌐\s*/, '')}
            </h2>
            <div className="courses-grid">
              {category.podcasts.map((podcast, podcastIndex) => (
                <div key={podcastIndex} className="course-card">
                  <div className="course-thumbnail flex items-center justify-center">
                    {(() => {
                      const CoverIcon = emojiToIcon[podcast.cover]
                      if (CoverIcon) {
                        return <CoverIcon className="w-16 h-16 text-cyber-neon" />
                      }
                      return <span style={{ fontSize: '4rem' }}>{podcast.cover}</span>
                    })()}
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
                      {podcast.links.map((link, linkIndex) => {
                        const emojiMatch = link.label.match(/^([^\s]+)\s(.+)$/)
                        const emoji = emojiMatch ? emojiMatch[1] : ''
                        const labelText = emojiMatch ? emojiMatch[2] : link.label
                        const LinkIcon = emoji && emojiToIcon[emoji] ? emojiToIcon[emoji] : null
                        
                        return (
                          <a key={linkIndex} href={link.url} className="course-link flex items-center gap-2" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                            {LinkIcon && <LinkIcon className="w-4 h-4" />}
                            {labelText}
                          </a>
                        )
                      })}
                    </div>
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
