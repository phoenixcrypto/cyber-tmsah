'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

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
}

export default function AdminMaterialsPage() {
  const { language } = useLanguage()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Material>>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    icon: 'BookOpen',
    color: 'from-blue-500 to-blue-600',
    articlesCount: 0,
    lastUpdated: 'لا توجد مقالات بعد',
  })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/admin/materials')
      const data = await res.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: formData.id || `material-${Date.now()}` }),
      })
      if (res.ok) {
        fetchMaterials()
        setShowAddForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error adding material:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingMaterial) return
    try {
      const res = await fetch('/api/admin/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingMaterial.id, ...formData }),
      })
      if (res.ok) {
        fetchMaterials()
        setEditingMaterial(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating material:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/materials?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchMaterials()
      }
    } catch (error) {
      console.error('Error deleting material:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      icon: 'BookOpen',
      color: 'from-blue-500 to-blue-600',
      articlesCount: 0,
      lastUpdated: 'لا توجد مقالات بعد',
    })
  }

  const startEdit = (material: Material) => {
    setEditingMaterial(material)
    setFormData(material)
    setShowAddForm(false)
  }

  if (loading) {
    return <div className="text-center py-20 text-dark-300">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة المواد التعليمية' : 'Materials Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل المواد التعليمية' : 'Manage, add and edit educational materials'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingMaterial(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة مادة' : 'Add Material'}
        </button>
      </div>

      {(showAddForm || editingMaterial) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingMaterial ? (language === 'ar' ? 'تعديل المادة' : 'Edit Material') : (language === 'ar' ? 'إضافة مادة جديدة' : 'Add New Material')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
              value={formData.titleEn || ''}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <textarea
              placeholder={language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none md:col-span-2"
              rows={3}
            />
            <textarea
              placeholder={language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
              value={formData.descriptionEn || ''}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none md:col-span-2"
              rows={3}
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'اسم الأيقونة (مثال: BookOpen)' : 'Icon Name (e.g., BookOpen)'}
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'اللون (مثال: from-blue-500 to-blue-600)' : 'Color (e.g., from-blue-500 to-blue-600)'}
              value={formData.color || ''}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingMaterial ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingMaterial(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <div
            key={material.id}
            className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-dark-100">{language === 'ar' ? material.title : material.titleEn}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(material)}
                  className="p-2 bg-cyber-neon/20 text-cyber-neon rounded-lg hover:bg-cyber-neon/30 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-dark-300 text-sm mb-4">
              {language === 'ar' ? material.description : material.descriptionEn}
            </p>
            <div className="text-xs text-dark-400">
              <div><strong>ID:</strong> {material.id}</div>
              <div><strong>Icon:</strong> {material.icon}</div>
              <div><strong>Color:</strong> {material.color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

