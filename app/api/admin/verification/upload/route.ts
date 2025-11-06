import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateStudentData, type StudentRow } from '@/lib/utils/excelParser'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { students } = body as { students: StudentRow[] }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: 'Invalid student data' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Insert students in batches
    const batchSize = 100
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize)
      
      // Validate each student
      const validStudents: StudentRow[] = []
      for (const student of batch) {
        const validation = validateStudentData(student)
        if (validation.valid) {
          validStudents.push(student)
        } else {
          results.failed++
          results.errors.push(`${student.fullName}: ${validation.error}`)
        }
      }

      if (validStudents.length > 0) {
        // Prepare data for insertion
        const insertData = validStudents.map(student => ({
          full_name: student.fullName.trim(),
          section_number: student.sectionNumber,
          group_name: student.groupName,
          student_id: student.studentId || null,
          email: student.email || null,
          is_registered: false,
        }))

        // Insert batch
        const { data, error } = await supabase
          .from('verification_list')
          .insert(insertData)
          .select()

        if (error) {
          // Handle duplicate errors
          if (error.code === '23505') { // Unique violation
            results.failed += validStudents.length
            results.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Some students already exist in database`)
          } else {
            results.failed += validStudents.length
            results.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
          }
        } else {
          results.success += data?.length || 0
        }
      }
    }

    return NextResponse.json({
      success: true,
      successCount: results.success,
      failedCount: results.failed,
      errors: results.errors.slice(0, 50), // Limit errors to first 50
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

