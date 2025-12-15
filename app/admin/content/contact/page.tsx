'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RefreshCw, Eye, EyeOff, Plus, Edit, Trash2, X } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import Link from 'next/link'

interface ContactMethod {
  id: string
  icon: string
  title: string
  value: string
  link?: string
  description: string
  order: number
}

interface ContactPage {
  title: string
  description: string
  contactMethods: ContactMethod[]
  formSettings: {
    enabled: boolean
    minMessageLength: number
    subjects: string[]
  }
}

export default function AdminContactPage() {
  const [page, setPage] = useState<ContactPage>({
    title: 'اتصل بنا',
    description: 'نحن هنا لمساعدتك',
    contactMethods: [],
    formSettings: {
      enabled: true,
      minMessageLength: 20,
      subjects: ['support', 'suggestion', 'complaint', 'partnership', 'other'],
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [editingMethod, setEditingMethod] = useState<ContactMethod | null>(null)
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pages/contact')
      if (res.ok) {
        const data = await res.json()
        if (data.data?.page) {
          setPage(data.data.page)
        } else if (data.page) {
          setPage(data.page)
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Failed to fetch contact page:', errorData)
      }
    } catch (error) {
      console.error('Error fetching contact page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/pages/contact', {
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">إدارة صفحة اتصل بنا</h1>
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
          <h1 className="admin-page-title">إدارة صفحة اتصل بنا</h1>
          <p className="admin-page-description">إدارة محتوى صفحة الاتصال وإعدادات النموذج</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className={`admin-page-action-btn ${previewMode ? 'bg-cyber-neon/20' : ''}`}
            onClick={() => setPreviewMode(!previewMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {previewMode ? (
              <>
                <EyeOff className="w-5 h-5" />
                <span>إخفاء المعاينة</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>معاينة الصفحة</span>
              </>
            )}
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
            <RichTextEditor
              value={page.description}
              onChange={(value) => setPage({ ...page, description: value })}
              placeholder="اكتب وصف الصفحة هنا..."
              height="150px"
              language="ar"
            />
          </div>
        </div>
      </motion.div>

      {/* Form Settings */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="stat-label mb-4">إعدادات النموذج</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">تفعيل النموذج</label>
              <p className="text-sm text-dark-400">السماح للمستخدمين بإرسال الرسائل</p>
            </div>
            <button
              onClick={() => setPage({
                ...page,
                formSettings: { ...page.formSettings, enabled: !page.formSettings.enabled }
              })}
              className={`relative rounded-full transition-all duration-300 focus:outline-none ${
                page.formSettings.enabled ? 'switch-track--active' : 'switch-track--inactive'
              } switch-track`}
            >
              <span
                className={`absolute rounded-full shadow-lg transform transition-transform duration-300 switch-knob ${
                  page.formSettings.enabled ? 'translate-x-[1.75rem]' : 'translate-x-0.5'
                }`}
                style={{ top: '2px', left: '2px' }}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-200 mb-2">الحد الأدنى لطول الرسالة</label>
            <input
              type="number"
              value={page.formSettings.minMessageLength}
              onChange={(e) => setPage({
                ...page,
                formSettings: { ...page.formSettings, minMessageLength: parseInt(e.target.value) || 20 }
              })}
              className="admin-navbar-search-input w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Contact Methods Management */}
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="stat-label">طرق الاتصال ({page.contactMethods.length})</div>
          <motion.button
            className="admin-page-action-btn"
            onClick={() => {
              setEditingMethod({
                id: Date.now().toString(),
                icon: 'Mail',
                title: '',
                value: '',
                description: '',
                order: page.contactMethods.length,
              })
              setIsMethodModalOpen(true)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة طريقة</span>
          </motion.button>
        </div>
        <div className="space-y-3">
          {page.contactMethods.sort((a, b) => a.order - b.order).map((method) => (
            <div
              key={method.id}
              className="p-4 bg-cyber-dark/30 rounded-lg border-2 border-cyber-neon/20 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-dark-100">{method.title}</h3>
                <p className="text-sm text-dark-400">{method.value}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="admin-action-btn admin-action-btn-edit"
                  onClick={() => {
                    setEditingMethod(method)
                    setIsMethodModalOpen(true)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="admin-action-btn admin-action-btn-delete"
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف طريقة الاتصال هذه؟')) {
                      setPage({
                        ...page,
                        contactMethods: page.contactMethods
                          .filter(m => m.id !== method.id)
                          .map((m, i) => ({ ...m, order: i })),
                      })
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ))}
          {page.contactMethods.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              <p>لا توجد طرق اتصال. اضغط على "إضافة طريقة" لإضافة طريقة جديدة</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Method Modal */}
      <AnimatePresence>
        {isMethodModalOpen && editingMethod && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMethodModalOpen(false)}
          >
            <motion.div
              className="stat-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="stat-label mb-4">تعديل طريقة الاتصال</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={editingMethod.title}
                    onChange={(e) => setEditingMethod({ ...editingMethod, title: e.target.value })}
                    className="admin-navbar-search-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">القيمة</label>
                  <input
                    type="text"
                    value={editingMethod.value}
                    onChange={(e) => setEditingMethod({ ...editingMethod, value: e.target.value })}
                    className="admin-navbar-search-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">الوصف</label>
                  <RichTextEditor
                    value={editingMethod.description}
                    onChange={(value) => setEditingMethod({ ...editingMethod, description: value })}
                    placeholder="اكتب وصف طريقة الاتصال..."
                    height="100px"
                    language="ar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-200 mb-2">الرابط (اختياري)</label>
                  <input
                    type="text"
                    value={editingMethod.link || ''}
                    onChange={(e) => {
                      const newLink = e.target.value.trim()
                      if (newLink) {
                        setEditingMethod({ 
                          ...editingMethod, 
                          link: newLink 
                        })
                      } else {
                        const { link, ...rest } = editingMethod
                        setEditingMethod(rest as ContactMethod)
                      }
                    }}
                    className="admin-navbar-search-input w-full"
                    placeholder="mailto:example@email.com أو https://..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    className="admin-page-action-btn flex-1"
                    onClick={() => {
                      const baseMethod = {
                        id: editingMethod.id,
                        icon: editingMethod.icon,
                        title: editingMethod.title,
                        value: editingMethod.value,
                        description: editingMethod.description,
                        order: editingMethod.order,
                      }
                      const methodToSave: ContactMethod = editingMethod.link
                        ? { ...baseMethod, link: editingMethod.link }
                        : baseMethod
                      if (editingMethod.id && page.contactMethods.find(m => m.id === editingMethod.id)) {
                        setPage({
                          ...page,
                          contactMethods: page.contactMethods.map(m =>
                            m.id === editingMethod.id ? methodToSave : m
                          ),
                        })
                      } else {
                        setPage({
                          ...page,
                          contactMethods: [...page.contactMethods, { ...methodToSave, order: page.contactMethods.length }],
                        })
                      }
                      setIsMethodModalOpen(false)
                      setEditingMethod(null)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ</span>
                  </motion.button>
                  <motion.button
                    className="admin-action-btn admin-action-btn-delete"
                    onClick={() => {
                      setIsMethodModalOpen(false)
                      setEditingMethod(null)
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

      {/* Preview Mode */}
      {previewMode && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyber-neon">معاينة الصفحة</h2>
              <motion.button
                className="admin-page-action-btn"
                onClick={() => setPreviewMode(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
                <span>إغلاق</span>
              </motion.button>
            </div>
            <div className="bg-cyber-dark/50 rounded-xl p-8 border-2 border-cyber-neon/30">
              <h1 className="text-4xl font-bold text-cyber-neon mb-4">{page.title}</h1>
              <div 
                className="text-dark-200 mb-8 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.description }}
              />
              {page.contactMethods.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {page.contactMethods.sort((a, b) => a.order - b.order).map((method) => (
                    <div
                      key={method.id}
                      className="p-6 bg-cyber-dark/30 rounded-xl border-2 border-cyber-neon/20"
                    >
                      <h3 className="text-xl font-bold text-cyber-neon mb-2">{method.title}</h3>
                      <p className="text-dark-200 mb-2">{method.value}</p>
                      <div 
                        className="text-dark-300 prose prose-invert max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: method.description }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 text-center">
                <Link 
                  href="/contact" 
                  target="_blank"
                  className="text-cyber-neon hover:text-cyber-green underline"
                >
                  عرض الصفحة الكاملة →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

