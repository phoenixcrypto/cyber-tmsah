'use client'

import { useEffect, useState } from 'react'

interface Profile {
  name: string
  email?: string
  role: string
  lastLogin?: string
}

export default function ProfileDetails() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setProfile(data.user)
      } catch (error) {
        console.error('Unable to load profile', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="admin-empty-state">جاري تحميل البيانات...</div>
  }

  if (!profile) {
    return <div className="admin-empty-state">تعذر تحميل معلومات الحساب.</div>
  }

  return (
    <div className="admin-section-grid">
      <div className="admin-section-stat">
        <span className="admin-section-stat-label">الاسم</span>
        <span className="admin-section-stat-value" style={{ fontSize: '1.4rem' }}>
          {profile.name}
        </span>
        <span className="admin-section-stat-change">الدور: {profile.role}</span>
      </div>

      <div className="admin-section-stat">
        <span className="admin-section-stat-label">البريد الإلكتروني</span>
        <span className="admin-section-stat-value" style={{ fontSize: '1rem' }}>
          {profile.email || 'لم يتم تحديد بريد إلكتروني'}
        </span>
      </div>

      <div className="admin-section-stat">
        <span className="admin-section-stat-label">آخر تسجيل دخول</span>
        <span className="admin-section-stat-value" style={{ fontSize: '1rem' }}>
          {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('ar-EG') : 'غير متوفر'}
        </span>
      </div>
    </div>
  )
}


