'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search, Edit2, Save, X, AlertCircle, CheckCircle2, UserX, Trash2 } from 'lucide-react'
import { authenticatedFetch } from '@/lib/auth/tokenRefresh'
import { verifyAdminAccess } from '@/lib/auth/client-admin'

interface Student {
  id: string
  full_name: string
  section_number: number
  group_name: string
  student_id: string | null
  email: string | null
  is_registered: boolean
  registered_at: string | null
  created_at: string
  updated_at: string
}

export default function VerificationListPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Student>>({})
  const [saving, setSaving] = useState(false)
  const [unregisteringId, setUnregisteringId] = useState<string | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // Track unregistered students to prevent them from reappearing
  const unregisteredStudentsRef = useRef<Set<string>>(new Set())

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [filterGroup, setFilterGroup] = useState('')
  const [filterRegistered, setFilterRegistered] = useState('')

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Clear unregistered students ref on page load to ensure fresh data
        unregisteredStudentsRef.current.clear()
        
        // Verify admin access using API
        const result = await verifyAdminAccess()
        
        if (result.isAdmin) {
          setIsAdmin(true)
          setMessage(null) // Clear any previous errors
          // Load students after admin verification
          await loadStudents(true)
        } else {
          // More specific error messages
          let errorMessage = result.error || 'Admin access required. Please log in as administrator.'
          
          setMessage({ type: 'error', text: errorMessage })
          setIsAdmin(false)
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login?redirect=/admin/verification-list')
          }, 2000)
        }
      } catch (err) {
        console.error('Admin check error:', err)
        setMessage({ type: 'error', text: 'Failed to verify admin access. Please check your connection and try again.' })
        setIsAdmin(false)
        setTimeout(() => {
          router.push('/login?redirect=/admin/verification-list')
        }, 2000)
      } finally {
        setLoading(false)
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

      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        filtered = filtered.filter(s => {
          if (!s || typeof s !== 'object') return false
          return (
            (s.full_name && typeof s.full_name === 'string' && s.full_name.toLowerCase().includes(term)) ||
            (s.student_id && typeof s.student_id === 'string' && s.student_id.toLowerCase().includes(term)) ||
            (s.email && typeof s.email === 'string' && s.email.toLowerCase().includes(term))
          )
        })
      }

      if (filterSection) {
        const sectionNum = parseInt(filterSection, 10)
        if (!isNaN(sectionNum)) {
          filtered = filtered.filter(s => s && typeof s === 'object' && s.section_number === sectionNum)
        }
      }

      if (filterGroup) {
        filtered = filtered.filter(s => s && typeof s === 'object' && s.group_name === filterGroup)
      }

      if (filterRegistered !== '') {
        const isRegistered = filterRegistered === 'true'
        filtered = filtered.filter(s => {
          if (!s || typeof s !== 'object') return false
          // If student is in unregistered ref, treat as unregistered
          if (unregisteredStudentsRef.current.has(s.id)) {
            return !isRegistered // Show only if filtering for unregistered
          }
          return s.is_registered === isRegistered
        })
      }

      // Also filter out students that are marked as unregistered in ref (if showing all)
      if (filterRegistered === '') {
        // When showing all, still respect the unregistered ref
        // But don't filter them out - just ensure their status is correct
        filtered = filtered.map(s => {
          if (unregisteredStudentsRef.current.has(s.id)) {
            return { ...s, is_registered: false, registered_at: null }
          }
          return s
        })
      }

      return filtered
    } catch (error) {
      console.error('[Verification List] Error in filteredStudentsMemo:', error)
      return []
    }
  }, [students, searchTerm, filterSection, filterGroup, filterRegistered])

  useEffect(() => {
    setFilteredStudents(filteredStudentsMemo)
  }, [filteredStudentsMemo])

  const loadStudents = async (showLoading = false) => {
    try {
      if (showLoading) {
        setMessage(null) // Clear previous messages
      }

      // Add cache busting to ensure fresh data
      const cacheBuster = `?t=${Date.now()}`
      const response = await authenticatedFetch(
        `/api/admin/verification/list${cacheBuster}`,
        { 
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        },
        () => {
          setMessage({ type: 'error', text: 'Authentication required. Please log in again.' })
          router.push('/login?redirect=/admin/verification-list')
        }
      )

      if (!response) {
        return
      }

      const data = await response.json()

      if (response.ok && data.success) {
        // Update students, ensuring unregistered students have correct status
        const studentsArray = (data.students || []).map((s: any) => {
          // If student is marked as unregistered in ref, ensure is_registered is false
          if (unregisteredStudentsRef.current.has(s.id)) {
            return { ...s, is_registered: false, registered_at: null }
          }
          return s
        })
        
        setStudents(studentsArray)
        if (studentsArray.length === 0 && (!data.students || data.students.length === 0)) {
          setMessage({ type: 'error', text: 'No students found in verification list. Please upload students first.' })
        }
      } else {
        console.error('Failed to load students:', data.error || 'Unknown error')
        setMessage({ type: 'error', text: data.error || 'Failed to load students. Please try again.' })
      }
    } catch (err) {
      console.error('Error loading students:', err)
      setMessage({ type: 'error', text: `Error loading students: ${err instanceof Error ? err.message : 'Unknown error'}` })
    }
  }

  const startEdit = (student: Student) => {
    setEditingId(student.id)
    setEditData({
      full_name: student.full_name,
      section_number: student.section_number,
      group_name: student.group_name,
      student_id: student.student_id || '',
      email: student.email || '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await authenticatedFetch(
        '/api/admin/verification/update',
        {
          method: 'PUT',
          body: JSON.stringify({
            id,
            ...editData,
          }),
        },
        () => {
          setMessage({ type: 'error', text: 'Authentication required. Please log in again.' })
          router.push('/login?redirect=/admin/verification-list')
        }
      )

      if (!response) {
        setSaving(false)
        return
      }

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Student updated successfully' })
        setEditingId(null)
        setEditData({})
        await loadStudents()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update student' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error updating student' })
    } finally {
      setSaving(false)
    }
  }

  // Unregister student - move from registered to unregistered
  const handleUnregisterStudent = async (verificationId: string, studentName: string) => {
    // Confirm unregistration
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
        setMessage({ type: 'error', text: `فشل إلغاء التسجيل: ${errorData.error || 'خطأ غير معروف'}` })
        return
      }

      const data = await response.json()
      
      if (data.success) {
        // Mark student as unregistered to prevent reappearing
        unregisteredStudentsRef.current.add(verificationId)
        
        // Find student and update immediately (optimistic update)
        const studentToUnregister = students.find(s => s.id === verificationId)
        
        if (studentToUnregister) {
          // Update student status IMMEDIATELY (optimistic update)
          setStudents(prev => prev.map(s => 
            s.id === verificationId 
              ? { ...s, is_registered: false, registered_at: null }
              : s
          ))
          setFilteredStudents(prev => prev.map(s => 
            s.id === verificationId 
              ? { ...s, is_registered: false, registered_at: null }
              : s
          ))
        }
        
        setMessage({ type: 'success', text: 'تم إلغاء تسجيل الطالب بنجاح. يمكنه التسجيل مرة أخرى لاحقاً.' })
        
        // DO NOT refresh immediately - the UI is already updated
        // Only refresh after a delay to allow server to sync, but filter out unregistered students
        setTimeout(() => {
          // Clear the unregistered flag after 5 seconds (server should be synced by then)
          setTimeout(() => {
            unregisteredStudentsRef.current.delete(verificationId)
          }, 5000)
          
          // Refresh to get updated data from server (but unregistered student won't reappear)
          loadStudents(false).catch(err => {
            console.error('[Verification List] Error refreshing after unregister:', err)
          })
        }, 2000) // Wait 2 seconds before refreshing
      } else {
        setMessage({ type: 'error', text: `فشل إلغاء التسجيل: ${data.error || 'خطأ غير معروف'}` })
      }
    } catch (err) {
      console.error('[Verification List] Error unregistering student:', err)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء إلغاء التسجيل. يرجى المحاولة مرة أخرى.' })
    } finally {
      setUnregisteringId(null)
    }
  }

  // Delete all students and unregister all 703 students
  const handleDeleteAllStudents = async () => {
    const confirmed = window.confirm(
      `⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!\n\nهل أنت متأكد من حذف جميع حسابات الطلاب وجعل جميع الـ 703 طالب غير مسجلين؟\n\nسيتم:\n- حذف جميع حسابات الطلاب من جدول users\n- جعل جميع الـ 703 طالب في verification_list غير مسجلين\n- إعادة تعيين جميع حالات التسجيل\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه!`
    )

    if (!confirmed) {
      return
    }

    // Double confirmation
    const doubleConfirm = window.confirm(
      `⚠️ تأكيد نهائي!\n\nأنت على وشك حذف جميع حسابات الطلاب وجعل جميع الـ 703 طالب غير مسجلين.\n\nهل أنت متأكد 100%؟`
    )

    if (!doubleConfirm) {
      return
    }

    setDeletingAll(true)
    setMessage(null)

    try {
      const response = await authenticatedFetch(
        '/api/admin/users/delete-all-students',
        {
          method: 'DELETE',
        },
        () => router.push('/login')
      )

      if (!response) {
        setDeletingAll(false)
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setMessage({ 
          type: 'error', 
          text: `فشل حذف جميع الطلاب: ${errorData.error || 'خطأ غير معروف'}` 
        })
        setDeletingAll(false)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `تم بنجاح: حذف ${data.deletedCount} حساب طالب وجعل جميع الـ 703 طالب غير مسجلين` 
        })
        
        // Clear all students from UI
        setStudents([])
        setFilteredStudents([])
        
        // Refresh after a delay to show updated data
        setTimeout(() => {
          loadStudents(true).catch(err => {
            console.error('[Verification List] Error refreshing after delete all:', err)
          })
        }, 2000)
      } else {
        setMessage({ 
          type: 'error', 
          text: `فشل العملية: ${data.error || 'خطأ غير معروف'}` 
        })
      }
    } catch (err) {
      console.error('[Verification List] Error deleting all students:', err)
      setMessage({ 
        type: 'error', 
        text: 'حدث خطأ أثناء حذف جميع الطلاب. يرجى المحاولة مرة أخرى.' 
      })
    } finally {
      setDeletingAll(false)
    }
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-dark-100 mb-2">Access Denied</h1>
          <p className="text-dark-300 mb-4">Admin access required</p>
          <button
            onClick={() => router.push('/login?redirect=/admin/verification-list')}
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
                Student Verification List
              </h1>
              <p className="text-dark-300">
                Manage and update student data (Total: {students.length} students)
              </p>
            </div>
            <button
              onClick={handleDeleteAllStudents}
              disabled={deletingAll}
              className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title="حذف جميع حسابات الطلاب وجعل جميع الـ 703 طالب غير مسجلين"
            >
              {deletingAll ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الحذف...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>حذف جميع الطلاب (703)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-cyber-green/20 border border-cyber-green/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-cyber-green' : 'text-red-300'}>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto text-dark-400 hover:text-dark-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters - Fixed height to prevent CLS */}
        <div className="mb-6 enhanced-card p-6 animate-slide-up min-h-[140px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, ID, or email..."
                  className="w-full pl-10 p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Section</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
              >
                <option value="">All Sections</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Section {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Group</label>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
              >
                <option value="">All Groups</option>
                <option value="Group 1">Group 1 (A)</option>
                <option value="Group 2">Group 2 (B)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Status</label>
              <select
                value={filterRegistered}
                onChange={(e) => setFilterRegistered(e.target.value)}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
              >
                <option value="">All</option>
                <option value="false">Not Registered</option>
                <option value="true">Registered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table - Fixed layout to prevent CLS */}
        <div className="enhanced-card overflow-hidden animate-slide-up min-h-[600px]">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[20%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[20%]" />
                <col className="w-[12%]" />
                <col className="w-[18%]" />
              </colgroup>
              <thead className="bg-cyber-dark/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-cyber-neon border-b border-cyber-neon/20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-dark-300">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-cyber-neon/5 transition-colors border-b border-dark-200/10"
                    >
                      <td className="px-6 py-4 text-dark-300">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editData.student_id || ''}
                            onChange={(e) => setEditData({ ...editData, student_id: e.target.value })}
                            className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded text-dark-100"
                            placeholder="Student ID"
                          />
                        ) : (
                          student.student_id || '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-dark-100 font-semibold">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editData.full_name || ''}
                            onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                            className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded text-dark-100"
                            placeholder="Full Name"
                          />
                        ) : (
                          student.full_name
                        )}
                      </td>
                      <td className="px-6 py-4 text-dark-300">
                        {editingId === student.id ? (
                          <select
                            value={editData.section_number || ''}
                            onChange={(e) => setEditData({ ...editData, section_number: parseInt(e.target.value) })}
                            className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded text-dark-100"
                          >
                            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        ) : (
                          student.section_number
                        )}
                      </td>
                      <td className="px-6 py-4 text-dark-300">
                        {editingId === student.id ? (
                          <select
                            value={editData.group_name || ''}
                            onChange={(e) => setEditData({ ...editData, group_name: e.target.value as 'Group 1' | 'Group 2' })}
                            className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded text-dark-100"
                          >
                            <option value="Group 1">Group 1 (A)</option>
                            <option value="Group 2">Group 2 (B)</option>
                          </select>
                        ) : (
                          student.group_name
                        )}
                      </td>
                      <td className="px-6 py-4 text-dark-300">
                        {editingId === student.id ? (
                          <input
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded text-dark-100"
                            placeholder="Email"
                          />
                        ) : (
                          student.email || '-'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.is_registered ? (
                          <span className="px-2 py-1 bg-cyber-green/20 text-cyber-green rounded text-xs font-medium">
                            Registered
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-cyber-neon/20 text-cyber-neon rounded text-xs font-medium">
                            Not Registered
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEdit(student.id)}
                              disabled={saving}
                              className="p-2 bg-cyber-green/20 text-cyber-green rounded hover:bg-cyber-green/30 transition-colors disabled:opacity-50"
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={saving}
                              className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(student)}
                              className="p-2 bg-cyber-neon/20 text-cyber-neon rounded hover:bg-cyber-neon/30 transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {/* Unregister button - only show for registered students */}
                            {student.is_registered && (
                              <button
                                onClick={() => handleUnregisterStudent(student.id, student.full_name)}
                                disabled={unregisteringId === student.id}
                                className="p-2 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="إلغاء تسجيل الطالب (إرجاعه إلى قائمة غير المسجلين)"
                              >
                                {unregisteringId === student.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-4 bg-cyber-dark/50 border-t border-cyber-neon/20">
            <div className="flex items-center justify-between text-sm text-dark-300">
              <span>
                Showing {filteredStudents.length} of {students.length} students
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Registered: <span className="text-cyber-green font-bold">
                    {(() => {
                      const studentsArray = Array.isArray(students) ? students : []
                      return studentsArray.filter(s => s && s.is_registered).length
                    })()}
                  </span>
                </span>
                <span>
                  Not Registered: <span className="text-cyber-neon font-bold">
                    {(() => {
                      const studentsArray = Array.isArray(students) ? students : []
                      return studentsArray.filter(s => s && !s.is_registered).length
                    })()}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

