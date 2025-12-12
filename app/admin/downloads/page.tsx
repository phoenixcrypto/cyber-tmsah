'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react'
import DownloadModal from '@/components/admin/DownloadModal'

interface DownloadItem {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string
  videoUrl?: string | null
  downloadUrl?: string | null
  category?: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null)

  const fetchDownloads = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/downloads')
      if (res.ok) {
        const data = await res.json()
        setDownloads(data.data.downloads || data.data.software || [])
      } else {
        console.error('Failed to fetch downloads')
      }
    } catch (error) {
      console.error('Error fetching downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDownloads()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) {
      return
    }

    try {
      const res = await fetch(`/api/downloads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDownloads(downloads.filter((d) => d.id !== id))
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

  const filteredDownloads = downloads.filter((download) =>
    download.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    download.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    download.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (download.category && download.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">برامج التنزيل</h1>
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
          <h1 className="admin-page-title">برامج التنزيل</h1>
          <p className="admin-page-description">إدارة البرامج والأدوات المتاحة للطلاب</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingDownload(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة برنامج جديد</span>
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
            placeholder="بحث عن برنامج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* Downloads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredDownloads.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <Download className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد برامج مسجلة حتى الآن'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>اسم البرنامج</th>
                <th>الوصف</th>
                <th>الفئة</th>
                <th>رابط التحميل</th>
                <th>آخر تحديث</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDownloads.map((download) => (
                <tr key={download.id}>
                  <td>
                    <strong>{download.name}</strong>
                    <br />
                    <span style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}>
                      {download.nameEn}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      {download.description.slice(0, 60)}
                      {download.description.length > 60 ? '...' : ''}
                    </div>
                  </td>
                  <td>{download.category || 'غير محدد'}</td>
                  <td>{download.downloadUrl ? '✓ متوفر' : '—'}</td>
                  <td>{new Date(download.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button
                        className="admin-action-btn admin-action-btn-edit"
                        onClick={() => {
                          setEditingDownload(download)
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
                        onClick={() => handleDelete(download.id)}
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

      {/* Download Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDownload(null)
        }}
        onSave={fetchDownloads}
        download={editingDownload}
      />
    </div>
  )
}
