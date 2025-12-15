'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react'
import MaterialModal from '@/components/admin/MaterialModal'

interface Material {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: string
  color: string
  articlesCount: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/materials')
      if (res.ok) {
        const data = await res.json()
        setMaterials(data.data?.materials || data.materials || [])
      } else {
        console.error('Failed to fetch materials')
        setMaterials([])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟ سيتم حذف جميع المقالات المرتبطة بها أيضاً.')) {
      return
    }

    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMaterials(materials.filter((m) => m.id !== id))
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

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">المواد الدراسية</h1>
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
          <h1 className="admin-page-title">المواد الدراسية</h1>
          <p className="admin-page-description">إدارة المواد الدراسية والمحتوى التعليمي</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingMaterial(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مادة جديدة</span>
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
            placeholder="بحث عن مادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
      </motion.div>

      {/* Materials Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ overflowX: 'auto', marginTop: '2rem' }}
      >
        {filteredMaterials.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
            <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد مواد مضافة حالياً'}</p>
          </div>
        ) : (
          <table className="admin-section-table">
            <thead>
              <tr>
                <th>المادة</th>
                <th>الوصف</th>
                <th>عدد المقالات</th>
                <th>آخر تحديث</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${material.color} rounded-lg flex items-center justify-center`}
                      >
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <strong>{material.title}</strong>
                        <br />
                        <span style={{ color: 'var(--dark-400)', fontSize: '0.875rem' }}>
                          {material.titleEn}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      {material.description.slice(0, 80)}
                      {material.description.length > 80 ? '...' : ''}
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge">{material.articlesCount}</span>
                  </td>
                  <td>{new Date(material.updatedAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button
                        className="admin-action-btn admin-action-btn-edit"
                        onClick={() => {
                          setEditingMaterial(material)
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
                        onClick={() => handleDelete(material.id)}
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

      {/* Material Modal */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMaterial(null)
        }}
        onSave={fetchMaterials}
        material={editingMaterial}
      />
    </div>
  )
}
