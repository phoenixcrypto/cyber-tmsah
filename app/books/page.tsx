'use client'

import { BookOpen, ExternalLink, Star, Globe, Radio, Shield, ShieldCheck, BarChart3, FlaskConical, GraduationCap, Book, Target, Unlock, Sword, User, Flag, Search, AlertCircle, Lock, Dna, Settings } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

interface Book {
  cover: string | React.ComponentType<any>
  title: string
  author: string
  description: string
  tags: string[]
  link: string
  rating?: number
}

// Emoji to Icon mapping
const emojiToIcon: Record<string, React.ComponentType<any>> = {
  '🌐': Globe,
  '📡': Radio,
  '🔒': Shield,
  '🛡️': ShieldCheck,
  '🌍': Globe,
  '🎯': Target,
  '🔓': Unlock,
  '⚔️': Sword,
  '🎭': User,
  '🏴': Flag,
  '🔍': Search,
  '🚨': AlertCircle,
  '📊': BarChart3,
  '🔐': Lock,
  '🔬': FlaskConical,
  '🧬': Dna,
  '⚙️': Settings,
  '📖': Book,
  '🎓': GraduationCap,
  '📚': BookOpen,
}

interface Category {
  title: string
  books: Book[]
}

const categories: Category[] = [
  {
    title: '💻 كتب البرمجة',
    books: [
      {
        cover: '🐍',
        title: 'Python for Cybersecurity',
        author: 'Howard E. Poston III',
        description: 'دليل شامل لتعلم البايثون من منظور الأمن السيبراني، يغطي بناء الأدوات الأمنية والتحليل الآلي.',
        tags: ['مبتدئ', 'بايثون', 'برمجة'],
        link: '#',
        rating: 4.5,
      },
      {
        cover: '📘',
        title: 'Black Hat Python',
        author: 'Justin Seitz',
        description: 'تعلم كتابة أدوات القرصنة الأخلاقية باستخدام بايثون، من اختراق الشبكات إلى تحليل البرمجيات الخبيثة.',
        tags: ['متقدم', 'بايثون', 'Hacking'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '🔧',
        title: 'Violent Python',
        author: 'TJ O\'Connor',
        description: 'كتاب متخصص في بناء أدوات الاختراق والتحليل الجنائي باستخدام بايثون بطريقة عملية.',
        tags: ['متقدم', 'بايثون', 'أدوات'],
        link: '#',
        rating: 4.6,
      },
      {
        cover: '⚙️',
        title: 'C Programming for Security',
        author: 'Marcus Johnson',
        description: 'فهم عميق للغة C وكيفية استخدامها في تطوير برمجيات آمنة واكتشاف الثغرات.',
        tags: ['متوسط', 'C Language', 'Secure Coding'],
        link: '#',
        rating: 4.4,
      },
    ],
  },
  {
    title: '🌐 كتب الشبكات',
    books: [
      {
        cover: '📡',
        title: 'Computer Networking: A Top-Down Approach',
        author: 'James Kurose & Keith Ross',
        description: 'الكتاب الأساسي لفهم الشبكات من الطبقة التطبيقية حتى الطبقة الفيزيائية، مرجع أكاديمي موثوق.',
        tags: ['مبتدئ', 'شبكات', 'أساسيات'],
        link: '#',
        rating: 4.9,
      },
      {
        cover: '🔒',
        title: 'Network Security Essentials',
        author: 'William Stallings',
        description: 'أساسيات أمن الشبكات بما في ذلك التشفير، جدران النار، والكشف عن التسلل.',
        tags: ['متوسط', 'أمن الشبكات', 'تشفير'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '🛡️',
        title: 'The Practice of Network Security Monitoring',
        author: 'Richard Bejtlich',
        description: 'دليل عملي لمراقبة أمن الشبكات واكتشاف التهديدات والاستجابة للحوادث الأمنية.',
        tags: ['متقدم', 'مراقبة', 'تهديدات'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '🌍',
        title: 'TCP/IP Illustrated',
        author: 'W. Richard Stevens',
        description: 'المرجع الكلاسيكي لفهم بروتوكولات TCP/IP بتفصيل عميق مع أمثلة عملية.',
        tags: ['متقدم', 'TCP/IP', 'بروتوكولات'],
        link: '#',
        rating: 4.9,
      },
    ],
  },
  {
    title: '🎯 كتب اختبار الاختراق',
    books: [
      {
        cover: '🔓',
        title: 'The Web Application Hacker\'s Handbook',
        author: 'Dafydd Stuttard & Marcus Pinto',
        description: 'الدليل الشامل لاختبار أمن تطبيقات الويب، يغطي جميع تقنيات الاختراق والثغرات المعروفة.',
        tags: ['متقدم', 'Web Security', 'Pentesting'],
        link: '#',
        rating: 4.9,
      },
      {
        cover: '⚔️',
        title: 'Metasploit: The Penetration Tester\'s Guide',
        author: 'David Kennedy et al.',
        description: 'دليل عملي شامل لاستخدام إطار عمل Metasploit في اختبار الاختراق والاستغلال.',
        tags: ['متوسط', 'Metasploit', 'أدوات'],
        link: '#',
        rating: 4.6,
      },
      {
        cover: '🎭',
        title: 'Penetration Testing: A Hands-On Introduction',
        author: 'Georgia Weidman',
        description: 'مقدمة عملية لاختبار الاختراق تغطي المنهجيات والأدوات والتقنيات الحديثة.',
        tags: ['مبتدئ', 'Pentesting', 'عملي'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '🏴',
        title: 'Advanced Penetration Testing',
        author: 'Wil Allsopp',
        description: 'تقنيات متقدمة في اختبار الاختراق للبنى التحتية المعقدة والشبكات المؤسسية.',
        tags: ['خبير', 'Advanced', 'Enterprise'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '🌐',
        title: 'The Hacker Playbook 3',
        author: 'Peter Kim',
        description: 'دليل عملي يحاكي سيناريوهات اختبار الاختراق الواقعية مع أحدث التقنيات والأدوات.',
        tags: ['متوسط', 'عملي', 'سيناريوهات'],
        link: '#',
        rating: 4.7,
      },
    ],
  },
  {
    title: '🛡️ كتب الأمن الدفاعي (Defensive Security)',
    books: [
      {
        cover: '🔍',
        title: 'Blue Team Handbook: Incident Response Edition',
        author: 'Don Murdoch',
        description: 'دليل مرجعي سريع لفرق الدفاع السيبراني والاستجابة للحوادث الأمنية.',
        tags: ['متوسط', 'Blue Team', 'Incident Response'],
        link: '#',
        rating: 4.5,
      },
      {
        cover: '🚨',
        title: 'Security Operations Center: Building, Operating, and Maintaining',
        author: 'Joseph Muniz et al.',
        description: 'دليل شامل لبناء وتشغيل مراكز العمليات الأمنية (SOC) بكفاءة عالية.',
        tags: ['متقدم', 'SOC', 'عمليات'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '📊',
        title: 'Applied Incident Response',
        author: 'Steve Anson',
        description: 'منهجية عملية للاستجابة للحوادث الأمنية من الكشف حتى التعافي الكامل.',
        tags: ['متوسط', 'IR', 'عملي'],
        link: '#',
        rating: 4.6,
      },
      {
        cover: '🔐',
        title: 'Defensive Security Handbook',
        author: 'Lee Brotherston & Amanda Berlin',
        description: 'أفضل الممارسات لحماية البنية التحتية وبناء دفاعات سيبرانية قوية.',
        tags: ['مبتدئ', 'دفاع', 'أفضل الممارسات'],
        link: '#',
        rating: 4.5,
      },
    ],
  },
  {
    title: '🔬 كتب الهندسة العكسية (Reverse Engineering)',
    books: [
      {
        cover: '🧬',
        title: 'Practical Malware Analysis',
        author: 'Michael Sikorski & Andrew Honig',
        description: 'الدليل الشامل لتحليل البرمجيات الخبيثة والهندسة العكسية بأسلوب عملي.',
        tags: ['متقدم', 'Malware', 'تحليل'],
        link: '#',
        rating: 4.9,
      },
      {
        cover: '⚙️',
        title: 'Reversing: Secrets of Reverse Engineering',
        author: 'Eldad Eilam',
        description: 'أساسيات ومفاهيم الهندسة العكسية للبرمجيات مع تطبيقات عملية متنوعة.',
        tags: ['متوسط', 'Reverse Engineering', 'أساسيات'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '🦠',
        title: 'The Art of Memory Forensics',
        author: 'Michael Hale Ligh et al.',
        description: 'تحليل الذاكرة الجنائي لاكتشاف البرمجيات الخبيثة والتهديدات المتقدمة.',
        tags: ['خبير', 'Forensics', 'Memory Analysis'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '💾',
        title: 'Practical Binary Analysis',
        author: 'Dennis Andriesse',
        description: 'تعلم تحليل الملفات الثنائية واستخراج المعلومات منها باستخدام أدوات حديثة.',
        tags: ['متقدم', 'Binary Analysis', 'عملي'],
        link: '#',
        rating: 4.6,
      },
    ],
  },
  {
    title: '🔐 كتب التشفير (Cryptography)',
    books: [
      {
        cover: '🔑',
        title: 'Cryptography Engineering',
        author: 'Niels Ferguson, Bruce Schneier, Tadayoshi Kohno',
        description: 'مبادئ التصميم وأفضل الممارسات لبناء أنظمة تشفير آمنة وفعالة.',
        tags: ['متقدم', 'تشفير', 'تصميم'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '📐',
        title: 'Introduction to Modern Cryptography',
        author: 'Jonathan Katz & Yehuda Lindell',
        description: 'مقدمة أكاديمية شاملة للتشفير الحديث مع أسس رياضية قوية.',
        tags: ['متوسط', 'تشفير', 'أكاديمي'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '🧮',
        title: 'Applied Cryptography',
        author: 'Bruce Schneier',
        description: 'المرجع الكلاسيكي للتشفير التطبيقي، يغطي البروتوكولات والخوارزميات.',
        tags: ['متقدم', 'Protocols', 'مرجع'],
        link: '#',
        rating: 4.9,
      },
      {
        cover: '🔓',
        title: 'Serious Cryptography',
        author: 'Jean-Philippe Aumasson',
        description: 'دليل عملي للتشفير الحديث بأسلوب واضح ومباشر للممارسين.',
        tags: ['متوسط', 'عملي', 'حديث'],
        link: '#',
        rating: 4.6,
      },
    ],
  },
  {
    title: '📱 كتب أمن التطبيقات (Application Security)',
    books: [
      {
        cover: '🌐',
        title: 'OWASP Testing Guide',
        author: 'OWASP Foundation',
        description: 'الدليل الشامل لاختبار أمن تطبيقات الويب وفقاً لمعايير OWASP العالمية.',
        tags: ['متوسط', 'OWASP', 'Web Security'],
        link: '#',
        rating: 4.8,
      },
      {
        cover: '📲',
        title: 'Mobile Application Hacker\'s Handbook',
        author: 'Dominic Chell et al.',
        description: 'دليل شامل لاختبار أمن تطبيقات الموبايل على منصات iOS و Android.',
        tags: ['متقدم', 'Mobile', 'iOS/Android'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '⚡',
        title: 'The Tangled Web',
        author: 'Michal Zalewski',
        description: 'فهم عميق لأمن المتصفحات وتطبيقات الويب من منظور تقني متقدم.',
        tags: ['متقدم', 'Browser Security', 'تقني'],
        link: '#',
        rating: 4.6,
      },
      {
        cover: '☁️',
        title: 'Cloud Security & Privacy',
        author: 'Tim Mather et al.',
        description: 'أمن الحوسبة السحابية وحماية البيانات في البيئات السحابية.',
        tags: ['متوسط', 'Cloud', 'Privacy'],
        link: '#',
        rating: 4.5,
      },
    ],
  },
  {
    title: '📖 كتب الأمن العام والاستراتيجي (General & Strategic Security)',
    books: [
      {
        cover: '🎓',
        title: 'Security Engineering',
        author: 'Ross Anderson',
        description: 'موسوعة شاملة في هندسة الأمن، تغطي المبادئ والأنظمة والتطبيقات الواقعية.',
        tags: ['متقدم', 'هندسة', 'موسوعي'],
        link: '#',
        rating: 4.9,
      },
      {
        cover: '🧠',
        title: 'The Art of Deception',
        author: 'Kevin Mitnick',
        description: 'فهم الهندسة الاجتماعية وكيف يستغل المهاجمون العنصر البشري.',
        tags: ['مبتدئ', 'Social Engineering', 'إنساني'],
        link: '#',
        rating: 4.7,
      },
      {
        cover: '📚',
        title: 'Hacking: The Art of Exploitation',
        author: 'Jon Erickson',
        description: 'تعلم أساسيات الاختراق والبرمجة والاستغلال من منظور تقني عميق.',
        tags: ['متوسط', 'Exploitation', 'أساسيات'],
        link: '#',
        rating: 4.8,
      },
    ],
  },
]

export default function BooksPage() {
  const { t } = useLanguage()
  
  return (
    <div className="books-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unified Page Header */}
        <PageHeader 
          title={t('books.title')} 
          icon={BookOpen}
          description={t('books.description')}
        />

        <div className="books-content">
        {categories.map((category, categoryIndex) => {
          // Extract emoji and text from title
          const emojiMatch = category.title.match(/^([^\s]+)\s(.+)$/)
          const emoji = emojiMatch ? emojiMatch[1] : ''
          const titleText = emojiMatch ? emojiMatch[2] : category.title
          const IconComponent = emoji && emojiToIcon[emoji] ? emojiToIcon[emoji] : null
          
          return (
          <section key={categoryIndex} className="book-category-section">
            <h2 className="book-category-title flex items-center gap-3">
              {IconComponent && <IconComponent className="w-8 h-8 text-cyber-neon" />}
              {titleText}
            </h2>
            <div className="books-grid">
              {category.books.map((book, bookIndex) => (
                <div 
                  key={bookIndex} 
                  className="book-card-enhanced"
                  style={{ animationDelay: `${(categoryIndex * category.books.length + bookIndex) * 0.05}s` }}
                >
                  <div className="book-cover-enhanced">
                    <div className="book-cover-icon">
                      {typeof book.cover === 'string' && emojiToIcon[book.cover] ? (
                        (() => {
                          const Icon = emojiToIcon[book.cover]
                          return <Icon className="w-12 h-12 text-cyber-neon" />
                        })()
                      ) : typeof book.cover === 'string' ? (
                        book.cover
                      ) : (
                        (() => {
                          const Icon = book.cover
                          return <Icon className="w-12 h-12 text-cyber-neon" />
                        })()
                      )}
                    </div>
                    {book.rating && (
                      <div className="book-rating">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="book-info-enhanced">
                    <h3 className="book-title-enhanced">{book.title}</h3>
                    <p className="book-author-enhanced">
                      <span className="book-author-label">المؤلف:</span> {book.author}
                    </p>
                    <p className="book-description-enhanced">{book.description}</p>
                    <div className="book-tags-enhanced">
                      {book.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="book-tag-enhanced">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={book.link} 
                      className="book-link-enhanced"
                      target={book.link !== '#' ? '_blank' : undefined}
                      rel={book.link !== '#' ? 'noopener noreferrer' : undefined}
                    >
                      <span>عرض التفاصيل</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
          )
        })}
        </div>
      </div>
    </div>
  )
}
