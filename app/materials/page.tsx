'use client'

import Link from 'next/link'
import { BookOpen, Calculator, Atom, Database, Globe, Users, ArrowRight, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

interface Subject {
  id: string
  title: string
  description: string
  icon: any
  color: string
  articlesCount: number
  lastUpdated: string
}

// Static data - no API calls
const subjectsData: Subject[] = [
  {
    id: 'applied-physics',
    title: 'الفيزياء التطبيقية',
    description: 'مبادئ الفيزياء وتطبيقاتها في التكنولوجيا',
    icon: Atom,
    color: 'from-blue-500 to-blue-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'mathematics',
    title: 'الرياضيات',
    description: 'أسس الرياضيات وحل المشكلات',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'entrepreneurship',
    title: 'ريادة الأعمال والتفكير الإبداعي',
    description: 'الابتكار في الأعمال وحل المشكلات الإبداعي',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'information-technology',
    title: 'تكنولوجيا المعلومات',
    description: 'أساسيات تكنولوجيا المعلومات والتقنيات الحديثة',
    icon: Globe,
    color: 'from-cyan-500 to-cyan-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'database-systems',
    title: 'قواعد البيانات',
    description: 'تصميم وتنفيذ وإدارة قواعد البيانات',
    icon: Database,
    color: 'from-orange-500 to-orange-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'english-language',
    title: 'اللغة الإنجليزية',
    description: 'التواصل باللغة الإنجليزية والكتابة التقنية',
    icon: BookOpen,
    color: 'from-red-500 to-red-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  },
  {
    id: 'information-systems',
    title: 'نظم المعلومات',
    description: 'تحليل وتصميم وتنفيذ نظم المعلومات',
    icon: BookOpen,
    color: 'from-indigo-500 to-indigo-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد'
  }
]

export default function MaterialsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unified Page Header */}
        <PageHeader 
          title={t('materials.title')} 
          icon={BookOpen}
          description={t('materials.description')}
        />

        {/* Subjects Grid - Enhanced 2026 Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subjectsData.map((subject, index) => {
            const Icon = subject.icon
            return (
              <Link
                key={subject.id}
                href={`/materials/${subject.id}`}
                className="group block"
              >
                <div className="enhanced-card p-8 h-full min-h-[280px] flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 animate-slide-up-delayed border-2 border-cyber-neon/10 hover:border-cyber-neon/30 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl shadow-cyber-neon/20`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-cyber-neon group-hover:translate-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-dark-100 mb-3 group-hover:text-cyber-neon transition-colors min-h-[64px] leading-tight">
                      {subject.title}
                    </h3>
                    
                    <p className="text-dark-300 mb-6 group-hover:text-dark-200 transition-colors text-base leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-dark-400 pt-4 border-t border-cyber-neon/10">
                    <span className="flex items-center gap-2 font-medium">
                      <FileText className="w-4 h-4 text-cyber-neon" />
                      {subject.articlesCount} {subject.articlesCount === 1 ? 'مقال' : 'مقالات'}
                    </span>
                    <span className="text-xs">
                      {subject.lastUpdated !== 'لا توجد مقالات بعد' ? `تم التحديث: ${subject.lastUpdated}` : 'قريباً'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
