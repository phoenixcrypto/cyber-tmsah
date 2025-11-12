'use client'

import Link from 'next/link'
import { BookOpen, Calculator, Atom, Database, Globe, Users, ArrowRight, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Subject {
  id: string
  title: string
  description: string
  icon: any
  color: string
  articlesCount: number
  lastUpdated: string
}

export default function MaterialsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const subjectConfig = [
    {
      id: 'applied-physics',
      title: 'Applied Physics',
      description: 'Physics principles and applications in technology',
      icon: Atom,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Mathematical foundations and problem solving',
      icon: Calculator,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship & Creative Thinking',
      description: 'Business innovation and creative problem solving',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'information-technology',
      title: 'Information Technology',
      description: 'IT fundamentals and modern technologies',
      icon: Globe,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'database-systems',
      title: 'Database Systems',
      description: 'Database design, implementation and management',
      icon: Database,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'english-language',
      title: 'English Language',
      description: 'English communication and technical writing',
      icon: BookOpen,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'information-systems',
      title: 'Information Systems',
      description: 'IS analysis, design and implementation',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  // Load articles count for each subject
  useEffect(() => {
    const loadArticlesCount = async () => {
      try {
        setLoading(true)
        
        // Fetch articles count for all subjects with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second total timeout
        
        const subjectsWithCounts = await Promise.all(
          subjectConfig.map(async (subject) => {
            try {
              const response = await fetch(`/api/materials?subjectId=${subject.id}&status=published`, {
                cache: 'no-store',
                signal: controller.signal
              })
              
              if (response.ok) {
                const data = await response.json()
                
                // Debug: Log what we received
                if (process.env.NODE_ENV === 'development') {
                  console.log(`[Materials] ${subject.id}: Received`, data)
                }
                
                // Ensure articles is an array
                const articlesArray = Array.isArray(data) ? data : []
                
                // Filter out any error objects or invalid articles
                const validArticles = articlesArray.filter((article: any) => {
                  return article && !article.error && article.id
                })
                
                const articlesCount = validArticles.length
                
                // Debug: Log count
                if (process.env.NODE_ENV === 'development') {
                  console.log(`[Materials] ${subject.id}: Count = ${articlesCount}`)
                }
                
                // Calculate last updated date
                let lastUpdated = 'No articles yet'
                if (articlesCount > 0 && validArticles.length > 0) {
                  const sortedArticles = [...validArticles].sort(
                    (a: any, b: any) => {
                      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
                      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
                      return dateB - dateA
                    }
                  )
                  const latestArticle = sortedArticles[0]
                  if (latestArticle && latestArticle.publishedAt) {
                    const publishedDate = new Date(latestArticle.publishedAt)
                    const now = new Date()
                    const diffTime = Math.abs(now.getTime() - publishedDate.getTime())
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                    
                    if (diffDays === 0) {
                      lastUpdated = 'Today'
                    } else if (diffDays === 1) {
                      lastUpdated = '1 day ago'
                    } else {
                      lastUpdated = `${diffDays} days ago`
                    }
                  }
                }
                
                return {
                  ...subject,
                  articlesCount,
                  lastUpdated
                }
              } else {
                // If response is not ok, return 0 articles
                const errorData = await response.json().catch(() => ({}))
                console.warn(`Failed to fetch articles for ${subject.id}:`, response.status, errorData)
                return {
                  ...subject,
                  articlesCount: 0,
                  lastUpdated: 'No articles yet'
                }
              }
            } catch (error: any) {
              // Handle timeout or network errors gracefully
              if (error.name === 'AbortError') {
                console.warn(`Request timeout for ${subject.id}`)
              } else {
                console.error(`Error loading articles for ${subject.id}:`, error)
              }
              return {
                ...subject,
                articlesCount: 0,
                lastUpdated: 'No articles yet'
              }
            }
          })
        )
        
        clearTimeout(timeoutId)
        setSubjects(subjectsWithCounts)
      } catch (error) {
        console.error('Error loading articles count:', error)
        // Fallback to default values
        setSubjects(
          subjectConfig.map(subject => ({
            ...subject,
            articlesCount: 0,
            lastUpdated: 'No articles yet'
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    loadArticlesCount()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              Learning Materials
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            Access comprehensive course materials and resources for all subjects
          </p>
        </div>

        {/* Subjects Grid - Fixed height to prevent CLS and improve FCP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            // Skeleton loading to prevent layout shift
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="enhanced-card p-6 min-h-[240px] animate-pulse">
                <div className="w-16 h-16 bg-cyber-dark/50 rounded-2xl mb-4"></div>
                <div className="h-6 bg-cyber-dark/50 rounded mb-2"></div>
                <div className="h-4 bg-cyber-dark/50 rounded mb-4"></div>
                <div className="h-4 bg-cyber-dark/50 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            subjects.map((subject, index) => {
              const Icon = subject.icon
              return (
                <Link
                  key={subject.id}
                  href={`/materials/${subject.id}`}
                  className="group block"
                >
                  <div className="enhanced-card p-6 h-full min-h-[240px] flex flex-col justify-between hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-cyber-neon group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2 group-hover:text-cyber-neon transition-colors min-h-[56px]">
                        {subject.title}
                      </h3>
                      
                      <p className="text-dark-300 mb-4 group-hover:text-dark-200 transition-colors">
                        {subject.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-dark-400">
                      <span>
                      {loading ? (
                        <span className="text-cyber-neon">Loading...</span>
                      ) : (
                        <>
                          {subject.articlesCount} {subject.articlesCount === 1 ? 'article' : 'articles'}
                        </>
                      )}
                    </span>
                    <span>
                      {loading ? '' : subject.lastUpdated !== 'No articles yet' ? `Updated ${subject.lastUpdated}` : 'No articles yet'}
                    </span>
                  </div>
                </div>
              </Link>
            )
            })
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-12 text-center">
          <Link
            href="/materials/upload"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 text-lg"
          >
            <Upload className="w-5 h-5" />
            Upload Material
          </Link>
        </div>
      </div>
    </div>
  )
}