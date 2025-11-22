import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { bulkImportScheduleItems } from '@/lib/db/schedule'
import { addMaterial } from '@/lib/db/materials'
import { addSoftware } from '@/lib/db/downloads'

// POST - Migrate all hardcoded data to database
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type } = body

    let migrated = 0
    let errors: string[] = []

    // Complete Schedule Data - All Sections and Lectures
    const allScheduleItems = [
      // Sections 1-7 (Group 1)
      { id: 's1-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 1, day: 'Monday' as const },
      { id: 's1-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 1, day: 'Tuesday' as const },
      { id: 's1-3', title: 'Physics', time: '09:00 AM - 10:00 AM', location: 'Hall G 203', instructor: 'Eng Ahmed Nashaat', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 1, day: 'Wednesday' as const },
      { id: 's1-4', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 1, day: 'Wednesday' as const },
      { id: 's1-5', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 1, day: 'Wednesday' as const },
      { id: 's2-1', title: 'Physics', time: '12:30 PM - 01:30 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 2, day: 'Saturday' as const },
      { id: 's2-2', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 2, day: 'Tuesday' as const },
      { id: 's2-3', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 2, day: 'Tuesday' as const },
      { id: 's2-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 2, day: 'Wednesday' as const },
      { id: 's2-5', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 2, day: 'Wednesday' as const },
      { id: 's3-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 3, day: 'Saturday' as const },
      { id: 's3-2', title: 'IT', time: '02:50 PM - 03:50 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 3, day: 'Tuesday' as const },
      { id: 's3-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 3, day: 'Tuesday' as const },
      { id: 's3-4', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 3, day: 'Wednesday' as const },
      { id: 's3-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 3, day: 'Wednesday' as const },
      { id: 's4-1', title: 'Physics', time: '02:50 PM - 03:50 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 4, day: 'Saturday' as const },
      { id: 's4-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 4, day: 'Monday' as const },
      { id: 's4-3', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 4, day: 'Monday' as const },
      { id: 's4-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 4, day: 'Wednesday' as const },
      { id: 's4-5', title: 'DataBase', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 4, day: 'Wednesday' as const },
      { id: 's5-1', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 5, day: 'Monday' as const },
      { id: 's5-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 5, day: 'Monday' as const },
      { id: 's5-3', title: 'IT', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 5, day: 'Tuesday' as const },
      { id: 's5-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 5, day: 'Wednesday' as const },
      { id: 's6-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 6, day: 'Monday' as const },
      { id: 's6-2', title: 'DataBase', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 6, day: 'Monday' as const },
      { id: 's6-3', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 6, day: 'Monday' as const },
      { id: 's6-4', title: 'IS', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 6, day: 'Wednesday' as const },
      { id: 's7-1', title: 'Mathematics', time: '12:30 PM - 01:30 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 7, day: 'Saturday' as const },
      { id: 's7-2', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 7, day: 'Monday' as const },
      { id: 's7-3', title: 'IT', time: '01:40 PM - 02:40 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 7, day: 'Monday' as const },
      { id: 's7-4', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 1' as const, sectionNumber: 7, day: 'Wednesday' as const },
      // Sections 8-15 (Group 2)
      { id: 's8-1', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 8, day: 'Saturday' as const },
      { id: 's8-2', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 8, day: 'Saturday' as const },
      { id: 's8-3', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 8, day: 'Monday' as const },
      { id: 's8-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 8, day: 'Monday' as const },
      { id: 's9-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 9, day: 'Saturday' as const },
      { id: 's9-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 9, day: 'Saturday' as const },
      { id: 's9-3', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 9, day: 'Monday' as const },
      { id: 's9-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 9, day: 'Monday' as const },
      { id: 's10-1', title: 'IT', time: '11:20 AM - 12:20 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 10, day: 'Saturday' as const },
      { id: 's10-2', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 10, day: 'Monday' as const },
      { id: 's10-3', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 10, day: 'Monday' as const },
      { id: 's10-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 10, day: 'Monday' as const },
      { id: 's11-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 11, day: 'Saturday' as const },
      { id: 's11-2', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 11, day: 'Monday' as const },
      { id: 's11-3', title: 'Data Base', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 11, day: 'Monday' as const },
      { id: 's11-4', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 11, day: 'Tuesday' as const },
      { id: 's11-5', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 102', instructor: 'Eng Dina Ali', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 11, day: 'Wednesday' as const },
      { id: 's12-1', title: 'Data Base', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 12, day: 'Monday' as const },
      { id: 's12-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 12, day: 'Monday' as const },
      { id: 's12-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 12, day: 'Monday' as const },
      { id: 's12-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 12, day: 'Tuesday' as const },
      { id: 's12-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 12, day: 'Wednesday' as const },
      { id: 's13-1', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 13, day: 'Monday' as const },
      { id: 's13-2', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 13, day: 'Monday' as const },
      { id: 's13-3', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 13, day: 'Tuesday' as const },
      { id: 's13-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 13, day: 'Wednesday' as const },
      { id: 's14-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 14, day: 'Monday' as const },
      { id: 's14-2', title: 'Data Base', time: '05:10 PM - 06:10 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 14, day: 'Monday' as const },
      { id: 's14-3', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 14, day: 'Wednesday' as const },
      { id: 's14-4', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 14, day: 'Wednesday' as const },
      { id: 's15-1', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 15, day: 'Monday' as const },
      { id: 's15-2', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 15, day: 'Tuesday' as const },
      { id: 's15-3', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 15, day: 'Wednesday' as const },
      { id: 's15-4', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab' as const, group: 'Group 2' as const, sectionNumber: 15, day: 'Wednesday' as const },
      // Lectures Group 1
      { id: 'l1-1', title: 'English', time: '11:20 AM - 12:20 PM', location: 'Hall G 205', instructor: 'Dr. Sabreen', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Saturday' as const },
      { id: 'l1-2', title: 'Information Systems', time: '09:00 AM - 10:00 AM', location: 'Hall G 205', instructor: 'Dr. Hind Ziada', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Monday' as const },
      { id: 'l1-3', title: 'Information Technology', time: '04:00 PM - 05:00 PM', location: 'Auditorium A', instructor: 'Dr. Shaima Ahmed', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Monday' as const },
      { id: 'l1-4', title: 'Entrepreneurship and Creative Thinking Skills', time: '09:00 AM - 10:00 AM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l1-5', title: 'Database Systems', time: '11:20 AM - 12:20 PM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l1-6', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Auditorium A', instructor: 'Dr. Simon Ezzat', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l1-7', title: 'Applied Physics', time: '04:00 PM - 05:00 PM', location: 'Auditorium A', instructor: 'Dr. Ahmed Bakr', type: 'lecture' as const, group: 'Group 1' as const, sectionNumber: null, day: 'Wednesday' as const },
      // Lectures Group 2
      { id: 'l2-1', title: 'English', time: '12:30 PM - 01:30 PM', location: 'Hall G 205', instructor: 'Dr. Sabreen', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Saturday' as const },
      { id: 'l2-2', title: 'Information Systems', time: '10:10 AM - 11:10 AM', location: 'Hall G 205', instructor: 'Dr. Hind Ziada', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Monday' as const },
      { id: 'l2-3', title: 'Information Technology', time: '02:50 PM - 03:50 PM', location: 'Auditorium A', instructor: 'Dr. Shaima Ahmed', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Monday' as const },
      { id: 'l2-4', title: 'Entrepreneurship and Creative Thinking Skills', time: '10:10 AM - 11:10 AM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l2-5', title: 'Database Systems', time: '12:30 PM - 01:30 PM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l2-6', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Auditorium A', instructor: 'Dr. Simon Ezzat', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Tuesday' as const },
      { id: 'l2-7', title: 'Applied Physics', time: '05:10 PM - 06:10 PM', location: 'Auditorium A', instructor: 'Dr. Ahmed Bakr', type: 'lecture' as const, group: 'Group 2' as const, sectionNumber: null, day: 'Wednesday' as const },
    ]

    // Migrate Schedule Data
    if (type === 'schedule' || type === 'all') {
      try {
        bulkImportScheduleItems(allScheduleItems)
        migrated += allScheduleItems.length
      } catch (error: any) {
        errors.push(`Schedule: ${error.message}`)
      }
    }

    // Migrate Materials Data
    if (type === 'materials' || type === 'all') {
      const materials = [
        { id: 'applied-physics', title: 'الفيزياء التطبيقية', titleEn: 'Applied Physics', description: 'مبادئ الفيزياء وتطبيقاتها في التكنولوجيا', descriptionEn: 'Principles of physics and its applications in technology', icon: 'Atom', color: 'from-blue-500 to-blue-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'mathematics', title: 'الرياضيات', titleEn: 'Mathematics', description: 'أسس الرياضيات وحل المشكلات', descriptionEn: 'Fundamentals of mathematics and problem solving', icon: 'Calculator', color: 'from-green-500 to-green-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'entrepreneurship', title: 'ريادة الأعمال والتفكير الإبداعي', titleEn: 'Entrepreneurship & Creative Thinking', description: 'الابتكار في الأعمال وحل المشكلات الإبداعي', descriptionEn: 'Business innovation and creative problem solving', icon: 'Users', color: 'from-purple-500 to-purple-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'information-technology', title: 'تكنولوجيا المعلومات', titleEn: 'Information Technology', description: 'أساسيات تكنولوجيا المعلومات والتقنيات الحديثة', descriptionEn: 'Fundamentals of information technology and modern technologies', icon: 'Globe', color: 'from-cyan-500 to-cyan-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'database-systems', title: 'قواعد البيانات', titleEn: 'Database Systems', description: 'تصميم وتنفيذ وإدارة قواعد البيانات', descriptionEn: 'Design, implementation and management of databases', icon: 'Database', color: 'from-orange-500 to-orange-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'english-language', title: 'اللغة الإنجليزية', titleEn: 'English Language', description: 'التواصل باللغة الإنجليزية والكتابة التقنية', descriptionEn: 'English communication and technical writing', icon: 'BookOpen', color: 'from-red-500 to-red-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
        { id: 'information-systems', title: 'نظم المعلومات', titleEn: 'Information Systems', description: 'تحليل وتصميم وتنفيذ نظم المعلومات', descriptionEn: 'Analysis, design and implementation of information systems', icon: 'BookOpen', color: 'from-indigo-500 to-indigo-600', articlesCount: 0, lastUpdated: 'لا توجد مقالات بعد' },
      ]

      for (const material of materials) {
        try {
          addMaterial(material)
          migrated++
        } catch (error: any) {
          errors.push(`Material ${material.id}: ${error.message}`)
        }
      }
    }

    // Migrate Downloads Data
    if (type === 'downloads' || type === 'all') {
      const downloads = [
        { id: 'edrawmax', name: 'Wondershare EdrawMax', nameEn: 'Wondershare EdrawMax', description: 'برنامج احترافي لرسم مخططات ERD وقواعد البيانات', descriptionEn: 'Professional software for drawing ERD diagrams and databases', icon: 'FileText', videoUrl: '#' },
        { id: 'revo', name: 'Revo Uninstaller', nameEn: 'Revo Uninstaller', description: 'أداة قوية لإزالة البرامج والملفات المتبقية من النظام', descriptionEn: 'Powerful tool for uninstalling programs and removing leftover files from the system', icon: 'Trash2', videoUrl: '#' },
        { id: 'office', name: 'Microsoft Office', nameEn: 'Microsoft Office', description: 'حزمة برامج مايكروسوفت المكتبية (Word, Excel, PowerPoint)', descriptionEn: 'Microsoft Office suite (Word, Excel, PowerPoint)', icon: 'Briefcase', videoUrl: '#' },
      ]

      for (const software of downloads) {
        try {
          addSoftware(software)
          migrated++
        } catch (error: any) {
          errors.push(`Software ${software.id}: ${error.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      migrated,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء نقل البيانات' }, { status: 500 })
  }
}

