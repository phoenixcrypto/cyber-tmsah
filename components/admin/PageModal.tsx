'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, FileText, Hash, Sparkles } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'

interface Page {
  id?: string
  slug: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  metaDescription?: string | null
  metaDescriptionEn?: string | null
  status: 'published' | 'draft'
  order?: number | null
}

interface PageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  page?: Page | null
}

export default function PageModal({ isOpen, onClose, onSave, page }: PageModalProps) {
  const [formData, setFormData] = useState<Page>({
    slug: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    metaDescription: null,
    metaDescriptionEn: null,
    status: 'draft',
    order: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug || '',
        title: page.title || '',
        titleEn: page.titleEn || '',
        content: page.content || '',
        contentEn: page.contentEn || '',
        metaDescription: page.metaDescription || null,
        metaDescriptionEn: page.metaDescriptionEn || null,
        status: page.status || 'draft',
        order: page.order || 0,
      })
    } else {
      setFormData({
        slug: '',
        title: '',
        titleEn: '',
        content: '',
        contentEn: '',
        metaDescription: null,
        metaDescriptionEn: null,
        status: 'draft',
        order: 0,
      })
    }
    setErrors({})
  }, [page, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['slug'].trim()) newErrors['slug'] = 'الرابط مطلوب'
    if (!formData['title'].trim()) newErrors['title'] = 'العنوان مطلوب'
    if (!formData['content'].trim()) newErrors['content'] = 'المحتوى مطلوب'

    // Validate slug format
    if (formData['slug'] && !/^[a-z0-9-]+$/.test(formData['slug'])) {
      newErrors['slug'] = 'الرابط يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = page?.id ? `/api/pages/${page.id}` : '/api/pages'
      const method = page?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData['slug'].trim(),
          title: formData['title'].trim(),
          titleEn: formData['titleEn'].trim() || formData['title'].trim(),
          content: formData['content'].trim(),
          contentEn: formData['contentEn'].trim() || formData['content'].trim(),
          metaDescription: formData['metaDescription'] || null,
          metaDescriptionEn: formData['metaDescriptionEn'] || formData['metaDescription'] || null,
          status: formData['status'],
          order: formData['order'] || 0,
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
          style={{ maxWidth: '90vw', width: '1200px', maxHeight: '95vh', overflowY: 'auto' }}
        >
          <div className="admin-modal-bg"></div>
          <div className="admin-modal-glow"></div>

          {/* Modal Header */}
          <div className="admin-modal-header">
            <div>
              <h2 className="admin-modal-title">
                {page?.id ? 'تعديل صفحة' : 'إضافة صفحة جديدة'}
              </h2>
              <p className="admin-modal-description">
                {page?.id ? 'قم بتعديل بيانات الصفحة' : 'أدخل بيانات الصفحة الجديدة'}
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
              {/* Slug */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <Hash className="w-4 h-4" />
                  <span>الرابط (Slug) *</span>
                </label>
                <input
                  type="text"
                  value={formData['slug']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['slug'] = e.target.value.toLowerCase().replace(/\s+/g, '-')
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['slug'] ? 'error' : ''}`}
                  placeholder="مثال: about-us"
                  disabled={!!page?.id}
                />
                {errors['slug'] && <span className="admin-modal-form-error">{errors['slug']}</span>}
                <small style={{ color: 'var(--dark-400)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {page?.id ? 'لا يمكن تغيير الرابط بعد الإنشاء' : 'سيتم الوصول للصفحة عبر /[slug]'}
                </small>
              </div>

              {/* Order */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>الترتيب</span>
                </label>
                <input
                  type="number"
                  value={formData['order'] || 0}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['order'] = parseInt(e.target.value) || 0
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  min="0"
                />
              </div>

              {/* Title */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
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
                  placeholder="عنوان الصفحة"
                />
                {errors['title'] && <span className="admin-modal-form-error">{errors['title']}</span>}
              </div>

              {/* Title En */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
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
                  placeholder="Page title in English"
                />
              </div>

              {/* Status */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
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

              {/* Meta Description */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="admin-modal-form-label" style={{ margin: 0 }}>
                    <FileText className="w-4 h-4" />
                    <span>وصف SEO (عربي)</span>
                  </label>
                  <motion.button
                    type="button"
                    onClick={async () => {
                      if (!formData['title']?.trim()) {
                        alert('يرجى إدخال عنوان الصفحة أولاً')
                        return
                      }
                      try {
                        const res = await fetch('/api/ai/generate-description', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: formData['title'],
                            type: 'page',
                            language: 'ar'
                          })
                        })
                        const data = await res.json()
                        if (data.success) {
                          setFormData({ ...formData, metaDescription: data.description })
                        }
                      } catch (error) {
                        console.error('Error generating description:', error)
                      }
                    }}
                    className="admin-generate-description-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!formData['title']?.trim()}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>توليد وصف</span>
                  </motion.button>
                </div>
                <textarea
                  value={formData['metaDescription'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['metaDescription'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="وصف مختصر للصفحة لمحركات البحث..."
                  rows={2}
                />
              </div>

              {/* Meta Description En */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="admin-modal-form-label" style={{ margin: 0 }}>
                    <FileText className="w-4 h-4" />
                    <span>وصف SEO (إنجليزي)</span>
                  </label>
                  <motion.button
                    type="button"
                    onClick={async () => {
                      if (!formData['titleEn']?.trim() && !formData['title']?.trim()) {
                        alert('يرجى إدخال عنوان الصفحة أولاً')
                        return
                      }
                      try {
                        const res = await fetch('/api/ai/generate-description', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: formData['titleEn'] || formData['title'],
                            type: 'page',
                            language: 'en'
                          })
                        })
                        const data = await res.json()
                        if (data.success) {
                          setFormData({ ...formData, metaDescriptionEn: data.description })
                        }
                      } catch (error) {
                        console.error('Error generating description:', error)
                      }
                    }}
                    className="admin-generate-description-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!formData['titleEn']?.trim() && !formData['title']?.trim()}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>توليد وصف</span>
                  </motion.button>
                </div>
                <textarea
                  value={formData['metaDescriptionEn'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['metaDescriptionEn'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="SEO description in English..."
                  rows={2}
                />
              </div>

              {/* Content */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>المحتوى (عربي) *</span>
                </label>
                <div style={{ minHeight: '400px' }}>
                  <RichTextEditor
                    value={formData['content']}
                    onChange={(value) => {
                      const newData = { ...formData }
                      newData['content'] = value
                      setFormData(newData)
                    }}
                    placeholder="اكتب محتوى الصفحة هنا..."
                    height="400px"
                    language="ar"
                  />
                </div>
                {errors['content'] && <span className="admin-modal-form-error">{errors['content']}</span>}
              </div>

              {/* Content En */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>المحتوى (إنجليزي)</span>
                </label>
                <div style={{ minHeight: '400px' }}>
                  <RichTextEditor
                    value={formData['contentEn']}
                    onChange={(value) => {
                      const newData = { ...formData }
                      newData['contentEn'] = value
                      setFormData(newData)
                    }}
                    placeholder="Write page content in English here..."
                    height="400px"
                    language="en"
                  />
                </div>
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

