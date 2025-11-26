export interface SeedMaterial {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: string
  color: string
  articlesCount: number
  lastUpdated: string
}

export const seedMaterials: SeedMaterial[] = [
  {
    id: 'applied-physics',
    title: 'الفيزياء التطبيقية',
    titleEn: 'Applied Physics',
    description: 'مبادئ الفيزياء وتطبيقاتها في التكنولوجيا.',
    descriptionEn: 'Fundamentals of physics and how they are applied in modern technology.',
    icon: 'Atom',
    color: 'from-blue-500 to-blue-600',
    articlesCount: 2,
    lastUpdated: '2025-01-05',
  },
  {
    id: 'mathematics',
    title: 'الرياضيات',
    titleEn: 'Mathematics',
    description: 'أسس الرياضيات وحل المشكلات بطريقة منهجية.',
    descriptionEn: 'Core mathematics concepts and structured problem solving.',
    icon: 'Calculator',
    color: 'from-green-500 to-green-600',
    articlesCount: 3,
    lastUpdated: '2025-01-07',
  },
  {
    id: 'entrepreneurship',
    title: 'ريادة الأعمال والتفكير الإبداعي',
    titleEn: 'Entrepreneurship & Creative Thinking',
    description: 'الابتكار في الأعمال وحل المشكلات الإبداعي.',
    descriptionEn: 'Innovation strategies for business and creative problem solving.',
    icon: 'Users',
    color: 'from-purple-500 to-purple-600',
    articlesCount: 1,
    lastUpdated: '2025-01-03',
  },
  {
    id: 'information-technology',
    title: 'تكنولوجيا المعلومات',
    titleEn: 'Information Technology',
    description: 'أساسيات تكنولوجيا المعلومات والتقنيات الحديثة.',
    descriptionEn: 'IT fundamentals and the latest emerging technologies.',
    icon: 'Globe',
    color: 'from-cyan-500 to-cyan-600',
    articlesCount: 4,
    lastUpdated: '2025-01-10',
  },
  {
    id: 'database-systems',
    title: 'قواعد البيانات',
    titleEn: 'Database Systems',
    description: 'تصميم وتنفيذ وإدارة قواعد البيانات للمشاريع الحديثة.',
    descriptionEn: 'Designing, implementing, and managing databases for modern projects.',
    icon: 'Database',
    color: 'from-orange-500 to-orange-600',
    articlesCount: 2,
    lastUpdated: '2025-01-09',
  },
  {
    id: 'english-language',
    title: 'اللغة الإنجليزية',
    titleEn: 'English Language',
    description: 'التواصل باللغة الإنجليزية والكتابة التقنية.',
    descriptionEn: 'Communication skills and technical writing in English.',
    icon: 'BookOpen',
    color: 'from-red-500 to-red-600',
    articlesCount: 2,
    lastUpdated: '2025-01-04',
  },
  {
    id: 'information-systems',
    title: 'نظم المعلومات',
    titleEn: 'Information Systems',
    description: 'تحليل وتصميم وتنفيذ نظم المعلومات المؤسسية.',
    descriptionEn: 'Analysis, design, and implementation of enterprise information systems.',
    icon: 'BookOpen',
    color: 'from-indigo-500 to-indigo-600',
    articlesCount: 3,
    lastUpdated: '2025-01-08',
  },
]


