'use client'

import { Calendar, Clock, MapPin, User, Search } from 'lucide-react'
import { useState } from 'react'

export default function SchedulePage() {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [filteredSchedule, setFilteredSchedule] = useState<any[]>([])
  const [validationError, setValidationError] = useState('')
  
  // Updated Schedule Data - Group A (Group 1) and Group B (Group 2) Lectures
  const scheduleData = [
    // ========== GROUP A (Group 1) LECTURES ==========
    // Saturday - Group A
    {
      id: '1',
      title: 'English',
      time: '11:20 - 12:20',
      location: 'Hall G 205',
      instructor: 'Dr. Nashwa',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Saturday'
    },
    // Monday - Group A
    {
      id: '2',
      title: 'Information Systems',
      time: '09:00 - 10:00',
      location: 'Hall G 250',
      instructor: 'Dr. Hind Ziada',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Monday'
    },
    {
      id: '3',
      title: 'Information Technology',
      time: '16:00 - 17:00',
      location: 'Auditorium A',
      instructor: 'Dr. Shaima Ahmed',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Monday'
    },
    // Tuesday - Group A
    {
      id: '4',
      title: 'Entrepreneurship and Creative Thinking Skills',
      time: '09:00 - 10:00',
      location: 'Auditorium A',
      instructor: 'Dr. Abeer Hassan',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Tuesday'
    },
    {
      id: '5',
      title: 'Database Systems',
      time: '11:20 - 12:20',
      location: 'Auditorium A',
      instructor: 'Dr. Abeer Hassan',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Tuesday'
    },
    {
      id: '6',
      title: 'Mathematics',
      time: '13:40 - 14:40',
      location: 'Auditorium A',
      instructor: 'Dr. Simon Ezzat',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Tuesday'
    },
    // Wednesday - Group A
    {
      id: '7',
      title: 'Applied Physics',
      time: '16:00 - 17:00',
      location: 'Auditorium A',
      instructor: 'Dr. Ahmed Bakr',
      type: 'lecture',
      section: 'Group A',
      group: 'Group 1',
      sectionNumber: null,
      day: 'Wednesday'
    },

    // ========== GROUP B (Group 2) LECTURES ==========
    // Saturday - Group B
    {
      id: '8',
      title: 'English',
      time: '12:30 - 13:30',
      location: 'Hall G 205',
      instructor: 'Dr. Nashwa',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Saturday'
    },
    // Monday - Group B
    {
      id: '9',
      title: 'Information Systems',
      time: '10:10 - 11:10',
      location: 'Hall G 205',
      instructor: 'Dr. Hind Ziada',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Monday'
    },
    {
      id: '10',
      title: 'Information Technology',
      time: '14:50 - 15:50',
      location: 'Auditorium A',
      instructor: 'Dr. Shaima Ahmed',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Monday'
    },
    // Tuesday - Group B
    {
      id: '11',
      title: 'Entrepreneurship and Creative Thinking Skills',
      time: '10:10 - 11:10',
      location: 'Auditorium A',
      instructor: 'Dr. Abeer Hassan',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Tuesday'
    },
    {
      id: '12',
      title: 'Database Systems',
      time: '12:30 - 13:30',
      location: 'Auditorium A',
      instructor: 'Dr. Abeer Hassan',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Tuesday'
    },
    {
      id: '13',
      title: 'Mathematics',
      time: '14:50 - 15:50',
      location: 'Auditorium A',
      instructor: 'Dr. Simon Ezzat',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Tuesday'
    },
    // Wednesday - Group B
    {
      id: '14',
      title: 'Applied Physics',
      time: '17:10 - 18:10',
      location: 'Auditorium A',
      instructor: 'Dr. Ahmed Bakr',
      type: 'lecture',
      section: 'Group B',
      group: 'Group 2',
      sectionNumber: null,
      day: 'Wednesday'
    }
  ]

  // Validation function
  const validateGroupAndSection = (group: string, section: string): string => {
    if (!group || !section) return ''
    
    const sectionNum = parseInt(section)
    
    // Group A (Group 1) → Sections 1-7 only
    if (group === 'Group 1') {
      if (sectionNum < 1 || sectionNum > 7) {
        return 'Group A only includes Sections 1-7. Please select a valid section number.'
      }
    }
    
    // Group B (Group 2) → Sections 8-15 only
    if (group === 'Group 2') {
      if (sectionNum < 8 || sectionNum > 15) {
        return 'Group B only includes Sections 8-15. Please select a valid section number.'
      }
    }
    
    return ''
  }

  const handleSearch = () => {
    if (!selectedGroup || !selectedSection) {
      setValidationError('Please select both Lecture Group and Section Number.')
      setFilteredSchedule([])
      return
    }
    
    // Validate group and section match
    const error = validateGroupAndSection(selectedGroup, selectedSection)
    if (error) {
      setValidationError(error)
      setFilteredSchedule([])
      return
    }
    
    // Clear error if validation passes
    setValidationError('')
    
    let filtered = scheduleData.filter(item => {
      const matchesGroup = !selectedGroup || item.group === selectedGroup
      const matchesSection = !selectedSection || item.sectionNumber === parseInt(selectedSection)
      return matchesGroup && matchesSection
    })
    
    // Sort by day order and then by time
    const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    filtered.sort((a, b) => {
      const dayA = dayOrder.indexOf(a.day || '')
      const dayB = dayOrder.indexOf(b.day || '')
      if (dayA !== dayB) return dayA - dayB
      
      // If same day, sort by time
      const timeA = a.time.split(' - ')[0] || ''
      const timeB = b.time.split(' - ')[0] || ''
      return timeA.localeCompare(timeB)
    })
    
    setFilteredSchedule(filtered)
  }

  // Group schedule by day
  const groupByDay = (items: any[]) => {
    const grouped: { [key: string]: any[] } = {}
    items.forEach(item => {
      const day = item.day || 'Other'
      if (!grouped[day]) {
        grouped[day] = []
      }
      grouped[day].push(item)
    })
    return grouped
  }

  const groups = [
    { value: 'Group 1', label: 'A' },
    { value: 'Group 2', label: 'B' }
  ]
  const sections = Array.from({length: 15}, (_, i) => i + 1)


  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            Academic Schedule
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            Comprehensive lecture and laboratory schedule for the current academic semester
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-8 animate-slide-up">
          <div className="enhanced-card p-6">
            <h2 className="text-xl font-semibold text-dark-100 mb-4 text-center">
              Select your lecture group (A or B) and section number to view your weekly schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Lecture Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="">Select Lecture Group</option>
                  {groups.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Section Number
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="">Select Section Number</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-cyber-neon to-cyber-green hover:from-cyber-green hover:to-cyber-neon text-dark-100 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
            
            {validationError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-red-400 font-bold text-lg">⚠</div>
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">Invalid Selection</h4>
                    <p className="text-red-300 text-sm">{validationError}</p>
                    <p className="text-dark-300 text-xs mt-2">
                      <strong>Group A:</strong> Sections 1-7 | <strong>Group B:</strong> Sections 8-15
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule - Organized by Day */}
        <div className="space-y-6">
          {(() => {
            const scheduleToShow = filteredSchedule.length > 0 ? filteredSchedule : scheduleData
            const groupedByDay = groupByDay(scheduleToShow)
            const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            
            return dayOrder.map(day => {
              const dayLectures = groupedByDay[day] || []
              if (dayLectures.length === 0) return null
              
              return (
                <div key={day} className="enhanced-card overflow-hidden">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 px-6 py-4 border-b border-cyber-neon/30">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-cyber-neon" />
                      <h3 className="text-xl font-bold text-dark-100">{day}</h3>
                      <span className="ml-auto text-sm text-dark-300 bg-cyber-dark/50 px-3 py-1 rounded-full">
                        {dayLectures.length} {dayLectures.length === 1 ? 'Lecture' : 'Lectures'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Day Lectures Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-cyber-dark/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Time</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Subject</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Instructor</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Location</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Type</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Group</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayLectures.map((item, index) => (
                          <tr 
                            key={item.id || index} 
                            className={`hover:bg-cyber-neon/5 transition-colors ${
                              index < dayLectures.length - 1 ? 'border-b border-dark-200/10' : ''
                            }`}
                          >
                            <td className="px-6 py-4 text-dark-300">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyber-neon" />
                                <span className="font-medium">{item.time}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-dark-100 font-semibold">
                              {item.title}
                            </td>
                            <td className="px-6 py-4 text-dark-300">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-cyber-violet" />
                                <span>{item.instructor}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-dark-300">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-cyber-green" />
                                <span>{item.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.type === 'lecture' 
                                  ? 'bg-cyber-violet/20 text-cyber-violet' 
                                  : 'bg-cyber-green/20 text-cyber-green'
                              }`}>
                                {item.type === 'lecture' ? 'Lecture' : item.type === 'lab' ? 'Lab' : 'Application'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-dark-300">
                              <span className="px-2 py-1 bg-cyber-neon/10 text-cyber-neon rounded text-xs font-medium">
                                {item.group === 'Group 1' ? 'A' : item.group === 'Group 2' ? 'B' : item.group}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }).filter(Boolean)
          })()}
        </div>

        {/* Empty State */}
        {scheduleData.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <Calendar className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              No Lectures Available
            </h3>
            <p className="text-dark-300">
              The academic schedule will be added soon. Stay tuned for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}