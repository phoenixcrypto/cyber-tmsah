'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Download, Loader2, AlertCircle } from 'lucide-react'
import { authenticatedFetch } from '@/lib/auth/tokenRefresh'
import { verifyAdminAccess } from '@/lib/auth/client-admin'

interface Student {
  id: string
  username: string
  email: string
  password_hash: string
  full_name: string
  section_number: number
  group_name: string
  university_email: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_login: string | null
}

interface Statistics {
  total: number
  active: number
  inactive: number
  bySection: Record<number, number>
  byGroup: Record<string, number>
}

export default function StudentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(true) // Show all students by default
  const [showPasswordHash, setShowPasswordHash] = useState(false)

  const fetchStudents = async () => {
    try {
      const response = await authenticatedFetch(
        '/api/admin/students',
        { method: 'GET' },
        () => router.push('/login?redirect=/admin/students')
      )

      if (!response) {
        setLoading(false)
        return
      }

      if (response.ok) {
        try {
          const data = await response.json()
          
          // Log for debugging
          console.log('[Admin Students] API Response:', {
            success: data.success,
            studentsCount: Array.isArray(data.students) ? data.students.length : 0,
            hasStatistics: !!data.statistics,
            statistics: data.statistics,
            firstStudent: Array.isArray(data.students) && data.students.length > 0 ? {
              id: data.students[0].id,
              username: data.students[0].username,
              full_name: data.students[0].full_name,
            } : null,
          })
          
          if (data.success !== false) {
            const studentsArray = Array.isArray(data.students) ? data.students : []
            setStudents(studentsArray)
            setFilteredStudents(studentsArray)
            setStatistics(data.statistics && typeof data.statistics === 'object' ? data.statistics : null)
            console.log('[Admin Students] Set students:', studentsArray.length)
          } else if (data.students && Array.isArray(data.students)) {
            setStudents(data.students)
            setFilteredStudents(data.students)
            setStatistics(data.statistics && typeof data.statistics === 'object' ? data.statistics : null)
            console.log('[Admin Students] Set students (fallback):', data.students.length)
          } else {
            console.warn('[Admin Students] No students in response')
            setStudents([])
            setFilteredStudents([])
            setStatistics(null)
          }
        } catch (parseError) {
          console.error('[Admin Students] Error parsing response:', parseError)
          setStudents([])
          setFilteredStudents([])
          setStatistics(null)
        }
      } else {
        // If still not ok after refresh, redirect to login
        if (response.status === 401 || response.status === 403) {
          try {
            const errorData = await response.json().catch(() => ({}))
            console.error('[Admin Students] Access denied:', {
              status: response.status,
              error: errorData.error || 'Unknown error',
              code: errorData.code,
            })
          } catch (e) {
            console.error('[Admin Students] Failed to parse error response:', e)
          }
          router.push('/login?redirect=/admin/students')
        } else {
          console.error('[Admin Students] API error:', response.status, response.statusText)
          setStudents([])
          setFilteredStudents([])
          setStatistics(null)
        }
      }
    } catch (err) {
      console.error('[Admin Students] Error fetching students:', err)
      setStudents([])
      setFilteredStudents([])
      setStatistics(null)
      // Don't redirect on network errors, just show empty state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Verify admin access using API
        const result = await verifyAdminAccess()
        
        if (result.isAdmin) {
          setIsAdmin(true)
          await fetchStudents()
          // fetchStudents handles setLoading(false) in its finally block
        } else {
          setIsAdmin(false)
          setLoading(false)
          router.push('/login?redirect=/admin/students')
        }
      } catch (err) {
        console.error('[Admin Students] Error in checkAdmin:', err)
        setIsAdmin(false)
        setLoading(false)
        router.push('/login?redirect=/admin/students')
      }
    }

    checkAdmin()
  }, [router])

  // Memoize filtered students to avoid unnecessary recalculations
  const filteredStudentsMemo = useMemo(() => {
    try {
      // Ensure students is always an array
      const studentsArray = Array.isArray(students) ? students : []
      
      if (studentsArray.length === 0) {
        return []
      }

      let filtered = [...studentsArray]

      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        filtered = filtered.filter((s) => {
          if (!s || typeof s !== 'object') return false
          return (
            (s.full_name && typeof s.full_name === 'string' && s.full_name.toLowerCase().includes(term)) ||
            (s.username && typeof s.username === 'string' && s.username.toLowerCase().includes(term)) ||
            (s.email && typeof s.email === 'string' && s.email.toLowerCase().includes(term))
          )
        })
      }

      // Section filter
      if (sectionFilter !== 'all') {
        const sectionNum = parseInt(sectionFilter, 10)
        if (!isNaN(sectionNum)) {
          filtered = filtered.filter((s) => s && typeof s === 'object' && s.section_number === sectionNum)
        }
      }

      // Group filter
      if (groupFilter !== 'all') {
        filtered = filtered.filter((s) => s && typeof s === 'object' && s.group_name === groupFilter)
      }

      // Active/Inactive filter
      if (!showInactive) {
        filtered = filtered.filter((s) => s && typeof s === 'object' && s.is_active === true)
      }

      return filtered
    } catch (error) {
      console.error('[Admin Students] Error in filteredStudentsMemo:', error)
      return []
    }
  }, [students, searchTerm, sectionFilter, groupFilter, showInactive])

  useEffect(() => {
    setFilteredStudents(filteredStudentsMemo)
    console.log('[Admin Students] Filtered students updated:', filteredStudentsMemo.length)
  }, [filteredStudentsMemo])

  const exportToCSV = () => {
    try {
      if (!Array.isArray(filteredStudents) || filteredStudents.length === 0) {
        console.warn('[Admin Students] No students to export')
        return
      }

      const headers = ['Full Name', 'Username', 'Email', 'Password Hash', 'Section', 'Group', 'University Email', 'Status', 'Registered', 'Last Login', 'Updated At']
      const rows = filteredStudents.map((s) => {
        if (!s || typeof s !== 'object') {
          return ['', '', '', '', '', '', '', '', '', '', '']
        }
        return [
          s.full_name || '',
          s.username || '',
          s.email || '',
          s.password_hash || '',
          s.section_number || '',
          s.group_name || '',
          s.university_email || '',
          s.is_active ? 'Active' : 'Inactive',
          s.created_at ? new Date(s.created_at).toLocaleDateString('ar-EG') : '',
          s.last_login ? new Date(s.last_login).toLocaleDateString('ar-EG') : 'Never',
          s.updated_at ? new Date(s.updated_at).toLocaleDateString('ar-EG') : '',
        ]
      })

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `students_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(link.href), 100)
    } catch (err) {
      console.error('[Admin Students] Error exporting CSV:', err)
    }
  }

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-neon mx-auto mb-4" />
          <p className="text-dark-300">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-100 mb-2">غير مصرح بالوصول</h2>
          <p className="text-dark-300 mb-4">يجب تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة.</p>
          <button
            onClick={() => router.push('/login?redirect=/admin/students')}
            className="px-6 py-2 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  // Use statistics from API, with fallback to students length
  const displayStats = statistics || {
    total: students.length,
    active: 0,
    inactive: 0,
    bySection: {} as Record<number, number>,
    byGroup: {} as Record<string, number>,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-cyber-neon" />
            قائمة الطلاب المسجلين
          </h1>
          <p className="text-dark-300">عرض وإدارة جميع الطلاب المسجلين في النظام</p>
        </div>

        {/* Statistics Cards - Fixed height to prevent CLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="enhanced-card p-6 border border-cyber-neon/20 hover:border-cyber-neon/40 transition-colors min-h-[140px] flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-cyber-neon mb-2">{displayStats.total}</div>
            <div className="text-dark-100 font-medium">إجمالي الطلاب المسجلين</div>
          </div>
          <div className="enhanced-card p-6 border border-green-400/20 hover:border-green-400/40 transition-colors min-h-[140px] flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">{displayStats.active}</div>
            <div className="text-dark-100 font-medium">نشط</div>
          </div>
          <div className="enhanced-card p-6 border border-red-400/20 hover:border-red-400/40 transition-colors min-h-[140px] flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-red-400 mb-2">{displayStats.inactive}</div>
            <div className="text-dark-100 font-medium">غير نشط</div>
          </div>
        </div>

        {/* Distribution Sections - Fixed height to prevent CLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 min-h-[400px]">
          {/* Distribution by Section */}
          <div className="enhanced-card p-6 border border-cyber-neon/20">
            <h3 className="text-xl font-bold text-dark-100 mb-6">التوزيع حسب القسم</h3>
            {displayStats.bySection && typeof displayStats.bySection === 'object' ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 15 }, (_, i) => i + 1).map((section) => (
                  <div 
                    key={section} 
                    className="text-center p-3 bg-cyber-dark/50 rounded-lg border border-cyber-neon/10 hover:border-cyber-neon/30 transition-colors min-h-[80px] flex flex-col justify-center"
                  >
                    <div className="text-2xl font-bold text-cyber-neon mb-1">{(displayStats.bySection[section]) || 0}</div>
                    <div className="text-xs text-dark-300">قسم {section}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 15 }, (_, i) => i + 1).map((section) => (
                  <div 
                    key={section} 
                    className="text-center p-3 bg-cyber-dark/50 rounded-lg border border-cyber-neon/10 min-h-[80px] flex flex-col justify-center"
                  >
                    <div className="text-2xl font-bold text-cyber-neon mb-1">-</div>
                    <div className="text-xs text-dark-300">قسم {section}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Distribution by Group */}
          <div className="enhanced-card p-6 border border-cyber-neon/20">
            <h3 className="text-xl font-bold text-dark-100 mb-6">التوزيع حسب المجموعة</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-cyber-dark/50 rounded-lg border border-cyber-neon/10 hover:border-cyber-neon/30 transition-colors min-h-[120px] flex flex-col justify-center">
                <div className="text-3xl font-bold text-cyber-neon mb-2">{(displayStats.byGroup && displayStats.byGroup['Group 1']) || 0}</div>
                <div className="text-sm text-dark-300 font-medium">Group 1 (A)</div>
              </div>
              <div className="text-center p-6 bg-cyber-dark/50 rounded-lg border border-cyber-neon/10 hover:border-cyber-neon/30 transition-colors min-h-[120px] flex flex-col justify-center">
                <div className="text-3xl font-bold text-cyber-neon mb-2">{(displayStats.byGroup && displayStats.byGroup['Group 2']) || 0}</div>
                <div className="text-sm text-dark-300 font-medium">Group 2 (B)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="enhanced-card p-6 mb-6 border border-cyber-neon/20">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، اسم المستخدم، أو البريد"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-cyber-neon transition-colors"
              />
            </div>

            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors min-w-[150px]"
            >
              <option value="all">جميع السكاشن</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  سكشن {i + 1}
                </option>
              ))}
            </select>

            {/* Group Filter */}
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors min-w-[150px]"
            >
              <option value="all">جميع المجموعات</option>
              <option value="Group 1">Group 1</option>
              <option value="Group 2">Group 2</option>
            </select>

            {/* Show Inactive Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-neon/30 bg-cyber-dark/50 text-cyber-neon focus:ring-cyber-neon focus:ring-offset-cyber-dark"
              />
              <label htmlFor="showInactive" className="text-dark-100 cursor-pointer select-none">
                إظهار غير النشطين
              </label>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              تصدير CSV (مع Password Hash)
            </button>
          </div>

          {/* Password Hash Checkbox */}
          <div className="flex items-center gap-2 pt-4 border-t border-cyber-neon/10">
            <input
              type="checkbox"
              id="showPasswordHash"
              checked={showPasswordHash}
              onChange={(e) => setShowPasswordHash(e.target.checked)}
              className="w-4 h-4 rounded border-cyber-neon/30 bg-cyber-dark/50 text-cyber-neon focus:ring-cyber-neon focus:ring-offset-cyber-dark"
            />
            <label htmlFor="showPasswordHash" className="text-dark-100 cursor-pointer select-none">
              إظهار Password Hash
            </label>
          </div>
        </div>

        {/* Students Table */}
        <div className="enhanced-card p-6 border border-cyber-neon/20">
          {/* Table Summary */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-cyber-neon/10">
            <div className="text-dark-100 font-medium">
              عرض {filteredStudents.length} من {students.length} طالب مسجل
            </div>
            <div className="text-sm text-dark-300">
              إجمالي المسجلين: <span className="text-cyber-neon font-bold">{displayStats.total}</span> | 
              نشط: <span className="text-green-400 font-bold">{displayStats.active}</span> | 
              غير نشط: <span className="text-red-400 font-bold">{displayStats.inactive}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                {showPasswordHash && <col className="w-[15%]" />}
                <col className="w-[6%]" />
                <col className="w-[8%]" />
                <col className="w-[7%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
                <col className="w-[9%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-cyber-neon/20 bg-cyber-dark/30">
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">الاسم الكامل</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">اسم المستخدم</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">البريد الإلكتروني</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">البريد الجامعي</th>
                  {showPasswordHash && (
                    <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">Password Hash</th>
                  )}
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">السكشن</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">المجموعة</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">الحالة</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">تاريخ التسجيل</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">آخر تحديث</th>
                  <th className="text-right py-3 px-4 text-dark-100 font-bold text-sm">آخر دخول</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={showPasswordHash ? 11 : 10} className="text-center py-8 text-dark-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-dark-500" />
                        <p className="text-lg font-semibold">لا توجد نتائج</p>
                        {students.length === 0 ? (
                          <p className="text-sm text-dark-500">
                            لا يوجد طلاب مسجلين في النظام بعد
                          </p>
                        ) : (
                          <p className="text-sm text-dark-500">
                            لا توجد نتائج تطابق الفلاتر المحددة. جرب تغيير معايير البحث أو الفلترة.
                            <br />
                            <span className="text-cyber-neon">
                              إجمالي الطلاب في النظام: {students.length}
                            </span>
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    if (!student || typeof student !== 'object' || !student.id) {
                      return null
                    }
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-cyber-neon/10 hover:bg-cyber-dark/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-dark-100 font-medium">{student.full_name || '-'}</td>
                        <td className="py-3 px-4 text-dark-200">{student.username || '-'}</td>
                        <td className="py-3 px-4 text-dark-200">{student.email || '-'}</td>
                        <td className="py-3 px-4 text-dark-200">{student.university_email || '-'}</td>
                        {showPasswordHash && (
                          <td className="py-3 px-4 text-dark-400 text-xs font-mono break-all max-w-xs">
                            {student.password_hash || '-'}
                          </td>
                        )}
                        <td className="py-3 px-4 text-dark-200 text-center">{student.section_number || '-'}</td>
                        <td className="py-3 px-4 text-dark-200">{student.group_name || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              student.is_active === true
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {student.is_active === true ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-dark-300 text-sm">
                          {student.created_at ? new Date(student.created_at).toLocaleDateString('ar-EG') : '-'}
                        </td>
                        <td className="py-3 px-4 text-dark-300 text-sm">
                          {student.updated_at ? new Date(student.updated_at).toLocaleDateString('ar-EG') : '-'}
                        </td>
                        <td className="py-3 px-4 text-dark-300 text-sm">
                          {student.last_login
                            ? new Date(student.last_login).toLocaleDateString('ar-EG')
                            : 'لم يسجل دخول'}
                        </td>
                      </tr>
                    )
                  }).filter(Boolean)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

