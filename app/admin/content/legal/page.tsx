'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

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

  useEffect(() => {
    fetchPage()
  }, [type])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/pages/legal?type=${type}`)
      if (res.ok) {
        const data = await res.json()
        setPage(data.data.page || page)
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
    const newSection: LegalSection = {
      id: Date.now().toString(),
      icon: 'Shield',
      title: '',
      content: '',
      order: page.sections.length,
    }
    setPage({
      ...page,
      sections: [...page.sections, newSection],
    })
  }

  const handleEditSection = (section: LegalSection) => {
    const newTitle = prompt('العنوان:', section.title)
    if (newTitle !== null) {
      const newContent = prompt('المحتوى:', section.content)
      if (newContent !== null) {
        setPage({
          ...page,
          sections: page.sections.map(s => 
            s.id === section.id 
              ? { ...s, title: newTitle, content: newContent }
              : s
          ),
        })
      }
    }
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
            <textarea
              value={page.description}
              onChange={(e) => setPage({ ...page, description: e.target.value })}
              className="admin-navbar-search-input w-full min-h-[100px]"
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
                  <span className="text-xs text-dark-400">#{section.order + 1}</span>
                  <h3 className="font-semibold text-dark-100">{section.title}</h3>
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
              <p className="text-sm text-dark-400 line-clamp-2">{section.content}</p>
            </motion.div>
          ))}
          {page.sections.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              <p>لا توجد أقسام. اضغط على "إضافة قسم" لإضافة قسم جديد</p>
            </div>
          )}
        </div>
      </motion.div>
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
