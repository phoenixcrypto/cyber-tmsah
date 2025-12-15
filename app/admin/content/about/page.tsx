'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Save, RefreshCw, GripVertical, X } from 'lucide-react'

interface AboutCard {
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  icon?: string
  color?: string
  image?: string
  order: number
  size: 'small' | 'medium' | 'large'
}

interface AboutPage {
  title: string
  description: string
  cards: AboutCard[]
  sections: Array<{
    id: string
    title: string
    content: string
  }>
}

export default function AdminAboutPage() {
  const [page, setPage] = useState<AboutPage>({
    title: 'من نحن',
    description: 'تعرف على منصة سايبر تمساح',
    cards: [],
    sections: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCard, setEditingCard] = useState<AboutCard | null>(null)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pages/about')
      if (res.ok) {
        const data = await res.json()
        setPage(data.data.page || page)
      }
    } catch (error) {
      console.error('Error fetching about page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/pages/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })

      if (res.ok) {
        alert('تم حفظ التغييرات بنجاح')
      } else {
        alert('حدث خطأ أثناء الحفظ')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCard = () => {
    setEditingCard({
      id: Date.now().toString(),
      title: '',
      description: '',
      order: page.cards.length,
      size: 'medium',
    })
    setIsCardModalOpen(true)
  }

  const handleEditCard = (card: AboutCard) => {
    setEditingCard(card)
    setIsCardModalOpen(true)
  }

  const handleDeleteCard = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه البطاقة؟')) return
    setPage({
      ...page,
      cards: page.cards.filter(c => c.id !== id).map((c, i) => ({ ...c, order: i })),
    })
  }

  const handleSaveCard = () => {
    if (!editingCard) return

    if (editingCard.id && page.cards.find(c => c.id === editingCard.id)) {
      // Update existing
      setPage({
        ...page,
        cards: page.cards.map(c => c.id === editingCard.id ? editingCard : c),
      })
    } else {
      // Add new
      setPage({
        ...page,
        cards: [...page.cards, { ...editingCard, order: page.cards.length }],
      })
    }

    setIsCardModalOpen(false)
    setEditingCard(null)
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة صفحة من نحن</h1>
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
          <h1 className="admin-page-title">إدارة صفحة من نحن</h1>
          <p className="admin-page-description">إدارة محتوى صفحة من نحن والكروت</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className="admin-page-action-btn"
            onClick={handleAddCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة كارت</span>
          </motion.button>
          <motion.button
            className="admin-page-action-btn"
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
                <span>حفظ التغييرات</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Page Settings */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">إعدادات الصفحة</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">عنوان الصفحة</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="admin-navbar-search-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">وصف الصفحة</label>
            <textarea
              value={page.description}
              onChange={(e) => setPage({ ...page, description: e.target.value })}
              className="admin-navbar-search-input w-full min-h-[100px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Cards Management */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">الكروت ({page.cards.length})</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {page.cards.sort((a, b) => a.order - b.order).map((card, index) => (
            <motion.div
              key={card.id}
              className="p-4 bg-cyber-dark/30 rounded-lg border-2 border-cyber-neon/20 hover:border-cyber-neon/40 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-dark-400 cursor-move" />
                  <span className="text-xs text-dark-400">#{card.order + 1}</span>
                  <span className="text-xs px-2 py-1 bg-cyber-neon/20 rounded">{card.size}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="admin-action-btn admin-action-btn-edit"
                    onClick={() => handleEditCard(card)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => handleDeleteCard(card.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <h3 className="font-semibold text-dark-100 mb-2">{card.title}</h3>
              <p className="text-sm text-dark-400 line-clamp-2">{card.description}</p>
            </motion.div>
          ))}
          {page.cards.length === 0 && (
            <div className="col-span-full text-center py-8 text-dark-400">
              <p>لا توجد كروت. اضغط على "إضافة كارت" لإضافة كارت جديد</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card Modal */}
      <AnimatePresence>
        {isCardModalOpen && editingCard && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCardModalOpen(false)}
          >
            <motion.div
              className="stat-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="stat-label mb-4">تعديل الكارت</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                    className="admin-navbar-search-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">الوصف</label>
                  <textarea
                    value={editingCard.description}
                    onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                    className="admin-navbar-search-input w-full min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">الحجم</label>
                    <select
                      value={editingCard.size}
                      onChange={(e) => setEditingCard({ ...editingCard, size: e.target.value as 'small' | 'medium' | 'large' })}
                      className="admin-navbar-search-input w-full"
                    >
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">الترتيب</label>
                    <input
                      type="number"
                      value={editingCard.order}
                      onChange={(e) => setEditingCard({ ...editingCard, order: parseInt(e.target.value) || 0 })}
                      className="admin-navbar-search-input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">اللون</label>
                  <input
                    type="text"
                    value={editingCard.color || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, color: e.target.value })}
                    className="admin-navbar-search-input w-full"
                    placeholder="from-blue-500 to-cyan-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    className="admin-page-action-btn flex-1"
                    onClick={handleSaveCard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ</span>
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => {
                      setIsCardModalOpen(false)
                      setEditingCard(null)
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

