'use client'

import { useState, useEffect } from 'react'
import { File, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import RichTextEditor from '@/components/RichTextEditor'

interface Page {
  id: string
  slug: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  metaDescription?: string
  metaDescriptionEn?: string
  status: 'published' | 'draft'
  order?: number
}

export default function AdminPagesPage() {
  const { language } = useLanguage()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Page>>({
    slug: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    metaDescription: '',
    metaDescriptionEn: '',
    status: 'draft',
    order: 0,
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages')
      const data = await res.json()
      setPages(data.pages || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportPages = async () => {
    if (!confirm(language === 'ar' ? 'هل تريد استيراد الصفحات الأساسية (about, privacy, terms, contact)؟' : 'Do you want to import basic pages (about, privacy, terms, contact)?')) return
    try {
      const res = await fetch('/api/admin/pages/import', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        alert(data.message || (language === 'ar' ? 'تم الاستيراد بنجاح' : 'Import successful'))
        fetchPages()
      } else {
        alert(data.error || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error importing pages:', error)
      alert(language === 'ar' ? 'حدث خطأ أثناء الاستيراد' : 'Error importing pages')
    }
  }

  const handleImportAllPages = async () => {
    if (!confirm(language === 'ar' ? 'هل تريد استيراد جميع الصفحات الموجودة (about, contact, privacy, terms, contribute, roadmap, expertise-guide)؟ سيتم استخراج محتوى كل صفحة بالكامل.' : 'Do you want to import ALL existing pages? Full content will be extracted from each page.')) return
    try {
      const res = await fetch('/api/admin/pages/import-all', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        alert(data.message || (language === 'ar' ? 'تم الاستيراد بنجاح' : 'Import successful'))
        fetchPages()
      } else {
        alert(data.error || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error importing all pages:', error)
      alert(language === 'ar' ? 'حدث خطأ أثناء الاستيراد' : 'Error importing pages')
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        fetchPages()
        setShowAddForm(false)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error adding page:', error)
      alert('حدث خطأ أثناء إضافة الصفحة')
    }
  }

  const handleUpdate = async () => {
    if (!editingPage) return
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPage.id, ...formData }),
      })
      if (res.ok) {
        fetchPages()
        setEditingPage(null)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      alert('حدث خطأ أثناء تحديث الصفحة')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الصفحة؟' : 'Are you sure you want to delete this page?')) return
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPages()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('حدث خطأ أثناء حذف الصفحة')
    }
  }

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      metaDescription: '',
      metaDescriptionEn: '',
      status: 'draft',
      order: 0,
    })
  }

  const startEdit = (page: Page) => {
    setEditingPage(page)
    setFormData(page)
    setShowAddForm(false)
  }

  if (loading) {
    return <div className="text-center py-20 text-dark-300">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
            <File className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة الصفحات' : 'Pages Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل الصفحات' : 'Manage, add and edit pages'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleImportPages}
            className="bg-gradient-to-r from-cyber-violet to-cyber-blue text-dark-100 px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all text-sm"
            title={language === 'ar' ? 'استيراد الصفحات الأساسية (about, privacy, terms, contact)' : 'Import basic pages (about, privacy, terms, contact)'}
          >
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'استيراد أساسي' : 'Basic Import'}
          </button>
          <button
            onClick={handleImportAllPages}
            className="bg-gradient-to-r from-cyber-green to-cyber-neon text-dark-100 px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all text-sm"
            title={language === 'ar' ? 'استيراد جميع الصفحات مع محتواها الكامل' : 'Import all pages with full content'}
          >
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'استيراد الكل' : 'Import All'}
          </button>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingPage(null)
              resetForm()
            }}
            className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            {language === 'ar' ? 'إضافة صفحة' : 'Add Page'}
          </button>
        </div>
      </div>

      {(showAddForm || editingPage) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingPage ? (language === 'ar' ? 'تعديل الصفحة' : 'Edit Page') : (language === 'ar' ? 'إضافة صفحة جديدة' : 'Add New Page')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'الرابط (Slug) *' : 'Slug *'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: about, contact' : 'e.g., about, contact'}
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required
                />
                <p className="text-xs text-dark-400 mt-1">
                  {language === 'ar' ? 'سيتم الوصول للصفحة عبر: /[slug]' : 'Page will be accessible at: /[slug]'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={language === 'ar' ? 'العنوان (عربي) *' : 'Title (Arabic) *'}
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder={language === 'ar' ? 'العنوان (إنجليزي) *' : 'Title (English) *'}
                value={formData.titleEn || ''}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder={language === 'ar' ? 'وصف SEO (عربي)' : 'SEO Description (Arabic)'}
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                rows={2}
              />
              <textarea
                placeholder={language === 'ar' ? 'وصف SEO (إنجليزي)' : 'SEO Description (English)'}
                value={formData.metaDescriptionEn || ''}
                onChange={(e) => setFormData({ ...formData, metaDescriptionEn: e.target.value })}
                className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                {language === 'ar' ? 'المحتوى (عربي) *' : 'Content (Arabic) *'}
              </label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder={language === 'ar' ? 'اكتب محتوى الصفحة هنا...' : 'Write page content here...'}
                height="400px"
                language="ar"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                {language === 'ar' ? 'المحتوى (إنجليزي) *' : 'Content (English) *'}
              </label>
              <RichTextEditor
                value={formData.contentEn || ''}
                onChange={(value) => setFormData({ ...formData, contentEn: value })}
                placeholder={language === 'ar' ? 'اكتب محتوى الصفحة بالإنجليزية هنا...' : 'Write page content in English here...'}
                height="400px"
                language="en"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
              >
                <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingPage ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingPage(null)
                resetForm()
              }}
              className="bg-cyber-dark/50 text-dark-300 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyber-dark/70 transition-all"
            >
              <X className="w-4 h-4" />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {page.status === 'published' ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${page.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {page.status === 'published' ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-cyber-neon/20 text-cyber-neon">
                    /{page.slug}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-dark-100 mb-2">
                  {language === 'ar' ? page.title : page.titleEn}
                </h3>
                {page.metaDescription && (
                  <p className="text-dark-300 text-sm mb-2">
                    {language === 'ar' ? page.metaDescription : page.metaDescriptionEn}
                  </p>
                )}
                <div className="text-xs text-dark-400">
                  <div><strong>ID:</strong> {page.id}</div>
                  {page.order !== undefined && (
                    <div><strong>{language === 'ar' ? 'الترتيب:' : 'Order:'}</strong> {page.order}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(page)}
                  className="p-2 bg-cyber-neon/20 text-cyber-neon rounded-lg hover:bg-cyber-neon/30 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="text-center py-20 text-dark-300">
            {language === 'ar' ? 'لا توجد صفحات بعد' : 'No pages yet'}
          </div>
        )}
      </div>
    </div>
  )
}

