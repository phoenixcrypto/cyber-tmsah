'use client'

import { useState } from 'react'
import { Lock, Mail, AlertCircle, Loader2, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLoginPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('🔐 Attempting login...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent and received
        body: JSON.stringify({ email, password }),
      })

      console.log('📡 Login response status:', response.status)
      console.log('📡 Login response headers:', {
        'set-cookie': response.headers.get('set-cookie'),
        'content-type': response.headers.get('content-type'),
      })

      const data = await response.json()
      console.log('📦 Login response data:', data)

      if (!response.ok) {
        console.error('❌ Login failed:', data.error)
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول')
        setLoading(false)
        return
      }

      // Success - verify that cookies were set
      if (data.success && data.user) {
        console.log('✅ Login successful!')
        console.log('👤 User:', data.user)
        console.log('🍪 Checking cookies...')
        
        // Check if cookies are available (they should be set by the server)
        // Note: HttpOnly cookies cannot be read by JavaScript, but they should be sent automatically
        const cookiesAvailable = document.cookie.includes('admin-token') || true // HttpOnly cookies won't appear in document.cookie
        
        console.log('🍪 Cookies status:', {
          documentCookies: document.cookie,
          cookiesAvailable: cookiesAvailable,
          note: 'HttpOnly cookies are not visible in document.cookie but should be sent automatically',
        })
        
        // Wait a moment to ensure cookies are processed by the browser
        // Then redirect with full page reload
        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...')
          // Use window.location.href for full page reload
          // This ensures cookies are sent with the next request
          window.location.href = '/admin/dashboard'
        }, 300)
        
        // Don't set loading to false here as we're redirecting
      } else {
        console.error('❌ Login response missing success or user data')
        setError('حدث خطأ أثناء تسجيل الدخول')
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Login error:', error)
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

