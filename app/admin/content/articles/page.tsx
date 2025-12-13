'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react'
import ArticleModal from '@/components/admin/ArticleModal'
import { parseTags } from '@/lib/utils/json-helpers'

interface Article {
  id: string
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
  views: number
  tags: string[]
  createdAt: string
  updatedAt: string
  material?: {
    title: string
  }
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [materials, setMaterials] = useState<Array<{ id: string; title: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data.data.articles || [])
      } else {
        console.error('Failed to fetch articles')
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials')
      if (res.ok) {
        const data = await res.json()
        setMaterials(data.data.materials || [])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchMaterials()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      return
    }

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id))
        alert('تم الحذف بنجاح')
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'حدث خطأ أثناء الحذف')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.material?.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">المقالات التعليمية</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">المقالات التعليمية</h1>
          <p className="admin-page-description">إدارة المحتوى الكتابي وربطه بالمواد الدراسية</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingArticle(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء مقال جديد</span>
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="admin-users-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="admin-users-search">
          <Search className="admin-users-search-icon" />
          <input
            type="text"
            placeholder="بحث عن مقال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* Articles Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredArticles.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لم يتم إضافة أي مقالات حتى الآن'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>المادة</th>
                <th>المؤلف</th>
                <th>الحالة</th>
                <th>المشاهدات</th>
                <th>تاريخ النشر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => {
                const tags = parseTags(article.tags)
                return (
                  <tr key={article.id}>
                    <td>
                      <strong>{article.title}</strong>
                      <br />
                      <span style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}>
                        {article.titleEn}
                      </span>
                    </td>
                    <td>{article.material?.title || 'غير محدد'}</td>
                    <td>{article.author}</td>
                    <td>
                      <span className={`admin-badge ${article.status === 'published' ? '' : 'opacity-50'}`}>
                        {article.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td>{article.views}</td>
                    <td>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-EG') : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          className="admin-action-btn admin-action-btn-edit"
                          onClick={() => {
                            setEditingArticle({ ...article, tags })
                            setIsModalOpen(true)
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="admin-action-btn admin-action-btn-delete"
                          onClick={() => handleDelete(article.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Article Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingArticle(null)
        }}
        onSave={fetchArticles}
        article={editingArticle}
        materials={materials}
      />
    </div>
  )
}
