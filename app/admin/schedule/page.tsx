'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Trash2, Search, Filter, Save, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab'
  group: 'Group 1' | 'Group 2'
  sectionNumber: number | null
  day: string
}

export default function AdminSchedulePage() {
  const { language } = useLanguage()
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterGroup, setFilterGroup] = useState<'Group 1' | 'Group 2' | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    title: '',
    time: '',
    location: '',
    instructor: '',
    type: 'lecture',
    group: 'Group 1',
    sectionNumber: null,
    day: 'Saturday',
  })

  useEffect(() => {
    fetchItems()
  }, [filterGroup])

  const fetchItems = async () => {
    try {
      const url = filterGroup !== 'all' ? `/api/admin/schedule?group=${filterGroup}` : '/api/admin/schedule'
      const res = await fetch(url)
      const data = await res.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        fetchItems()
        setShowAddForm(false)
        setFormData({
          title: '',
          time: '',
          location: '',
          instructor: '',
          type: 'lecture',
          group: 'Group 1',
          sectionNumber: null,
          day: 'Saturday',
        })
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingItem.id, ...formData }),
      })
      if (res.ok) {
        fetchItems()
        setEditingItem(null)
        setFormData({})
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return
    try {
      const res = await fetch(`/api/admin/schedule?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const startEdit = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData(item)
    setShowAddForm(false)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return <div className="text-center py-20 text-dark-300">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة الجداول الدراسية' : 'Schedule Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل الجداول الدراسية' : 'Manage, add and edit study schedules'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingItem(null)
            setFormData({
              title: '',
              time: '',
              location: '',
              instructor: '',
              type: 'lecture',
              group: 'Group 1',
              sectionNumber: null,
              day: 'Saturday',
            })
          }}
          className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة عنصر' : 'Add Item'}
        </button>
      </div>

      {/* Filters */}
      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-dark-400" />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value as any)}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="Group 1">{language === 'ar' ? 'المجموعة أ' : 'Group A'}</option>
              <option value="Group 2">{language === 'ar' ? 'المجموعة ب' : 'Group B'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingItem ? (language === 'ar' ? 'تعديل العنصر' : 'Edit Item') : (language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={language === 'ar' ? 'العنوان' : 'Title'}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'الوقت (مثال: 09:00 AM - 10:00 AM)' : 'Time (e.g., 09:00 AM - 10:00 AM)'}
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'المكان' : 'Location'}
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <input
              type="text"
              placeholder={language === 'ar' ? 'المحاضر' : 'Instructor'}
              value={formData.instructor || ''}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <select
              value={formData.type || 'lecture'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'lecture' | 'lab' })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="lecture">{language === 'ar' ? 'محاضرة' : 'Lecture'}</option>
              <option value="lab">{language === 'ar' ? 'معمل' : 'Lab'}</option>
            </select>
            <select
              value={formData.group || 'Group 1'}
              onChange={(e) => setFormData({ ...formData, group: e.target.value as 'Group 1' | 'Group 2' })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="Group 1">{language === 'ar' ? 'المجموعة أ' : 'Group A'}</option>
              <option value="Group 2">{language === 'ar' ? 'المجموعة ب' : 'Group B'}</option>
            </select>
            <input
              type="number"
              placeholder={language === 'ar' ? 'رقم السكشن (اختياري)' : 'Section Number (optional)'}
              value={formData.sectionNumber || ''}
              onChange={(e) => setFormData({ ...formData, sectionNumber: e.target.value ? parseInt(e.target.value) : null })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            />
            <select
              value={formData.day || 'Saturday'}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="Saturday">{language === 'ar' ? 'السبت' : 'Saturday'}</option>
              <option value="Sunday">{language === 'ar' ? 'الأحد' : 'Sunday'}</option>
              <option value="Monday">{language === 'ar' ? 'الإثنين' : 'Monday'}</option>
              <option value="Tuesday">{language === 'ar' ? 'الثلاثاء' : 'Tuesday'}</option>
              <option value="Wednesday">{language === 'ar' ? 'الأربعاء' : 'Wednesday'}</option>
              <option value="Thursday">{language === 'ar' ? 'الخميس' : 'Thursday'}</option>
              <option value="Friday">{language === 'ar' ? 'الجمعة' : 'Friday'}</option>
            </select>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingItem ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingItem(null)
                setFormData({})
              }}
              className="bg-cyber-dark/50 text-dark-300 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyber-dark/70 transition-all"
            >
              <X className="w-4 h-4" />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
        <h2 className="text-xl font-bold text-dark-100 mb-4">
          {language === 'ar' ? 'قائمة العناصر' : 'Items List'} ({filteredItems.length})
        </h2>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20 hover:border-cyber-neon/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-100 mb-2">{item.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-dark-300">
                    <div><strong>{language === 'ar' ? 'الوقت:' : 'Time:'}</strong> {item.time}</div>
                    <div><strong>{language === 'ar' ? 'المكان:' : 'Location:'}</strong> {item.location}</div>
                    <div><strong>{language === 'ar' ? 'المحاضر:' : 'Instructor:'}</strong> {item.instructor}</div>
                    <div><strong>{language === 'ar' ? 'النوع:' : 'Type:'}</strong> {item.type === 'lecture' ? (language === 'ar' ? 'محاضرة' : 'Lecture') : (language === 'ar' ? 'معمل' : 'Lab')}</div>
                    <div><strong>{language === 'ar' ? 'المجموعة:' : 'Group:'}</strong> {item.group}</div>
                    <div><strong>{language === 'ar' ? 'اليوم:' : 'Day:'}</strong> {item.day}</div>
                    {item.sectionNumber && <div><strong>{language === 'ar' ? 'السكشن:' : 'Section:'}</strong> {item.sectionNumber}</div>}
                  </div>
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

