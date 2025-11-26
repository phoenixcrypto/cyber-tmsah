export interface SeedNews {
  id: string
  title: string
  titleEn: string
  subjectId: string
  subjectTitle: string
  subjectTitleEn: string
  url: string
  status: 'published' | 'draft'
  publishedAt: string
}

export const seedNews: SeedNews[] = [
  {
    id: 'news-1',
    title: 'إطلاق منصة Cyber TMSAH للتعلم المتقدم',
    titleEn: 'Cyber TMSAH Platform Launch',
    subjectId: 'information-technology',
    subjectTitle: 'تكنولوجيا المعلومات',
    subjectTitleEn: 'Information Technology',
    url: 'https://www.cyber-tmsah.site/news/platform-launch',
    status: 'published',
    publishedAt: '2025-01-05T09:00:00.000Z',
  },
  {
    id: 'news-2',
    title: 'خطة محدثة للجدول الدراسي للفصل الثاني',
    titleEn: 'Updated Schedule for Spring Term',
    subjectId: 'schedule',
    subjectTitle: 'الجدول الدراسي',
    subjectTitleEn: 'Schedule',
    url: 'https://www.cyber-tmsah.site/news/spring-schedule',
    status: 'published',
    publishedAt: '2025-01-08T12:00:00.000Z',
  },
  {
    id: 'news-3',
    title: 'مسابقة الابتكار وريادة الأعمال 2025',
    titleEn: 'Innovation & Entrepreneurship Challenge 2025',
    subjectId: 'entrepreneurship',
    subjectTitle: 'ريادة الأعمال والتفكير الإبداعي',
    subjectTitleEn: 'Entrepreneurship & Creative Thinking',
    url: 'https://www.cyber-tmsah.site/news/entrepreneurship-challenge',
    status: 'published',
    publishedAt: '2025-01-12T15:30:00.000Z',
  },
]


