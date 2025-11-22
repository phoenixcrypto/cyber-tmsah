'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, Loader2, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        // 401 is expected when not logged in - not an error
        return null
      })
      .then((data) => {
        if (data?.user) {
          router.push('/admin/dashboard')
        }
        // If no user, stay on login page (this is normal)
      })
      .catch(() => {
        // Network errors are expected - not logged in, continue
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول')
        setLoading(false)
        return
      }

      // Success - redirect to dashboard
      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyber-neon/20 to-cyber-violet/20 rounded-2xl mb-4 border-2 border-cyber-neon/30">
            <Shield className="w-10 h-10 text-cyber-neon" />
          </div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2">
            {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
          <p className="text-dark-300">
            {language === 'ar' ? 'تسجيل الدخول للوصول إلى لوحة التحكم' : 'Login to access admin dashboard'}
          </p>
        </div>

        {/* Login Form */}
        <div className="enhanced-card p-8 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyber-neon" />
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-cyber-dark/80 border-2 border-cyber-neon/30 rounded-xl text-dark-100 focus:border-cyber-neon focus:outline-none focus:ring-4 focus:ring-cyber-neon/20 transition-all duration-300"
                placeholder={language === 'ar' ? 'admin@cyber-tmsah.site' : 'admin@cyber-tmsah.site'}
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyber-neon" />
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-cyber-dark/80 border-2 border-cyber-neon/30 rounded-xl text-dark-100 focus:border-cyber-neon focus:outline-none focus:ring-4 focus:ring-cyber-neon/20 transition-all duration-300"
                placeholder={language === 'ar' ? '••••••••' : '••••••••'}
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-neon via-cyber-green to-cyber-neon bg-size-200 bg-pos-0 hover:bg-pos-100 text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyber-neon/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-cyber-neon/10 border border-cyber-neon/30 rounded-lg">
              <p className="text-xs text-dark-300 text-center">
                <strong className="text-cyber-neon">Default Admin:</strong>
                <br />
                Email: admin@cyber-tmsah.site
                <br />
                Password: Admin@2026!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

