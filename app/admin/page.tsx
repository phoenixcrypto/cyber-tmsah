'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Calendar,
  Download,
  TrendingUp,
  Newspaper,
  BookOpen,
} from 'lucide-react'
import MetricCard from '@/components/admin/MetricCard'
import ChartCard from '@/components/admin/ChartCard'
import ActivityFeed from '@/components/admin/ActivityFeed'
import SystemHealth from '@/components/admin/SystemHealth'
import QuickActions from '@/components/admin/QuickActions'

interface Metrics {
  totalUsers: number
  totalContent: number
  totalSchedule: number
  totalDownloads: number
  totalArticles: number
  totalNews: number
  userGrowth: number
  contentGrowth: number
  scheduleGrowth: number
  downloadGrowth: number
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    totalContent: 0,
    totalSchedule: 0,
    totalDownloads: 0,
    totalArticles: 0,
    totalNews: 0,
    userGrowth: 0,
    contentGrowth: 0,
    scheduleGrowth: 0,
    downloadGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    users: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      data: [0, 0, 0, 0, 0, 0],
    },
    content: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      data: [0, 0, 0, 0, 0, 0],
    },
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        
        // Fetch stats from dedicated API endpoint
        const statsRes = await fetch('/api/admin/stats').catch(() => null)
        
        if (statsRes?.ok) {
          const statsData = await statsRes.json()
          const stats = statsData.data

          setMetrics({
            totalUsers: stats.metrics?.totalUsers || 0,
            totalContent: stats.metrics?.totalContent || 0,
            totalSchedule: stats.metrics?.totalSchedule || 0,
            totalDownloads: stats.metrics?.totalDownloads || 0,
            totalArticles: stats.metrics?.totalArticles || 0,
            totalNews: stats.metrics?.totalNews || 0,
            userGrowth: stats.metrics?.userGrowth || 0,
            contentGrowth: stats.metrics?.contentGrowth || 0,
            scheduleGrowth: stats.metrics?.scheduleGrowth || 0,
            downloadGrowth: stats.metrics?.downloadGrowth || 0,
          })

          // Generate chart data with real data
          const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
          setChartData({
            users: {
              labels: months,
              data: [
                0,
                0,
                0,
                0,
                0,
                stats.metrics?.totalUsers || 0,
              ],
            },
            content: {
              labels: months,
              data: [
                0,
                0,
                0,
                0,
                0,
                stats.metrics?.totalContent || 0,
              ],
            },
          })
        } else {
          // Fallback: fetch individual endpoints
          const [usersRes, materialsRes, articlesRes, scheduleRes, downloadsRes, newsRes] = await Promise.all([
            fetch('/api/admin/users').catch(() => null),
            fetch('/api/materials').catch(() => null),
            fetch('/api/articles').catch(() => null),
            fetch('/api/schedule').catch(() => null),
            fetch('/api/downloads').catch(() => null),
            fetch('/api/news').catch(() => null),
          ])

          const users = usersRes?.ok ? ((await usersRes.json()).data?.users || []) : []
          const materials = materialsRes?.ok ? ((await materialsRes.json()).data?.materials || []) : []
          const articles = articlesRes?.ok ? ((await articlesRes.json()).data?.articles || []) : []
          
          interface ScheduleItem {
            id: string
            title: string
            [key: string]: unknown
          }
          interface DownloadItem {
            id: string
            name: string
            [key: string]: unknown
          }
          let schedule: ScheduleItem[] = []
          if (scheduleRes?.ok) {
            const scheduleData = await scheduleRes.json()
            schedule = (scheduleData?.data?.schedule || scheduleData?.data?.items || scheduleData?.items || []) as ScheduleItem[]
          }
          
          let downloads: DownloadItem[] = []
          if (downloadsRes?.ok) {
            const downloadsData = await downloadsRes.json()
            downloads = (downloadsData?.data?.downloads || downloadsData?.data?.software || downloadsData?.downloads || []) as DownloadItem[]
          }
          
          const news = newsRes?.ok ? ((await newsRes.json()).data?.news || []) : []

          // Count only published articles
          const publishedArticles = articles.filter((a: { status?: string }) => a.status === 'published')
          const totalContent = materials.length + publishedArticles.length + news.length

          setMetrics({
            totalUsers: users.length,
            totalContent,
            totalSchedule: schedule.length,
            totalDownloads: downloads.length,
            totalArticles: publishedArticles.length,
            totalNews: news.length,
            userGrowth: 0,
            contentGrowth: 0,
            scheduleGrowth: 0,
            downloadGrowth: 0,
          })

          // Generate chart data
          const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
          setChartData({
            users: {
              labels: months,
              data: [0, 0, 0, 0, 0, users.length],
            },
            content: {
              labels: months,
              data: [0, 0, 0, 0, 0, totalContent],
            },
          })
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    
    // Refresh every 5 minutes (instead of 30 seconds to prevent reload issues)
    const interval = setInterval(fetchMetrics, 300000)
    return () => clearInterval(interval)
  }, [])

  const [activities, setActivities] = useState<Array<{
    id: string
    user: string
    action: string
    target: string
    time: string
    avatar: string
  }>>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRes = await fetch('/api/admin/activities').catch(() => null)
        if (activitiesRes?.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.data?.activities || [])
        } else {
          // Fallback to mock data
          setActivities([
            {
              id: '1',
              user: 'النظام',
              action: 'تم تحديث الإحصائيات',
              target: 'لوحة التحكم',
              time: 'الآن',
              avatar: 'S',
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        setActivities([
          {
            id: '1',
            user: 'النظام',
            action: 'تم تحديث الإحصائيات',
            target: 'لوحة التحكم',
            time: 'الآن',
            avatar: 'S',
          },
        ])
      }
    }

    fetchActivities()
    
    // Refresh activities every 5 minutes (instead of 30 seconds)
    const interval = setInterval(fetchActivities, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">لوحة التحكم</h1>
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
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="admin-page-title">لوحة التحكم</h1>
          <p className="admin-page-description">نظرة عامة على النظام والإحصائيات</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => window.open('/api/admin/stats', '_blank')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp className="w-5 h-5" />
          <span>تقرير كامل</span>
        </motion.button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <MetricCard
          title="إجمالي المستخدمين"
          value={metrics.totalUsers}
          change={metrics.userGrowth}
          icon={Users}
          color="from-blue-500 to-cyan-500"
          delay={0}
        />
        <MetricCard
          title="إجمالي المحتوى"
          value={metrics.totalContent}
          change={metrics.contentGrowth}
          icon={FileText}
          color="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <MetricCard
          title="الجدول الدراسي"
          value={metrics.totalSchedule}
          change={metrics.scheduleGrowth}
          icon={Calendar}
          color="from-green-500 to-emerald-500"
          delay={0.2}
        />
        <MetricCard
          title="التنزيلات"
          value={metrics.totalDownloads}
          change={metrics.downloadGrowth}
          icon={Download}
          color="from-orange-500 to-red-500"
          delay={0.3}
        />
      </div>

      {/* Additional Metrics */}
      <div className="admin-metrics-grid" style={{ marginTop: '1.5rem' }}>
        <MetricCard
          title="المقالات"
          value={metrics.totalArticles}
          change={0}
          icon={BookOpen}
          color="from-indigo-500 to-blue-500"
          delay={0.4}
        />
        <MetricCard
          title="الأخبار"
          value={metrics.totalNews}
          change={0}
          icon={Newspaper}
          color="from-pink-500 to-rose-500"
          delay={0.5}
        />
      </div>

      {/* Charts & Activity Grid */}
      <div className="admin-dashboard-grid">
        {/* Users Chart */}
        <ChartCard
          title="نمو المستخدمين"
          data={chartData.users}
          type="line"
          color="#3b82f6"
          delay={0.6}
        />

        {/* Content Chart */}
        <ChartCard
          title="نمو المحتوى"
          data={chartData.content}
          type="bar"
          color="#a855f7"
          delay={0.7}
        />

        {/* Activity Feed */}
        <ActivityFeed activities={activities} delay={0.8} />

        {/* System Health */}
        <SystemHealth delay={0.9} />

        {/* Quick Actions */}
        <QuickActions delay={1.0} />
      </div>
    </div>
  )
}
