'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Newspaper, Link as LinkIcon, Calendar } from 'lucide-react'

interface News {
  id?: string
  title: string
  titleEn: string
  subjectId: string
  subjectTitle: string
  subjectTitleEn: string
  url: string
  status: 'published' | 'draft'
  publishedAt?: string
}

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  news?: News | null
}

export default function NewsModal({ isOpen, onClose, onSave, news }: NewsModalProps) {
  const [formData, setFormData] = useState<Omit<News, 'publishedAt'> & { publishedAt: string }>({
    title: '',
    titleEn: '',
    subjectId: '',
    subjectTitle: '',
    subjectTitleEn: '',
    url: '',
    status: 'draft',
    publishedAt: (new Date().toISOString().split('T')[0] ?? '') as string,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        titleEn: news.titleEn || '',
        subjectId: news.subjectId || '',
        subjectTitle: news.subjectTitle || '',
        subjectTitleEn: news.subjectTitleEn || '',
        url: news.url || '',
        status: news.status || 'draft',
        publishedAt: (news.publishedAt ? (new Date(news.publishedAt).toISOString().split('T')[0] ?? '') : (new Date().toISOString().split('T')[0] ?? '')) as string,
      })
    } else {
      setFormData({
        title: '',
        titleEn: '',
        subjectId: '',
        subjectTitle: '',
        subjectTitleEn: '',
        url: '',
        status: 'draft',
        publishedAt: new Date().toISOString().split('T')[0] || '',
      })
    }
    setErrors({})
  }, [news, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['title'].trim()) newErrors['title'] = 'العنوان مطلوب'
    if (!formData['subjectId'].trim()) newErrors['subjectId'] = 'معرف المادة مطلوب'
    if (!formData['subjectTitle'].trim()) newErrors['subjectTitle'] = 'عنوان المادة مطلوب'
    if (!formData['url'].trim()) newErrors['url'] = 'الرابط مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = news?.id ? `/api/news/${news.id}` : '/api/news'
      const method = news?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData['title'].trim(),
          titleEn: formData['titleEn'].trim() || formData['title'].trim(),
          subjectId: formData['subjectId'].trim(),
          subjectTitle: formData['subjectTitle'].trim(),
          subjectTitleEn: formData['subjectTitleEn'].trim() || formData['subjectTitle'].trim(),
          url: formData['url'].trim(),
          status: formData['status'],
          publishedAt: formData['publishedAt'] || new Date().toISOString().split('T')[0],
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
                {news?.id ? 'تعديل خبر' : 'إضافة خبر جديد'}
              </h2>
              <p className="admin-modal-description">
                {news?.id ? 'قم بتعديل بيانات الخبر' : 'أدخل بيانات الخبر الجديد'}
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
                  <Newspaper className="w-4 h-4" />
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
                  placeholder="عنوان الخبر"
                />
                {errors['title'] && <span className="admin-modal-form-error">{errors['title']}</span>}
              </div>

              {/* Title En */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Newspaper className="w-4 h-4" />
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
                  placeholder="News title in English"
                />
              </div>

              {/* Subject ID */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Newspaper className="w-4 h-4" />
                  <span>معرف المادة *</span>
                </label>
                <input
                  type="text"
                  value={formData['subjectId']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['subjectId'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['subjectId'] ? 'error' : ''}`}
                  placeholder="مثال: material-1"
                />
                {errors['subjectId'] && <span className="admin-modal-form-error">{errors['subjectId']}</span>}
              </div>

              {/* Subject Title */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Newspaper className="w-4 h-4" />
                  <span>عنوان المادة *</span>
                </label>
                <input
                  type="text"
                  value={formData['subjectTitle']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['subjectTitle'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['subjectTitle'] ? 'error' : ''}`}
                  placeholder="مثال: الأمن السيبراني"
                />
                {errors['subjectTitle'] && <span className="admin-modal-form-error">{errors['subjectTitle']}</span>}
              </div>

              {/* Subject Title En */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Newspaper className="w-4 h-4" />
                  <span>عنوان المادة (إنجليزي)</span>
                </label>
                <input
                  type="text"
                  value={formData['subjectTitleEn']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['subjectTitleEn'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="Example: Cybersecurity"
                />
              </div>

              {/* URL */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <LinkIcon className="w-4 h-4" />
                  <span>الرابط *</span>
                </label>
                <input
                  type="url"
                  value={formData['url']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['url'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['url'] ? 'error' : ''}`}
                  placeholder="https://example.com/news"
                />
                {errors['url'] && <span className="admin-modal-form-error">{errors['url']}</span>}
              </div>

              {/* Status */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Newspaper className="w-4 h-4" />
                  <span>الحالة</span>
                </label>
                <select
                  value={formData['status']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['status'] = e.target.value as 'published' | 'draft'
                    setFormData(newData)
                  }}
                  className="admin-modal-form-select"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>

              {/* Published At */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Calendar className="w-4 h-4" />
                  <span>تاريخ النشر</span>
                </label>
                <input
                  type="date"
                  value={formData['publishedAt'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['publishedAt'] = e.target.value
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
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

