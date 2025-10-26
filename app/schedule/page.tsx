'use client'

import { Calendar, Clock, MapPin, User, BookOpen, Search } from 'lucide-react'
import { useState } from 'react'

export default function SchedulePage() {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [filteredSchedule, setFilteredSchedule] = useState<any[]>([])
  const scheduleData = [
    {
      id: '1',
      title: 'Applied Physics',
      time: '09:00 - 10:30',
      location: 'Main Hall A',
      instructor: 'Dr. Ahmed Mohamed',
      type: 'lecture',
      section: 'Group A (350 students)',
      group: 'Group 1',
      sectionNumber: null
    },
    {
      id: '2',
      title: 'Applied Physics',
      time: '11:00 - 12:30',
      location: 'Main Hall B',
      instructor: 'Dr. Ahmed Mohamed',
      type: 'lecture',
      section: 'Group B (350 students)',
      group: 'Group 2',
      sectionNumber: null
    },
    {
      id: '3',
      title: 'Mathematics',
      time: '14:00 - 15:30',
      location: 'Main Hall A',
      instructor: 'Dr. Sara Ahmed',
      type: 'lecture',
      section: 'Group A (350 students)',
      group: 'Group 1',
      sectionNumber: null
    },
    {
      id: '4',
      title: 'Mathematics',
      time: '16:00 - 17:30',
      location: 'Main Hall B',
      instructor: 'Dr. Sara Ahmed',
      type: 'lecture',
      section: 'Group B (350 students)',
      group: 'Group 2',
      sectionNumber: null
    },
    {
      id: '5',
      title: 'Entrepreneurship and Creative Thinking Skills',
      time: '18:00 - 19:30',
      location: 'Main Hall A',
      instructor: 'Dr. Mohamed Ali',
      type: 'lecture',
      section: 'Group A (350 students)',
      group: 'Group 1',
      sectionNumber: null
    },
    {
      id: '6',
      title: 'Entrepreneurship and Creative Thinking Skills',
      time: '08:00 - 09:30',
      location: 'Main Hall B',
      instructor: 'Dr. Mohamed Ali',
      type: 'lecture',
      section: 'Group B (350 students)',
      group: 'Group 2',
      sectionNumber: null
    },
    {
      id: '7',
      title: 'Information Technology',
      time: '10:00 - 11:30',
      location: 'Computer Lab 1',
      instructor: 'Dr. Fatma Hassan',
      type: 'lab',
      section: 'Section 1 (47 students)',
      group: 'Group 1',
      sectionNumber: 1
    },
    {
      id: '8',
      title: 'Information Technology',
      time: '12:00 - 13:30',
      location: 'Computer Lab 2',
      instructor: 'Dr. Fatma Hassan',
      type: 'lab',
      section: 'Section 2 (47 students)',
      group: 'Group 1',
      sectionNumber: 2
    },
    {
      id: '9',
      title: 'Information Technology',
      time: '14:00 - 15:30',
      location: 'Computer Lab 3',
      instructor: 'Dr. Fatma Hassan',
      type: 'lab',
      section: 'Section 3 (47 students)',
      group: 'Group 1',
      sectionNumber: 3
    },
    {
      id: '10',
      title: 'Database Systems',
      time: '16:00 - 17:30',
      location: 'Computer Lab 1',
      instructor: 'Eng. Ali Mahmoud',
      type: 'lab',
      section: 'Section 4 (47 students)',
      group: 'Group 1',
      sectionNumber: 4
    },
    {
      id: '11',
      title: 'Database Systems',
      time: '18:00 - 19:30',
      location: 'Computer Lab 2',
      instructor: 'Eng. Ali Mahmoud',
      type: 'lab',
      section: 'Section 5 (47 students)',
      group: 'Group 1',
      sectionNumber: 5
    },
    {
      id: '12',
      title: 'Database Systems',
      time: '08:00 - 09:30',
      location: 'Computer Lab 3',
      instructor: 'Eng. Ali Mahmoud',
      type: 'lab',
      section: 'Section 6 (47 students)',
      group: 'Group 1',
      sectionNumber: 6
    },
    {
      id: '13',
      title: 'English',
      time: '10:00 - 11:30',
      location: 'Language Lab 1',
      instructor: 'Dr. Nour El-Din',
      type: 'lab',
      section: 'Section 7 (47 students)',
      group: 'Group 1',
      sectionNumber: 7
    },
    {
      id: '14',
      title: 'English',
      time: '12:00 - 13:30',
      location: 'Language Lab 2',
      instructor: 'Dr. Nour El-Din',
      type: 'lab',
      section: 'Section 8 (47 students)',
      group: 'Group 2',
      sectionNumber: 8
    },
    {
      id: '15',
      title: 'English',
      time: '14:00 - 15:30',
      location: 'Language Lab 3',
      instructor: 'Dr. Nour El-Din',
      type: 'lab',
      section: 'Section 9 (47 students)',
      group: 'Group 2',
      sectionNumber: 9
    },
    {
      id: '16',
      title: 'Information System',
      time: '16:00 - 17:30',
      location: 'Computer Lab 4',
      instructor: 'Eng. Mariam Ahmed',
      type: 'lab',
      section: 'Section 10 (47 students)',
      group: 'Group 2',
      sectionNumber: 10
    },
    {
      id: '17',
      title: 'Information System',
      time: '18:00 - 19:30',
      location: 'Computer Lab 5',
      instructor: 'Eng. Mariam Ahmed',
      type: 'lab',
      section: 'Section 11 (47 students)',
      group: 'Group 2',
      sectionNumber: 11
    },
    {
      id: '18',
      title: 'Information System',
      time: '08:00 - 09:30',
      location: 'Computer Lab 6',
      instructor: 'Eng. Mariam Ahmed',
      type: 'lab',
      section: 'Section 12 (47 students)',
      group: 'Group 2',
      sectionNumber: 12
    },
    {
      id: '19',
      title: 'Information Technology',
      time: '10:00 - 11:30',
      location: 'Computer Lab 7',
      instructor: 'Dr. Fatma Hassan',
      type: 'lab',
      section: 'Section 13 (47 students)',
      group: 'Group 2',
      sectionNumber: 13
    },
    {
      id: '20',
      title: 'Database Systems',
      time: '12:00 - 13:30',
      location: 'Computer Lab 8',
      instructor: 'Eng. Ali Mahmoud',
      type: 'lab',
      section: 'Section 14 (47 students)',
      group: 'Group 2',
      sectionNumber: 14
    },
    {
      id: '21',
      title: 'Information System',
      time: '14:00 - 15:30',
      location: 'Computer Lab 9',
      instructor: 'Eng. Mariam Ahmed',
      type: 'lab',
      section: 'Section 15 (47 students)',
      group: 'Group 2',
      sectionNumber: 15
    }
  ]

  const handleSearch = () => {
    let filtered = scheduleData.filter(item => {
      const matchesGroup = !selectedGroup || item.group === selectedGroup
      const matchesSection = !selectedSection || item.sectionNumber === parseInt(selectedSection)
      return matchesGroup && matchesSection
    })
    setFilteredSchedule(filtered)
  }

  const groups = ['Group 1', 'Group 2']
  const sections = Array.from({length: 15}, (_, i) => i + 1)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-gradient-to-r from-cyber-neon to-cyber-green'
      case 'lab':
        return 'bg-gradient-to-r from-cyber-violet to-cyber-blue'
      case 'tutorial':
        return 'bg-gradient-to-r from-cyber-green to-cyber-neon'
      default:
        return 'bg-gradient-to-r from-cyber-blue to-cyber-violet'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return BookOpen
      case 'lab':
        return Calendar
      case 'tutorial':
        return User
      default:
        return Calendar
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            الجدول الأكاديمي
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            جدول المحاضرات والمختبرات للفصل الدراسي الحالي
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-8 animate-slide-up">
          <div className="enhanced-card p-6">
            <h2 className="text-xl font-semibold text-dark-100 mb-4 text-center">
              اختر مجموعتك وسكشنك لعرض جدولك الأسبوعي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  المجموعة
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="">اختر المجموعة</option>
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  السكشن
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="">اختر السكشن</option>
                  {sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-cyber-neon to-cyber-green hover:from-cyber-green hover:to-cyber-neon text-dark-100 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  البحث
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredSchedule.length > 0 ? filteredSchedule : scheduleData).map((item, index) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <div
                key={item.id}
                className="enhanced-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getTypeColor(item.type)} rounded-xl flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6 text-dark-100" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyber-neon/20 text-cyber-neon font-medium">
                    {item.type === 'lecture' ? 'محاضرة' : item.type === 'lab' ? 'مختبر' : 'تطبيق'}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-dark-100 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-dark-300">
                    <Clock className="w-4 h-4 text-cyber-neon" />
                    <span className="text-sm">{item.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <MapPin className="w-4 h-4 text-cyber-violet" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <User className="w-4 h-4 text-cyber-green" />
                    <span className="text-sm">{item.instructor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <Calendar className="w-4 h-4 text-cyber-blue" />
                    <span className="text-sm">{item.section}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {scheduleData.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <Calendar className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              لا توجد محاضرات متاحة
            </h3>
            <p className="text-dark-300">
              سيتم إضافة الجدول الأكاديمي قريباً. ابق متابعاً للتحديثات!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}