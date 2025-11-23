'use client'

import { GraduationCap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

interface Course {
  title: string
  instructor: string
  description: string
  tags: string[]
  link: string
}

interface Category {
  title: string
  courses: Course[]
}

const categories: Category[] = [
  {
    title: 'دورات الأساسيات (الشبكات، الأنظمة، البرمجة)',
    courses: [
      {
        title: 'مقدمة في الأمن السيبراني',
        instructor: 'Cisco Networking Academy',
        description: 'دورة شاملة تغطي أساسيات الأمن السيبراني، التهديدات، ومبادئ الحماية.',
        tags: ['مبتدئ', 'مجاني', 'شهادة'],
        link: '#',
      },
      {
        title: 'أساسيات الشبكات',
        instructor: 'Google',
        description: 'تعلم أساسيات الشبكات، البروتوكولات، وتصميم البنية التحتية للشبكات.',
        tags: ['مبتدئ', 'مجاني'],
        link: '#',
      },
      {
        title: 'برمجة بايثون للأمن السيبراني',
        instructor: 'Codecademy',
        description: 'تعلم برمجة بايثون وتطبيقها في مجالات الأمن السيبراني المختلفة.',
        tags: ['مبتدئ', 'مدفوع', 'برمجة'],
        link: '#',
      },
    ],
  },
  {
    title: 'دورات المسار الهجومي (Penetration Testing)',
    courses: [
      {
        title: 'أخلاقيات الهاكينج والاختراق',
        instructor: 'EC-Council',
        description: 'دورة شاملة تغطي منهجيات الاختبارات الاختراقية وأدواتها.',
        tags: ['متوسط', 'مدفوع', 'شهادة'],
        link: '#',
      },
      {
        title: 'اختبار اختراق تطبيقات الويب',
        instructor: 'PortSwigger',
        description: 'تعلم كيفية اكتشاف الثغرات في تطبيقات الويب واستغلالها.',
        tags: ['متقدم', 'مجاني'],
        link: '#',
      },
      {
        title: 'الهندسة الاجتماعية والاختراق المادي',
        instructor: 'SANS Institute',
        description: 'تعلم تقنيات الهندسة الاجتماعية والاختراق المادي للأنظمة.',
        tags: ['متقدم', 'مدفوع', 'مكثف'],
        link: '#',
      },
    ],
  },
  {
    title: 'دورات المسار الدفاعي (SOC & Incident Response)',
    courses: [
      {
        title: 'مركز عمليات الأمن SOC',
        instructor: 'Coursera - IBM',
        description: 'تعلم مهام ومهارات محللي مركز عمليات الأمن SOC.',
        tags: ['متوسط', 'مجاني', 'شهادة'],
        link: '#',
      },
      {
        title: 'الاستجابة للحوادث الأمنية',
        instructor: 'Cybrary',
        description: 'تعلم منهجيات الاستجابة للحوادث الأمنية وتحليل الأدلة الرقمية.',
        tags: ['متقدم', 'مجاني'],
        link: '#',
      },
      {
        title: 'تحليل البرمجيات الخبيثة',
        instructor: 'Pluralsight',
        description: 'تعلم تقنيات تحليل البرمجيات الخبيثة وتفكيكها لفهم سلوكها.',
        tags: ['متقدم', 'مدفوع', 'مختبر'],
        link: '#',
      },
    ],
  },
]

export default function CoursesPage() {
  const { t } = useLanguage()
  
  return (
    <div className="page-container">
      <PageHeader 
        title={t('courses.title')} 
        icon={GraduationCap}
        description={t('courses.description')}
        />

        <div className="courses-content">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="category-title">{category.title}</h2>
            <div className="courses-grid">
              {category.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="course-card">
                  <div className="course-thumbnail">صورة الدورة</div>
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p className="course-instructor">{course.instructor}</p>
                    <p className="course-description">{course.description}</p>
                    <div className="course-tags">
                      {course.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="course-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={course.link} className="course-link">
                      مشاهدة الدورة
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
