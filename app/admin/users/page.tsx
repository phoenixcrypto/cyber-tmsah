'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Save, X, Shield, UserCheck, UserX, Key } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface User {
  id: string
  username: string
  email?: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export default function AdminUsersPage() {
  const { language } = useLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<User & { password: string; confirmPassword: string }>>({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'editor',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: formData.role,
        }),
      })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchUsers()
        setShowAddForm(false)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert(language === 'ar' ? 'حدث خطأ أثناء إضافة المستخدم' : 'Error adding user')
    }
  }

  const handleUpdate = async () => {
    if (!editingUser) return

    const updates: any = {
      name: formData.name,
      role: formData.role,
    }

    if (formData.email) {
      updates.email = formData.email
    }

    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        alert(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
        return
      }
      updates.password = formData.password
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingUser.id, ...updates }),
      })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchUsers()
        setEditingUser(null)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert(language === 'ar' ? 'حدث خطأ أثناء تحديث المستخدم' : 'Error updating user')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Immediate sync - refresh data
        await fetchUsers()
      } else {
        const error = await res.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(language === 'ar' ? 'حدث خطأ أثناء حذف المستخدم' : 'Error deleting user')
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      role: 'editor',
    })
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email || '',
      name: user.name,
      password: '',
      confirmPassword: '',
      role: user.role,
    })
    setShowAddForm(false)
  }

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: { label: language === 'ar' ? 'مدير' : 'Admin', color: 'from-red-500 to-red-600', icon: Shield },
      editor: { label: language === 'ar' ? 'محرر' : 'Editor', color: 'from-blue-500 to-blue-600', icon: UserCheck },
      viewer: { label: language === 'ar' ? 'مشاهد' : 'Viewer', color: 'from-gray-500 to-gray-600', icon: UserX },
    }
    return roles[role as keyof typeof roles] || roles.viewer
  }

  if (loading) {
    return <div className="text-center py-20 text-dark-300">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-cyber-neon" />
            {language === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'إدارة وإضافة وتعديل المستخدمين' : 'Manage, add and edit users'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingUser(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-300 mb-1">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
              <p className="text-3xl font-bold text-dark-100">{users.length}</p>
            </div>
            <Users className="w-12 h-12 text-cyber-neon opacity-50" />
          </div>
        </div>
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-300 mb-1">{language === 'ar' ? 'المديرين' : 'Admins'}</p>
              <p className="text-3xl font-bold text-dark-100">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <Shield className="w-12 h-12 text-red-400 opacity-50" />
          </div>
        </div>
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-300 mb-1">{language === 'ar' ? 'المحررين' : 'Editors'}</p>
              <p className="text-3xl font-bold text-dark-100">{users.filter(u => u.role === 'editor').length}</p>
            </div>
            <UserCheck className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </div>
      </div>

      {(showAddForm || editingUser) && (
        <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <h2 className="text-xl font-bold text-dark-100 mb-4">
            {editingUser ? (language === 'ar' ? 'تعديل المستخدم' : 'Edit User') : (language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User')}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'اسم المستخدم *' : 'Username *'}
                </label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'الصلاحية *' : 'Role *'}
                </label>
                <select
                  value={formData.role || 'editor'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                  <option value="editor">{language === 'ar' ? 'محرر' : 'Editor'}</option>
                  <option value="viewer">{language === 'ar' ? 'مشاهد' : 'Viewer'}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {language === 'ar' ? 'كلمة المرور *' : 'Password *'}
                  {editingUser && <span className="text-xs text-dark-400">({language === 'ar' ? 'اتركه فارغاً للاحتفاظ بالكلمة الحالية' : 'Leave empty to keep current'})</span>}
                </label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-2">
                  {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                  {editingUser && <span className="text-xs text-dark-400">({language === 'ar' ? 'فقط إذا غيرت كلمة المرور' : 'Only if changing password'})</span>}
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword || ''}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/80 border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  required={!editingUser}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingUser ? handleUpdate : handleAdd}
              className="bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingUser(null)
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

      <div className="space-y-4">
        {users.map((user) => {
          const roleBadge = getRoleBadge(user.role)
          const RoleIcon = roleBadge.icon
          return (
            <div
              key={user.id}
              className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${roleBadge.color} rounded-xl flex items-center justify-center`}>
                      <RoleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-100">{user.name}</h3>
                      <p className="text-sm text-dark-400">@{user.username}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${roleBadge.color} text-white`}>
                      {roleBadge.label}
                    </span>
                  </div>
                  <div className="text-xs text-dark-400 space-y-1">
                    {user.email && (
                      <div><strong>{language === 'ar' ? 'البريد:' : 'Email:'}</strong> {user.email}</div>
                    )}
                    <div><strong>{language === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
                    {user.lastLogin && (
                      <div><strong>{language === 'ar' ? 'آخر تسجيل دخول:' : 'Last Login:'}</strong> {new Date(user.lastLogin).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="p-2 bg-cyber-neon/20 text-cyber-neon rounded-lg hover:bg-cyber-neon/30 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {users.length === 0 && (
          <div className="text-center py-20 text-dark-300">
            {language === 'ar' ? 'لا يوجد مستخدمين بعد' : 'No users yet'}
          </div>
        )}
      </div>
    </div>
  )
}

