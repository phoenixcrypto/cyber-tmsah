'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, FileText, User, Tag, Calendar, BookOpen } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'

interface Article {
  id?: string
  materialId: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  excerpt?: string | null
  excerptEn?: string | null
  author: string
  status: 'published' | 'draft'
  publishedAt?: string | null
  tags: string[]
}

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  article?: Article | null
  materials?: Array<{ id: string; title: string }>
}

export default function ArticleModal({ isOpen, onClose, onSave, article, materials = [] }: ArticleModalProps) {
  const [formData, setFormData] = useState<Article>({
    materialId: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    excerpt: null,
    excerptEn: null,
    author: '',
    status: 'draft',
    publishedAt: null,
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (article) {
      setFormData({
        materialId: article.materialId || '',
        title: article.title || '',
        titleEn: article.titleEn || '',
        content: article.content || '',
        contentEn: article.contentEn || '',
        excerpt: article.excerpt || null,
        excerptEn: article.excerptEn || null,
        author: article.author || '',
        status: article.status || 'draft',
        publishedAt: article.publishedAt || null,
        tags: article.tags || [],
      })
    } else {
      setFormData({
        materialId: materials[0]?.id || '',
        title: '',
        titleEn: '',
        content: '',
        contentEn: '',
        excerpt: null,
        excerptEn: null,
        author: '',
        status: 'draft',
        publishedAt: null,
        tags: [],
      })
    }
    setTagInput('')
    setErrors({})
  }, [article, isOpen, materials])

  const handleAddTag = () => {
    if (tagInput.trim() && !formData['tags'].includes(tagInput.trim())) {
      const newData = { ...formData }
      newData['tags'] = [...formData['tags'], tagInput.trim()]
      setFormData(newData)
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newData = { ...formData }
    newData['tags'] = formData['tags'].filter((t) => t !== tag)
    setFormData(newData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData['materialId']) newErrors['materialId'] = 'المادة مطلوبة'
    if (!formData['title'].trim()) newErrors['title'] = 'العنوان مطلوب'
    if (!formData['content'].trim()) newErrors['content'] = 'المحتوى مطلوب'
    if (!formData['author'].trim()) newErrors['author'] = 'المؤلف مطلوب'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = article?.id ? `/api/articles/${article.id}` : '/api/articles'
      const method = article?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: formData['materialId'],
          title: formData['title'].trim(),
          titleEn: formData['titleEn'].trim() || formData['title'].trim(),
          content: formData['content'].trim(),
          contentEn: formData['contentEn'].trim() || formData['content'].trim(),
          excerpt: formData['excerpt'] || null,
          excerptEn: formData['excerptEn'] || formData['excerpt'] || null,
          author: formData['author'].trim(),
          status: formData['status'],
          publishedAt: formData['status'] === 'published' && formData['publishedAt'] ? formData['publishedAt'] : formData['status'] === 'published' ? new Date().toISOString() : null,
          tags: formData['tags'],
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
          style={{ maxWidth: '90vw', width: '1200px', maxHeight: '95vh', overflowY: 'auto' }}
        >
          <div className="admin-modal-bg"></div>
          <div className="admin-modal-glow"></div>

          {/* Modal Header */}
          <div className="admin-modal-header">
            <div>
              <h2 className="admin-modal-title">
                {article?.id ? 'تعديل مقال' : 'إضافة مقال جديد'}
              </h2>
              <p className="admin-modal-description">
                {article?.id ? 'قم بتعديل بيانات المقال' : 'أدخل بيانات المقال الجديد'}
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
              {/* Material */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <BookOpen className="w-4 h-4" />
                  <span>المادة *</span>
                </label>
                <select
                  value={formData['materialId']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['materialId'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-select ${errors['materialId'] ? 'error' : ''}`}
                >
                  <option value="">اختر المادة</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.title}
                    </option>
                  ))}
                </select>
                {errors['materialId'] && <span className="admin-modal-form-error">{errors['materialId']}</span>}
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
                  placeholder="عنوان المقال"
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
                  placeholder="Article title in English"
                />
              </div>

              {/* Author */}
              <div className="admin-modal-form-group">
                <label className="admin-modal-form-label">
                  <User className="w-4 h-4" />
                  <span>المؤلف *</span>
                </label>
                <input
                  type="text"
                  value={formData['author']}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['author'] = e.target.value
                    setFormData(newData)
                  }}
                  className={`admin-modal-form-input ${errors['author'] ? 'error' : ''}`}
                  placeholder="اسم المؤلف"
                />
                {errors['author'] && <span className="admin-modal-form-error">{errors['author']}</span>}
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

              {/* Published At */}
              {formData['status'] === 'published' && (
                <div className="admin-modal-form-group">
                  <label className="admin-modal-form-label">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ النشر</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData['publishedAt'] ? new Date(formData['publishedAt']).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const newData = { ...formData }
                      newData['publishedAt'] = e.target.value ? new Date(e.target.value).toISOString() : null
                      setFormData(newData)
                    }}
                    className="admin-modal-form-input"
                  />
                </div>
              )}

              {/* Excerpt */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>الملخص (عربي)</span>
                </label>
                <textarea
                  value={formData['excerpt'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['excerpt'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="ملخص المقال..."
                  rows={3}
                />
              </div>

              {/* Excerpt En */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>الملخص (إنجليزي)</span>
                </label>
                <textarea
                  value={formData['excerptEn'] || ''}
                  onChange={(e) => {
                    const newData = { ...formData }
                    newData['excerptEn'] = e.target.value || null
                    setFormData(newData)
                  }}
                  className="admin-modal-form-input"
                  placeholder="Article excerpt in English..."
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <FileText className="w-4 h-4" />
                  <span>المحتوى (عربي) *</span>
                </label>
                <div style={{ minHeight: '300px' }}>
                  <RichTextEditor
                    value={formData['content']}
                    onChange={(value) => {
                      const newData = { ...formData }
                      newData['content'] = value
                      setFormData(newData)
                    }}
                    placeholder="اكتب محتوى المقال هنا..."
                    height="300px"
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
                <div style={{ minHeight: '300px' }}>
                  <RichTextEditor
                    value={formData['contentEn']}
                    onChange={(value) => {
                      const newData = { ...formData }
                      newData['contentEn'] = value
                      setFormData(newData)
                    }}
                    placeholder="Write article content in English here..."
                    height="300px"
                    language="en"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="admin-modal-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-modal-form-label">
                  <Tag className="w-4 h-4" />
                  <span>الوسوم</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {formData['tags'].map((tag) => (
                    <span
                      key={tag}
                      className="admin-badge"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    className="admin-modal-form-input"
                    placeholder="أضف وسم..."
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddTag}
                    className="admin-modal-btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    إضافة
                  </motion.button>
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

