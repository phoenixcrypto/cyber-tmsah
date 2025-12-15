'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, CheckCircle2, XCircle, Ban } from 'lucide-react'
import type { User } from '@/lib/types'

interface UserWithStatus extends User {
  status?: 'online' | 'offline' | 'banned' // Optional, calculated from lastLogin
}

interface UserTableProps {
  users: UserWithStatus[]
  selectedUsers: string[]
  onSelectionChange: (ids: string[]) => void
  onEdit: (user: UserWithStatus) => void
  onDelete: (userId: string) => void
}

export default function UserTable({
  users,
  selectedUsers,
  onSelectionChange,
  onEdit,
  onDelete,
}: UserTableProps) {
  const [sortField, setSortField] = useState<keyof UserWithStatus>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)

  const sortedUsers = [...users].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const paginatedUsers = sortedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage)

  const handleSort = (field: keyof UserWithStatus) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(paginatedUsers.map((u) => u.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter((id) => id !== userId))
    } else {
      onSelectionChange([...selectedUsers, userId])
    }
  }

  const getStatusFromUser = (user: UserWithStatus): 'online' | 'offline' | 'banned' => {
    if (user.status) return user.status
    // Calculate status from lastLogin
    if (!user.lastLogin) return 'offline'
    const lastLogin = user.lastLogin instanceof Date ? user.lastLogin : new Date(user.lastLogin)
    const now = new Date()
    const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60)
    return hoursSinceLogin < 24 ? 'online' : 'offline'
  }

  const getStatusBadge = (status: 'online' | 'offline' | 'banned') => {
    switch (status) {
      case 'online':
        return (
          <span className="admin-user-status-badge online">
            <CheckCircle2 className="w-3 h-3" />
            <span>متصل</span>
          </span>
        )
      case 'offline':
        return (
          <span className="admin-user-status-badge offline">
            <XCircle className="w-3 h-3" />
            <span>غير متصل</span>
          </span>
        )
      case 'banned':
        return (
          <span className="admin-user-status-badge banned">
            <Ban className="w-3 h-3" />
            <span>محظور</span>
          </span>
        )
    }
  }

  const getRoleBadge = (role: User['role']) => {
    const colors = {
      admin: 'from-red-500 to-pink-500',
      editor: 'from-blue-500 to-cyan-500',
      viewer: 'from-gray-500 to-gray-600',
    }
    return (
      <span className={`admin-user-role-badge bg-gradient-to-r ${colors[role]}`}>
        {role === 'admin' ? 'مدير' : role === 'editor' ? 'محرر' : 'مشاهد'}
      </span>
    )
  }

  return (
    <motion.div
      className="admin-user-table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="admin-user-table-wrapper">
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="admin-user-table-checkbox"
                />
              </th>
              <th onClick={() => handleSort('name')} className="admin-user-table-sortable">
                الاسم
                {sortField === 'name' && (
                  <span className="admin-user-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('email')} className="admin-user-table-sortable">
                البريد الإلكتروني
                {sortField === 'email' && (
                  <span className="admin-user-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('role')} className="admin-user-table-sortable">
                الصلاحية
                {sortField === 'role' && (
                  <span className="admin-user-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('status')} className="admin-user-table-sortable">
                الحالة
                {sortField === 'status' && (
                  <span className="admin-user-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('lastLogin')} className="admin-user-table-sortable">
                آخر تسجيل دخول
                {sortField === 'lastLogin' && (
                  <span className="admin-user-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className={`admin-user-table-row ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  whileHover={{ x: 5 }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="admin-user-table-checkbox"
                    />
                  </td>
                  <td>
                    <div className="admin-user-table-name">
                      <div className="admin-user-table-avatar">{user.name[0]}</div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(getStatusFromUser(user))}</td>
                  <td>
                    {user.lastLogin
                      ? (user.lastLogin instanceof Date ? user.lastLogin : new Date(user.lastLogin)).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'لم يسجل دخول'}
                  </td>
                  <td>
                    <div className="admin-user-table-actions">
                      <motion.button
                        className="admin-user-table-action-btn"
                        onClick={() => onEdit(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="admin-user-table-action-btn"
                        onClick={() => onDelete(user.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="admin-user-table-pagination">
        <div className="admin-user-table-pagination-info">
          عرض {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, sortedUsers.length)} من{' '}
          {sortedUsers.length}
        </div>
        <div className="admin-user-table-pagination-controls">
          <motion.button
            className="admin-user-table-pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            السابق
          </motion.button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <motion.button
              key={pageNum}
              className={`admin-user-table-pagination-btn ${page === pageNum ? 'active' : ''}`}
              onClick={() => setPage(pageNum)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {pageNum}
            </motion.button>
          ))}
          <motion.button
            className="admin-user-table-pagination-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            التالي
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

