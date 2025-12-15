'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Download } from 'lucide-react'
import UserTable from '@/components/admin/UserTable'
import UserModal from '@/components/admin/UserModal'
import type { User } from '@/lib/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Function to refresh users list
  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.data.users || [])
      }
    } catch (error) {
      console.error('Error refreshing users:', error)
    }
  }

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        if (res.ok) {
          const data = await res.json()
          setUsers(data.data.users || [])
        } else {
          console.error('Failed to fetch users')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">إدارة المستخدمين</h1>
          <p className="admin-page-description">إدارة جميع المستخدمين والصلاحيات</p>
        </div>
        <motion.button
          className="admin-page-action-btn"
          onClick={() => {
            setEditingUser(null)
            setIsModalOpen(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مستخدم</span>
        </motion.button>
      </motion.div>

      {/* Filters & Search */}
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
            placeholder="بحث عن مستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users-search-input"
          />
        </div>

        <div className="admin-users-filters-group">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="admin-users-filter-select"
          >
            <option value="all">جميع الصلاحيات</option>
            <option value="admin">مدير</option>
            <option value="editor">محرر</option>
            <option value="viewer">مشاهد</option>
          </select>


          <motion.button
            className="admin-users-filter-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span>فلتر متقدم</span>
          </motion.button>

          {selectedUsers.length > 0 && (
            <motion.button
              className="admin-users-batch-btn"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span>تصدير ({selectedUsers.length})</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onEdit={(user) => {
          setEditingUser(user)
          setIsModalOpen(true)
        }}
        onDelete={async (_userId) => {
          if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            // Delete user
            try {
              const res = await fetch(`/api/admin/users/${_userId}`, { method: 'DELETE' })
              if (res.ok) {
                // Remove from local state
                setUsers(users.filter(u => u.id !== _userId))
                alert('تم الحذف بنجاح')
              } else {
                const data = await res.json()
                alert(data.error || 'حدث خطأ أثناء الحذف')
              }
            } catch (error) {
              console.error('Delete error:', error)
              alert('حدث خطأ أثناء الحذف')
            }
          }
        }}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        onSave={refreshUsers}
        user={editingUser}
      />
    </div>
  )
}

