'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Eye, FileText } from 'lucide-react'
import ChartCard from '@/components/admin/ChartCard'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalUsers: 0,
    totalContent: 0,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        // Fetch data from APIs
        const [articlesRes, usersRes] = await Promise.all([
          fetch('/api/articles').catch(() => null),
          fetch('/api/admin/users').catch(() => null),
        ])

        const articles = articlesRes?.ok ? (await articlesRes.json()).data?.articles || [] : []
        const users = usersRes?.ok ? (await usersRes.json()).data?.users || [] : []

        const totalViews = articles.reduce((sum: number, article: { views?: number }) => sum + (article.views || 0), 0)

        setStats({
          totalViews,
          totalUsers: users.length,
          totalContent: articles.length,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const mockChartData = {
    views: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      data: [0, 0, 0, 0, 0, stats.totalViews],
    },
    users: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      data: [0, 0, 0, 0, 0, stats.totalUsers],
    },
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الإحصائيات</h1>
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
          <h1 className="admin-page-title">الإحصائيات</h1>
          <p className="admin-page-description">تحليل الأداء والاستخدام</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="admin-metrics-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Eye className="w-8 h-8" />
          </div>
          <div className="stat-value">{stats.totalViews}</div>
          <div className="stat-label">إجمالي المشاهدات</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">إجمالي المستخدمين</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <FileText className="w-8 h-8" />
          </div>
          <div className="stat-value">{stats.totalContent}</div>
          <div className="stat-label">إجمالي المحتوى</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        <ChartCard
          title="المشاهدات"
          data={mockChartData.views}
          type="line"
          color="#3b82f6"
          delay={0.3}
        />
        <ChartCard
          title="المستخدمين"
          data={mockChartData.users}
          type="bar"
          color="#a855f7"
          delay={0.4}
        />
      </div>
    </div>
  )
}
