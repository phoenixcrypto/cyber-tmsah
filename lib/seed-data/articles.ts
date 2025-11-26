export interface SeedArticle {
  id: string
  materialId: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  excerpt?: string
  excerptEn?: string
  author: string
  status: 'published' | 'draft'
  tags: string[]
  publishedAt?: string
}

export const seedArticles: SeedArticle[] = [
  {
    id: 'article-physics-1',
    materialId: 'applied-physics',
    title: 'مقدمة في قوانين الحركة',
    titleEn: 'Introduction to Motion Laws',
    content: '<p>تنطلق دراسة الفيزياء من فهم قوانين نيوتن للحركة وكيفية تطبيقها على الأنظمة الحديثة.</p>',
    contentEn: '<p>Physics starts by understanding Newton&apos;s laws of motion and how they apply to modern systems.</p>',
    excerpt: 'مراجعة سريعة لأهم قوانين الحركة وكيفية قراءتها.',
    excerptEn: 'A quick review of the essential laws of motion and how to interpret them.',
    author: 'فريق المحتوى العلمي',
    status: 'published',
    tags: ['physics', 'mechanics'],
    publishedAt: '2025-01-06T09:00:00.000Z',
  },
  {
    id: 'article-it-1',
    materialId: 'information-technology',
    title: 'خريطة طريق لتعلم أساسيات تكنولوجيا المعلومات',
    titleEn: 'Roadmap to Learn IT Fundamentals',
    content: '<p>يستعرض هذا الدليل أهم المهارات التي يحتاجها الطالب لفهم البنية التحتية الحديثة.</p>',
    contentEn: '<p>This guide covers the key skills required to understand modern infrastructure.</p>',
    excerpt: 'من الشبكات إلى الأمن السيبراني، هكذا تبدأ رحلتك في عالم IT.',
    excerptEn: 'From networking to cybersecurity, here is how you begin your IT journey.',
    author: 'قسم تكنولوجيا المعلومات',
    status: 'published',
    tags: ['it', 'networking'],
    publishedAt: '2025-01-09T11:30:00.000Z',
  },
  {
    id: 'article-db-1',
    materialId: 'database-systems',
    title: 'أفضل ممارسات تصميم قواعد البيانات',
    titleEn: 'Best Practices for Database Design',
    content: '<p>استخدام التطبيع، وضبط الفهارس، ومراقبة الأداء هي الركائز الأساسية لأي قاعدة بيانات ناجحة.</p>',
    contentEn: '<p>Normalization, indexing, and performance monitoring are the pillars of any successful database.</p>',
    excerpt: 'مقال عملي يتناول أخطاء التصميم الشائعة وكيفية تجنبها.',
    excerptEn: 'A practical article covering common design mistakes and how to avoid them.',
    author: 'فريق قواعد البيانات',
    status: 'published',
    tags: ['database', 'design'],
    publishedAt: '2025-01-11T14:15:00.000Z',
  },
]


