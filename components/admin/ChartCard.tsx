'use client'

import { motion } from 'framer-motion'
import { LineChart, BarChart3 } from 'lucide-react'

interface ChartCardProps {
  title: string
  data: {
    labels: string[]
    data: number[]
  }
  type: 'line' | 'bar'
  color: string
  delay?: number
}

export default function ChartCard({ title, data, type, color, delay = 0 }: ChartCardProps) {
  const maxValue = Math.max(...data.data)
  const minValue = Math.min(...data.data)
  const range = maxValue - minValue

  return (
    <motion.div
      className="admin-chart-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="admin-chart-card-bg"></div>
      <div className="admin-chart-card-glow"></div>

      <div className="admin-chart-card-header">
        <h3 className="admin-chart-card-title">{title}</h3>
        <div className="admin-chart-card-icon">
          {type === 'line' ? (
            <LineChart className="w-5 h-5" />
          ) : (
            <BarChart3 className="w-5 h-5" />
          )}
        </div>
      </div>

      <div className="admin-chart-card-body">
        <div className="admin-chart-container">
          {type === 'line' ? (
            <svg className="admin-chart-svg" viewBox="0 0 400 200">
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={data.data
                  .map(
                    (value, index) =>
                      `${index === 0 ? 'M' : 'L'} ${(index / (data.data.length - 1)) * 400} ${
                        200 - ((value - minValue) / range) * 180
                      }`
                  )
                  .join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: delay + 0.3 }}
              />
              <motion.path
                d={`${data.data
                  .map(
                    (value, index) =>
                      `${index === 0 ? 'M' : 'L'} ${(index / (data.data.length - 1)) * 400} ${
                        200 - ((value - minValue) / range) * 180
                      }`
                  )
                  .join(' ')} L 400 200 L 0 200 Z`}
                fill={`url(#gradient-${title})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: delay + 0.5 }}
              />
              {data.data.map((value, index) => (
                <motion.circle
                  key={index}
                  cx={(index / (data.data.length - 1)) * 400}
                  cy={200 - ((value - minValue) / range) * 180}
                  r="4"
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.8 + index * 0.1 }}
                />
              ))}
            </svg>
          ) : (
            <div className="admin-chart-bars">
              {data.data.map((value, index) => {
                const height = ((value - minValue) / range) * 100
                return (
                  <div key={index} className="admin-chart-bar-wrapper">
                    <motion.div
                      className="admin-chart-bar"
                      style={{
                        background: `linear-gradient(to top, ${color}, ${color}dd)`,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: delay + 0.3 + index * 0.1 }}
                    />
                    <span className="admin-chart-bar-label">{data.labels[index]}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="admin-chart-card-footer">
        <div className="admin-chart-legend">
          <div className="admin-chart-legend-item">
            <div
              className="admin-chart-legend-color"
              style={{ backgroundColor: color }}
            ></div>
            <span>القيمة الحالية</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

