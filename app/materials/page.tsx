'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'
import * as Icons from 'lucide-react'
interface Subject {
  id: string
  title: string
  description: string
  icon: string
  color: string
  articlesCount: number
  lastUpdated: string
}

export default function MaterialsPage() {
  const { t } = useLanguage()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/materials')
        if (!res.ok) {
          throw new Error('Failed to fetch materials')
        }
        const data = await res.json()
        // Map API data to Subject format
        interface ApiMaterial {
          id: string
          title: string
          description: string
          icon: string
          color: string
          articlesCount?: number
          lastUpdated?: string
        }
        const materials = (data.data?.materials || []) as ApiMaterial[]
        const mappedSubjects = materials.map((m): Subject => ({
          id: m.id,
          title: m.title,
          description: m.description,
          icon: m.icon || 'BookOpen',
          color: m.color || 'from-blue-500 to-cyan-500',
          articlesCount: m.articlesCount || 0,
          lastUpdated: m.lastUpdated || 'لا توجد مقالات بعد'
        }))
        setSubjects(mappedSubjects)
      } catch (error) {
        console.error('Error fetching materials:', error)
        setSubjects([]) // Empty array on error, no fallback data
      } finally {
        setLoading(false)
      }
    }
    fetchMaterials()
  }, [])

  return (
    <div className="page-container">
      <PageHeader 
        title={t('materials.title')} 
        icon={BookOpen}
        description={t('materials.description')}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-neon mx-auto mb-4"></div>
          <p className="text-dark-300">جاري التحميل...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && subjects.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-dark-100 mb-4">لا توجد مواد دراسية</h3>
          <p className="text-dark-300">سيتم إضافة المواد الدراسية قريباً</p>
        </div>
      )}

      {/* Subjects Grid - Enhanced 2026 Design */}
      {!loading && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {subjects.map((subject, index) => {
            // Type-safe icon lookup
            const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[subject.icon]
            const Icon = (IconComponent && typeof IconComponent === 'function' ? IconComponent : BookOpen) as LucideIcon
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
      )}
    </div>
  )
}
