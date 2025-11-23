'use client'

import { motion } from 'framer-motion'
import { Cpu, HardDrive, Wifi, MemoryStick } from 'lucide-react'

interface SystemHealthProps {
  delay?: number
}

const systemMetrics = [
  { label: 'المعالج', icon: Cpu, value: 65, color: '#3b82f6' },
  { label: 'الذاكرة', icon: MemoryStick, value: 78, color: '#a855f7' },
  { label: 'التخزين', icon: HardDrive, value: 42, color: '#10b981' },
  { label: 'الشبكة', icon: Wifi, value: 88, color: '#f59e0b' },
]

export default function SystemHealth({ delay = 0 }: SystemHealthProps) {
  return (
    <motion.div
      className="admin-system-health"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="admin-system-health-bg"></div>
      <div className="admin-system-health-glow"></div>

      <div className="admin-system-health-header">
        <h3 className="admin-system-health-title">صحة النظام</h3>
        <div className="admin-system-health-status">
          <div className="admin-system-health-status-dot"></div>
          <span>متصل</span>
        </div>
      </div>

      <div className="admin-system-health-list">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon
          const isHigh = metric.value > 80
          const isMedium = metric.value > 50 && metric.value <= 80

          return (
            <motion.div
              key={metric.label}
              className="admin-system-health-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
            >
              <div className="admin-system-health-item-header">
                <div className="admin-system-health-item-icon">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="admin-system-health-item-info">
                  <span className="admin-system-health-item-label">{metric.label}</span>
                  <span className="admin-system-health-item-value">{metric.value}%</span>
                </div>
              </div>
              <div className="admin-system-health-item-progress">
                <motion.div
                  className={`admin-system-health-item-progress-bar ${
                    isHigh ? 'high' : isMedium ? 'medium' : 'low'
                  }`}
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: delay + index * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

