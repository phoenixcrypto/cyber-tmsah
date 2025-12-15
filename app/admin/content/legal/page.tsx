'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, X, GripVertical } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'
import Link from 'next/link'
import * as Icons from 'lucide-react'

interface LegalSection {
  id: string
  icon: string
  title: string
  content: string
  order: number
}

interface LegalPage {
  title: string
  description: string
  sections: LegalSection[]
}

function AdminLegalPageContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'privacy'
  const [page, setPage] = useState<LegalPage>({
    title: type === 'privacy' ? 'سياسة الخصوصية' : 'اتفاقية الاستخدام',
    description: '',
    sections: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [editingSection, setEditingSection] = useState<LegalSection | null>(null)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)

  const fetchPage = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/pages/legal?type=${type}`)
      if (res.ok) {
        const data = await res.json()
        if (data.data?.page) {
          setPage(data.data.page)
        } else if (data.page) {
          setPage(data.page)
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Failed to fetch legal page:', errorData)
      }
    } catch (error) {
      console.error('Error fetching legal page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch(`/api/pages/legal?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })

      if (res.ok) {
        alert('تم حفظ التغييرات بنجاح')
      } else {
        alert('حدث خطأ أثناء الحفظ')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSection = () => {
    setEditingSection({
      id: Date.now().toString(),
      icon: 'Shield',
      title: '',
      content: '',
      order: page.sections.length,
    })
    setIsSectionModalOpen(true)
  }

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Icons.Shield
    const Icon = (Icons as unknown as Record<string, typeof Icons.Shield>)[iconName]
    return Icon || Icons.Shield
  }

  const handleEditSection = (section: LegalSection) => {
    setEditingSection(section)
    setIsSectionModalOpen(true)
  }

  const handleSaveSection = () => {
    if (!editingSection) return

    if (editingSection.id && page.sections.find(s => s.id === editingSection.id)) {
      // Update existing
      setPage({
        ...page,
        sections: page.sections.map(s => s.id === editingSection.id ? editingSection : s),
      })
    } else {
      // Add new
      setPage({
        ...page,
        sections: [...page.sections, { ...editingSection, order: page.sections.length }],
      })
    }

    setIsSectionModalOpen(false)
    setEditingSection(null)
  }

  const handleDeleteSection = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return
    setPage({
      ...page,
      sections: page.sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })),
    })
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة {type === 'privacy' ? 'سياسة الخصوصية' : 'اتفاقية الاستخدام'}</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة {type === 'privacy' ? 'سياسة الخصوصية' : 'اتفاقية الاستخدام'}</h1>
          <p className="admin-page-description">إدارة محتوى الصفحة القانونية</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className="admin-page-action-btn"
            onClick={handleAddSection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة قسم</span>
          </motion.button>
          <motion.button
            className={`admin-page-action-btn ${previewMode ? 'bg-cyber-neon/20' : ''}`}
            onClick={() => setPreviewMode(!previewMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {previewMode ? (
              <>
                <EyeOff className="w-5 h-5" />
                <span>إخفاء المعاينة</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>معاينة الصفحة</span>
              </>
            )}
          </motion.button>
          <motion.button
            className="admin-page-action-btn"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
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
        </div>
      </motion.div>

      {/* Page Settings */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">إعدادات الصفحة</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">عنوان الصفحة</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="admin-navbar-search-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">وصف الصفحة</label>
            <RichTextEditor
              value={page.description}
              onChange={(value) => setPage({ ...page, description: value })}
              placeholder="اكتب وصف الصفحة هنا..."
              height="150px"
              language="ar"
            />
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">الأقسام ({page.sections.length})</div>
        <div className="space-y-3">
          {page.sections.sort((a, b) => a.order - b.order).map((section, index) => (
            <motion.div
              key={section.id}
              className="p-4 bg-cyber-dark/30 rounded-lg border-2 border-cyber-neon/20 hover:border-cyber-neon/40 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-dark-400 cursor-move" />
                  <span className="text-xs text-dark-400">#{section.order + 1}</span>
                  <h3 className="font-semibold text-dark-100">{section.title || 'قسم بدون عنوان'}</h3>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="admin-action-btn admin-action-btn-edit"
                    onClick={() => handleEditSection(section)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => handleDeleteSection(section.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div 
                className="text-sm text-dark-400 line-clamp-2 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content || 'لا يوجد محتوى' }}
              />
            </motion.div>
          ))}
          {page.sections.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              <p>لا توجد أقسام. اضغط على "إضافة قسم" لإضافة قسم جديد</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Section Modal */}
      <AnimatePresence>
        {isSectionModalOpen && editingSection && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSectionModalOpen(false)}
          >
            <motion.div
              className="stat-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="stat-label mb-4">تعديل القسم</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="admin-navbar-search-input w-full"
                    placeholder="عنوان القسم..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">المحتوى</label>
                  <RichTextEditor
                    value={editingSection.content}
                    onChange={(value) => setEditingSection({ ...editingSection, content: value })}
                    placeholder="اكتب محتوى القسم هنا..."
                    height="300px"
                    language="ar"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">الأيقونة</label>
                    <input
                      type="text"
                      value={editingSection.icon}
                      onChange={(e) => setEditingSection({ ...editingSection, icon: e.target.value })}
                      className="admin-navbar-search-input w-full"
                      placeholder="Shield, Lock, Eye, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">الترتيب</label>
                    <input
                      type="number"
                      value={editingSection.order}
                      onChange={(e) => setEditingSection({ ...editingSection, order: parseInt(e.target.value) || 0 })}
                      className="admin-navbar-search-input w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    className="admin-page-action-btn flex-1"
                    onClick={handleSaveSection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ</span>
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => {
                      setIsSectionModalOpen(false)
                      setEditingSection(null)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Mode */}
      {previewMode && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyber-neon">معاينة الصفحة</h2>
              <motion.button
                className="admin-page-action-btn"
                onClick={() => setPreviewMode(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
                <span>إغلاق</span>
              </motion.button>
            </div>
            <div className="bg-cyber-dark/50 rounded-xl p-8 border-2 border-cyber-neon/30">
              <h1 className="text-4xl font-bold text-cyber-neon mb-4">{page.title}</h1>
              {page.description && (
                <div 
                  className="text-dark-200 mb-8 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.description }}
                />
              )}
              <div className="space-y-6 mt-8">
                {page.sections.sort((a, b) => a.order - b.order).map((section) => {
                  const Icon = getIconComponent(section.icon)
                  return (
                    <div
                      key={section.id}
                      className="p-6 bg-cyber-dark/30 rounded-xl border-2 border-cyber-neon/20"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/30">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-cyber-neon mb-0">{section.title}</h2>
                        </div>
                      </div>
                      <div 
                        className="text-dark-200 prose prose-invert max-w-none text-lg"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 text-center">
                <Link 
                  href={type === 'privacy' ? '/privacy' : '/terms'} 
                  target="_blank"
                  className="text-cyber-neon hover:text-cyber-green underline"
                >
                  عرض الصفحة الكاملة →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function AdminLegalPage() {
  return (
    <Suspense fallback={
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">جاري التحميل...</h1>
          </div>
        </div>
      </div>
    }>
      <AdminLegalPageContent />
    </Suspense>
  )
}
