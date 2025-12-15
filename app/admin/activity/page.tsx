'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ActivityFeed from '@/components/admin/ActivityFeed'

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Array<{
    id: string
    user: string
    action: string
    target: string
    time: string
    avatar: string
    type?: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const activitiesRes = await fetch('/api/admin/activities')
        if (activitiesRes?.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.data?.activities || [])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
    const interval = setInterval(fetchActivities, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">النشاطات</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">النشاطات</h1>
          <p className="admin-page-description">سجل جميع الأنشطة في النظام</p>
        </div>
      </motion.div>

      <div className="admin-dashboard-grid" style={{ marginTop: '2rem' }}>
        <ActivityFeed activities={activities} delay={0} />
      </div>
    </div>
  )
}

