'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Lock, User, Mail, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const cookies = document.cookie.split(';')
        const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
        const accessToken = accessTokenCookie?.split('=')[1]

        if (!accessToken) {
          router.push('/login?redirect=/admin/settings')
          return
        }

        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1] || ''))
          if (payload.role !== 'admin') {
            setMessage({ type: 'error', text: 'Admin access required' })
            setIsAdmin(false)
            return
          }

          setIsAdmin(true)
          
          // Fetch current admin data
          const response = await fetch('/api/admin/profile', {
            credentials: 'include',
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
          })

          if (response.ok) {
            const data = await response.json()
            setFormData({
            fullName: data.user.full_name || '',
            email: data.user.email || '',
            username: data.user.username || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
          // Note: currentUser state removed as it's not used in UI
          }
        } catch (e) {
          setMessage({ type: 'error', text: 'Invalid token. Please log in again.' })
          setIsAdmin(false)
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to verify admin access.' })
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const cookies = document.cookie.split(';')
      const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
      const accessToken = accessTokenCookie?.split('=')[1]

      // Validate password change if provided
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          setMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' })
          setSaving(false)
          return
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' })
          setSaving(false)
          return
        }
        if (!formData.currentPassword) {
          setMessage({ type: 'error', text: 'يجب إدخال كلمة المرور الحالية لتغييرها' })
          setSaving(false)
          return
        }
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم تحديث البيانات بنجاح!' })
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل تحديث البيانات' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث البيانات' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-neon mx-auto mb-4" />
          <p className="text-dark-300">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-100 mb-2">غير مصرح بالوصول</h2>
          <p className="text-dark-300 mb-4">يجب تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة.</p>
          <button
            onClick={() => router.push('/login?redirect=/admin/settings')}
            className="px-6 py-2 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
            إعدادات المسؤول
          </h1>
          <p className="text-dark-300">تحديث بيانات حسابك وكلمة المرور</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-400' 
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="enhanced-card p-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark-100 flex items-center gap-2">
              <User className="w-5 h-5 text-cyber-neon" />
              المعلومات الشخصية
            </h2>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                required
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-4 pt-6 border-t border-cyber-neon/20">
            <h2 className="text-xl font-semibold text-dark-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyber-neon" />
              تغيير كلمة المرور
            </h2>
            <p className="text-sm text-dark-400">اترك الحقول فارغة إذا لم ترد تغيير كلمة المرور</p>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                كلمة المرور الحالية
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon pr-10"
                  placeholder="أدخل كلمة المرور الحالية"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon pr-10"
                  placeholder="8 أحرف على الأقل"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon pr-10"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-cyber-neon/20">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

