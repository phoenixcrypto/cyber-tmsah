'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, MapPin, BookOpen, Shield, Code, Database, Globe, Lock, Users, Target, Zap } from 'lucide-react'

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
      {
        id: 'S14-Database Systems-Monday-P8',
        title: 'Database Systems',
        instructor: 'Eng. نجلاء سعيد',
        day: 'Monday',
        date: '2025-01-18',
        time: '5:10 PM',
        duration: '1 hour 10 minutes',
        location: 'D102',
        description: 'Database Systems with Eng. نجلاء سعيد',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 8,
        section: '14'
      },
    ],
    '15': [
      {
        id: 'S15-Database Systems-Monday-P7',
        title: 'Database Systems',
        instructor: 'Eng. نجلاء سعيد',
        day: 'Monday',
        date: '2025-01-18',
        time: '4:00 PM',
        duration: '1 hour',
        location: 'D101',
        description: 'Database Systems with Eng. نجلاء سعيد',
        category: 'Database Systems',
        status: 'upcoming' as const,
        icon: Database,
        type: 'session' as const,
        period: 7,
        section: '15'
      },
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

const SchedulePage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('1')
  const [selectedSection, setSelectedSection] = useState<string>('1')
  const [showSchedule, setShowSchedule] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const egyptTime = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Cairo"}))
      setCurrentTime(egyptTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
      setCurrentDate(egyptTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    if (selectedGroup && selectedSection) {
      setShowSchedule(true)
    }
  }

  const getStudentSchedule = (): ScheduleItem[] => {
    if (!selectedSection) return []
    
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
    
    return allItems
  }

  const getWeeklySchedule = () => {
    const studentSchedule = getStudentSchedule()
    const weeklySchedule: Record<string, ScheduleItem[]> = {
      'Saturday': [],
      'Sunday': [],
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': []
    }

    studentSchedule.forEach(item => {
      if (weeklySchedule[item.day]) {
        weeklySchedule[item.day].push(item)
      }
    })

    // Sort each day's schedule by time
    Object.keys(weeklySchedule).forEach(day => {
      weeklySchedule[day] = sortScheduleByTime(weeklySchedule[day])
    })

    return weeklySchedule
  }

  const weeklySchedule = getWeeklySchedule()

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <Link href="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Schedule</span>
        </div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-orbitron font-black mb-3 sm:mb-4 md:mb-6 text-cyber-neon px-2"
        >
          Schedule
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-base sm:text-lg md:text-xl text-dark-300 max-w-3xl mx-auto px-2 mb-6 sm:mb-8"
        >
          Your complete cybersecurity learning schedule - organized and optimized for success
        </motion.p>

        {/* Current Time and Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="enhanced-card mb-6 sm:mb-8 mx-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              
                <Clock className="text-cyber-neon" size={20} />
              
              <span className="text-cyber-neon text-lg sm:text-2xl font-bold font-orbitron">
                {currentTime}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              
                <Calendar className="text-cyber-violet" size={20} />
              
              <span className="text-dark-300 text-base sm:text-lg">
                {currentDate}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Section Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="enhanced-card mb-8"
        >
          <div className="text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              
                <Users className="text-cyber-neon" size={32} />
              
              <h3 className="text-2xl font-orbitron font-bold text-cyber-neon">
                Select Your Section
              </h3>
            </motion.div>
            <p className="text-dark-300 text-lg">
              Choose your section to view your personalized schedule
            </p>
              </div>

          {/* Section Selection */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-8">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((section) => {
              const group = parseInt(section.toString()) <= 7 ? '1' : '2'
              return (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSection(section.toString())
                    setSelectedGroup(group)
                  }}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all duration-300 enhanced-card interactive-hover text-sm sm:text-base ${
                    selectedSection === section.toString()
                      ? 'bg-cyber-violet/20 text-cyber-violet border-2 border-cyber-violet/50' 
                      : 'bg-cyber-dark/30 text-dark-300 border border-cyber-glow/30 hover:border-cyber-violet/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    
                      <Target size={16} />
                    
                    <span>{section}</span>
                    <span className="text-xs opacity-70">(G{group})</span>
                  </div>
                </motion.button>
              )
            })}
                </div>
                
          {/* View Schedule Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="btn-primary px-8 py-4"
              disabled={!selectedSection}
            >
              
                <Calendar size={20} />
              
              View My Schedule
            </motion.button>
                </div>
        </motion.div>

        {/* Schedule Display */}
        {showSchedule && (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card"
          >
            <div className="text-center mb-8">
            <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 animated-gradient rounded-full flex items-center justify-center glow-pulse magnetic-hover"
              >
                
                  <Calendar className="text-white" size={32} />
                
              </motion.div>
              <h3 className="text-3xl font-orbitron font-bold text-cyber-neon mb-4">
                Your Schedule
              </h3>
              <p className="text-dark-300 text-lg">
                Group {selectedGroup} • Section {selectedSection}
              </p>
                </div>

            {/* Color Legend */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8A2BE2' }}></div>
                <span className="text-dark-300 text-sm">Lectures</span>
                </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00BFFF' }}></div>
                <span className="text-dark-300 text-sm">Sessions</span>
                </div>
              </div>

            {/* Weekly Schedule Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyber-glow/30">
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Day</th>
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Time</th>
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Subject</th>
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Instructor</th>
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Location</th>
                      <th className="text-left py-2 px-2 sm:py-4 sm:px-6 text-cyber-neon font-orbitron font-bold text-xs sm:text-sm">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(weeklySchedule).map(([day, items]) => {
                      if (items.length === 0) {
                        return (
                          <tr key={day} className="border-b border-cyber-glow/20">
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-300 font-medium text-xs sm:text-sm">{day}</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-400 text-xs sm:text-sm">-</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-400 text-xs sm:text-sm">
                              {day === 'Thursday' || day === 'Friday' ? 'Holiday' : 'No Classes'}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-400 text-xs sm:text-sm">-</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-400 text-xs sm:text-sm">-</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-400 text-xs sm:text-sm">-</td>
                          </tr>
                        )
                      }
                      
                      return items.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="border-b border-cyber-glow/20 hover:bg-cyber-dark/20 transition-colors duration-300"
                          >
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-300 font-medium text-xs sm:text-sm">
                              {index === 0 ? day : ''}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-300">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Clock size={12} className="sm:w-4 sm:h-4" />
                                <span className="font-medium text-xs sm:text-sm">{item.time}</span>
                              </div>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div 
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor: item.type === 'lecture' ? '#8A2BE2' : '#00BFFF'
                                  }}
                                >
                                  <IconComponent size={12} className="text-white sm:w-4 sm:h-4" />
                                </div>
                                <span className="text-cyber-neon font-medium break-words text-xs sm:text-sm">{item.title}</span>
                              </div>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-300 break-words text-xs sm:text-sm">
                              {item.instructor}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6 text-dark-300">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <MapPin size={12} className="sm:w-4 sm:h-4" />
                                <span className="break-words text-xs sm:text-sm">{item.location}</span>
                              </div>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-6">
                              <span 
                                className="px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: item.type === 'lecture' ? '#8A2BE2' : '#00BFFF',
                                  color: 'white'
                                }}
                              >
                                {item.type === 'lecture' ? 'Lecture' : 'Session'}
                              </span>
                            </td>
                          </motion.tr>
                        )
                      })
                    })}
                  </tbody>
                </table>
              </div>
              </div>
            </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
            <h3 className="text-2xl font-orbitron font-bold text-cyber-neon mb-4">
            Need Help with Your Schedule?
            </h3>
            <p className="text-dark-300 mb-6">
            Contact us for any schedule-related questions or clarifications.
          </p>
          <Link href="/about" className="btn-primary">
              Contact Us
            </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default SchedulePage
