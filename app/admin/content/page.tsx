'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, FileText, Newspaper, Download, Hash } from 'lucide-react'
import { getAdminBasePath } from '@/lib/utils/admin-path'

interface ContentStats {
  materials: number
  articles: number
  pages: number
  news: number
  downloads: number
}

export default function AdminContentOverviewPage() {
  const [stats, setStats] = useState<ContentStats>({
    materials: 0,
    articles: 0,
    pages: 0,
    news: 0,
    downloads: 0,
  })
  const [loading, setLoading] = useState(true)
  const basePath = getAdminBasePath()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [materialsRes, articlesRes, pagesRes, newsRes, downloadsRes] = await Promise.all([
          fetch('/api/materials').catch(() => null),
          fetch('/api/articles').catch(() => null),
          fetch('/api/pages').catch(() => null),
          fetch('/api/news').catch(() => null),
          fetch('/api/downloads').catch(() => null),
        ])

        const materials = materialsRes?.ok ? ((await materialsRes.json()).data?.materials || []) : []
        const articles = articlesRes?.ok ? ((await articlesRes.json()).data?.articles || []) : []
        const pages = pagesRes?.ok ? ((await pagesRes.json()).data?.pages || []) : []
        const news = newsRes?.ok ? ((await newsRes.json()).data?.news || []) : []
        
        interface DownloadItem {
          id: string
          name: string
          [key: string]: unknown
        }
        let downloads: DownloadItem[] = []
        if (downloadsRes?.ok) {
          const downloadsData = await downloadsRes.json()
          downloads = (downloadsData?.data?.downloads || downloadsData?.data?.software || []) as DownloadItem[]
        }

        setStats({
          materials: materials.length,
          articles: articles.length,
          pages: pages.length,
          news: news.length,
          downloads: downloads.length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const contentSections = [
    { label: 'المواد الدراسية', value: stats.materials, path: '/content/materials', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'المقالات التعليمية', value: stats.articles, path: '/content/articles', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: 'الصفحات الثابتة', value: stats.pages, path: '/content/pages', icon: Hash, color: 'from-green-500 to-emerald-500' },
    { label: 'الأخبار', value: stats.news, path: '/content/news', icon: Newspaper, color: 'from-orange-500 to-red-500' },
    { label: 'برامج التنزيل', value: stats.downloads, path: '/downloads', icon: Download, color: 'from-indigo-500 to-blue-500' },
  ]

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة المحتوى</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة المحتوى</h1>
          <p className="admin-page-description">نظرة شاملة على جميع الوحدات والمصادر التعليمية داخل المنصة</p>
        </div>
      </motion.div>

      {/* Content Stats Grid */}
      <motion.div
        className="admin-metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {contentSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Link
              key={section.path}
              href={`${basePath}${section.path}`}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className={`stat-icon bg-gradient-to-br ${section.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="stat-value">{section.value}</div>
                <div className="stat-label">{section.label}</div>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
