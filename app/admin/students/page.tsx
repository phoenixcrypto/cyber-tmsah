'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Download, Loader2, AlertCircle } from 'lucide-react'

interface Student {
  id: string
  username: string
  email: string
  full_name: string
  section_number: number
  group_name: string
  is_active: boolean
  created_at: string
  last_login: string | null
}

export default function StudentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const cookies = document.cookie.split(';')
        const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
        const accessToken = accessTokenCookie?.split('=')[1]

        if (!accessToken) {
          router.push('/login?redirect=/admin/students')
          return
        }

        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1] || ''))
          if (payload.role !== 'admin') {
            setIsAdmin(false)
            return
          }

          setIsAdmin(true)
          await fetchStudents(accessToken)
        } catch (e) {
          setIsAdmin(false)
        }
      } catch (err) {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const fetchStudents = async (accessToken: string) => {
    try {
      const response = await fetch('/api/admin/students', {
        credentials: 'include',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
        setFilteredStudents(data.students || [])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    }
  }

  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.full_name.toLowerCase().includes(term) ||
          s.username.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
      )
    }

    // Section filter
    if (sectionFilter !== 'all') {
      filtered = filtered.filter((s) => s.section_number === parseInt(sectionFilter))
    }

    // Group filter
    if (groupFilter !== 'all') {
      filtered = filtered.filter((s) => s.group_name === groupFilter)
    }

    // Active/Inactive filter
    if (!showInactive) {
      filtered = filtered.filter((s) => s.is_active)
    }

    setFilteredStudents(filtered)
  }, [searchTerm, sectionFilter, groupFilter, showInactive, students])

  const exportToCSV = () => {
    const headers = ['Full Name', 'Username', 'Email', 'Section', 'Group', 'Status', 'Registered', 'Last Login']
    const rows = filteredStudents.map((s) => [
      s.full_name,
      s.username,
      s.email,
      s.section_number,
      s.group_name,
      s.is_active ? 'Active' : 'Inactive',
      new Date(s.created_at).toLocaleDateString('ar-EG'),
      s.last_login ? new Date(s.last_login).toLocaleDateString('ar-EG') : 'Never',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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

  const stats = {
    total: students.length,
    active: students.filter((s) => s.is_active).length,
    inactive: students.filter((s) => !s.is_active).length,
    bySection: Array.from({ length: 15 }, (_, i) => ({
      section: i + 1,
      count: students.filter((s) => s.section_number === i + 1).length,
    })),
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="enhanced-card p-6">
            <div className="text-3xl font-bold text-cyber-neon mb-1">{stats.total}</div>
            <div className="text-dark-300">إجمالي الطلاب</div>
          </div>
          <div className="enhanced-card p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.active}</div>
            <div className="text-dark-300">نشط</div>
          </div>
          <div className="enhanced-card p-6">
            <div className="text-3xl font-bold text-red-400 mb-1">{stats.inactive}</div>
            <div className="text-dark-300">غير نشط</div>
          </div>
        </div>

        {/* Filters */}
        <div className="enhanced-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، اسم المستخدم، أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
              />
            </div>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
            >
              <option value="all">جميع السكاشن</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  سكشن {i + 1}
                </option>
              ))}
            </select>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
            >
              <option value="all">جميع المجموعات</option>
              <option value="Group 1">Group 1</option>
              <option value="Group 2">Group 2</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showInactive" className="text-dark-300 cursor-pointer">
                إظهار غير النشطين
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير CSV
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="enhanced-card p-6">
          <div className="mb-4 text-dark-300">
            عرض {filteredStudents.length} من {students.length} طالب
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-neon/20">
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">الاسم الكامل</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">اسم المستخدم</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">البريد الإلكتروني</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">السكشن</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">المجموعة</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">الحالة</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">تاريخ التسجيل</th>
                  <th className="text-right py-3 px-4 text-dark-300 font-semibold">آخر دخول</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-dark-400">
                      لا توجد نتائج
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-cyber-neon/10 hover:bg-cyber-dark/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-dark-100">{student.full_name}</td>
                      <td className="py-3 px-4 text-dark-200">{student.username}</td>
                      <td className="py-3 px-4 text-dark-200">{student.email}</td>
                      <td className="py-3 px-4 text-dark-200 text-center">{student.section_number}</td>
                      <td className="py-3 px-4 text-dark-200">{student.group_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            student.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {student.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-dark-300 text-sm">
                        {new Date(student.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3 px-4 text-dark-300 text-sm">
                        {student.last_login
                          ? new Date(student.last_login).toLocaleDateString('ar-EG')
                          : 'لم يسجل دخول'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

