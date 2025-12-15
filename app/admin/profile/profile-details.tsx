'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Save, RefreshCw, Eye, EyeOff } from 'lucide-react'

interface ProfileFormData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfileDetails() {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    // Fetch current user data
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.data?.user) {
            setFormData(prev => ({
              ...prev,
              name: data.data.user.name || '',
              email: data.data.user.email || '',
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUser()
  }, [])
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors['name'] = 'الاسم مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors['email'] = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors['email'] = 'البريد الإلكتروني غير صحيح'
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors['currentPassword'] = 'كلمة المرور الحالية مطلوبة'
      }

      if (formData.newPassword.length < 8) {
        newErrors['newPassword'] = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors['confirmPassword'] = 'كلمات المرور غير متطابقة'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      const updateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.newPassword) {
        updateData['currentPassword'] = formData.currentPassword
        updateData['newPassword'] = formData.newPassword
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        alert('تم تحديث الملف الشخصي بنجاح')
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        // Reload page to get updated data
        window.location.reload()
      } else {
        alert(data.message || 'حدث خطأ أثناء التحديث')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('حدث خطأ أثناء التحديث')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{ maxWidth: '800px', margin: '2rem auto' }}
    >
      <div className="stat-label mb-6">تعديل الملف الشخصي</div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-dark-200 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            الاسم الكامل
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`admin-navbar-search-input w-full ${errors['name'] ? 'border-red-500' : ''}`}
            placeholder="أدخل اسمك الكامل"
          />
          {errors['name'] && (
            <p className="text-red-500 text-sm mt-1">{errors['name']}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-dark-200 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`admin-navbar-search-input w-full ${errors['email'] ? 'border-red-500' : ''}`}
            placeholder="example@email.com"
          />
          {errors['email'] && (
            <p className="text-red-500 text-sm mt-1">{errors['email']}</p>
          )}
        </div>

        {/* Password Section */}
        <div className="border-t border-cyber-neon/20 pt-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">تغيير كلمة المرور</h3>
          <p className="text-sm text-dark-400 mb-4">اترك الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور</p>

          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-dark-200 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`admin-navbar-search-input w-full pr-10 ${errors['currentPassword'] ? 'border-red-500' : ''}`}
                placeholder="أدخل كلمة المرور الحالية"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors['currentPassword'] && (
              <p className="text-red-500 text-sm mt-1">{errors['currentPassword']}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-dark-200 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`admin-navbar-search-input w-full pr-10 ${errors['newPassword'] ? 'border-red-500' : ''}`}
                placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors['newPassword'] && (
              <p className="text-red-500 text-sm mt-1">{errors['newPassword']}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`admin-navbar-search-input w-full pr-10 ${errors['confirmPassword'] ? 'border-red-500' : ''}`}
                placeholder="أعد إدخال كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors['confirmPassword'] && (
              <p className="text-red-500 text-sm mt-1">{errors['confirmPassword']}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="admin-page-action-btn w-full"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
        >
          {saving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>حفظ التغييرات</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
