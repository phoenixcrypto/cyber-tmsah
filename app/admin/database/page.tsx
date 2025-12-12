'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, HardDrive, Table, RefreshCw, Users, BookOpen, FileText, Hash, Newspaper, Download, Calendar } from 'lucide-react'

interface DatabaseInfo {
  totalTables: number
  totalRecords: number
  databaseSize: string
}

interface TableInfo {
  name: string
  count: number
  icon: typeof Users
}

export default function AdminDatabasePage() {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo>({
    totalTables: 0,
    totalRecords: 0,
    databaseSize: '0 MB',
  })
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDatabaseInfo = async () => {
      try {
        setLoading(true)
        // Fetch counts from all tables
        const [materialsRes, articlesRes, pagesRes, newsRes, downloadsRes, scheduleRes, usersRes] = await Promise.all([
          fetch('/api/materials').catch(() => null),
          fetch('/api/articles').catch(() => null),
          fetch('/api/pages').catch(() => null),
          fetch('/api/news').catch(() => null),
          fetch('/api/downloads').catch(() => null),
          fetch('/api/schedule').catch(() => null),
          fetch('/api/admin/users').catch(() => null),
        ])

        const materials = materialsRes?.ok ? (await materialsRes.json()).data?.materials || [] : []
        const articles = articlesRes?.ok ? (await articlesRes.json()).data?.articles || [] : []
        const pages = pagesRes?.ok ? (await pagesRes.json()).data?.pages || [] : []
        const news = newsRes?.ok ? (await newsRes.json()).data?.news || [] : []
        const downloads = downloadsRes?.ok ? (await downloadsRes.json()).data?.downloads || downloadsRes?.ok ? (await downloadsRes.json()).data?.software || [] : []
        const schedule = scheduleRes?.ok ? (await scheduleRes.json()).data?.schedule || scheduleRes?.ok ? (await scheduleRes.json()).data?.items || [] : []
        const users = usersRes?.ok ? (await usersRes.json()).data?.users || [] : []

        const totalRecords = materials.length + articles.length + pages.length + news.length + downloads.length + schedule.length + users.length

        setDbInfo({
          totalTables: 7, // users, materials, articles, pages, news, downloads, schedule
          totalRecords,
          databaseSize: 'حساب الحجم يتطلب اتصال مباشر بقاعدة البيانات',
        })

        setTables([
          { name: 'المستخدمين', count: users.length, icon: Users },
          { name: 'المواد الدراسية', count: materials.length, icon: BookOpen },
          { name: 'المقالات', count: articles.length, icon: FileText },
          { name: 'الصفحات', count: pages.length, icon: Hash },
          { name: 'الأخبار', count: news.length, icon: Newspaper },
          { name: 'التنزيلات', count: downloads.length, icon: Download },
          { name: 'الجدول الدراسي', count: schedule.length, icon: Calendar },
        ])
      } catch (error) {
        console.error('Error fetching database info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDatabaseInfo()
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">قاعدة البيانات</h1>
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
          <h1 className="admin-page-title">قاعدة البيانات</h1>
          <p className="admin-page-description">معلومات قاعدة البيانات والإحصائيات</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          <span>تحديث</span>
        </motion.button>
      </motion.div>

      {/* Database Stats */}
      <div className="admin-metrics-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Table className="w-8 h-8" />
          </div>
          <div className="stat-value">{dbInfo.totalTables}</div>
          <div className="stat-label">عدد الجداول</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Database className="w-8 h-8" />
          </div>
          <div className="stat-value">{dbInfo.totalRecords}</div>
          <div className="stat-label">إجمالي السجلات</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{dbInfo.databaseSize}</div>
          <div className="stat-label">حجم قاعدة البيانات</div>
        </motion.div>
      </div>

      {/* Tables Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '2rem' }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--primary-white)' }}>
          الجداول المتاحة
        </h2>
        <div className="admin-section-grid">
          {tables.map((table, index) => {
            const Icon = table.icon
            return (
              <motion.div
                key={table.name}
                className="admin-section-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Icon className="w-6 h-6 mb-2" style={{ color: 'var(--primary-red)' }} />
                <span className="admin-section-stat-label">{table.name}</span>
                <span className="admin-section-stat-value">{table.count}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
