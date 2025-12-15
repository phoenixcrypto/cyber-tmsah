'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, User, Calendar, FileText } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'

interface Article {
  id: string
  title: string
  status?: string
  excerpt?: string
  description?: string
  duration?: string
  publishedAt?: string | Date
  type?: string
  [key: string]: unknown
}

// Subject data mapping
const subjectData = {
  'applied-physics': {
    title: 'الفيزياء التطبيقية',
    description: 'مبادئ الفيزياء وتطبيقاتها في التكنولوجيا',
    instructor: 'د. أحمد بكر',
    color: 'from-blue-500 to-blue-600',
  },
  'mathematics': {
    title: 'الرياضيات',
    description: 'أسس الرياضيات وحل المشكلات',
    instructor: 'د. سيمون عزت',
    color: 'from-green-500 to-green-600',
  },
  'entrepreneurship': {
    title: 'ريادة الأعمال والتفكير الإبداعي',
    description: 'الابتكار التجاري وحل المشكلات الإبداعي',
    instructor: 'د. عبير حسن',
    color: 'from-purple-500 to-purple-600',
  },
  'information-technology': {
    title: 'تكنولوجيا المعلومات',
    description: 'أساسيات تكنولوجيا المعلومات والتقنيات الحديثة',
    instructor: 'د. شيماء أحمد',
    color: 'from-cyan-500 to-cyan-600',
  },
  'database-systems': {
    title: 'قواعد البيانات',
    description: 'تصميم وتنفيذ وإدارة قواعد البيانات',
    instructor: 'د. عبير حسن',
    color: 'from-orange-500 to-orange-600',
  },
  'english-language': {
    title: 'اللغة الإنجليزية',
    description: 'التواصل باللغة الإنجليزية والكتابة التقنية',
    instructor: 'د. صابرين',
    color: 'from-red-500 to-red-600',
  },
  'information-systems': {
    title: 'نظم المعلومات',
    description: 'تحليل وتصميم وتنفيذ نظم المعلومات',
    instructor: 'د. هند زيادة',
    color: 'from-indigo-500 to-indigo-600',
  }
}

export default function SubjectPage() {
  const { t } = useLanguage()
  const params = useParams()
  const subjectId = params['id'] as string
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const subject = subjectData[subjectId as keyof typeof subjectData]

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        // First, get the material ID from the slug
        const materialsRes = await fetch('/api/materials')
        const materialsData = await materialsRes.json()
        const materials = materialsData.data?.materials || []
        const material = materials.find((m: { id: string }) => m.id === subjectId)
        
        if (!material) {
          setArticles([])
          setLoading(false)
          return
        }

        // Fetch articles for this material
        const articlesRes = await fetch('/api/articles')
        const articlesData = await articlesRes.json()
        const allArticles = articlesData.data?.articles || []
        
        // Filter articles by materialId and only published
        const materialArticles = allArticles.filter((article: Article) => {
          return article['materialId'] === subjectId && article['status'] === 'published'
        })
        
        setArticles(materialArticles)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    if (subjectId) {
      fetchArticles()
    }
  }, [subjectId])

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark-100 mb-4">{t('materials.subject.notFound')}</h1>
          <Link href="/materials" className="btn-primary">
            {t('materials.subject.backToMaterials')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/materials" 
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('materials.subject.backToMaterials')}
          </Link>
          
          <div className="enhanced-card p-8 mb-8 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center shadow-xl shadow-cyber-neon/20`}>
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-2 bg-gradient-to-r from-cyber-neon to-cyber-green bg-clip-text text-transparent">
                  {subject.title}
                </h1>
                <p className="text-lg text-dark-300">{subject.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20">
                <User className="w-5 h-5 text-cyber-neon" />
                <span className="text-dark-200 font-semibold">{subject.instructor}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20">
                <FileText className="w-5 h-5 text-cyber-green" />
                <span className="text-dark-200 font-semibold">
                  {loading ? '...' : articles.length} {articles.length === 1 ? t('materials.article') : t('materials.articles')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-neon mx-auto mb-4"></div>
              <p className="text-dark-300">جاري التحميل...</p>
            </div>
          ) : articles.length > 0 ? articles.map((article, index) => (
            <div 
              key={String(article['id'])}
              className="enhanced-card p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up-delayed"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-dark-100">
                      {String(article['title'] || '')}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article['status'] === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {article['status'] === 'published' ? t('materials.subject.available') : t('materials.subject.comingSoon')}
                    </span>
                  </div>
                  
                  <p className="text-dark-300 mb-4">
                    {String(article['excerpt'] || article['description'] || '')}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-dark-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{t('materials.subject.duration')}: {String(article['duration'] || '')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{t('materials.subject.publishedAt')}: {article['publishedAt'] ? new Date(String(article['publishedAt'])).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{t('materials.subject.type')}: <span className="capitalize">{String(article['type'] || '')}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-dark-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-200 mb-2">
                {t('materials.subject.noArticles')}
              </h3>
              <p className="text-dark-400 mb-6">
                {t('materials.subject.comingSoon')}
              </p>
            </div>
          )}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-dark-100 mb-2">
              {t('materials.subject.comingSoon')}
            </h3>
            <p className="text-dark-300">
              {t('materials.subject.comingSoon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
