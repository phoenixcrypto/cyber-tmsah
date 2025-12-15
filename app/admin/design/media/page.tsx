'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Upload, Trash2, Search, FileImage, FileVideo, File } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: Date
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      // TODO: Implement API endpoint to fetch media
      setMedia([])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      // TODO: Implement upload to Firebase Storage
      const newMedia: MediaItem[] = []
      const fileArray = Array.from(files)
      
      fileArray.forEach((file, i) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          const type = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document'
          newMedia.push({
            id: Date.now().toString() + i,
            name: file.name,
            url,
            type,
            size: file.size,
            uploadedAt: new Date(),
          })
          if (newMedia.length === fileArray.length) {
            setMedia([...media, ...newMedia])
            setUploading(false)
          }
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('حدث خطأ أثناء رفع الملفات')
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return
    
    try {
      setMedia(media.filter(item => item.id !== id))
      // TODO: Implement API endpoint to delete media
      alert('تم الحذف بنجاح')
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return FileImage
      case 'video': return FileVideo
      default: return File
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الصور والوسائط</h1>
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
          <h1 className="admin-page-title">مكتبة الوسائط</h1>
          <p className="admin-page-description">إدارة الصور والملفات الوسائطية</p>
        </div>
        <label className="admin-page-action-btn cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>رفع ملفات</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="admin-users-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="admin-users-search">
          <Search className="admin-users-search-icon" />
          <input
            type="text"
            placeholder="بحث عن ملف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="admin-navbar-search-input"
          style={{ minWidth: '150px' }}
        >
          <option value="all">جميع الملفات</option>
          <option value="image">صور</option>
          <option value="video">فيديو</option>
          <option value="document">مستندات</option>
        </select>
      </motion.div>

      {/* Media Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '2rem' }}
      >
        {filteredMedia.map((item, index) => {
          const Icon = getMediaIcon(item.type)
          return (
            <motion.div
              key={item.id}
              className="stat-card relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-cyber-dark/50 rounded-lg mb-2 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-cyber-neon opacity-50" />
                </div>
              )}
              <div className="text-xs text-dark-300 truncate mb-1">{item.name}</div>
              <div className="text-xs text-dark-400">{formatFileSize(item.size)}</div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          )
        })}
      </motion.div>

      {filteredMedia.length === 0 && (
        <motion.div
          className="admin-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
          <p>{searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد ملفات مسجلة حتى الآن'}</p>
        </motion.div>
      )}
    </div>
  )
}
