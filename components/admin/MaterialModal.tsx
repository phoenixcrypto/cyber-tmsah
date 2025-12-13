'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, BookOpen, Palette, Type } from 'lucide-react'

interface Material {
  id?: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: string
  color: string
}

interface MaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  material?: Material | null
}

const iconOptions = [
  'BookOpen', 'Shield', 'Lock', 'Key', 'Code', 'Database', 'Network', 'Server',
  'Terminal', 'FileCode', 'Bug', 'AlertTriangle', 'CheckCircle', 'XCircle',
  'Zap', 'Cpu', 'HardDrive', 'Wifi', 'Globe', 'Cloud', 'GitBranch'
]

const colorOptions = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-indigo-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-cyan-500',
]

export default function MaterialModal({ isOpen, onClose, onSave, material }: MaterialModalProps) {
  const [formData, setFormData] = useState<Material>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    icon: 'BookOpen',
    color: 'from-blue-500 to-cyan-500',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        titleEn: material.titleEn || '',
        description: material.description || '',
        descriptionEn: material.descriptionEn || '',
        icon: material.icon || 'BookOpen',
        color: material.color || 'from-blue-500 to-cyan-500',
      })
    } else {
      setFormData({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        icon: 'BookOpen',
        color: 'from-blue-500 to-cyan-500',
      })
    }
    setErrors({})
  }, [material, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['title'].trim()) newErrors['title'] = 'العنوان مطلوب'
    if (!formData['description'].trim()) newErrors['description'] = 'الوصف مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = material?.id ? `/api/materials/${material.id}` : '/api/materials'
      const method = material?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData['title'].trim(),
          titleEn: formData['titleEn'].trim() || formData['title'].trim(),
          description: formData['description'].trim(),
          descriptionEn: formData['descriptionEn'].trim() || formData['description'].trim(),
          icon: formData['icon'],
          color: formData['color'],
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="admin-modal-bg"></div>
          <div className="admin-modal-glow"></div>

          {/* Modal Header */}
          <div className="admin-modal-header">
            <div>
              <h2 className="admin-modal-title">
                {material?.id ? 'تعديل مادة دراسية' : 'إضافة مادة دراسية جديدة'}
              </h2>
              <p className="admin-modal-description">
                {material?.id ? 'قم بتعديل بيانات المادة الدراسية' : 'أدخل بيانات المادة الدراسية الجديدة'}
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
                  <Type className="w-4 h-4" />
                  <span>العنوان (عربي) *</span>
                </label>
                <input
                  type="text"
                  value={formData['title']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['title'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['title'] ? 'error' : ''}`}
                  placeholder="مثال: الأمن السيبراني"
                />
                {errors['title'] && <span className="admin-modal-form-error">{errors['title']}</span>}
              </div>

              {/* Title En */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Type className="w-4 h-4" />
                  <span>العنوان (إنجليزي)</span>
                </label>
                <input
                  type="text"
                  value={formData['titleEn']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['titleEn'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="Example: Cybersecurity"
                />
              </div>

              {/* Description */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>الوصف (عربي) *</span>
                </label>
                <textarea
                  value={formData['description']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['description'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['description'] ? 'error' : ''}`}
                  placeholder="وصف المادة الدراسية..."
                  rows={4}
                />
                {errors['description'] && <span className="admin-modal-form-error">{errors['description']}</span>}
              </div>

              {/* Description En */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>الوصف (إنجليزي)</span>
                </label>
                <textarea
                  value={formData['descriptionEn']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['descriptionEn'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="Material description in English..."
                  rows={4}
                />
              </div>

              {/* Icon */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>الأيقونة</span>
                </label>
                <select
                  value={formData['icon']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['icon'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-select"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Palette className="w-4 h-4" />
                  <span>اللون</span>
                </label>
                <select
                  value={formData['color']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['color'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-select"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
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

