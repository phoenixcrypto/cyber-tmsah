'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react'
import ScheduleModal from '@/components/admin/ScheduleModal'

interface ScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab'
  group: 'Group1' | 'Group2'
  sectionNumber?: number | null
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  createdAt: string
  updatedAt: string
}

const daysArabic: Record<string, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
}

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null)

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/schedule')
      if (res.ok) {
        const data = await res.json()
        const items = data.data.schedule || data.data.items || []
        // Transform group from Group1/Group2 to Group 1/Group 2 for display
        setSchedule(items.map((item: ScheduleItem) => ({
          ...item,
          group: item.group === 'Group1' ? 'Group 1' : 'Group 2',
        })) as ScheduleItem[])
      } else {
        console.error('Failed to fetch schedule')
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      return
    }

    try {
      const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSchedule(schedule.filter((s) => s.id !== id))
        alert('تم الحذف بنجاح')
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'حدث خطأ أثناء الحذف')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const filteredSchedule = schedule.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    daysArabic[item.day]?.includes(searchQuery)
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الجدول الدراسي</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الجدول الدراسي</h1>
          <p className="admin-page-description">إدارة الجداول الزمنية والمواد لكل المجموعات</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingSchedule(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة حصة جديدة</span>
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="admin-users-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="admin-users-search">
          <Search className="admin-users-search-icon" />
          <input
            type="text"
            placeholder="بحث عن حصة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* Schedule Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredSchedule.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <Calendar className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد عناصر في الجدول حالياً'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>اليوم</th>
                <th>الوقت</th>
                <th>المجموعة</th>
                <th>المادة</th>
                <th>النوع</th>
                <th>المكان</th>
                <th>المحاضر</th>
                <th>السكشن</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((item) => (
                <tr key={item.id}>
                  <td>{daysArabic[item.day] || item.day}</td>
                  <td>{item.time}</td>
                  <td>{item.group}</td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.type === 'lecture' ? 'محاضرة' : 'معمل'}</td>
                  <td>{item.location}</td>
                  <td>{item.instructor}</td>
                  <td>{item.sectionNumber || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button
                        className="admin-action-btn admin-action-btn-edit"
                        onClick={() => {
                          setEditingSchedule(item)
                          setIsModalOpen(true)
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="admin-action-btn admin-action-btn-delete"
                        onClick={() => handleDelete(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSchedule(null)
        }}
        onSave={fetchSchedule}
        schedule={editingSchedule ? {
          ...editingSchedule,
          group: editingSchedule.group as 'Group 1' | 'Group 2',
        } : null}
      />
    </div>
  )
}
