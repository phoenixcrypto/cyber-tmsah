'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as LinkIcon, Plus, Edit, Trash2, Save, RefreshCw, GripVertical, X } from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  labelEn: string
  href: string
  order: number
  parentId?: string
  children?: MenuItem[]
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setLoading(true)
      // TODO: Implement API endpoint to fetch menus
      // For now, use default structure
      setMenus([
        { id: '1', label: 'الرئيسية', labelEn: 'Home', href: '/', order: 1 },
        { id: '2', label: 'المواد الدراسية', labelEn: 'Materials', href: '/materials', order: 2 },
        { id: '3', label: 'الجدول الدراسي', labelEn: 'Schedule', href: '/schedule', order: 3 },
        { id: '4', label: 'التنزيلات', labelEn: 'Downloads', href: '/downloads', order: 4 },
        { id: '5', label: 'اتصل بنا', labelEn: 'Contact', href: '/contact', order: 5 },
      ])
    } catch (error) {
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Implement API endpoint to save menus
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ القوائم بنجاح')
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving menus:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    
    try {
      setMenus(menus.filter(item => item.id !== id))
      // TODO: Implement API endpoint to delete menu item
      alert('تم الحذف بنجاح')
    } catch (error) {
      console.error('Error deleting menu item:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const handleAdd = () => {
    setEditingItem({
      id: Date.now().toString(),
      label: '',
      labelEn: '',
      href: '',
      order: menus.length + 1,
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">القوائم والروابط</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">القوائم والروابط</h1>
          <p className="admin-page-description">إدارة قوائم التنقل والروابط في الموقع</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة رابط جديد</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
          <LinkIcon className="w-8 h-8" />
        </div>
        <div className="stat-label mb-4">عناصر القائمة</div>
        <div className="space-y-3">
          {menus.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between p-4 bg-cyber-dark/30 rounded-lg border-2 border-cyber-neon/20 hover:border-cyber-neon/40 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-dark-400 cursor-move" />
                <div className="flex-1">
                  <div className="font-semibold text-dark-100">{item.label}</div>
                  <div className="text-sm text-dark-400">{item.labelEn} - {item.href}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  className="admin-action-btn admin-action-btn-edit"
                  onClick={() => handleEdit(item)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="admin-action-btn admin-action-btn-delete"
                  onClick={() => handleDelete(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {menus.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              <p>لا توجد عناصر في القائمة</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="stat-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="stat-label mb-4">تعديل عنصر القائمة</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">النص (عربي)</label>
                  <input
                    type="text"
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                    className="admin-navbar-search-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">النص (إنجليزي)</label>
                  <input
                    type="text"
                    value={editingItem.labelEn}
                    onChange={(e) => setEditingItem({ ...editingItem, labelEn: e.target.value })}
                    className="admin-navbar-search-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">الرابط (URL)</label>
                  <input
                    type="text"
                    value={editingItem.href}
                    onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                    className="admin-navbar-search-input w-full"
                    placeholder="/page"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    className="admin-page-action-btn flex-1"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.05 }}
                    whileTap={{ scale: saving ? 1 : 0.95 }}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>حفظ</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingItem(null)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

