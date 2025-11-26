export interface SeedPage {
  id: string
  slug: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  metaDescription?: string
  metaDescriptionEn?: string
  status: 'published' | 'draft'
  order?: number
}

export const seedPages: SeedPage[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'من نحن',
    titleEn: 'About Us',
    content: '<p>منصة Cyber TMSAH هي مبادرة تعليمية رقمية تركز على تمكين الطلاب في مجالات الأمن السيبراني والتكنولوجيا الحديثة.</p>',
    contentEn: '<p>Cyber TMSAH is a digital learning initiative focused on empowering students in cybersecurity and modern technology.</p>',
    metaDescription: 'تعرف على رسالتنا في تمكين الجيل القادم من خبراء الأمن السيبراني.',
    metaDescriptionEn: 'Learn about our mission to empower the next generation of cybersecurity experts.',
    status: 'published',
    order: 1,
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'سياسة الخصوصية',
    titleEn: 'Privacy Policy',
    content: '<p>نلتزم بحماية خصوصية مستخدمينا ونعامل البيانات بحرص شديد، مع الالتزام بالقوانين المحلية والدولية.</p>',
    contentEn: '<p>We are committed to protecting your privacy and handling data with great care in accordance with local and international regulations.</p>',
    metaDescription: 'تعرف على كيفية تعاملنا مع بياناتك الشخصية.',
    metaDescriptionEn: 'Understand how we handle your personal data.',
    status: 'published',
    order: 2,
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'الشروط والأحكام',
    titleEn: 'Terms & Conditions',
    content: '<p>باستخدامك للمنصة فإنك توافق على الالتزام بسياسات الاستخدام العادل والضوابط الأكاديمية.</p>',
    contentEn: '<p>By using the platform you agree to comply with fair use policies and academic integrity guidelines.</p>',
    metaDescription: 'الشروط المنظمة لاستخدام منصة Cyber TMSAH.',
    metaDescriptionEn: 'The terms governing the use of the Cyber TMSAH platform.',
    status: 'published',
    order: 3,
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'تواصل معنا',
    titleEn: 'Contact Us',
    content: '<p>يمكنك التواصل معنا عبر البريد الإلكتروني support@cyber-tmsah.site أو من خلال نموذج التواصل في الموقع.</p>',
    contentEn: '<p>You can reach us at support@cyber-tmsah.site or through the contact form on the website.</p>',
    metaDescription: 'طرق التواصل مع فريق Cyber TMSAH.',
    metaDescriptionEn: 'Ways to contact the Cyber TMSAH team.',
    status: 'published',
    order: 4,
  },
]


