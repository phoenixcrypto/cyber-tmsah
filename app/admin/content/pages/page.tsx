'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react'
import PageModal from '@/components/admin/PageModal'

interface Page {
  id: string
  slug: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  metaDescription?: string | null
  metaDescriptionEn?: string | null
  status: 'published' | 'draft'
  order?: number | null
  createdAt: string
  updatedAt: string
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)

  const fetchPages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pages')
      if (res.ok) {
        const data = await res.json()
        setPages(data.data?.pages || data.pages || [])
      } else {
        console.error('Failed to fetch pages')
        setPages([])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      return
    }

    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPages(pages.filter((p) => p.id !== id))
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

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الصفحات الثابتة</h1>
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
          <h1 className="admin-page-title">الصفحات الثابتة</h1>
          <p className="admin-page-description">إدارة صفحات من نحن، الشروط، الخصوصية وغيرها من المحتوى الرسمي</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingPage(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة صفحة جديدة</span>
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
            placeholder="بحث عن صفحة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* Pages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredPages.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد صفحات مسجلة حتى الآن'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>الرابط</th>
                <th>العنوان</th>
                <th>الحالة</th>
                <th>الترتيب</th>
                <th>آخر تحديث</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id}>
                  <td>
                    <code style={{ background: 'rgba(255, 59, 64, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                      /{page.slug}
                    </code>
                  </td>
                  <td>
                    <strong>{page.title}</strong>
                    <br />
                    <span style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}>
                      {page.titleEn}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${page.status === 'published' ? '' : 'opacity-50'}`}>
                      {page.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td>{page.order || 0}</td>
                  <td>{new Date(page.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button
                        className="admin-action-btn admin-action-btn-edit"
                        onClick={() => {
                          setEditingPage(page)
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
                        onClick={() => handleDelete(page.id)}
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

      {/* Page Modal */}
      <PageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPage(null)
        }}
        onSave={fetchPages}
        page={editingPage}
      />
    </div>
  )
}
