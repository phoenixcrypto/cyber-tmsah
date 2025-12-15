'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface Activity {
  id: string | number
  user: string
  action: string
  target: string
  time: string
  avatar: string
}

interface ActivityFeedProps {
  activities: Activity[]
  delay?: number
}

export default function ActivityFeed({ activities, delay = 0 }: ActivityFeedProps) {
  return (
    <motion.div
      className="admin-activity-feed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="admin-activity-feed-bg"></div>
      <div className="admin-activity-feed-glow"></div>

      <div className="admin-activity-feed-header">
        <h3 className="admin-activity-feed-title">النشاط الأخير</h3>
        <button className="admin-activity-feed-view-all">عرض الكل</button>
      </div>

      <div className="admin-activity-feed-list">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="admin-activity-feed-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <div className="admin-activity-feed-avatar">
              {activity.avatar}
            </div>
            <div className="admin-activity-feed-content">
              <div className="admin-activity-feed-main">
                <span className="admin-activity-feed-user">{activity.user}</span>
                <span className="admin-activity-feed-action">{activity.action}</span>
                <span className="admin-activity-feed-target">{activity.target}</span>
              </div>
              <div className="admin-activity-feed-meta">
                <Clock className="w-3 h-3" />
                <span>{activity.time}</span>
              </div>
            </div>
            <div className="admin-activity-feed-dot"></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

