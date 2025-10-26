'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, BookOpen, Shield, Code, Database, Globe, Lock } from 'lucide-react'

// Student Schedule Data Structure
interface ScheduleItem {
  id: string
  title: string
  instructor: string
  day: string
  date: string
  time: string
  duration: string
  location: string
  description: string
  category: string
  status: 'upcoming' | 'full' | 'completed'
  icon: any
  type: 'lecture' | 'session'
  period: number // 1-8 for university periods
  section: string // Section number (1-15)
}

// University Periods Mapping
const PERIODS = {
  1: { start: '9:00 AM', end: '10:00 AM', time: '9:00 AM', duration: '1 hour' },
  2: { start: '10:10 AM', end: '11:10 AM', time: '10:10 AM', duration: '1 hour' },
  3: { start: '11:20 AM', end: '12:20 PM', time: '11:20 AM', duration: '1 hour' },
  4: { start: '12:30 PM', end: '1:30 PM', time: '12:30 PM', duration: '1 hour' },
  5: { start: '1:40 PM', end: '2:40 PM', time: '1:40 PM', duration: '1 hour' },
  6: { start: '2:50 PM', end: '3:50 PM', time: '2:50 PM', duration: '1 hour' },
  7: { start: '4:00 PM', end: '5:00 PM', time: '4:00 PM', duration: '1 hour' },
  8: { start: '5:00 PM', end: '6:10 PM', time: '5:00 PM', duration: '1 hour 10 minutes' }
}

// Helper function to sort schedule by time
const sortScheduleByTime = (schedule: ScheduleItem[]) => {
  return schedule.sort((a, b) => {
    const timeA = PERIODS[a.period as keyof typeof PERIODS]?.time || a.time
    const timeB = PERIODS[b.period as keyof typeof PERIODS]?.time || b.time
    return timeA.localeCompare(timeB)
  })
}

// Complete schedule data extracted from Excel file - FIXED VERSION
const scheduleData: Record<string, Record<string, ScheduleItem[]>> = {
  '1': {
    '1': [
      {
        id: 'S1-Information Systems-Monday-P1',
        title: 'Information Systems',
        instructor: 'Dr. هند',
        day: 'Monday',
        date: '2025-01-18',
        time: '9:00 AM',
        duration: '1 hour',
        location: 'G205',
        description: 'Information Systems with Dr. هند',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'lecture' as const,
        period: 1,
        section: '1'
      },
      {
        id: 'S1-Information Systems-Monday-P2',
        title: 'Information Systems',
        instructor: 'Dr. هند',
        day: 'Monday',
        date: '2025-01-18',
        time: '10:10 AM',
        duration: '1 hour',
        location: 'G205',
        description: 'Information Systems with Dr. هند',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'lecture' as const,
        period: 2,
        section: '1'
      },
      {
        id: 'S1-Information Technology-Monday-P6',
        title: 'Information Technology',
        instructor: 'Dr. شيماء',
        day: 'Monday',
        date: '2025-01-18',
        time: '2:50 PM',
        duration: '1 hour',
        location: 'مدرج A',
        description: 'Information Technology with Dr. شيماء',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'lecture' as const,
        period: 6,
        section: '1'
      },
      {
        id: 'S1-Information Technology-Monday-P7',
        title: 'Information Technology',
        instructor: 'Dr. شيماء',
        day: 'Monday',
        date: '2025-01-18',
        time: '4:00 PM',
        duration: '1 hour',
        location: 'مدرج A',
        description: 'Information Technology with Dr. شيماء',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'lecture' as const,
        period: 7,
        section: '1'
      },
    ],
    '2': [
    ],
    '3': [
    ],
    '4': [
      {
        id: 'S4-Information Technology-Monday-P4',
        title: 'Information Technology',
        instructor: 'Eng. محمد',
        day: 'Monday',
        date: '2025-01-18',
        time: '12:30 PM',
        duration: '1 hour',
        location: 'D101',
        description: 'Information Technology with Eng. محمد',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'session' as const,
        period: 4,
        section: '4'
      },
    ],
    '5': [
      {
        id: 'S5-Information Systems-Monday-P2',
        title: 'Information Systems',
        instructor: 'Eng. محمود',
        day: 'Monday',
        date: '2025-01-18',
        time: '10:10 AM',
        duration: '1 hour',
        location: 'D103',
        description: 'Information Systems with Eng. محمود',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'session' as const,
        period: 2,
        section: '5'
      },
    ],
    '6': [
      {
        id: 'S6-Information Technology-Monday-P2',
        title: 'Information Technology',
        instructor: 'Eng. محمد',
        day: 'Monday',
        date: '2025-01-18',
        time: '10:10 AM',
        duration: '1 hour',
        location: 'D101',
        description: 'Information Technology with Eng. محمد',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'session' as const,
        period: 2,
        section: '6'
      },
      {
        id: 'S6-Database Systems-Monday-P6',
        title: 'Database Systems',
        instructor: 'Eng. كريم',
        day: 'Monday',
        date: '2025-01-18',
        time: '2:50 PM',
        duration: '1 hour',
        location: 'D103',
        description: 'Database Systems with Eng. كريم',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 6,
        section: '6'
      },
    ],
    '7': [
      {
        id: 'S7-Database Systems-Monday-P2',
        title: 'Database Systems',
        instructor: 'Eng. كريم',
        day: 'Monday',
        date: '2025-01-18',
        time: '10:10 AM',
        duration: '1 hour',
        location: 'D103',
        description: 'Database Systems with Eng. كريم',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 2,
        section: '7'
      },
      {
        id: 'S7-Information Technology-Monday-P5',
        title: 'Information Technology',
        instructor: 'Eng. محمد',
        day: 'Monday',
        date: '2025-01-18',
        time: '1:40 PM',
        duration: '1 hour',
        location: 'D101',
        description: 'Information Technology with Eng. محمد',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'session' as const,
        period: 5,
        section: '7'
      },
    ],
    '8': [
    ],
    '9': [
    ],
    '10': [
    ],
    '11': [
    ],
    '12': [
    ],
    '13': [
    ],
    '14': [
    ],
    '15': [
    ],
  },
  '2': {
    '1': [
    ],
    '2': [
    ],
    '3': [
    ],
    '4': [
    ],
    '5': [
    ],
    '6': [
    ],
    '7': [
    ],
    '8': [
      {
        id: 'S8-Database Systems-Monday-P1',
        title: 'Database Systems',
        instructor: 'Eng. كريم',
        day: 'Monday',
        date: '2025-01-18',
        time: '9:00 AM',
        duration: '1 hour',
        location: 'D103',
        description: 'Database Systems with Eng. كريم',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 1,
        section: '8'
      },
      {
        id: 'S8-Information Systems-Monday-P3',
        title: 'Information Systems',
        instructor: 'Eng. محمود',
        day: 'Monday',
        date: '2025-01-18',
        time: '11:20 AM',
        duration: '1 hour',
        location: 'D103',
        description: 'Information Systems with Eng. محمود',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'session' as const,
        period: 3,
        section: '8'
      },
    ],
    '9': [
      {
        id: 'S9-Information Systems-Monday-P4',
        title: 'Information Systems',
        instructor: 'Eng. محمود',
        day: 'Monday',
        date: '2025-01-18',
        time: '12:30 PM',
        duration: '1 hour',
        location: 'D103',
        description: 'Information Systems with Eng. محمود',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'session' as const,
        period: 4,
        section: '9'
      },
      {
        id: 'S9-Database Systems-Monday-P5',
        title: 'Database Systems',
        instructor: 'Eng. كريم',
        day: 'Monday',
        date: '2025-01-18',
        time: '1:40 PM',
        duration: '1 hour',
        location: 'D103',
        description: 'Database Systems with Eng. كريم',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 5,
        section: '9'
      },
    ],
    '10': [
      {
        id: 'S10-Database Systems-Monday-P3',
        title: 'Database Systems',
        instructor: 'Eng. كريم',
        day: 'Monday',
        date: '2025-01-18',
        time: '11:20 AM',
        duration: '1 hour',
        location: 'D103',
        description: 'Database Systems with Eng. كريم',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 3,
        section: '10'
      },
      {
        id: 'S10-Information Systems-Monday-P5',
        title: 'Information Systems',
        instructor: 'Eng. محمود',
        day: 'Monday',
        date: '2025-01-18',
        time: '1:40 PM',
        duration: '1 hour',
        location: 'D103',
        description: 'Information Systems with Eng. محمود',
        category: 'Information Systems',
        status: 'upcoming' as const,
        icon: Globe,
        type: 'session' as const,
        period: 5,
        section: '10'
      },
    ],
    '11': [
      {
        id: 'S11-Information Technology-Monday-P1',
        title: 'Information Technology',
        instructor: 'Eng. محمد',
        day: 'Monday',
        date: '2025-01-18',
        time: '9:00 AM',
        duration: '1 hour',
        location: 'D102',
        description: 'Information Technology with Eng. محمد',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'session' as const,
        period: 1,
        section: '11'
      },
      {
        id: 'S11-Database Systems-Monday-P3',
        title: 'Database Systems',
        instructor: 'Eng. نجلاء',
        day: 'Monday',
        date: '2025-01-18',
        time: '11:20 AM',
        duration: '1 hour',
        location: 'D101',
        description: 'Database Systems with Eng. نجلاء',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 3,
        section: '11'
      },
    ],
    '12': [
      {
        id: 'S12-Database Systems-Monday-P1',
        title: 'Database Systems',
        instructor: 'Eng. نجلاء',
        day: 'Monday',
        date: '2025-01-18',
        time: '9:00 AM',
        duration: '1 hour',
        location: 'D101',
        description: 'Database Systems with Eng. نجلاء',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 1,
        section: '12'
      },
      {
        id: 'S12-Information Technology-Monday-P4',
        title: 'Information Technology',
        instructor: 'Eng. محمد',
        day: 'Monday',
        date: '2025-01-18',
        time: '12:30 PM',
        duration: '1 hour',
        location: 'D102',
        description: 'Information Technology with Eng. محمد',
        category: 'Information Technology',
        status: 'upcoming' as const,
        icon: Shield,
        type: 'session' as const,
        period: 4,
        section: '12'
      },
    ],
    '13': [
    ],
    '14': [
    ],
    '15': [
    ],
  },
}










// Helper function to get group for a section
const getGroupForSection = (section: string): string => {
  const sectionNum = parseInt(section)
  return sectionNum <= 7 ? '1' : '2'
}

// Helper function to get lecture for a section - will be populated from Excel analysis
const getLectureForSection = (section: string, day: string): ScheduleItem | null => {
  // This function will be populated with correct data from Excel analysis
  return null
}

interface TodayScheduleProps {
  selectedGroup: string
  selectedSection: string
}

export default function TodaySchedule({ selectedGroup, selectedSection }: TodayScheduleProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [currentDay, setCurrentDay] = useState<string>('')

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const egyptTime = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Cairo"}))
      setCurrentTime(egyptTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
      setCurrentDate(egyptTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      setCurrentDay(days[egyptTime.getDay()])
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Get today's schedule
  useEffect(() => {
    const getTodaySchedule = () => {
      if (!selectedSection) return
      
      const allItems: ScheduleItem[] = []
      
      // Get sessions for the selected section
      const group = getGroupForSection(selectedSection)
      const sessions = scheduleData[group]?.[selectedSection] || []
      allItems.push(...sessions)
      
      // Get lectures for each day
      const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      days.forEach(day => {
        const lecture = getLectureForSection(selectedSection, day)
        if (lecture) {
          allItems.push(lecture)
        }
      })
      
      // Filter for today and sort by time
      const todayItems = allItems.filter(item => item.day === currentDay)
      const sortedItems = sortScheduleByTime(todayItems)
      setTodaySchedule(sortedItems)
    }

    getTodaySchedule()
  }, [selectedSection, currentDay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <Clock size={24} className="text-cyber-neon" />
          <span className="text-cyber-neon text-2xl font-bold font-orbitron">
            {currentTime}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-dark-300" />
          <span className="text-dark-300 text-lg">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Today's Schedule */}
      {currentDay === 'Thursday' || currentDay === 'Friday' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-cyber-dark/50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-dark-400" />
          </div>
          <h4 className="text-xl font-orbitron font-bold text-cyber-neon mb-2">
            Holiday
          </h4>
          <p className="text-dark-300">
            Today is a holiday. Enjoy your break!
          </p>
        </div>
      ) : todaySchedule.length > 0 ? (
        <div className="space-y-4">
          {todaySchedule.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 bg-cyber-dark/30 rounded-lg border border-cyber-glow/20 hover:border-cyber-glow/40 transition-all duration-300"
                style={{
                  borderLeft: `4px solid ${item.type === 'lecture' ? '#8A2BE2' : '#00BFFF'}`
                }}
              >
                         <div className="flex items-start gap-4">
                           <div 
                             className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                             style={{
                               backgroundColor: item.type === 'lecture' ? '#8A2BE2' : '#00BFFF'
                             }}
                           >
                             <IconComponent size={26} className="text-white" />
                           </div>
                           
                           <div className="flex-1 min-w-0">
                             <div className="flex items-start gap-3 mb-3">
                               <h4 className="text-xl font-orbitron font-bold text-cyber-neon break-words leading-tight">
                                 {item.title}
                               </h4>
                               <span className={`px-3 py-1 text-xs rounded-full flex-shrink-0 ${
                                 item.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                                 item.status === 'full' ? 'bg-yellow-500/20 text-yellow-400' :
                                 'bg-gray-500/20 text-gray-400'
                               }`}>
                                 {item.status === 'upcoming' ? 'Upcoming' :
                                  item.status === 'full' ? 'Full' : 'Completed'}
                               </span>
                             </div>

                             <div className="space-y-2 mb-3">
                               <div className="flex items-center gap-2 text-sm text-dark-300">
                                 <Clock size={16} />
                                 <span className="font-medium">{item.time}</span>
                                 <span className="text-dark-400">•</span>
                                 <span className="font-medium">{item.duration}</span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-dark-300">
                                 <MapPin size={16} />
                                 <span className="break-words font-medium">{item.location}</span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-dark-400">
                                 <BookOpen size={16} />
                                 <span className="break-words font-medium">{item.instructor}</span>
                               </div>
                             </div>
                           </div>
                         </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-cyber-dark/50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-dark-400" />
          </div>
          <h4 className="text-xl font-orbitron font-bold text-cyber-neon mb-2">
            No Classes Today
          </h4>
          <p className="text-dark-300">
            Enjoy your free day! Check the full schedule for other days.
          </p>
        </div>
      )}
    </motion.div>
  )
}