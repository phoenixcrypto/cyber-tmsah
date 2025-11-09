'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Download, Loader2, AlertCircle, Trash2, RefreshCw, UserX } from 'lucide-react'
import { authenticatedFetch } from '@/lib/auth/tokenRefresh'
import { verifyAdminAccess } from '@/lib/auth/client-admin'

interface Student {
  id: string
  verification_id?: string // ID from verification_list
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
  registered_at?: string
  registered_by?: string
}

interface Statistics {
  total: number
  loggedInLast24Hours: number
  loggedInLast7Days: number
  newInLast30Days: number
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
  const [showPasswordHash, setShowPasswordHash] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [unregisteringId, setUnregisteringId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)
  // Track deleted/unregistered students to prevent them from reappearing
  const deletedStudentsRef = useRef<Set<string>>(new Set())
  const unregisteredStudentsRef = useRef<Set<string>>(new Set())

  // Auto-refresh students data periodically for real-time updates
  useEffect(() => {
    if (loading) return

    const interval = setInterval(() => {
      fetchStudents(false) // Silent refresh
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [loading])

  // Refresh when page becomes visible
  useEffect(() => {
    if (loading) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStudents(false)
      }
    }

    const handleFocus = () => {
      fetchStudents(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [loading])

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Clear refs on page load
        deletedStudentsRef.current.clear()
        unregisteredStudentsRef.current.clear()

        const result = await verifyAdminAccess()
        
        if (result.isAdmin) {
          setIsAdmin(true)
          await fetchStudents(true)
        } else {
          setIsAdmin(false)
          setTimeout(() => {
            router.push('/login?redirect=/admin/students')
          }, 2000)
        }
      } catch (err) {
        console.error('Admin check error:', err)
        setIsAdmin(false)
        setTimeout(() => {
          router.push('/login?redirect=/admin/students')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const fetchStudents = async (showLoading = true) => {
    try {
      if (showLoading) {
        setRefreshing(true)
      }

      // Add cache busting
      const cacheBuster = `?t=${Date.now()}`
      const response = await authenticatedFetch(
        `/api/admin/students/list${cacheBuster}`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        },
        () => router.push('/login')
      )

      if (!response) {
        return
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        throw new Error(`Failed to fetch students: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Filter out deleted/unregistered students
        const studentsArray = (data.students || []).filter((s: any) => {
          return !deletedStudentsRef.current.has(s.id) && 
                 !unregisteredStudentsRef.current.has(s.verification_id || s.id)
        })

        setStudents(studentsArray)
        setStatistics(data.statistics || null)
        setLastRefreshTime(new Date())
      } else {
        console.error('Failed to load students:', data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error loading students:', err)
    } finally {
      if (showLoading) {
        setRefreshing(false)
      }
    }
  }

  // Memoize filtered students
  const filteredStudentsMemo = useMemo(() => {
    try {
      const studentsArray = Array.isArray(students) ? students : []
      if (studentsArray.length === 0) {
        return []
      }
      
      let filtered = [...studentsArray]

      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        filtered = filtered.filter(s => {
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
          filtered = filtered.filter(s => s && typeof s === 'object' && s.section_number === sectionNum)
        }
      }

      // Group filter
      if (groupFilter !== 'all') {
        filtered = filtered.filter(s => s && typeof s === 'object' && s.group_name === groupFilter)
      }

      return filtered
    } catch (error) {
      console.error('[Admin Students] Error in filteredStudentsMemo:', error)
      return []
    }
  }, [students, searchTerm, sectionFilter, groupFilter])

  useEffect(() => {
    setFilteredStudents(filteredStudentsMemo)
  }, [filteredStudentsMemo])

  const handleManualRefresh = async () => {
    await fetchStudents(true)
  }

  // Delete student account
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف حساب الطالب "${studentName}"؟\n\nسيتم:\n- حذف الحساب من النظام\n- إعادة تعيين حالة التسجيل في verification_list`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(studentId)

    try {
      const response = await authenticatedFetch(
        `/api/admin/students/${studentId}`,
        {
          method: 'DELETE',
        },
        () => router.push('/login')
      )

      if (!response) {
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 404) {
          // Student already deleted, remove from UI
          deletedStudentsRef.current.add(studentId)
          setStudents(prev => prev.filter(s => s.id !== studentId))
          setFilteredStudents(prev => prev.filter(s => s.id !== studentId))
          
          if (statistics) {
            setStatistics(prev => {
              if (!prev) return null
              return {
                ...prev,
                total: Math.max(0, prev.total - 1),
              }
            })
          }
          
          alert('الطالب محذوف بالفعل من النظام. تم إزالته من القائمة.')
          return
        }
        
        alert(`فشل حذف الحساب: ${errorData.error || 'خطأ غير معروف'}`)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        deletedStudentsRef.current.add(studentId)
        
        const studentToDelete = students.find(s => s.id === studentId)
        
        // Remove immediately (optimistic update)
        setStudents(prev => prev.filter(s => s.id !== studentId))
        setFilteredStudents(prev => prev.filter(s => s.id !== studentId))
        
        // Update statistics immediately
        if (statistics && studentToDelete) {
          setStatistics(prev => {
            if (!prev) return null
            const newTotal = Math.max(0, prev.total - 1)
            const newBySection = { ...prev.bySection }
            const newByGroup = { ...prev.byGroup }
            
            if (studentToDelete.section_number) {
              const sectionCount = newBySection[studentToDelete.section_number] || 0
              newBySection[studentToDelete.section_number] = Math.max(0, sectionCount - 1)
            }
            
            if (studentToDelete.group_name) {
              const groupCount = newByGroup[studentToDelete.group_name] || 0
              newByGroup[studentToDelete.group_name] = Math.max(0, groupCount - 1)
            }
            
            // Update time-based statistics
            const now = new Date()
            const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            
            let newLoggedInLast24Hours = prev.loggedInLast24Hours || 0
            let newLoggedInLast7Days = prev.loggedInLast7Days || 0
            let newNewInLast30Days = prev.newInLast30Days || 0
            
            if (studentToDelete.last_login) {
              const lastLogin = new Date(studentToDelete.last_login)
              if (lastLogin >= last24Hours) newLoggedInLast24Hours = Math.max(0, newLoggedInLast24Hours - 1)
              if (lastLogin >= last7Days) newLoggedInLast7Days = Math.max(0, newLoggedInLast7Days - 1)
            }
            
            if (studentToDelete.registered_at) {
              const registeredAt = new Date(studentToDelete.registered_at)
              if (registeredAt >= last30Days) newNewInLast30Days = Math.max(0, newNewInLast30Days - 1)
            }
            
            return {
              ...prev,
              total: newTotal,
              bySection: newBySection,
              byGroup: newByGroup,
              loggedInLast24Hours: newLoggedInLast24Hours,
              loggedInLast7Days: newLoggedInLast7Days,
              newInLast30Days: newNewInLast30Days,
            }
          })
        }
        
        alert('تم حذف حساب الطالب بنجاح وإعادة تعيين حالة التسجيل.')
        
        // Refresh immediately
        fetchStudents(false).catch(err => {
          console.error('[Admin Students] Error refreshing after delete:', err)
        })
      } else {
        alert(`فشل حذف الحساب: ${data.error || 'خطأ غير معروف'}`)
      }
    } catch (err) {
      console.error('[Admin Students] Error deleting student:', err)
      alert('حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى.')
    } finally {
      setDeletingId(null)
    }
  }

  // Unregister student
  const handleUnregisterStudent = async (verificationId: string, studentName: string) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من إلغاء تسجيل الطالب "${studentName}"؟\n\nسيتم:\n- إعادة الطالب إلى قائمة غير المسجلين\n- حذف الحساب من النظام\n\nيمكن للطالب التسجيل مرة أخرى لاحقاً.`
    )

    if (!confirmed) {
      return
    }

    setUnregisteringId(verificationId)

    try {
      const response = await authenticatedFetch(
        `/api/admin/students/${verificationId}/unregister`,
        {
          method: 'POST',
        },
        () => router.push('/login')
      )

      if (!response) {
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`فشل إلغاء التسجيل: ${errorData.error || 'خطأ غير معروف'}`)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        unregisteredStudentsRef.current.add(verificationId)
        
        const studentToUnregister = students.find(s => (s.verification_id || s.id) === verificationId)
        
        if (studentToUnregister) {
          // Remove immediately (optimistic update)
          setStudents(prev => prev.filter(s => (s.verification_id || s.id) !== verificationId))
          setFilteredStudents(prev => prev.filter(s => (s.verification_id || s.id) !== verificationId))
          
          // Update statistics
          if (statistics && studentToUnregister) {
            setStatistics(prev => {
              if (!prev) return null
              const newTotal = Math.max(0, prev.total - 1)
              const newBySection = { ...prev.bySection }
              const newByGroup = { ...prev.byGroup }
              
              if (studentToUnregister.section_number) {
                const sectionCount = newBySection[studentToUnregister.section_number] || 0
                newBySection[studentToUnregister.section_number] = Math.max(0, sectionCount - 1)
              }
              
              if (studentToUnregister.group_name) {
                const groupCount = newByGroup[studentToUnregister.group_name] || 0
                newByGroup[studentToUnregister.group_name] = Math.max(0, groupCount - 1)
              }
              
              // Update time-based statistics
              const now = new Date()
              const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
              const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              
              let newLoggedInLast24Hours = prev.loggedInLast24Hours || 0
              let newLoggedInLast7Days = prev.loggedInLast7Days || 0
              let newNewInLast30Days = prev.newInLast30Days || 0
              
              if (studentToUnregister.last_login) {
                const lastLogin = new Date(studentToUnregister.last_login)
                if (lastLogin >= last24Hours) newLoggedInLast24Hours = Math.max(0, newLoggedInLast24Hours - 1)
                if (lastLogin >= last7Days) newLoggedInLast7Days = Math.max(0, newLoggedInLast7Days - 1)
              }
              
              if (studentToUnregister.registered_at) {
                const registeredAt = new Date(studentToUnregister.registered_at)
                if (registeredAt >= last30Days) newNewInLast30Days = Math.max(0, newNewInLast30Days - 1)
              }
              
              return {
                ...prev,
                total: newTotal,
                bySection: newBySection,
                byGroup: newByGroup,
                loggedInLast24Hours: newLoggedInLast24Hours,
                loggedInLast7Days: newLoggedInLast7Days,
                newInLast30Days: newNewInLast30Days,
              }
            })
          }
        }
        
        alert('تم إلغاء تسجيل الطالب بنجاح. يمكنه التسجيل مرة أخرى لاحقاً.')
        
        // Refresh immediately
        fetchStudents(false).catch(err => {
          console.error('[Admin Students] Error refreshing after unregister:', err)
        })
      } else {
        alert(`فشل إلغاء التسجيل: ${data.error || 'خطأ غير معروف'}`)
      }
    } catch (err) {
      console.error('[Admin Students] Error unregistering student:', err)
      alert('حدث خطأ أثناء إلغاء التسجيل. يرجى المحاولة مرة أخرى.')
    } finally {
      setUnregisteringId(null)
    }
  }

  const exportToCSV = () => {
    try {
      if (!filteredStudents || filteredStudents.length === 0) {
        alert('لا توجد بيانات للتصدير')
        return
      }

      const headers = [
        'ID',
        'Username',
        'Email',
        'Full Name',
        'Section',
        'Group',
        'University Email',
        'Password Hash',
        'Role',
        'Is Active',
        'Registered At',
        'Last Login',
        'Created At',
      ]

      const rows = filteredStudents.map((s) => [
        s.id,
        s.username,
        s.email,
        s.full_name,
        s.section_number,
        s.group_name,
        s.university_email || '',
        showPasswordHash ? s.password_hash : '***',
        s.role,
        s.is_active ? 'Yes' : 'No',
        s.registered_at || '',
        s.last_login || '',
        s.created_at,
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting CSV:', err)
      alert('حدث خطأ أثناء تصدير البيانات')
    }
  }

  // Use statistics from API, with fallback
  const displayStats = statistics || {
    total: students.length,
    loggedInLast24Hours: 0,
    loggedInLast7Days: 0,
    newInLast30Days: 0,
    bySection: {},
    byGroup: {},
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyber-neon animate-spin mx-auto mb-4" />
          <p className="text-dark-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-dark-100 mb-2">Access Denied</h1>
          <p className="text-dark-300 mb-4">Admin access required</p>
          <button
            onClick={() => router.push('/login?redirect=/admin/students')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
            قائمة الطلاب المسجلين
          </h1>
          <p className="text-dark-300">
            إدارة الطلاب المسجلين في النظام (المصدر: verification_list)
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-cyber-neon">{displayStats.total}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">إجمالي الطلاب المسجلين</h3>
              <p className="text-dark-300 text-sm">جميع الطلاب المسجلين</p>
            </div>
          </div>

          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-green to-cyber-neon rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-green-400">{displayStats.loggedInLast24Hours}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">دخلوا في آخر 24 ساعة</h3>
              <p className="text-dark-300 text-sm">نشطون مؤخراً</p>
            </div>
          </div>

          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-violet rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{displayStats.loggedInLast7Days}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">دخلوا في آخر 7 أيام</h3>
              <p className="text-dark-300 text-sm">نشطون هذا الأسبوع</p>
            </div>
          </div>

          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{displayStats.newInLast30Days}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">جدد في آخر 30 يوم</h3>
              <p className="text-dark-300 text-sm">مسجلون حديثاً</p>
            </div>
          </div>
        </div>

        {/* Distribution by Section */}
        <div className="mb-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-dark-100 mb-4">التوزيع حسب القسم</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-3">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((sectionNum) => (
              <div key={sectionNum} className="enhanced-card p-4 text-center">
                <div className="text-2xl font-bold text-cyber-neon mb-1">
                  {displayStats.bySection[sectionNum] || 0}
                </div>
                <div className="text-sm text-dark-300">قسم {sectionNum}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution by Group */}
        <div className="mb-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-dark-100 mb-4">التوزيع حسب المجموعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="enhanced-card p-6">
              <div className="text-3xl font-bold text-cyber-neon mb-2">
                {displayStats.byGroup['Group 1'] || 0}
              </div>
              <div className="text-lg text-dark-300">Group 1 (A)</div>
            </div>
            <div className="enhanced-card p-6">
              <div className="text-3xl font-bold text-cyber-neon mb-2">
                {displayStats.byGroup['Group 2'] || 0}
              </div>
              <div className="text-lg text-dark-300">Group 2 (B)</div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 enhanced-card p-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-cyber-neon/20 hover:bg-cyber-neon/30 text-cyber-neon rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>تحديث</span>
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث بالاسم، اسم المستخدم، أو البريد"
                  className="w-full pl-10 p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                />
              </div>

              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="px-4 py-2 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100"
              >
                <option value="all">جميع السكاشن</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    قسم {num}
                  </option>
                ))}
              </select>

              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="px-4 py-2 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100"
              >
                <option value="all">جميع المجموعات</option>
                <option value="Group 1">Group 1 (A)</option>
                <option value="Group 2">Group 2 (B)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تصدير CSV {showPasswordHash ? '(مع Password Hash)' : ''}</span>
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-cyber-dark border border-cyber-neon/30 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPasswordHash}
                  onChange={(e) => setShowPasswordHash(e.target.checked)}
                  className="w-4 h-4 text-cyber-neon"
                />
                <span className="text-sm text-dark-300">إظهار Password Hash</span>
              </label>
            </div>
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
              آخر 24 ساعة: <span className="text-green-400 font-bold">{displayStats.loggedInLast24Hours}</span> | 
              آخر 7 أيام: <span className="text-blue-400 font-bold">{displayStats.loggedInLast7Days}</span>
              {lastRefreshTime && (
                <span className="mr-2 text-xs text-dark-400">
                  (آخر تحديث: {lastRefreshTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[13%]" />
              </colgroup>
              <thead className="bg-cyber-dark/50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    الاسم الكامل
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    اسم المستخدم
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    البريد الإلكتروني
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    البريد الجامعي
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    السكشن
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    المجموعة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    تاريخ التسجيل
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-dark-300">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-cyber-neon/5 transition-colors border-b border-dark-200/10"
                    >
                      <td className="py-3 px-4 text-dark-100 font-semibold break-words">
                        {student.full_name || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300 break-words">
                        {student.username || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300 break-words">
                        {student.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300 break-words">
                        {student.university_email || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300">
                        {student.section_number || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300">
                        {student.group_name || '-'}
                      </td>
                      <td className="py-3 px-4 text-dark-300">
                        {student.registered_at
                          ? new Date(student.registered_at).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {/* Unregister Button */}
                          <button
                            onClick={() => handleUnregisterStudent(
                              student.verification_id || student.id, 
                              student.full_name || student.username
                            )}
                            disabled={unregisteringId === (student.verification_id || student.id) || deletingId === student.id}
                            className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="إلغاء تسجيل الطالب (إرجاعه إلى قائمة غير المسجلين)"
                          >
                            {unregisteringId === (student.verification_id || student.id) ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">جاري الإلغاء...</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4" />
                                <span className="text-xs">إلغاء التسجيل</span>
                              </>
                            )}
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.full_name || student.username)}
                            disabled={deletingId === student.id || unregisteringId === (student.verification_id || student.id)}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="حذف حساب الطالب"
                          >
                            {deletingId === student.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">جاري الحذف...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs">حذف</span>
                              </>
                            )}
                          </button>
                        </div>
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

