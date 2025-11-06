import * as XLSX from 'xlsx'

export interface StudentRow {
  fullName: string
  sectionNumber: number
  groupName: 'Group 1' | 'Group 2'
  studentId?: string
  email?: string
}

export interface ParseResult {
  success: boolean
  data: StudentRow[]
  errors: string[]
}

/**
 * Parse Excel file and extract student data
 * Expected columns: Full Name, Section Number, Group, Student ID (optional), Email (optional)
 */
export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0] as string
        const worksheet = workbook.Sheets[firstSheetName as keyof typeof workbook.Sheets] as XLSX.WorkSheet

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        }) as any[][]

        if (jsonData.length < 2) {
          resolve({
            success: false,
            data: [],
            errors: ['Excel file must contain at least a header row and one data row'],
          })
          return
        }

        // Find header row (usually first row)
        const headerRow = (jsonData[0] || []).map((cell: any) =>
          String(cell).toLowerCase().trim()
        )

        // Find column indices
        const fullNameIndex = findColumnIndex(headerRow, ['full name', 'name', 'الاسم', 'اسم'])
        const sectionIndex = findColumnIndex(headerRow, [
          'section',
          'section number',
          'sectionnumber',
          'السكشن',
          'سكشن',
        ])
        const groupIndex = findColumnIndex(headerRow, [
          'group',
          'group name',
          'groupname',
          'المجموعة',
          'مجموعة',
        ])
        const studentIdIndex = findColumnIndex(headerRow, [
          'student id',
          'studentid',
          'id',
          'student_id',
          'الرقم الجامعي',
          'رقم جامعي',
        ])
        const emailIndex = findColumnIndex(headerRow, ['email', 'e-mail', 'البريد', 'بريد'])

        if (fullNameIndex === -1 || sectionIndex === -1 || groupIndex === -1) {
          resolve({
            success: false,
            data: [],
            errors: [
              'Missing required columns. Required: Full Name, Section Number, Group',
            ],
          })
          return
        }

        const students: StudentRow[] = []
        const errors: string[] = []

        // Process data rows (skip header)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]

          if (!row || row.length === 0) continue

          const fullName = String(row[fullNameIndex] || '').trim()
          const sectionStr = String(row[sectionIndex] || '').trim()
          const groupStr = String(row[groupIndex] || '').trim()
          const studentId = studentIdIndex >= 0 ? String(row[studentIdIndex] || '').trim() : undefined
          const email = emailIndex >= 0 ? String(row[emailIndex] || '').trim() : undefined

          // Validate required fields
          if (!fullName) {
            errors.push(`Row ${i + 1}: Missing full name`)
            continue
          }

          const sectionNumber = parseInt(sectionStr, 10)
          if (isNaN(sectionNumber) || sectionNumber < 1 || sectionNumber > 15) {
            errors.push(`Row ${i + 1}: Invalid section number (must be 1-15)`)
            continue
          }

          // Normalize group name
          let groupName: 'Group 1' | 'Group 2'
          const groupLower = groupStr.toLowerCase().trim()

          if (groupLower.includes('1') || groupLower.includes('a') || groupLower.includes('group 1')) {
            groupName = 'Group 1'
          } else if (groupLower.includes('2') || groupLower.includes('b') || groupLower.includes('group 2')) {
            groupName = 'Group 2'
          } else {
            errors.push(`Row ${i + 1}: Invalid group (must be Group 1 or Group 2)`)
            continue
          }

          // Validate section and group match
          if (groupName === 'Group 1' && (sectionNumber < 1 || sectionNumber > 7)) {
            errors.push(
              `Row ${i + 1}: ${fullName} - Section ${sectionNumber} does not match Group 1 (sections 1-7)`
            )
            continue
          }

          if (groupName === 'Group 2' && (sectionNumber < 8 || sectionNumber > 15)) {
            errors.push(
              `Row ${i + 1}: ${fullName} - Section ${sectionNumber} does not match Group 2 (sections 8-15)`
            )
            continue
          }

          const student: StudentRow = {
            fullName,
            sectionNumber,
            groupName,
          }
          if (studentId) {
            student.studentId = studentId
          }
          if (email) {
            student.email = email
          }
          students.push(student)
        }

        resolve({
          success: errors.length === 0 || students.length > 0,
          data: students,
          errors,
        })
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        })
      }
    }

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Error reading file'],
      })
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Find column index by matching header names
 */
function findColumnIndex(headerRow: string[], possibleNames: string[]): number {
  for (let i = 0; i < headerRow.length; i++) {
    const cell = headerRow[i] || ''
    for (const name of possibleNames) {
      if (cell.includes(name) || name.includes(cell)) {
        return i
      }
    }
  }
  return -1
}

/**
 * Validate student data before upload
 */
export function validateStudentData(student: StudentRow): {
  valid: boolean
  error?: string
} {
  if (!student.fullName || student.fullName.trim().length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters' }
  }

  if (student.sectionNumber < 1 || student.sectionNumber > 15) {
    return { valid: false, error: 'Section number must be between 1 and 15' }
  }

  if (student.groupName !== 'Group 1' && student.groupName !== 'Group 2') {
    return { valid: false, error: 'Group must be Group 1 or Group 2' }
  }

  // Validate section and group match
  if (student.groupName === 'Group 1' && (student.sectionNumber < 1 || student.sectionNumber > 7)) {
    return {
      valid: false,
      error: 'Group 1 only includes Sections 1-7',
    }
  }

  if (student.groupName === 'Group 2' && (student.sectionNumber < 8 || student.sectionNumber > 15)) {
    return {
      valid: false,
      error: 'Group 2 only includes Sections 8-15',
    }
  }

  if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true }
}

