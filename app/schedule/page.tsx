'use client'

import { Calendar, Clock, MapPin, User, Search, BookOpen } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'

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
    { id: 's4-5', title: 'DataBase', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Wednesday' },
    
    // Section 5
    { id: 's5-1', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
    { id: 's5-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
    { id: 's5-3', title: 'IT', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Tuesday' },
    { id: 's5-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Wednesday' },
    
    // Section 6
    { id: 's6-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-2', title: 'DataBase', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-3', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
    { id: 's6-4', title: 'IS', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Wednesday' },
    
    // Section 7
    { id: 's7-1', title: 'Mathematics', time: '12:30 PM - 01:30 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Saturday' },
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
    { id: 's10-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
    
    // Section 11
    { id: 's11-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Saturday' },
    { id: 's11-2', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
    { id: 's11-3', title: 'Data Base', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
    { id: 's11-4', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Tuesday' },
    { id: 's11-5', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 102', instructor: 'Eng Dina Ali', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Wednesday' },
    
    // Section 12
    { id: 's12-1', title: 'Data Base', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
    { id: 's12-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Tuesday' },
    { id: 's12-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Wednesday' },
    
    // Section 13
    { id: 's13-1', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
    { id: 's13-2', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
    { id: 's13-3', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Tuesday' },
    { id: 's13-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Wednesday' },
    
    // Section 14
    { id: 's14-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
    { id: 's14-2', title: 'Data Base', time: '05:10 PM - 06:10 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
    { id: 's14-3', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
    { id: 's14-4', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
    
    // Section 15
    { id: 's15-1', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Monday' },
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

  const sections = Array.from({length: 15}, (_, i) => i + 1);
  
  // Period times mapping (8 periods) - defined first as it's used in other computations
  const periods = useMemo(() => [
    { number: 1, time: '09:00 AM - 10:00 AM', start: '09:00' },
    { number: 2, time: '10:10 AM - 11:10 AM', start: '10:10' },
    { number: 3, time: '11:20 AM - 12:20 PM', start: '11:20' },
    { number: 4, time: '12:30 PM - 01:30 PM', start: '12:30' },
    { number: 5, time: '01:40 PM - 02:40 PM', start: '01:40' },
    { number: 6, time: '02:50 PM - 03:50 PM', start: '02:50' },
    { number: 7, time: '04:00 PM - 05:00 PM', start: '04:00' },
    { number: 8, time: '05:10 PM - 06:10 PM', start: '05:10' }
  ], []);
  
  const periodIndexMap = useMemo(() => {
    return periods.reduce<Record<number, number>>((acc, period, index) => {
      acc[period.number] = index
      return acc
    }, {});
  }, [periods]);

  // Convert time string to period number
  const getPeriodFromTime = useCallback((timeStr: string): number => {
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
  }, [periods]);
  
  // View mode state: 'list' or 'matrix'
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  
  // Matrix view options
  const [showLecturesInMatrix, setShowLecturesInMatrix] = useState(true);
  const [showEmptyPeriods, setShowEmptyPeriods] = useState(true);

  const allScheduleData = useMemo(() => [...scheduleData, ...sectionsData], [scheduleData, sectionsData]);
  const baseSchedule = useMemo(() => filteredSchedule.length > 0 ? filteredSchedule : allScheduleData, [filteredSchedule, allScheduleData]);

  // Compute derived values
  const groupFilter = useMemo(() => {
    return scheduleView === 'A' ? 'Group 1' : 'Group 2';
  }, [scheduleView]);
  
  const scheduleForCurrentGroup = useMemo(() => {
    return baseSchedule.filter(item => item.group === groupFilter);
  }, [baseSchedule, groupFilter]);
  
  const groupSectionsList: number[] = scheduleView === 'A' 
    ? [1, 2, 3, 4, 5, 6, 7] 
    : [8, 9, 10, 11, 12, 13, 14, 15];

  const handleSearch = () => {
    // Filter by selected group (A or B) from toggle
    
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
    
    let filtered = allScheduleData.filter(item => {
      const matchesGroup = item.group === groupFilter
      // If section is selected: show that section's labs AND all group lectures
      // If no section selected: show all sections and lectures
      if (selectedSection) {
        // Include: labs for the selected section OR lectures (no sectionNumber)
        return matchesGroup && (item.sectionNumber === parseInt(selectedSection) || !item.sectionNumber)
      } else {
        // Include: all items in the group
        return matchesGroup
      }
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

  // Auto-filter when scheduleView or selectedSection changes
  useEffect(() => {
    if (selectedSection) {
      handleSearch()
    } else {
      // If no section selected, clear filtered schedule to show all
      setFilteredSchedule([])
      setValidationError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleView, selectedSection])

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
                  className={`relative w-20 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:ring-offset-2 focus:ring-offset-cyber-dark switch-track switch-track--compact ${
                    scheduleView === 'A' ? 'switch-track--active' : 'switch-track--inactive'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
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
                  onClick={() => {
                    if (selectedSection) {
                      handleSearch()
                    } else {
                      setFilteredSchedule([])
                      setValidationError('')
                    }
                  }}
                  className="w-full bg-gradient-to-r from-cyber-neon to-cyber-green hover:from-cyber-green hover:to-cyber-neon text-dark-100 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  {selectedSection ? 'Filter' : 'Clear'}
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
                className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon switch-track switch-track--compact ${
                  viewMode === 'matrix' ? 'switch-track--active' : 'switch-track--inactive'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
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

        {/* Matrix View Options */}
        {viewMode === 'matrix' && (
          <div className="mb-6 animate-slide-up">
            <div className="enhanced-card p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h3 className="text-lg font-semibold text-dark-100">Matrix View Options</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showLecturesInMatrix}
                        onChange={(e) => setShowLecturesInMatrix(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 transition-all ${
                        showLecturesInMatrix 
                          ? 'bg-cyber-neon border-cyber-neon' 
                          : 'bg-cyber-dark border-cyber-neon/30'
                      } flex items-center justify-center`}>
                        {showLecturesInMatrix && (
                          <svg className="w-3 h-3 text-cyber-dark" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-dark-300">Show Lectures</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showEmptyPeriods}
                        onChange={(e) => setShowEmptyPeriods(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 transition-all ${
                        showEmptyPeriods 
                          ? 'bg-cyber-neon border-cyber-neon' 
                          : 'bg-cyber-dark border-cyber-neon/30'
                      } flex items-center justify-center`}>
                        {showEmptyPeriods && (
                          <svg className="w-3 h-3 text-cyber-dark" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-dark-300">Show Empty Periods</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matrix Schedule View */}
        {viewMode === 'matrix' && (
          <div className="space-y-6 mb-8">
            {(() => {
              const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
              const holidayDays = ['Sunday', 'Thursday', 'Friday']
              
              return (
                <>
                  {dayOrder.map(day => {
                const isHoliday = holidayDays.includes(day)
                const dayEntries = scheduleForCurrentGroup.filter(item => item.day === day)
                const lectures = dayEntries.filter(item => !item.sectionNumber)
                const labs = dayEntries.filter(item => item.sectionNumber)
                
                let sectionsToShow = selectedSection
                  ? [parseInt(selectedSection, 10)].filter(num => !Number.isNaN(num))
                  : groupSectionsList
                
                if (sectionsToShow.length === 0) {
                  sectionsToShow = groupSectionsList
                }
                
                const rows = sectionsToShow.map(sectionNum => {
                  const cells = periods.map(period => {
                    const match = labs.find(item => 
                      item.sectionNumber === sectionNum && getPeriodFromTime(item.time) === period.number
                    )
                    return match || null
                  })
                  return { sectionNum, cells }
                })
                
                const lectureRow = showLecturesInMatrix
                  ? periods.map(period => {
                      const match = lectures.find(item => getPeriodFromTime(item.time) === period.number)
                      return match || null
                    })
                  : null

                const periodHasContent = (index: number) => {
                  if (index === undefined || index < 0) return false
                  const lectureHas = lectureRow ? lectureRow[index] : null
                  if (lectureHas) return true
                  return rows.some(row => row.cells[index])
                }

                const filteredPeriods = showEmptyPeriods
                  ? periods
                  : periods.filter(period => {
                      const index = periodIndexMap[period.number]
                      return index !== undefined && periodHasContent(index)
                    })
                
                const hasContent = (lectureRow && lectureRow.some(Boolean)) ||
                  rows.some(row => row.cells.some(Boolean))
                
                return (
                  <div key={day} className="enhanced-card overflow-hidden">
                    <div className={`px-4 sm:px-6 py-4 border-b ${
                      isHoliday 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                        : 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border-cyber-neon/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${isHoliday ? 'text-yellow-400' : 'text-cyber-neon'}`} />
                        <h3 className="text-lg sm:text-xl font-bold text-dark-100">{day}</h3>
                        {isHoliday && (
                          <span className="ml-auto text-sm text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                            🎉 Holiday
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isHoliday ? (
                      <div className="p-8 sm:p-12 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h4 className="text-2xl font-semibold text-dark-200 mb-2">Holiday</h4>
                        <p className="text-dark-400">No classes scheduled for this day.</p>
                      </div>
                    ) : !hasContent && !showEmptyPeriods ? (
                      <div className="p-8 text-center text-dark-300">
                        <p className="text-lg font-semibold text-dark-100 mb-2">لا توجد حصص معروضة في هذا اليوم.</p>
                        <p className="text-sm text-dark-400">
                          تأكد من اختيار القسم الصحيح أو فعّل خيار إظهار الفترات الفارغة/المحاضرات لعرض كل التفاصيل.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Matrix View */}
                        <div className="hidden lg:block overflow-x-auto p-4 sm:p-6">
                          <div className="inline-block min-w-full">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="px-4 py-4 bg-gradient-to-br from-cyber-dark/95 via-cyber-dark/90 to-cyber-dark/85 text-cyber-neon font-bold text-sm border-2 border-cyber-neon/50 sticky left-0 z-20 shadow-2xl backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></div>
                                      <span className="text-cyber-neon tracking-wide">SECTION</span>
                                    </div>
                                  </th>
                                  {filteredPeriods.map(period => (
                                    <th key={period.number} className="px-3 py-4 bg-gradient-to-br from-cyber-dark/95 via-cyber-dark/90 to-cyber-dark/85 text-cyber-neon font-semibold text-xs border-2 border-cyber-neon/50 min-w-[160px] relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-neon/5 to-transparent animate-shimmer"></div>
                                      <div className="flex flex-col items-center gap-1.5 relative z-10">
                                        <span className="font-bold text-base bg-gradient-to-r from-cyber-neon to-cyber-green bg-clip-text text-transparent">P{period.number}</span>
                                        <span className="text-[11px] opacity-90 font-mono text-cyber-neon/80">{period.start}</span>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {lectureRow && lectureRow.some(cell => cell) && (
                                  <tr className="bg-cyber-dark/40 border-b border-cyber-neon/20">
                                    <td className="px-4 py-4 text-cyber-neon font-semibold text-sm sticky left-0 bg-cyber-dark/40">
                                      Group {scheduleView} Lecture
                                    </td>
                                    {filteredPeriods.map(period => {
                                      const idx = periodIndexMap[period.number]
                                      const cellData = idx !== undefined && lectureRow ? lectureRow[idx] : null
                                      if (!cellData && !showEmptyPeriods) {
                                        return (
                                          <td key={`lecture-empty-${period.number}`} className="px-2 py-2 border border-dark-200/25 min-w-[160px] h-24 bg-cyber-dark/20"></td>
                                        )
                                      }
                                      
                                      if (!cellData) {
                                        return (
                                          <td key={`lecture-empty-${period.number}`} className="px-2 py-2 border border-dark-200/25 min-w-[160px] h-24 bg-cyber-dark/20">
                                            <div className="text-center text-dark-500/20 text-xs">—</div>
                                          </td>
                                        )
                                      }
                                      
                                      return (
                                        <td key={`lecture-${period.number}`} className="px-2 py-2.5 border border-dark-200/30 min-w-[160px] h-28">
                                          <div className="h-full p-3 rounded-xl bg-gradient-to-br from-cyber-violet/35 to-cyber-violet/20 border border-cyber-violet/50 text-xs text-dark-100">
                                            <div className="font-semibold text-sm mb-1">{cellData.title || cellData.subject}</div>
                                            <div className="text-[11px] text-dark-300 flex items-center gap-1">
                                              <Clock className="w-3 h-3 text-cyber-neon" />
                                              <span>{cellData.time}</span>
                                            </div>
                                            <div className="text-[11px] text-dark-300 flex items-center gap-1">
                                              <MapPin className="w-3 h-3 text-cyber-green" />
                                              <span>{cellData.location || cellData.room}</span>
                                            </div>
                                          </div>
                                        </td>
                                      )
                                    })}
                                  </tr>
                                )}

                                {rows.map(row => (
                                  <tr key={row.sectionNum} className="hover:bg-cyber-neon/5 transition-all duration-300 group">
                                    <td className="px-4 py-4 bg-gradient-to-r from-cyber-dark/70 via-cyber-dark/60 to-cyber-dark/50 text-cyber-neon font-bold text-base border-2 border-cyber-neon/50 sticky left-0 z-10 shadow-2xl backdrop-blur-md group-hover:from-cyber-neon/25 group-hover:via-cyber-neon/20 group-hover:to-cyber-neon/15 transition-all duration-300">
                                      <span className="px-4 py-2 bg-gradient-to-r from-cyber-neon/50 via-cyber-neon/40 to-cyber-neon/30 rounded-lg font-extrabold text-sm shadow-lg shadow-cyber-neon/20 hover:shadow-xl hover:shadow-cyber-neon/30 transition-all duration-300 inline-block">
                                        S{row.sectionNum}
                                      </span>
                                    </td>
                                    {filteredPeriods.map(period => {
                                      const idx = periodIndexMap[period.number]
                                      const cellData = idx !== undefined ? row.cells[idx] : null
                                      if (!cellData && !showEmptyPeriods) {
                                        return (
                                          <td key={`${row.sectionNum}-${period.number}`} className="px-2 py-2 border border-dark-200/25 min-w-[160px] h-28 bg-cyber-dark/15"></td>
                                        )
                                      }
                                      
                                      if (!cellData) {
                                        return (
                                          <td key={`${row.sectionNum}-${period.number}`} className="px-2 py-2 border border-dark-200/25 min-w-[160px] h-28 bg-gradient-to-br from-cyber-dark/30 to-cyber-dark/20 group/empty hover:from-cyber-dark/40 hover:to-cyber-dark/30 transition-all duration-300">
                                            {showEmptyPeriods && (
                                              <div className="p-2 text-center text-dark-500/15 text-xs font-light">—</div>
                                            )}
                                          </td>
                                        )
                                      }
                                      
                                      return (
                                        <td key={`${row.sectionNum}-${period.number}`} className="px-2 py-2.5 border border-dark-200/30 min-w-[160px] h-32">
                                          <div 
                                            className={`h-full p-2.5 rounded-xl text-xs cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group/cell ${
                                              cellData.type === 'lecture'
                                                ? 'bg-gradient-to-br from-cyber-violet/50 via-cyber-violet/35 to-cyber-violet/25 border-2 border-cyber-violet/70 hover:border-cyber-violet hover:shadow-cyber-violet/30'
                                                : 'bg-gradient-to-br from-cyber-green/50 via-cyber-green/35 to-cyber-green/25 border-2 border-cyber-green/70 hover:border-cyber-green hover:shadow-cyber-green/30'
                                            }`}
                                            title={`${cellData.title || cellData.subject} | ${cellData.instructor} | ${cellData.location || cellData.room} | ${cellData.time}`}
                                          >
                                            {/* Animated background shimmer */}
                                            <div className={`absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-500 ${
                                              cellData.type === 'lecture'
                                                ? 'bg-gradient-to-r from-transparent via-cyber-violet/20 to-transparent' 
                                                : 'bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent'
                                            } animate-shimmer`}></div>
                                            
                                            <div className="relative z-10 space-y-1.5">
                                              {/* 1. المادة (Subject) */}
                                              <div className="font-bold text-dark-100 text-sm leading-tight line-clamp-1 group-hover/cell:text-cyber-neon transition-colors duration-300">
                                                {cellData.title || cellData.subject}
                </div>
                
                                              {/* 2. صاحب المادة (Instructor) */}
                                              <div className="text-dark-300 text-[10px] opacity-90 flex items-center gap-1 truncate">
                                                <User className="w-3 h-3 text-cyber-neon/60 flex-shrink-0" />
                                                <span className="truncate">{cellData.instructor}</span>
                </div>

                                              {/* 3. الموعد (Time) */}
                                              <div className="flex items-center gap-1 text-[9px] text-dark-300">
                                                <Clock className="w-3 h-3 text-cyber-neon/70 flex-shrink-0" />
                                                <span className="font-medium">{cellData.time}</span>
                </div>

                                              {/* 4. مكان الحضور (Location) & Type */}
                                              <div className="flex items-center justify-between gap-2 pt-0.5">
                                                {(cellData.location || cellData.room) && (
                                                  <div className="flex items-center gap-1 text-[9px] text-dark-300 truncate flex-1">
                                                    <MapPin className="w-3 h-3 text-cyber-green/70 flex-shrink-0" />
                                                    <span className="truncate">{cellData.location || cellData.room}</span>
                                                  </div>
                                                )}
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold shadow-md flex-shrink-0 ${
                                                  cellData.type === 'lecture'
                                                    ? 'bg-gradient-to-r from-cyber-violet/60 to-cyber-violet/50 text-white border border-cyber-violet/40'
                                                    : 'bg-gradient-to-r from-cyber-green/60 to-cyber-green/50 text-white border border-cyber-green/40'
                                                }`}>
                                                  {cellData.type === 'lecture' ? '📚' : '🔬'}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      )
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                </div>
              </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden p-4 space-y-3">
                          {lectureRow && lectureRow.some(cell => cell) && (
                            <div className="enhanced-card p-4">
                              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-cyber-neon/20">
                                <span className="px-3 py-1.5 bg-cyber-violet/20 text-cyber-violet rounded-lg text-sm font-semibold">
                                  Group {scheduleView} Lectures
                                </span>
                              </div>
                              <div className="space-y-2">
                                {lectureRow.map((cellData, idx) => {
                                  if (!cellData) return null
                                  return (
                                    <div key={`mobile-lecture-${idx}`} className="p-4 rounded-lg border-2 border-cyber-violet/40 bg-gradient-to-r from-cyber-violet/30 to-cyber-violet/20">
                                      <div className="font-bold text-dark-100 mb-2">{cellData.title || cellData.subject}</div>
                                      <div className="text-sm text-dark-300 flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-cyber-neon" />
                                        <span>{cellData.time}</span>
                                      </div>
                                      <div className="text-sm text-dark-300 flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-cyber-green" />
                                        <span>{cellData.location || cellData.room}</span>
                                      </div>
                                      <div className="text-sm text-dark-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-cyber-neon/80" />
                                        <span>{cellData.instructor}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {rows.map(row => {
                            const rowHasEntries = filteredPeriods.some(period => {
                              const idx = periodIndexMap[period.number]
                              return idx !== undefined && row.cells[idx]
                            })
                            
                            return (
                              <div key={`mobile-section-${row.sectionNum}`} className="enhanced-card p-4">
                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-cyber-neon/20">
                                  <span className="px-3 py-1.5 bg-gradient-to-r from-cyber-neon/40 to-cyber-neon/30 rounded-lg font-bold text-sm text-cyber-neon">
                                    Section {row.sectionNum}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {!rowHasEntries && showEmptyPeriods && (
                                    <div className="p-4 rounded-lg border-2 border-dark-200/20 bg-cyber-dark/30 text-center text-dark-400 text-sm">
                                      No classes scheduled for this section in this day.
                                    </div>
                                  )}
                                  {filteredPeriods.map(period => {
                                    const idx = periodIndexMap[period.number]
                                    const cellData = idx !== undefined ? row.cells[idx] : null
                                    
                                    if (!cellData) {
                                      if (!showEmptyPeriods) return null
                                      return (
                                        <div key={`mobile-empty-${row.sectionNum}-${period.number}`} className="p-3 rounded-lg border border-dark-200/15 text-center text-dark-500/40 text-sm">
                                          — No class in this period —
                                        </div>
                                      )
                                    }
                                    
                                    return (
                                      <div
                                        key={`mobile-cell-${row.sectionNum}-${period.number}`}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                          cellData.type === 'lecture'
                                            ? 'bg-gradient-to-r from-cyber-violet/30 to-cyber-violet/20 border-cyber-violet/50'
                                            : 'bg-gradient-to-r from-cyber-green/30 to-cyber-green/20 border-cyber-green/50'
                                        }`}
                                      >
                                        <div className="font-bold text-dark-100 text-base mb-2">
                                          {cellData.title || cellData.subject}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2 text-sm text-dark-300">
                                          <User className="w-4 h-4 text-cyber-neon/70" />
                                          <span>{cellData.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2 text-sm text-dark-300">
                                          <Clock className="w-4 h-4 text-cyber-neon" />
                                          <span>{cellData.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2 text-sm text-dark-300">
                                          <MapPin className="w-4 h-4 text-cyber-green" />
                                          <span>{cellData.location || cellData.room}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                          <span className="px-2 py-1 rounded-full bg-cyber-dark/40 text-cyber-neon">
                                            Period {period.number}
                                          </span>
                                          <span className={`px-3 py-1 rounded-full ${
                                            cellData.type === 'lecture'
                                              ? 'bg-cyber-violet/30 text-cyber-violet'
                                              : 'bg-cyber-green/30 text-cyber-green'
                                          }`}>
                                            {cellData.type === 'lecture' ? '📚 Lecture' : '🔬 Lab'}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </>
          )
        })()}
          </div>
        )}

        {/* List Schedule View - Original */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {(() => {
              const scheduleToShow = scheduleForCurrentGroup
              
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
                      <div>
                        {/* Lectures - Stacked Cards */}
                        {(() => {
                          // Filter and sort lectures by time
                          const lectures = dayLectures
                            .filter(item => item.type === 'lecture')
                            .sort((a, b) => {
                              const periodA = getPeriodFromTime(a.time)
                              const periodB = getPeriodFromTime(b.time)
                              return periodA - periodB // Sort by period ascending
                            })
                          
                          // Filter and sort labs: first by section number ascending, then by time
                          const labs = dayLectures
                            .filter(item => item.type !== 'lecture')
                            .sort((a, b) => {
                              // First sort by section number (ascending)
                              const sectionA = a.sectionNumber || 0
                              const sectionB = b.sectionNumber || 0
                              if (sectionA !== sectionB) {
                                return sectionA - sectionB
                              }
                              // If same section, sort by time (period)
                              const periodA = getPeriodFromTime(a.time)
                              const periodB = getPeriodFromTime(b.time)
                              return periodA - periodB
                            })
                          
                          return (
                            <>
                              {lectures.length > 0 && (
                                <div className="overflow-hidden rounded-lg">
                                  {lectures.map((item, index) => (
                                    <div
                                      key={item.id || `lecture-${index}`}
                                      className={`px-6 py-5 bg-gradient-to-r from-cyber-violet/30 to-cyber-violet/20 border-l-4 border-cyber-violet hover:from-cyber-violet/40 hover:to-cyber-violet/30 transition-all ${
                                        index < lectures.length - 1 ? 'border-b border-cyber-violet/20' : ''
                                      }`}
                                    >
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                          {/* 1. المادة (Subject) */}
                                          <h4 className="text-lg font-bold text-dark-100">{item.title || item.subject}</h4>
                                          {/* 2. صاحب المادة (Instructor) */}
                                          <div className="flex items-center gap-2 text-sm text-dark-300">
                                            <User className="w-4 h-4 text-cyber-neon/70" />
                                            <span>{item.instructor}</span>
                                          </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                          {/* 3. الموعد (Time) */}
                                          <div className="flex items-center gap-2 text-sm text-dark-300 bg-cyber-dark/30 px-3 py-2 rounded-lg">
                                            <Clock className="w-4 h-4 text-cyber-neon" />
                                            <span className="font-medium">{item.time}</span>
                                          </div>
                                          {/* 4. مكان الحضور (Location) */}
                                          <div className="flex items-center gap-2 text-sm text-dark-300 bg-cyber-dark/30 px-3 py-2 rounded-lg">
                                            <MapPin className="w-4 h-4 text-cyber-green" />
                                            <span>{item.location || item.room}</span>
                                          </div>
                                          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-cyber-violet/40 text-cyber-violet flex items-center gap-1.5">
                                            <BookOpen className="w-3 h-3" />
                                            Lecture
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Labs - Table Format */}
                              {labs.length > 0 && (
                                <div className={`${lectures.length > 0 ? 'mt-6 pt-6 border-t border-cyber-neon/20' : ''} overflow-x-auto`}>
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
                                      {labs.map((item, index) => (
                                        <tr 
                                          key={item.id || index} 
                                          className={`hover:bg-cyber-neon/5 transition-colors ${
                                            index < labs.length - 1 ? 'border-b border-dark-200/10' : ''
                                          }`}
                                        >
                                          <td className="px-6 py-4 text-dark-300">
                                            <div className="flex items-center gap-2">
                                              <Clock className="w-4 h-4 text-cyber-neon" />
                                              <span className="font-medium">{item.time}</span>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 text-dark-100 font-semibold">
                                            {item.title || item.subject}
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
                                              <span>{item.location || item.room}</span>
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
                              )}
                              
                              {lectures.length === 0 && labs.length === 0 && (
                                <div className="p-8 text-center">
                                  <p className="text-dark-400">No classes scheduled for this day.</p>
                                </div>
                              )}
                            </>
                          )
                        })()}
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
