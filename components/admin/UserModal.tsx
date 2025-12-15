'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, User as UserIcon, Mail, Shield, Lock } from 'lucide-react'
import type { User } from '@/lib/types'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  user?: User | null
}

export default function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || 'viewer',
        password: '',
        confirmPassword: '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        role: 'viewer',
        password: '',
        confirmPassword: '',
      })
    }
    setErrors({})
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['name']) newErrors['name'] = 'الاسم مطلوب'
    if (!formData['email']) newErrors['email'] = 'البريد الإلكتروني مطلوب'
    if (!formData['username']) newErrors['username'] = 'اسم المستخدم مطلوب'
    if (!user && !formData['password']) newErrors['password'] = 'كلمة المرور مطلوبة'
    if (formData['password'] && formData['password'] !== formData['confirmPassword']) {
      newErrors['confirmPassword'] = 'كلمات المرور غير متطابقة'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    // Submit form
    setIsSubmitting(true)
    try {
      const url = user ? `/api/admin/users/${user.id}` : '/api/admin/users'
      const method = user ? 'PUT' : 'POST'
      
      // Prepare data (exclude confirmPassword)
      const { confirmPassword, ...submitData } = formData
      // Only include password if it's set (for new users or password change)
      if (!submitData.password && !user) {
        setIsSubmitting(false)
        setErrors({ password: 'كلمة المرور مطلوبة' })
        return
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      
      if (res.ok) {
        setIsSubmitting(false)
        if (onSave) {
          onSave() // Call onSave callback to refresh list
        } else {
          window.location.reload() // Fallback: reload page
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
                {user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </h2>
              <p className="admin-modal-description">
                {user ? 'قم بتعديل بيانات المستخدم' : 'أدخل بيانات المستخدم الجديد'}
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
              {/* Name */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <UserIcon className="w-4 h-4" />
                  <span>الاسم الكامل</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`admin-modal-form-input ${errors['name'] ? 'error' : ''}`}
                  placeholder="أدخل الاسم الكامل"
                />
                {errors['name'] && <span className="admin-modal-form-error">{errors['name']}</span>}
              </div>

              {/* Email */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Mail className="w-4 h-4" />
                  <span>البريد الإلكتروني</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`admin-modal-form-input ${errors['email'] ? 'error' : ''}`}
                  placeholder="user@example.com"
                />
                {errors['email'] && <span className="admin-modal-form-error">{errors['email']}</span>}
              </div>

              {/* Username */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <UserIcon className="w-4 h-4" />
                  <span>اسم المستخدم</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`admin-modal-form-input ${errors['username'] ? 'error' : ''}`}
                  placeholder="username"
                />
                {errors['username'] && (
                  <span className="admin-modal-form-error">{errors['username']}</span>
                )}
              </div>

              {/* Role */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Shield className="w-4 h-4" />
                  <span>الصلاحية</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const role = e.target.value as 'admin' | 'editor' | 'viewer'
                    if (role === 'admin' || role === 'editor' || role === 'viewer') {
                      setFormData({ ...formData, role })
                    }
                  }}
                  className="admin-modal-form-select"
                >
                  <option value="viewer">مشاهد</option>
                  <option value="editor">محرر</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              {/* Password */}
              {!user && (
                <>
                  <div className="admin-modal-form-group">
                    <label className="admin-modal-form-label">
                      <Lock className="w-4 h-4" />
                      <span>كلمة المرور</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`admin-modal-form-input ${errors['password'] ? 'error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors['password'] && (
                      <span className="admin-modal-form-error">{errors['password']}</span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="admin-modal-form-group">
                    <label className="admin-modal-form-label">
                      <Lock className="w-4 h-4" />
                      <span>تأكيد كلمة المرور</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className={`admin-modal-form-input ${errors['confirmPassword'] ? 'error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors['confirmPassword'] && (
                      <span className="admin-modal-form-error">{errors['confirmPassword']}</span>
                    )}
                  </div>
                </>
              )}
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

