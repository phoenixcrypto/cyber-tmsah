'use client'

import { Calendar, Clock, MapPin, User, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SchedulePage() {
  const [selectedSection, setSelectedSection] = useState('')
  const [filteredSchedule, setFilteredSchedule] = useState<any[]>([])
  const [validationError, setValidationError] = useState('')
  const [scheduleView, setScheduleView] = useState<'A' | 'B'>('A') // Toggle between Group A and B
  
  // Sections Data - All 15 Sections with their lab schedules
  const sectionsData = [
    // ========== SECTIONS 1-7 (GROUP A - Group 1) ==========
    // Section 1
    { id: 's1-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Monday' },
    { id: 's1-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Tuesday' },
    { id: 's1-3', title: 'Physics', time: '09:00 AM - 10:00 AM', location: 'Hall G 203', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
    { id: 's1-4', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
    { id: 's1-5', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
    
    // Section 2
    { id: 's2-1', title: 'Physics', time: '12:30 PM - 01:30 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Saturday' },
    { id: 's2-2', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Tuesday' },
    { id: 's2-3', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Tuesday' },
    { id: 's2-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Wednesday' },
    { id: 's2-5', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Wednesday' },
    
    // Section 3
    { id: 's3-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Saturday' },
    { id: 's3-2', title: 'IT', time: '02:50 PM - 03:50 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Tuesday' },
    { id: 's3-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Tuesday' },
    { id: 's3-4', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Wednesday' },
    { id: 's3-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Wednesday' },
    
    // Section 4
    { id: 's4-1', title: 'Physics', time: '02:50 PM - 03:50 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Saturday' },
    { id: 's4-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Monday' },
    { id: 's4-3', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Monday' },
    { id: 's4-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Wednesday' },
    { id: 's4-5', title: 'Database', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Wednesday' },
    
    // Section 5
    { id: 's5-1', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
    { id: 's5-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
    { id: 's5-3', title: 'IT', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Tuesday' },
    { id: 's5-4', title: 'Database', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Wednesday' },
    
    // Section 6
    { id: 's6-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-2', title: 'DataBase', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-3', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-4', title: 'IS', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Wednesday' },
    
    // Section 7
    { id: 's7-1', title: 'Mathematics', time: '12:30 PM - 01:30 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Saturday' },
    { id: 's7-1b', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Saturday' },
    { id: 's7-2', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Monday' },
    { id: 's7-3', title: 'IT', time: '01:40 PM - 02:40 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Monday' },
    { id: 's7-4', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Wednesday' },

    // ========== SECTIONS 8-15 (GROUP B - Group 2) ==========
    // Section 8
    { id: 's8-1', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Saturday' },
    { id: 's8-2', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Saturday' },
    { id: 's8-3', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Monday' },
    { id: 's8-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Monday' },
    
    // Section 9
    { id: 's9-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Saturday' },
    { id: 's9-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Saturday' },
    { id: 's9-3', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Monday' },
    { id: 's9-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Monday' },
    
    // Section 10
    { id: 's10-1', title: 'IT', time: '11:20 AM - 12:20 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Saturday' },
    { id: 's10-2', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
    { id: 's10-3', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
    { id: 's10-4', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
    
    // Section 11
    { id: 's11-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Saturday' },
    { id: 's11-2', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
    { id: 's11-3', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
    { id: 's11-4', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Tuesday' },
    { id: 's11-5', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 102', instructor: 'Eng Dina Ali', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Wednesday' },
    
    // Section 12
    { id: 's12-0', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Saturday' },
    { id: 's12-1', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Tuesday' },
    { id: 's12-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Wednesday' },
    
    // Section 13
    { id: 's13-1', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
    { id: 's13-2', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
    { id: 's13-3', title: 'Database', time: '04:00 PM - 05:00 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Tuesday' },
    { id: 's13-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Wednesday' },
    
    // Section 14
    { id: 's14-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
    { id: 's14-2', title: 'DataBase', time: '05:10 PM - 06:10 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
    { id: 's14-3', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
    { id: 's14-4', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
    
    // Section 15
    { id: 's15-1', title: 'DataBase', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Monday' },
    { id: 's15-2', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Tuesday' },
    { id: 's15-3', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Wednesday' },
    { id: 's15-4', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Wednesday' }
  ]

  // Updated Schedule Data - Group A (Group 1) and Group B (Group 2) Lectures
  const scheduleData = [
    // ========== GROUP A (Group 1) LECTURES ==========
    // Saturday - Group A
    {
      id: '1',
      title: 'English',
      time: '11:20 AM - 12:20 PM',
      location: 'Hall G 205',
      instructor: 'Dr. Sabreen',
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
      time: '09:00 AM - 10:00 AM',
      location: 'Hall G 205',
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
      time: '04:00 PM - 05:00 PM',
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
      time: '09:00 AM - 10:00 AM',
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
      time: '11:20 AM - 12:20 PM',
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
      time: '01:40 PM - 02:40 PM',
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
      time: '04:00 PM - 05:00 PM',
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
      time: '12:30 PM - 01:30 PM',
      location: 'Hall G 205',
      instructor: 'Dr. Sabreen',
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
      time: '10:10 AM - 11:10 AM',
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
      time: '02:50 PM - 03:50 PM',
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
      time: '10:10 AM - 11:10 AM',
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
      time: '12:30 PM - 01:30 PM',
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
      time: '02:50 PM - 03:50 PM',
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
      time: '05:10 PM - 06:10 PM',
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
    // Filter by selected group (A or B) from toggle
    const groupFilter = scheduleView === 'A' ? 'Group 1' : 'Group 2'
    
    // If section is selected, validate it
    if (selectedSection) {
      const error = validateGroupAndSection(groupFilter, selectedSection)
      if (error) {
        setValidationError(error)
        setFilteredSchedule([])
        return
      }
    }
    
    // Clear error if validation passes
    setValidationError('')
    
    // Combine lectures and sections data
    const allScheduleData = [...scheduleData, ...sectionsData]
    
    let filtered = allScheduleData.filter(item => {
      const matchesGroup = item.group === groupFilter
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

  // Auto-filter when scheduleView changes
  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleView])

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

  const sections = Array.from({length: 15}, (_, i) => i + 1)
  
  // Period times mapping (8 periods)
  const periods = [
    { number: 1, time: '09:00 AM - 10:00 AM', start: '09:00' },
    { number: 2, time: '10:10 AM - 11:10 AM', start: '10:10' },
    { number: 3, time: '11:20 AM - 12:20 PM', start: '11:20' },
    { number: 4, time: '12:30 PM - 01:30 PM', start: '12:30' },
    { number: 5, time: '01:40 PM - 02:40 PM', start: '01:40' },
    { number: 6, time: '02:50 PM - 03:50 PM', start: '02:50' },
    { number: 7, time: '04:00 PM - 05:00 PM', start: '04:00' },
    { number: 8, time: '05:10 PM - 06:10 PM', start: '05:10' }
  ]
  
  // Convert time string to period number
  const getPeriodFromTime = (timeStr: string): number => {
    if (!timeStr) return 0
    const startTime = timeStr.split(' - ')[0] || ''
    // Normalize time format (handle AM/PM)
    let normalizedTime = startTime.trim()
    if (normalizedTime.includes('AM') || normalizedTime.includes('PM')) {
      normalizedTime = normalizedTime.replace(' AM', '').replace(' PM', '')
    }
    
    // Match exact period start time
    for (const period of periods) {
      const periodStart = period.start.replace(':', '')
      const timeWithoutColon = normalizedTime.replace(':', '')
      
      // Check if time matches period start (with some tolerance)
      if (normalizedTime.startsWith(period.start.substring(0, 4)) || 
          timeWithoutColon.startsWith(periodStart.substring(0, 4))) {
        return period.number
      }
    }
    
    return 0
  }
  
  // View mode state: 'list' or 'matrix'
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')
  
  // Build matrix schedule for a specific day
  const buildMatrixSchedule = (day: string): { [section: number]: { [period: number]: any } } => {
    const groupFilter = scheduleView === 'A' ? 'Group 1' : 'Group 2'
    const allScheduleData = [...scheduleData, ...sectionsData]
    const dayData = allScheduleData.filter(item => 
      item.day === day && 
      item.group === groupFilter &&
      (!selectedSection || item.sectionNumber === parseInt(selectedSection))
    )
    
    // Create matrix: [section][period] = schedule item
    const matrix: { [section: number]: { [period: number]: any } } = {}
    
    // Initialize all sections
    for (let i = 1; i <= 15; i++) {
      matrix[i] = {}
    }
    
    // Fill matrix with data
    dayData.forEach(item => {
      if (item.sectionNumber) {
        const period = getPeriodFromTime(item.time)
        const sectionNum = item.sectionNumber
        if (period > 0 && matrix[sectionNum]) {
          matrix[sectionNum][period] = item
        }
      }
    })
    
    // Add lectures (which don't have sectionNumber, but apply to all sections in the group)
    const groupSections = scheduleView === 'A' ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12, 13, 14, 15]
    dayData.forEach(item => {
      if (!item.sectionNumber && item.type === 'lecture') {
        const period = getPeriodFromTime(item.time)
        if (period > 0) {
          groupSections.forEach(section => {
            if (matrix[section] && !matrix[section][period]) {
              matrix[section][period] = { ...item, isLecture: true }
            }
          })
        }
      }
    })
    
    return matrix
  }


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

        {/* Schedule View Toggle - Group A or B */}
        <div className="mb-6 animate-slide-up">
          <div className="enhanced-card p-6">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold text-dark-100 text-center">
                Select Schedule View
              </h2>
              
              {/* Toggle Switch */}
              <div className="flex items-center gap-4">
                <span className={`text-lg font-semibold transition-colors ${scheduleView === 'A' ? 'text-cyber-neon' : 'text-dark-400'}`}>
                  Group A
                </span>
                
                <button
                  onClick={() => setScheduleView(scheduleView === 'A' ? 'B' : 'A')}
                  className={`relative w-20 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:ring-offset-2 focus:ring-offset-cyber-dark ${
                    scheduleView === 'A' 
                      ? 'bg-gradient-to-r from-cyber-neon to-cyber-green' 
                      : 'bg-gradient-to-r from-cyber-violet to-cyber-blue'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 ${
                      scheduleView === 'A' ? 'translate-x-0' : 'translate-x-10'
                    }`}
                  />
                </button>
                
                <span className={`text-lg font-semibold transition-colors ${scheduleView === 'B' ? 'text-cyber-violet' : 'text-dark-400'}`}>
                  Group B
                </span>
              </div>

              <p className="text-sm text-dark-400 text-center">
                Currently viewing: <span className="text-cyber-neon font-semibold">Group {scheduleView}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="mb-8 animate-slide-up">
          <div className="enhanced-card p-6">
            <h2 className="text-xl font-semibold text-dark-100 mb-4 text-center">
              Filter by Section Number (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Section Number
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="">All Sections</option>
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
                  Filter
                </button>
              </div>
                </div>

            {validationError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-2xl mx-auto">
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

        {/* View Mode Toggle */}
        <div className="mb-6 animate-slide-up">
          <div className="enhanced-card p-4">
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${viewMode === 'list' ? 'text-cyber-neon' : 'text-dark-400'}`}>
                List View
              </span>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'matrix' : 'list')}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon ${
                  viewMode === 'matrix'
                    ? 'bg-gradient-to-r from-cyber-neon to-cyber-green'
                    : 'bg-cyber-dark border border-cyber-neon/30'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-lg transform transition-transform duration-300 ${
                    viewMode === 'matrix' ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${viewMode === 'matrix' ? 'text-cyber-neon' : 'text-dark-400'}`}>
                Matrix View
              </span>
            </div>
                </div>
              </div>

        {/* Matrix Schedule View */}
        {viewMode === 'matrix' && (
          <div className="space-y-6 mb-8">
            {(() => {
              const dayOrder = ['Saturday', 'Monday', 'Tuesday', 'Wednesday']
              const holidayDays = ['Sunday', 'Thursday', 'Friday']
              
              return dayOrder.map(day => {
                const isHoliday = holidayDays.includes(day)
                const matrix = buildMatrixSchedule(day)
                const groupSections = scheduleView === 'A' ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12, 13, 14, 15]
                const sectionsToShow = selectedSection ? [parseInt(selectedSection)] : groupSections
                
                return (
                  <div key={day} className="enhanced-card overflow-hidden">
                    <div className={`px-6 py-4 border-b ${
                      isHoliday 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                        : 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border-cyber-neon/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${isHoliday ? 'text-yellow-400' : 'text-cyber-neon'}`} />
                        <h3 className="text-xl font-bold text-dark-100">{day}</h3>
                        {isHoliday && (
                          <span className="ml-auto text-sm text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                            🎉 Holiday
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isHoliday ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h4 className="text-2xl font-semibold text-dark-200 mb-2">Holiday</h4>
                        <p className="text-dark-400">No classes scheduled for this day.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto p-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 bg-cyber-dark/70 text-cyber-neon font-bold text-sm border-2 border-cyber-neon/30 sticky left-0 z-10 shadow-lg">
                                Section
                              </th>
                              {periods.map(period => (
                                <th key={period.number} className="px-3 py-3 bg-cyber-dark/70 text-cyber-neon font-semibold text-xs border-2 border-cyber-neon/30 min-w-[120px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-bold text-base">P{period.number}</span>
                                    <span className="text-[11px] opacity-90 font-mono">{period.start}</span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sectionsToShow.map(sectionNum => (
                              <tr key={sectionNum} className="hover:bg-cyber-neon/5 transition-colors">
                                <td className="px-4 py-3 bg-cyber-dark/50 text-cyber-neon font-bold text-base border-2 border-cyber-neon/30 sticky left-0 z-10 shadow-lg">
                                  <span className="px-3 py-1.5 bg-cyber-neon/30 rounded-lg font-extrabold">S{sectionNum}</span>
                                </td>
                                {periods.map(period => {
                                  const cellData = matrix[sectionNum] && matrix[sectionNum][period.number]
                                  return (
                                    <td key={period.number} className="px-2 py-2 border border-dark-200/20 align-middle min-w-[120px] h-20">
                                      {cellData ? (
                                        <div 
                                          className={`p-2 rounded-lg text-xs cursor-pointer hover:scale-105 transition-transform ${
                                            cellData.isLecture || !cellData.sectionNumber
                                              ? 'bg-gradient-to-br from-cyber-violet/30 to-cyber-violet/10 border-2 border-cyber-violet/50'
                                              : 'bg-gradient-to-br from-cyber-green/30 to-cyber-green/10 border-2 border-cyber-green/50'
                                          }`}
                                          title={`${cellData.title} - ${cellData.instructor} - ${cellData.location}`}
                                        >
                                          <div className="font-bold text-dark-100 mb-1 text-sm">{cellData.title}</div>
                                          <div className="text-dark-300 text-[10px] opacity-80">{cellData.instructor.split(' ').slice(-2).join(' ')}</div>
                                          <div className="mt-1.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                              cellData.isLecture || !cellData.sectionNumber
                                                ? 'bg-cyber-violet/40 text-cyber-violet'
                                                : 'bg-cyber-green/40 text-cyber-green'
                                            }`}>
                                              {cellData.isLecture || !cellData.sectionNumber ? '📚 Lecture' : '🔬 Lab'}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-2 text-center text-dark-500/20 text-xs">—</div>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        )}

        {/* List Schedule View - Original */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {(() => {
              // Filter by selected group from toggle
              const groupFilter = scheduleView === 'A' ? 'Group 1' : 'Group 2'
              const allScheduleData = [...scheduleData, ...sectionsData]
              const scheduleToShow = filteredSchedule.length > 0 
                ? filteredSchedule.filter(item => item.group === groupFilter)
                : allScheduleData.filter(item => item.group === groupFilter)
              
              const groupedByDay = groupByDay(scheduleToShow)
              const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
              const holidayDays = ['Sunday', 'Thursday', 'Friday']
              
              return dayOrder.map(day => {
                const dayLectures = groupedByDay[day] || []
                const isHoliday = holidayDays.includes(day)
                
                return (
                  <div key={day} className="enhanced-card overflow-hidden">
                    {/* Day Header */}
                    <div className={`px-6 py-4 border-b ${
                      isHoliday 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                        : 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border-cyber-neon/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${isHoliday ? 'text-yellow-400' : 'text-cyber-neon'}`} />
                        <h3 className="text-xl font-bold text-dark-100">{day}</h3>
                        {isHoliday ? (
                          <span className="ml-auto text-sm text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                            🎉 Holiday
                          </span>
                        ) : (
                          <span className="ml-auto text-sm text-dark-300 bg-cyber-dark/50 px-3 py-1 rounded-full">
                            {dayLectures.length} {dayLectures.length === 1 ? 'Class' : 'Classes'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Day Content */}
                    {isHoliday ? (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h4 className="text-2xl font-semibold text-dark-200 mb-2">Holiday</h4>
                        <p className="text-dark-400">No lectures scheduled for this day.</p>
                      </div>
                    ) : dayLectures.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-cyber-dark/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Time</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Subject</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Instructor</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Location</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Type</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">Section</th>
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
                                  {item.sectionNumber && (
                                    <span className="ml-2 text-xs text-cyber-neon font-normal">
                                      (Section {item.sectionNumber})
                                    </span>
                                  )}
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
                                  {item.sectionNumber ? (
                                    <span className="px-2 py-1 bg-cyber-green/20 text-cyber-green rounded text-xs font-medium">
                                      Section {item.sectionNumber}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-cyber-neon/10 text-cyber-neon rounded text-xs font-medium">
                                      {item.group === 'Group 1' ? 'A' : item.group === 'Group 2' ? 'B' : item.group}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-dark-400">No lectures scheduled for this day.</p>
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        )}

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
