export interface SeedDownload {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string
  videoUrl?: string
  downloadUrl?: string
  category?: string
}

export const seedDownloads: SeedDownload[] = [
  {
    id: 'edrawmax',
    name: 'EdrawMax',
    nameEn: 'EdrawMax',
    description: 'برنامج احترافي لإنشاء المخططات الانسيابية والرسوم الهندسية.',
    descriptionEn: 'Professional diagramming software for flowcharts and engineering visuals.',
    icon: 'PenTool',
    videoUrl: 'https://www.youtube.com/watch?v=5CfH2Yh4X_w',
    downloadUrl: 'https://www.edrawsoft.com/edraw-max/',
    category: 'رسم هندسي',
  },
  {
    id: 'xshell',
    name: 'Xshell',
    nameEn: 'Xshell',
    description: 'محاكي طرفية قوي لدعم بروتوكولات SSH وTelnet.',
    descriptionEn: 'Powerful terminal emulator supporting SSH and Telnet.',
    icon: 'Terminal',
    videoUrl: 'https://www.youtube.com/watch?v=EjhqjX6ix-4',
    downloadUrl: 'https://www.netsarang.com/en/xshell/',
    category: 'إدارة خوادم',
  },
  {
    id: 'xftp',
    name: 'Xftp',
    nameEn: 'Xftp',
    description: 'أداة مدمجة لنقل الملفات باستخدام بروتوكولات SFTP وFTP.',
    descriptionEn: 'Modern file transfer client for SFTP and FTP workflows.',
    icon: 'UploadCloud',
    videoUrl: 'https://www.youtube.com/watch?v=KY_pQ0kzXks',
    downloadUrl: 'https://www.netsarang.com/en/xftp/',
    category: 'نقل ملفات',
  },
  {
    id: 'projectlibre',
    name: 'ProjectLibre',
    nameEn: 'ProjectLibre',
    description: 'بديل مفتوح المصدر لـ Microsoft Project لإدارة المشاريع.',
    descriptionEn: 'Open-source alternative to Microsoft Project for managing timelines.',
    icon: 'ClipboardList',
    videoUrl: 'https://www.youtube.com/watch?v=8sh09Kkq5NI',
    downloadUrl: 'https://www.projectlibre.com/',
    category: 'إدارة مشاريع',
  },
  {
    id: 'canva',
    name: 'Canva',
    nameEn: 'Canva',
    description: 'منصة تصميم مرئية سريعة لإنشاء عروض تقديمية ومنشورات.',
    descriptionEn: 'Visual design platform for quick presentations and social posts.',
    icon: 'Palette',
    videoUrl: 'https://www.youtube.com/watch?v=boP5Nm_4GnE',
    downloadUrl: 'https://www.canva.com/',
    category: 'تصميم',
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio',
    nameEn: 'Visual Studio',
    description: 'بيئة تطوير متكاملة تدعم لغات متعددة للتطبيقات والويب.',
    descriptionEn: 'Integrated development environment supporting multiple languages.',
    icon: 'Code2',
    videoUrl: 'https://www.youtube.com/watch?v=grD_M6hnaRw',
    downloadUrl: 'https://visualstudio.microsoft.com/',
    category: 'تطوير',
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    nameEn: 'Microsoft 365',
    description: 'حزمة الإنتاجية الأكثر استخدامًا للمستندات والتعاون السحابي.',
    descriptionEn: 'Popular productivity suite for documents and collaboration.',
    icon: 'Briefcase',
    videoUrl: 'https://www.youtube.com/watch?v=t0aBM4tiJtk',
    downloadUrl: 'https://www.microsoft.com/microsoft-365',
    category: 'إنتاجية',
  },
  {
    id: 'zoom',
    name: 'Zoom Cloud Meetings',
    nameEn: 'Zoom Cloud Meetings',
    description: 'حل الاجتماعات المرئية الأشهر للتعليم والعمل عن بعد.',
    descriptionEn: 'Leading video conferencing solution for remote work and learning.',
    icon: 'Video',
    videoUrl: 'https://www.youtube.com/watch?v=fMUxzrgZvZQ',
    downloadUrl: 'https://zoom.us/download',
    category: 'اجتماعات',
  },
]


