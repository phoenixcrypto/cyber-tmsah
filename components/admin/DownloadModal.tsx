'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Download, Link as LinkIcon, Video, Tag } from 'lucide-react'

interface Download {
  id?: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string
  videoUrl?: string | null
  downloadUrl?: string | null
  category?: string | null
}

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  download?: Download | null
}

const iconOptions = [
  'Download', 'FileText', 'Code', 'Database', 'Server', 'Terminal', 'Cpu',
  'HardDrive', 'Wifi', 'Globe', 'Cloud', 'GitBranch', 'Package', 'Box'
]

export default function DownloadModal({ isOpen, onClose, onSave, download }: DownloadModalProps) {
  const [formData, setFormData] = useState<Download>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    icon: 'Download',
    videoUrl: null,
    downloadUrl: null,
    category: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (download) {
      setFormData({
        name: download.name || '',
        nameEn: download.nameEn || '',
        description: download.description || '',
        descriptionEn: download.descriptionEn || '',
        icon: download.icon || 'Download',
        videoUrl: download.videoUrl || null,
        downloadUrl: download.downloadUrl || null,
        category: download.category || null,
      })
    } else {
      setFormData({
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        icon: 'Download',
        videoUrl: null,
        downloadUrl: null,
        category: null,
      })
    }
    setErrors({})
  }, [download, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['name'].trim()) newErrors['name'] = 'الاسم مطلوب'
    if (!formData['description'].trim()) newErrors['description'] = 'الوصف مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = download?.id ? `/api/downloads/${download.id}` : '/api/downloads'
      const method = download?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData['name'].trim(),
          nameEn: formData['nameEn'].trim() || formData['name'].trim(),
          description: formData['description'].trim(),
          descriptionEn: formData['descriptionEn'].trim() || formData['description'].trim(),
          icon: formData['icon'],
          videoUrl: formData['videoUrl'] || null,
          downloadUrl: formData['downloadUrl'] || null,
          category: formData['category'] || null,
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
                {download?.id ? 'تعديل برنامج' : 'إضافة برنامج جديد'}
              </h2>
              <p className="admin-modal-description">
                {download?.id ? 'قم بتعديل بيانات البرنامج' : 'أدخل بيانات البرنامج الجديد'}
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
                  <Download className="w-4 h-4" />
                  <span>الاسم (عربي) *</span>
                </label>
                <input
                  type="text"
                  value={formData['name']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['name'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['name'] ? 'error' : ''}`}
                  placeholder="مثال: Kali Linux"
                />
                {errors['name'] && <span className="admin-modal-form-error">{errors['name']}</span>}
              </div>

              {/* Name En */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Download className="w-4 h-4" />
                  <span>الاسم (إنجليزي)</span>
                </label>
                <input
                  type="text"
                  value={formData['nameEn']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['nameEn'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="Example: Kali Linux"
                />
              </div>

              {/* Description */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <Download className="w-4 h-4" />
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
                  placeholder="وصف البرنامج..."
                  rows={4}
                />
                {errors['description'] && <span className="admin-modal-form-error">{errors['description']}</span>}
              </div>

              {/* Description En */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <Download className="w-4 h-4" />
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
                  placeholder="Software description in English..."
                  rows={4}
                />
              </div>

              {/* Icon */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Download className="w-4 h-4" />
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

              {/* Category */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Tag className="w-4 h-4" />
                  <span>الفئة</span>
                </label>
                <input
                  type="text"
                  value={formData['category'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['category'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="مثال: أنظمة التشغيل"
                />
              </div>

              {/* Video URL */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Video className="w-4 h-4" />
                  <span>رابط الفيديو</span>
                </label>
                <input
                  type="url"
                  value={formData['videoUrl'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['videoUrl'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="https://youtube.com/..."
                />
              </div>

              {/* Download URL */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <LinkIcon className="w-4 h-4" />
                  <span>رابط التحميل</span>
                </label>
                <input
                  type="url"
                  value={formData['downloadUrl'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['downloadUrl'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="https://example.com/download"
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

