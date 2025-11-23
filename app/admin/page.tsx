'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Calendar,
  Download,
  TrendingUp,
} from 'lucide-react'
import MetricCard from '@/components/admin/MetricCard'
import ChartCard from '@/components/admin/ChartCard'
import ActivityFeed from '@/components/admin/ActivityFeed'
import SystemHealth from '@/components/admin/SystemHealth'
import QuickActions from '@/components/admin/QuickActions'

// Mock Data
const mockMetrics = {
  totalUsers: 1247,
  totalContent: 342,
  totalSchedule: 156,
  totalDownloads: 89,
  userGrowth: 12.5,
  contentGrowth: 8.3,
  scheduleGrowth: -2.1,
  downloadGrowth: 15.7,
}

const mockChartData = {
  users: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    data: [450, 520, 680, 750, 920, 1100],
  },
  content: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    data: [120, 145, 180, 210, 250, 290],
  },
}

const mockActivities = [
  {
    id: 1,
    user: 'زياد محمد',
    action: 'أنشأ مقال جديد',
    target: 'مادة الأمن السيبراني',
    time: 'منذ 5 دقائق',
    avatar: 'Z',
  },
  {
    id: 2,
    user: 'مؤمن هيثم',
    action: 'حدث الجدول الدراسي',
    target: 'المجموعة الأولى',
    time: 'منذ 15 دقيقة',
    avatar: 'M',
  },
  {
    id: 3,
    user: 'يوسف وليد',
    action: 'أضاف برنامج جديد',
    target: 'Kali Linux',
    time: 'منذ ساعة',
    avatar: 'Y',
  },
  {
    id: 4,
    user: 'زياد محمد',
    action: 'نشر خبر جديد',
    target: 'تحديثات الأمن السيبراني',
    time: 'منذ ساعتين',
    avatar: 'Z',
  },
]

export default function AdminDashboard() {
  const [metrics] = useState(mockMetrics)

  useEffect(() => {
    // Fetch real metrics from API
    // fetch('/api/admin/metrics').then(res => res.json()).then(setMetrics)
  }, [])

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

      {/* Charts & Activity Grid */}
      <div className="admin-dashboard-grid">
        {/* Users Chart */}
        <ChartCard
          title="نمو المستخدمين"
          data={mockChartData.users}
          type="line"
          color="#3b82f6"
          delay={0.4}
        />

        {/* Content Chart */}
        <ChartCard
          title="نمو المحتوى"
          data={mockChartData.content}
          type="bar"
          color="#a855f7"
          delay={0.5}
        />

        {/* Activity Feed */}
        <ActivityFeed activities={mockActivities} delay={0.6} />

        {/* System Health */}
        <SystemHealth delay={0.7} />

        {/* Quick Actions */}
        <QuickActions delay={0.8} />
      </div>
    </div>
  )
}

