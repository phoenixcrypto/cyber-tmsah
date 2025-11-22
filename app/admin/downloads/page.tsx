'use client'

import { useState, useEffect } from 'react'
import { Download, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Software {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string
  videoUrl: string
}

export default function AdminDownloadsPage() {
  const { language } = useLanguage()
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Software>>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    icon: 'FileText',
    videoUrl: '#',
  })

  useEffect(() => {
    fetchSoftware()
  }, [])

  const fetchSoftware = async () => {
    try {
      const res = await fetch('/api/admin/downloads')
      const data = await res.json()
      setSoftware(data.software || [])
    } catch (error) {
      console.error('Error fetching software:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: formData.id || `download-${Date.now()}` }),
      })
      if (res.ok) {
        fetchSoftware()
        setShowAddForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error adding software:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingSoftware) return
    try {
      const res = await fetch('/api/admin/downloads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSoftware.id, ...formData }),
      })
      if (res.ok) {
        fetchSoftware()
        setEditingSoftware(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating software:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/downloads?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSoftware()
      }
    } catch (error) {
      console.error('Error deleting software:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      icon: 'FileText',
      videoUrl: '#',
    })
  }

  const startEdit = (item: Software) => {
    setEditingSoftware(item)
    setFormData(item)
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
            <Download className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة البرامج' : 'Downloads Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل برامج التنزيل' : 'Manage, add and edit download programs'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingSoftware(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة برنامج' : 'Add Software'}
        </button>
      </div>

      {(showAddForm || editingSoftware) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingSoftware ? (language === 'ar' ? 'تعديل البرنامج' : 'Edit Software') : (language === 'ar' ? 'إضافة برنامج جديد' : 'Add New Software')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
              value={formData.nameEn || ''}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
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
              placeholder={language === 'ar' ? 'اسم الأيقونة (مثال: FileText)' : 'Icon Name (e.g., FileText)'}
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="url"
              placeholder={language === 'ar' ? 'رابط الفيديو (YouTube)' : 'Video URL (YouTube)'}
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingSoftware ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingSoftware(null)
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
        {software.map((item) => (
          <div
            key={item.id}
            className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-dark-100">{language === 'ar' ? item.name : item.nameEn}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 bg-cyber-neon/20 text-cyber-neon rounded-lg hover:bg-cyber-neon/30 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-dark-300 text-sm mb-4">
              {language === 'ar' ? item.description : item.descriptionEn}
            </p>
            <div className="text-xs text-dark-400">
              <div><strong>Video URL:</strong> <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-cyber-neon hover:underline">{item.videoUrl}</a></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

