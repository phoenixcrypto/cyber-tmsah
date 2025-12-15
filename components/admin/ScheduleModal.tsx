'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Calendar, Clock, MapPin, User, BookOpen, Users } from 'lucide-react'

interface ScheduleItem {
  id?: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab'
  group: 'Group 1' | 'Group 2'
  sectionNumber?: number | null
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
}

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  schedule?: ScheduleItem | null
}

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const daysArabic = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']

export default function ScheduleModal({ isOpen, onClose, onSave, schedule }: ScheduleModalProps) {
  const [formData, setFormData] = useState<ScheduleItem>({
    title: '',
    time: '',
    location: '',
    instructor: '',
    type: 'lecture',
    group: 'Group 1',
    sectionNumber: null,
    day: 'Saturday',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title || '',
        time: schedule.time || '',
        location: schedule.location || '',
        instructor: schedule.instructor || '',
        type: schedule.type || 'lecture',
        group: schedule.group || 'Group 1',
        sectionNumber: schedule.sectionNumber || null,
        day: schedule.day || 'Saturday',
      })
    } else {
      setFormData({
        title: '',
        time: '',
        location: '',
        instructor: '',
        type: 'lecture',
        group: 'Group 1',
        sectionNumber: null,
        day: 'Saturday',
      })
    }
    setErrors({})
  }, [schedule, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['title'].trim()) newErrors['title'] = 'المادة مطلوبة'
    if (!formData['time'].trim()) newErrors['time'] = 'الوقت مطلوب'
    if (!formData['location'].trim()) newErrors['location'] = 'المكان مطلوب'
    if (!formData['instructor'].trim()) newErrors['instructor'] = 'المحاضر مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = schedule?.id ? `/api/admin/schedule/${schedule.id}` : '/api/schedule'
      const method = schedule?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          time: formData.time.trim(),
          location: formData.location.trim(),
          instructor: formData.instructor.trim(),
          type: formData.type,
          group: formData.group,
          sectionNumber: formData.sectionNumber || null,
          day: formData.day,
        }),
      })

      if (res.ok) {
        setIsSubmitting(false)
        if (onSave) {
          onSave()
        } else {
          window.location.reload()
        }
        onClose()
      } else {
        const errorData = await res.json()
        setIsSubmitting(false)
        alert(errorData.error || 'حدث خطأ أثناء الحفظ')
      }
    } catch (error) {
      console.error('Save error:', error)
      setIsSubmitting(false)
      alert('حدث خطأ أثناء الحفظ')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="admin-modal-overlay" onClick={onClose}>
        <motion.div
          className="admin-modal"
          initial={{ opacity: 0, scale: 0.85, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30, rotateX: -15 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 150,
            damping: 15
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="admin-modal-bg"></div>
          <div className="admin-modal-glow"></div>

          {/* Modal Header */}
          <div className="admin-modal-header">
            <div>
              <h2 className="admin-modal-title">
                {schedule?.id ? 'تعديل حصة دراسية' : 'إضافة حصة دراسية جديدة'}
              </h2>
              <p className="admin-modal-description">
                {schedule?.id ? 'قم بتعديل بيانات الحصة الدراسية' : 'أدخل بيانات الحصة الدراسية الجديدة'}
              </p>
            </div>
            <motion.button
              className="admin-modal-close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="admin-modal-body">
            <div className="admin-modal-form-grid">
              {/* Title */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>المادة *</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`admin-modal-form-input ${errors['title'] ? 'error' : ''}`}
                  placeholder="مثال: الأمن السيبراني"
                />
                {errors['title'] && <span className="admin-modal-form-error">{errors['title']}</span>}
              </div>

              {/* Day */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Calendar className="w-4 h-4" />
                  <span>اليوم *</span>
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value as ScheduleItem['day'] })}
                  className="admin-modal-form-select"
                >
                  {days.map((day, index) => (
                    <option key={day} value={day}>
                      {daysArabic[index]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Clock className="w-4 h-4" />
                  <span>الوقت *</span>
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`admin-modal-form-input ${errors['time'] ? 'error' : ''}`}
                  placeholder="مثال: 10:00 - 12:00"
                />
                {errors['time'] && <span className="admin-modal-form-error">{errors['time']}</span>}
              </div>

              {/* Location */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <MapPin className="w-4 h-4" />
                  <span>المكان *</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`admin-modal-form-input ${errors['location'] ? 'error' : ''}`}
                  placeholder="مثال: القاعة 101"
                />
                {errors['location'] && <span className="admin-modal-form-error">{errors['location']}</span>}
              </div>

              {/* Instructor */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <User className="w-4 h-4" />
                  <span>المحاضر *</span>
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className={`admin-modal-form-input ${errors['instructor'] ? 'error' : ''}`}
                  placeholder="اسم المحاضر"
                />
                {errors['instructor'] && <span className="admin-modal-form-error">{errors['instructor']}</span>}
              </div>

              {/* Type */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>النوع *</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'lecture' | 'lab' })}
                  className="admin-modal-form-select"
                >
                  <option value="lecture">محاضرة</option>
                  <option value="lab">معمل</option>
                </select>
              </div>

              {/* Group */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Users className="w-4 h-4" />
                  <span>المجموعة *</span>
                </label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value as 'Group 1' | 'Group 2' })}
                  className="admin-modal-form-select"
                >
                  <option value="Group 1">المجموعة الأولى</option>
                  <option value="Group 2">المجموعة الثانية</option>
                </select>
              </div>

              {/* Section Number */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Users className="w-4 h-4" />
                  <span>رقم السكشن (اختياري)</span>
                </label>
                <input
                  type="number"
                  value={formData.sectionNumber || ''}
                  onChange={(e) => setFormData({ ...formData, sectionNumber: e.target.value ? parseInt(e.target.value) : null })}
                  className="admin-modal-form-input"
                  placeholder="مثال: 1"
                  min="1"
                />
              </div>
            </div>
          </form>

          {/* Modal Footer */}
          <div className="admin-modal-footer">
            <motion.button
              className="admin-modal-btn-secondary"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
            <motion.button
              className="admin-modal-btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="admin-modal-btn-spinner"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

