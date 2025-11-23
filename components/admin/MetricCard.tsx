'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  change: number
  icon: LucideIcon
  color: string
  delay?: number
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0,
}: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      className="admin-metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="admin-metric-card-bg"></div>
      <div className="admin-metric-card-glow"></div>

      <div className="admin-metric-card-content">
        <div className="admin-metric-card-header">
          <div className={`admin-metric-card-icon bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="admin-metric-card-change">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
              {Math.abs(change)}%
            </span>
          </div>
        </div>

        <div className="admin-metric-card-body">
          <h3 className="admin-metric-card-title">{title}</h3>
          <motion.div
            className="admin-metric-card-value"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value.toLocaleString('ar-EG')}
          </motion.div>
        </div>

        <div className="admin-metric-card-footer">
          <div className="admin-metric-card-progress">
            <motion.div
              className={`admin-metric-card-progress-bar ${isPositive ? 'positive' : 'negative'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.abs(change)}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

