'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Create animated particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
      } else {
        setErrors({ general: data.error || 'حدث خطأ أثناء تسجيل الدخول' })
      }
    } catch (error) {
      setErrors({ general: 'حدث خطأ في الاتصال' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      {/* Animated Background */}
      <div className="admin-login-background">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="admin-login-particle"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          />
        ))}
        <div className="admin-login-gradient-orb orb-1"></div>
        <div className="admin-login-gradient-orb orb-2"></div>
        <div className="admin-login-gradient-orb orb-3"></div>
      </div>

      {/* Login Card */}
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-login-card-bg"></div>
        <div className="admin-login-card-glow"></div>

        {/* Logo & Header */}
        <div className="admin-login-header">
          <motion.div
            className="admin-login-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Shield className="w-12 h-12" />
          </motion.div>
          <h1 className="admin-login-title">لوحة التحكم</h1>
          <p className="admin-login-subtitle">سجل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <motion.div
            className="admin-login-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-form-group">
            <label className="admin-login-form-label">
              <Mail className="w-5 h-5" />
              <span>اسم المستخدم</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`admin-login-form-input ${errors.username ? 'error' : ''}`}
              placeholder="أدخل اسم المستخدم"
              required
            />
            {errors.username && (
              <span className="admin-login-form-error">{errors.username}</span>
            )}
          </div>

          <div className="admin-login-form-group">
            <label className="admin-login-form-label">
              <Lock className="w-5 h-5" />
              <span>كلمة المرور</span>
            </label>
            <div className="admin-login-form-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`admin-login-form-input ${errors.password ? 'error' : ''}`}
                placeholder="أدخل كلمة المرور"
                required
              />
              <motion.button
                type="button"
                className="admin-login-form-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
            {errors.password && (
              <span className="admin-login-form-error">{errors.password}</span>
            )}
          </div>

          <div className="admin-login-form-options">
            <label className="admin-login-form-checkbox">
              <input type="checkbox" />
              <span>تذكرني</span>
            </label>
            <a href="#" className="admin-login-form-forgot">
              نسيت كلمة المرور؟
            </a>
          </div>

          <motion.button
            type="submit"
            className="admin-login-form-submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="admin-login-form-spinner"></div>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <p>
            © {new Date().getFullYear()} Cyber TMSAH. جميع الحقوق محفوظة.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

