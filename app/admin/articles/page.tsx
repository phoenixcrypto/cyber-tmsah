'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import RichTextEditor from '@/components/RichTextEditor'

interface Article {
  id: string
  materialId: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  excerpt?: string
  excerptEn?: string
  author: string
  status: 'published' | 'draft'
  publishedAt?: string
  views?: number
  tags?: string[]
}

interface Material {
  id: string
  title: string
  titleEn: string
}

export default function AdminArticlesPage() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Article>>({
    materialId: '',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    excerpt: '',
    excerptEn: '',
    author: '',
    status: 'draft',
    tags: [],
  })

  useEffect(() => {
    fetchArticles()
    fetchMaterials()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles')
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials')
      const data = await res.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: formData.status || 'draft',
          publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
        }),
      })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchArticles()
        setShowAddForm(false)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error adding article:', error)
      alert('حدث خطأ أثناء إضافة المقال')
    }
  }

  const handleUpdate = async () => {
    if (!editingArticle) return
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArticle.id,
          ...formData,
          publishedAt: formData.status === 'published' && !editingArticle.publishedAt 
            ? new Date().toISOString() 
            : editingArticle.publishedAt,
        }),
      })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchArticles()
        setEditingArticle(null)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert('حدث خطأ أثناء تحديث المقال')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this article?')) return
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchArticles()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('حدث خطأ أثناء حذف المقال')
    }
  }

  const resetForm = () => {
    setFormData({
      materialId: '',
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      excerpt: '',
      excerptEn: '',
      author: '',
      status: 'draft',
      tags: [],
    })
  }

  const startEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData(article)
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
            <FileText className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة المقالات' : 'Articles Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل المقالات' : 'Manage, add and edit articles'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingArticle(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة مقال' : 'Add Article'}
        </button>
      </div>

      {(showAddForm || editingArticle) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingArticle ? (language === 'ar' ? 'تعديل المقال' : 'Edit Article') : (language === 'ar' ? 'إضافة مقال جديد' : 'Add New Article')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'المادة' : 'Material'} *
                </label>
                <select
                  value={formData.materialId || ''}
                  onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required
                >
                  <option value="">{language === 'ar' ? 'اختر المادة' : 'Select Material'}</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {language === 'ar' ? material.title : material.titleEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'المؤلف' : 'Author'} *
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required
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
                placeholder={language === 'ar' ? 'الملخص (عربي)' : 'Excerpt (Arabic)'}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                rows={2}
              />
              <textarea
                placeholder={language === 'ar' ? 'الملخص (إنجليزي)' : 'Excerpt (English)'}
                value={formData.excerptEn || ''}
                onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
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
                placeholder={language === 'ar' ? 'اكتب محتوى المقال هنا...' : 'Write article content here...'}
                height="500px"
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
                placeholder={language === 'ar' ? 'اكتب محتوى المقال بالإنجليزية هنا...' : 'Write article content in English here...'}
                height="500px"
                language="en"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'العلامات (مفصولة بفواصل)' : 'Tags (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  placeholder={language === 'ar' ? 'مثال: تقنية, برمجة, تعليم' : 'e.g., tech, programming, education'}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingArticle ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingArticle(null)
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
        {articles.map((article) => {
          const material = materials.find(m => m.id === article.materialId)
          return (
            <div
              key={article.id}
              className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {article.status === 'published' ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {article.status === 'published' ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                    </span>
                    {material && (
                      <span className="text-xs px-2 py-1 rounded bg-cyber-neon/20 text-cyber-neon">
                        {language === 'ar' ? material.title : material.titleEn}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-dark-100 mb-2">
                    {language === 'ar' ? article.title : article.titleEn}
                  </h3>
                  {article.excerpt && (
                    <p className="text-dark-300 text-sm mb-2">
                      {language === 'ar' ? article.excerpt : article.excerptEn}
                    </p>
                  )}
                  <div className="text-xs text-dark-400 space-y-1">
                    <div><strong>{language === 'ar' ? 'المؤلف:' : 'Author:'}</strong> {article.author}</div>
                    {article.publishedAt && (
                      <div><strong>{language === 'ar' ? 'تاريخ النشر:' : 'Published:'}</strong> {new Date(article.publishedAt).toLocaleDateString()}</div>
                    )}
                    {article.views !== undefined && (
                      <div><strong>{language === 'ar' ? 'المشاهدات:' : 'Views:'}</strong> {article.views}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(article)}
                    className="p-2 bg-cyber-neon/20 text-cyber-neon rounded-lg hover:bg-cyber-neon/30 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {articles.length === 0 && (
          <div className="text-center py-20 text-dark-300">
            {language === 'ar' ? 'لا توجد مقالات بعد' : 'No articles yet'}
          </div>
        )}
      </div>
    </div>
  )
}

