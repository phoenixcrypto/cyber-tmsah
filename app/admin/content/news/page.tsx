'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Newspaper } from 'lucide-react'
import NewsModal from '@/components/admin/NewsModal'

interface NewsItem {
  id: string
  title: string
  titleEn: string
  subjectId: string
  subjectTitle: string
  subjectTitleEn: string
  url: string
  status: 'published' | 'draft'
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/news')
      if (res.ok) {
        const data = await res.json()
        setNews(data.data.news || [])
      } else {
        console.error('Failed to fetch news')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      return
    }

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id))
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

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الأخبار والتحديثات</h1>
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
          <h1 className="admin-page-title">الأخبار والتحديثات</h1>
          <p className="admin-page-description">إدارة الأخبار والتحديثات الخاصة بالمواد الدراسية</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingNews(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة خبر جديد</span>
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
            placeholder="بحث عن خبر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* News Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredNews.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <Newspaper className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد أخبار مسجلة حتى الآن'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>المادة</th>
                <th>الحالة</th>
                <th>تاريخ النشر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <br />
                    <span style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}>
                      {item.titleEn}
                    </span>
                  </td>
                  <td>{item.subjectTitle}</td>
                  <td>
                    <span className={`admin-badge ${item.status === 'published' ? '' : 'opacity-50'}`}>
                      {item.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td>{new Date(item.publishedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button
                        className="admin-action-btn admin-action-btn-edit"
                        onClick={() => {
                          setEditingNews(item)
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
                        onClick={() => handleDelete(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* News Modal */}
      <NewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNews(null)
        }}
        onSave={fetchNews}
        news={editingNews}
      />
    </div>
  )
}
