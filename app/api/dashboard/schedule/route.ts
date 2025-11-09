import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 300 // Cache for 5 minutes (schedule doesn't change often)

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('section_number, group_name')
      .eq('id', payload.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get today's date
    const today = new Date()
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })

    // Get schedule data (from static data - same as home page)
    // In production, this would come from database
    const scheduleData = [
      // Group 1 Lectures
      { time: '09:00 AM - 10:00 AM', subject: 'Information Systems', instructor: 'Dr. Hind Ziada', room: 'Hall G 205', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Monday' },
      { time: '04:00 PM - 05:00 PM', subject: 'Information Technology', instructor: 'Dr. Shaima Ahmed', room: 'Auditorium A', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Monday' },
      { time: '09:00 AM - 10:00 AM', subject: 'Entrepreneurship and Creative Thinking Skills', instructor: 'Dr. Abeer Hassan', room: 'Auditorium A', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
      { time: '11:20 AM - 12:20 PM', subject: 'Database Systems', instructor: 'Dr. Abeer Hassan', room: 'Auditorium A', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
      { time: '01:40 PM - 02:40 PM', subject: 'Mathematics', instructor: 'Dr. Simon Ezzat', room: 'Auditorium A', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
      { time: '04:00 PM - 05:00 PM', subject: 'Applied Physics', instructor: 'Dr. Ahmed Bakr', room: 'Auditorium A', type: 'Lecture', group: 'Group 1', sectionNumber: null, day: 'Wednesday' },
      
      // Group 2 Lectures
      { time: '10:10 AM - 11:10 AM', subject: 'Information Systems', instructor: 'Dr. Hind Ziada', room: 'Hall G 205', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Monday' },
      { time: '02:50 PM - 03:50 PM', subject: 'Information Technology', instructor: 'Dr. Shaima Ahmed', room: 'Auditorium A', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Monday' },
      { time: '10:10 AM - 11:10 AM', subject: 'Entrepreneurship and Creative Thinking Skills', instructor: 'Dr. Abeer Hassan', room: 'Auditorium A', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
      { time: '12:30 PM - 01:30 PM', subject: 'Database Systems', instructor: 'Dr. Abeer Hassan', room: 'Auditorium A', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
      { time: '02:50 PM - 03:50 PM', subject: 'Mathematics', instructor: 'Dr. Simon Ezzat', room: 'Auditorium A', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
      { time: '05:10 PM - 06:10 PM', subject: 'Applied Physics', instructor: 'Dr. Ahmed Bakr', room: 'Auditorium A', type: 'Lecture', group: 'Group 2', sectionNumber: null, day: 'Wednesday' },
    ]

    // Filter schedule for today and user's section/group
    const filteredSchedule = scheduleData.filter(item => {
      const matchesDay = item.day === dayName
      const matchesGroup = item.group === user.group_name
      const matchesSection = item.sectionNumber === null || item.sectionNumber === user.section_number
      
      return matchesDay && matchesGroup && matchesSection
    })

    // Sort by time
    const sortedSchedule = filteredSchedule.sort((a, b) => {
      const timeA = a.time.split(' - ')[0] || ''
      const timeB = b.time.split(' - ')[0] || ''
      return timeA.localeCompare(timeB)
    })

    return NextResponse.json({
      success: true,
      day: dayName,
      schedule: sortedSchedule,
    })
  } catch (error) {
    console.error('Schedule error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

