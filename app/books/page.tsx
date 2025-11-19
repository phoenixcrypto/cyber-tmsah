'use client'

interface Book {
  cover: string
  title: string
  author: string
  description: string
  tags: string[]
  link: string
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
      },
      {
        cover: '📘',
        title: 'Black Hat Python',
        author: 'Justin Seitz',
        description: 'تعلم كتابة أدوات القرصنة الأخلاقية باستخدام بايثون، من اختراق الشبكات إلى تحليل البرمجيات الخبيثة.',
        tags: ['متقدم', 'بايثون', 'Hacking'],
        link: '#',
      },
      {
        cover: '🔧',
        title: 'Violent Python',
        author: 'TJ O\'Connor',
        description: 'كتاب متخصص في بناء أدوات الاختراق والتحليل الجنائي باستخدام بايثون بطريقة عملية.',
        tags: ['متقدم', 'بايثون', 'أدوات'],
        link: '#',
      },
      {
        cover: '⚙️',
        title: 'C Programming for Security',
        author: 'Marcus Johnson',
        description: 'فهم عميق للغة C وكيفية استخدامها في تطوير برمجيات آمنة واكتشاف الثغرات.',
        tags: ['متوسط', 'C Language', 'Secure Coding'],
        link: '#',
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
      },
      {
        cover: '🔒',
        title: 'Network Security Essentials',
        author: 'William Stallings',
        description: 'أساسيات أمن الشبكات بما في ذلك التشفير، جدران النار، والكشف عن التسلل.',
        tags: ['متوسط', 'أمن الشبكات', 'تشفير'],
        link: '#',
      },
      {
        cover: '🛡️',
        title: 'The Practice of Network Security Monitoring',
        author: 'Richard Bejtlich',
        description: 'دليل عملي لمراقبة أمن الشبكات واكتشاف التهديدات والاستجابة للحوادث الأمنية.',
        tags: ['متقدم', 'مراقبة', 'تهديدات'],
        link: '#',
      },
      {
        cover: '🌍',
        title: 'TCP/IP Illustrated',
        author: 'W. Richard Stevens',
        description: 'المرجع الكلاسيكي لفهم بروتوكولات TCP/IP بتفصيل عميق مع أمثلة عملية.',
        tags: ['متقدم', 'TCP/IP', 'بروتوكولات'],
        link: '#',
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
      },
      {
        cover: '⚔️',
        title: 'Metasploit: The Penetration Tester\'s Guide',
        author: 'David Kennedy et al.',
        description: 'دليل عملي شامل لاستخدام إطار عمل Metasploit في اختبار الاختراق والاستغلال.',
        tags: ['متوسط', 'Metasploit', 'أدوات'],
        link: '#',
      },
      {
        cover: '🎭',
        title: 'Penetration Testing: A Hands-On Introduction',
        author: 'Georgia Weidman',
        description: 'مقدمة عملية لاختبار الاختراق تغطي المنهجيات والأدوات والتقنيات الحديثة.',
        tags: ['مبتدئ', 'Pentesting', 'عملي'],
        link: '#',
      },
      {
        cover: '🏴',
        title: 'Advanced Penetration Testing',
        author: 'Wil Allsopp',
        description: 'تقنيات متقدمة في اختبار الاختراق للبنى التحتية المعقدة والشبكات المؤسسية.',
        tags: ['خبير', 'Advanced', 'Enterprise'],
        link: '#',
      },
      {
        cover: '🌐',
        title: 'The Hacker Playbook 3',
        author: 'Peter Kim',
        description: 'دليل عملي يحاكي سيناريوهات اختبار الاختراق الواقعية مع أحدث التقنيات والأدوات.',
        tags: ['متوسط', 'عملي', 'سيناريوهات'],
        link: '#',
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
      },
      {
        cover: '🚨',
        title: 'Security Operations Center: Building, Operating, and Maintaining',
        author: 'Joseph Muniz et al.',
        description: 'دليل شامل لبناء وتشغيل مراكز العمليات الأمنية (SOC) بكفاءة عالية.',
        tags: ['متقدم', 'SOC', 'عمليات'],
        link: '#',
      },
      {
        cover: '📊',
        title: 'Applied Incident Response',
        author: 'Steve Anson',
        description: 'منهجية عملية للاستجابة للحوادث الأمنية من الكشف حتى التعافي الكامل.',
        tags: ['متوسط', 'IR', 'عملي'],
        link: '#',
      },
      {
        cover: '🔐',
        title: 'Defensive Security Handbook',
        author: 'Lee Brotherston & Amanda Berlin',
        description: 'أفضل الممارسات لحماية البنية التحتية وبناء دفاعات سيبرانية قوية.',
        tags: ['مبتدئ', 'دفاع', 'أفضل الممارسات'],
        link: '#',
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
      },
      {
        cover: '⚙️',
        title: 'Reversing: Secrets of Reverse Engineering',
        author: 'Eldad Eilam',
        description: 'أساسيات ومفاهيم الهندسة العكسية للبرمجيات مع تطبيقات عملية متنوعة.',
        tags: ['متوسط', 'Reverse Engineering', 'أساسيات'],
        link: '#',
      },
      {
        cover: '🦠',
        title: 'The Art of Memory Forensics',
        author: 'Michael Hale Ligh et al.',
        description: 'تحليل الذاكرة الجنائي لاكتشاف البرمجيات الخبيثة والتهديدات المتقدمة.',
        tags: ['خبير', 'Forensics', 'Memory Analysis'],
        link: '#',
      },
      {
        cover: '💾',
        title: 'Practical Binary Analysis',
        author: 'Dennis Andriesse',
        description: 'تعلم تحليل الملفات الثنائية واستخراج المعلومات منها باستخدام أدوات حديثة.',
        tags: ['متقدم', 'Binary Analysis', 'عملي'],
        link: '#',
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
      },
      {
        cover: '📐',
        title: 'Introduction to Modern Cryptography',
        author: 'Jonathan Katz & Yehuda Lindell',
        description: 'مقدمة أكاديمية شاملة للتشفير الحديث مع أسس رياضية قوية.',
        tags: ['متوسط', 'تشفير', 'أكاديمي'],
        link: '#',
      },
      {
        cover: '🧮',
        title: 'Applied Cryptography',
        author: 'Bruce Schneier',
        description: 'المرجع الكلاسيكي للتشفير التطبيقي، يغطي البروتوكولات والخوارزميات.',
        tags: ['متقدم', 'Protocols', 'مرجع'],
        link: '#',
      },
      {
        cover: '🔓',
        title: 'Serious Cryptography',
        author: 'Jean-Philippe Aumasson',
        description: 'دليل عملي للتشفير الحديث بأسلوب واضح ومباشر للممارسين.',
        tags: ['متوسط', 'عملي', 'حديث'],
        link: '#',
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
      },
      {
        cover: '📲',
        title: 'Mobile Application Hacker\'s Handbook',
        author: 'Dominic Chell et al.',
        description: 'دليل شامل لاختبار أمن تطبيقات الموبايل على منصات iOS و Android.',
        tags: ['متقدم', 'Mobile', 'iOS/Android'],
        link: '#',
      },
      {
        cover: '⚡',
        title: 'The Tangled Web',
        author: 'Michal Zalewski',
        description: 'فهم عميق لأمن المتصفحات وتطبيقات الويب من منظور تقني متقدم.',
        tags: ['متقدم', 'Browser Security', 'تقني'],
        link: '#',
      },
      {
        cover: '☁️',
        title: 'Cloud Security & Privacy',
        author: 'Tim Mather et al.',
        description: 'أمن الحوسبة السحابية وحماية البيانات في البيئات السحابية.',
        tags: ['متوسط', 'Cloud', 'Privacy'],
        link: '#',
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
      },
      {
        cover: '🧠',
        title: 'The Art of Deception',
        author: 'Kevin Mitnick',
        description: 'فهم الهندسة الاجتماعية وكيف يستغل المهاجمون العنصر البشري.',
        tags: ['مبتدئ', 'Social Engineering', 'إنساني'],
        link: '#',
      },
      {
        cover: '📚',
        title: 'Hacking: The Art of Exploitation',
        author: 'Jon Erickson',
        description: 'تعلم أساسيات الاختراق والبرمجة والاستغلال من منظور تقني عميق.',
        tags: ['متوسط', 'Exploitation', 'أساسيات'],
        link: '#',
      },
    ],
  },
]

export default function BooksPage() {
  return (
    <div className="books-page">
      <section className="page-hero">
        <h1>📚 مكتبة الكتب الشاملة</h1>
        <p>مجموعة منتقاة لأهم كتب الأمن السيبراني، مصنفة حسب التخصص والمستوى.</p>
      </section>

      <div className="library-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="book-category-title">{category.title}</h2>
            <div className="book-grid">
              {category.books.map((book, bookIndex) => (
                <div key={bookIndex} className="book-card">
                  <div className="book-cover">{book.cover}</div>
                  <h4>{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <p className="book-description">{book.description}</p>
                  <div className="book-tags">
                    {book.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="book-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={book.link} className="book-link">
                    عرض التفاصيل
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
