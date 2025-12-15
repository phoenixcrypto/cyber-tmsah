'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar } from 'lucide-react'
import ProfileDetails from './profile-details'

interface UserProfile {
  id: string
  name: string
  email: string | null
  username: string
  role: 'admin' | 'editor' | 'viewer'
  lastLogin: string | null
  createdAt: string
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.data.user)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">الملف الشخصي</h1>
            <p className="admin-page-description">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  const roleLabels: Record<string, string> = {
    admin: 'مدير',
    editor: 'محرر',
    viewer: 'مشاهد',
  }

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="admin-page-title">الملف الشخصي</h1>
          <p className="admin-page-description">عرض معلومات الحساب الحالية</p>
        </div>
      </motion.div>

      {/* Profile Info */}
      {profile && (
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ maxWidth: '600px', margin: '2rem auto' }}
        >
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-white)' }}>
              {profile.name}
            </h2>
            <div className="admin-badge" style={{ marginBottom: '1.5rem' }}>
              {roleLabels[profile.role] || profile.role}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <User className="w-5 h-5" style={{ color: 'var(--primary-red)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>اسم المستخدم</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-white)' }}>{profile.username}</div>
              </div>
            </div>

            {profile.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--primary-red)' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>البريد الإلكتروني</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-white)' }}>{profile.email}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--primary-red)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>الصلاحية</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-white)' }}>{roleLabels[profile.role] || profile.role}</div>
              </div>
            </div>

            {profile.lastLogin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--primary-red)' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>آخر تسجيل دخول</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-white)' }}>
                    {new Date(profile.lastLogin).toLocaleString('ar-EG')}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <Calendar className="w-5 h-5" style={{ color: 'var(--primary-red)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--dark-400)' }}>تاريخ الإنشاء</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-white)' }}>
                  {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      )}

      {/* Profile Details Component */}
      <ProfileDetails />
    </div>
  )
}
