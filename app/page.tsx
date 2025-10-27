'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Calendar, CheckSquare, BookOpen, ArrowRight, Sparkles, Zap, Shield, Clock, MapPin, User } from 'lucide-react'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [filteredSchedule, setFilteredSchedule] = useState<any[]>([])
  const features = [
    {
      icon: Calendar,
      title: 'Academic Schedule',
      description: 'Comprehensive class schedules and important academic events',
      href: '/schedule',
      color: 'from-cyber-neon via-cyber-green to-cyber-neon'
    },
    {
      icon: CheckSquare,
      title: 'Assignment Management',
      description: 'Organize and track academic assignments and projects',
      href: '/tasks',
      color: 'from-cyber-violet via-cyber-blue to-cyber-violet'
    },
    {
      icon: BookOpen,
      title: 'Learning Materials',
      description: 'Access comprehensive course materials and resources',
      href: '/materials',
      color: 'from-cyber-green via-cyber-neon to-cyber-green'
    }
  ]

  // Full schedule for today
  const fullSchedule = [
    // Group 1 Lectures
    { time: '09:00 - 10:30', subject: 'Applied Physics', instructor: 'Dr. Ahmed Bakr', room: 'Hall 101', type: 'Lecture', group: 'Group 1', sectionNumber: null },
    { time: '11:00 - 12:30', subject: 'Mathematics', instructor: 'Dr. Simon Ezzat', room: 'Hall 102', type: 'Lecture', group: 'Group 1', sectionNumber: null },
    { time: '14:00 - 15:30', subject: 'Database Systems', instructor: 'Dr. Abeer Hassan', room: 'Hall 103', type: 'Lecture', group: 'Group 1', sectionNumber: null },
    
    // Group 2 Lectures
    { time: '09:00 - 10:30', subject: 'Applied Physics', instructor: 'Dr. Ahmed Bakr', room: 'Hall 201', type: 'Lecture', group: 'Group 2', sectionNumber: null },
    { time: '11:00 - 12:30', subject: 'Mathematics', instructor: 'Dr. Simon Ezzat', room: 'Hall 202', type: 'Lecture', group: 'Group 2', sectionNumber: null },
    { time: '14:00 - 15:30', subject: 'Database Systems', instructor: 'Dr. Abeer Hassan', room: 'Hall 203', type: 'Lecture', group: 'Group 2', sectionNumber: null },
    
    // Sections 1-7 (Group 1)
    { time: '08:00 - 09:30', subject: 'Applied Physics Lab', instructor: 'TA Ahmed Nashaat', room: 'Lab 101', type: 'Lab', group: 'Group 1', sectionNumber: 1 },
    { time: '10:00 - 11:30', subject: 'Mathematics Lab', instructor: 'TA Ehab Gallab', room: 'Lab 102', type: 'Lab', group: 'Group 1', sectionNumber: 2 },
    { time: '12:00 - 13:30', subject: 'Database Systems Lab', instructor: 'TA Nagla Saeed', room: 'Lab 103', type: 'Lab', group: 'Group 1', sectionNumber: 3 },
    { time: '15:00 - 16:30', subject: 'IT Lab', instructor: 'TA Mohamed Ammar', room: 'Lab 104', type: 'Lab', group: 'Group 1', sectionNumber: 4 },
    { time: '17:00 - 18:30', subject: 'English Lab', instructor: 'Dr. Nashwa', room: 'Lab 105', type: 'Lab', group: 'Group 1', sectionNumber: 5 },
    { time: '19:00 - 20:30', subject: 'IS Lab', instructor: 'TA Mahmoud Mohamed', room: 'Lab 106', type: 'Lab', group: 'Group 1', sectionNumber: 6 },
    { time: '21:00 - 22:30', subject: 'Entrepreneurship Lab', instructor: 'TA Kareem Adel', room: 'Lab 107', type: 'Lab', group: 'Group 1', sectionNumber: 7 },
    
    // Sections 8-15 (Group 2)
    { time: '08:00 - 09:30', subject: 'Applied Physics Lab', instructor: 'TA Amany Ibrahim', room: 'Lab 201', type: 'Lab', group: 'Group 2', sectionNumber: 8 },
    { time: '10:00 - 11:30', subject: 'Mathematics Lab', instructor: 'TA Ahmed Nashaat', room: 'Lab 202', type: 'Lab', group: 'Group 2', sectionNumber: 9 },
    { time: '12:00 - 13:30', subject: 'Database Systems Lab', instructor: 'TA Kareem Adel', room: 'Lab 203', type: 'Lab', group: 'Group 2', sectionNumber: 10 },
    { time: '15:00 - 16:30', subject: 'IT Lab', instructor: 'TA Mohamed Ammar', room: 'Lab 204', type: 'Lab', group: 'Group 2', sectionNumber: 11 },
    { time: '17:00 - 18:30', subject: 'English Lab', instructor: 'Dr. Nashwa', room: 'Lab 205', type: 'Lab', group: 'Group 2', sectionNumber: 12 },
    { time: '19:00 - 20:30', subject: 'IS Lab', instructor: 'TA Mariam Ashraf', room: 'Lab 206', type: 'Lab', group: 'Group 2', sectionNumber: 13 },
    { time: '21:00 - 22:30', subject: 'Entrepreneurship Lab', instructor: 'TA Dina Ali', room: 'Lab 207', type: 'Lab', group: 'Group 2', sectionNumber: 14 },
    { time: '23:00 - 00:30', subject: 'Physics Lab', instructor: 'TA Dina Ali', room: 'Lab 208', type: 'Lab', group: 'Group 2', sectionNumber: 15 }
  ]

  const sections = Array.from({ length: 15 }, (_, i) => i + 1)

  // Search function
  const handleSearch = () => {
    if (!selectedGroup || !selectedSection) return
    
    const filtered = fullSchedule.filter(item => 
      item.group === selectedGroup && 
      (item.sectionNumber === parseInt(selectedSection) || item.sectionNumber === null)
    )
    
    // Sort by time
    const sorted = filtered.sort((a, b) => {
      const timeA = a.time.split(' - ')[0] || ''
      const timeB = b.time.split(' - ')[0] || ''
      return timeA.localeCompare(timeB)
    })
    
    setFilteredSchedule(sorted)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }))
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyber-neon/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyber-violet/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyber-green/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold text-dark-100 mb-6 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green">
                Cyber TMSAH
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              An advanced university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/schedule"
                className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold group"
              >
                Begin Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/materials"
                className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold group"
              >
                Explore Materials
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Accelerated Learning</h3>
              <p className="text-dark-300">Advanced techniques for efficient and effective learning</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-violet via-cyber-blue to-cyber-violet rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-violet/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Secure & Reliable</h3>
              <p className="text-dark-300">Comprehensive protection for your data and information</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-green via-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Premium Experience</h3>
              <p className="text-dark-300">Modern, intuitive user interface designed for academic excellence</p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyber-neon rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyber-neon rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-cyber-dark to-cyber-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
              Core Features
            </h2>
            <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
              Discover all the advanced features available in our academic platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group block"
                >
                  <div className="enhanced-card p-6 text-center h-full hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-dark-100 mb-2 group-hover:text-cyber-neon transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-300 group-hover:text-dark-200 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Schedule Preview Section */}
      <section className="py-20 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-cyber-neon" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
                Today's Schedule
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
              {currentDate}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-6 h-6 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-full flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-cyber-neon font-semibold text-lg">{currentTime}</span>
            </div>
          </div>

          {/* Search Interface */}
          <div className="mb-8 animate-slide-up">
            <div className="enhanced-card p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-dark-100 mb-4 text-center">
                Select your group and attendance section to view your personalized schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Group</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full p-3 bg-dark-200 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50 transition-colors"
                  >
                    <option value="">Select Group</option>
                    <option value="Group 1">Group 1 (Attendance 1-7)</option>
                    <option value="Group 2">Group 2 (Attendance 8-15)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Attendance</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-3 bg-dark-200 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50 transition-colors"
                  >
                    <option value="">Select Attendance</option>
                    {sections.map(section => (
                      <option key={section} value={section}>Attendance {section}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full btn-primary py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Schedule Table */}
          {filteredSchedule.length > 0 ? (
            <div className="mb-8 animate-slide-up">
              <div className="enhanced-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-cyber-neon/10 to-cyber-violet/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Subject</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Instructor</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Room</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedule.map((schedule, index) => (
                        <tr key={index} className="hover:bg-cyber-neon/5 transition-colors">
                          <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cyber-neon" />
                              <span className="font-medium">{schedule.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-dark-100 font-semibold border-b border-dark-200/20">
                            {schedule.subject}
                          </td>
                          <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-cyber-violet" />
                              <span>{schedule.instructor}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-cyber-green" />
                              <span>{schedule.room}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-b border-dark-200/20">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              schedule.type === 'Lecture' 
                                ? 'bg-cyber-violet/20 text-cyber-violet' 
                                : 'bg-cyber-green/20 text-cyber-green'
                            }`}>
                              {schedule.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                            {schedule.sectionNumber ? `Attendance ${schedule.sectionNumber}` : 'General Lecture'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 animate-slide-up">
              <div className="w-24 h-24 bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-cyber-neon" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Select your group and attendance</h3>
              <p className="text-dark-300">to view your personalized daily schedule</p>
            </div>
          )}
          
          <div className="text-center animate-slide-up-delayed">
            <Link
              href="/schedule"
              className="btn-primary inline-flex items-center gap-2"
            >
              View Full Schedule
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}