'use client'

import { Calendar, Clock, MapPin, User, Search } from 'lucide-react'
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
                  className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
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
                  className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
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
          </div>
        </div>

        {/* Schedule Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Lecture Group</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Section</th>
                </tr>
              </thead>
              <tbody>
                {(filteredSchedule.length > 0 ? filteredSchedule : scheduleData).map((item) => (
                  <tr key={item.id} className="hover:bg-cyber-neon/5 transition-colors">
                    <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyber-neon" />
                        <span className="font-medium">{item.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-100 font-semibold border-b border-dark-200/20">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-cyber-violet" />
                        <span>{item.instructor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyber-green" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-dark-200/20">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'lecture' 
                          ? 'bg-cyber-violet/20 text-cyber-violet' 
                          : 'bg-cyber-green/20 text-cyber-green'
                      }`}>
                        {item.type === 'lecture' ? 'Lecture' : item.type === 'lab' ? 'Lab' : 'Application'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                      <span className="px-2 py-1 bg-cyber-neon/10 text-cyber-neon rounded text-xs font-medium">
                        {item.group === 'Group 1' ? 'A' : item.group === 'Group 2' ? 'B' : item.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-300 border-b border-dark-200/20">
                      {item.sectionNumber ? item.sectionNumber : 'General Lecture'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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