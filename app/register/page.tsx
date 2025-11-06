'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    sectionNumber: '',
    groupName: '',
    universityEmail: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [verificationStatus, setVerificationStatus] = useState<{
    checked: boolean
    valid: boolean
    message: string
  }>({ checked: false, valid: false, message: '' })

  // Verify student data before registration
  const handleVerify = async () => {
    if (!formData.fullName || !formData.sectionNumber || !formData.groupName) {
      setError('Please fill in full name, section number, and group first')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          sectionNumber: parseInt(formData.sectionNumber),
          groupName: formData.groupName,
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setVerificationStatus({
          checked: true,
          valid: true,
          message: 'Verification successful! You can proceed with registration.',
        })
        setSuccess('Your information has been verified. Please complete the form below.')
      } else {
        setVerificationStatus({
          checked: true,
          valid: false,
          message: data.error || 'Verification failed. Please check your information.',
        })
        setError(data.error || 'Your information does not match our records.')
      }
    } catch (err) {
      setError('Failed to verify. Please try again.')
      setVerificationStatus({
        checked: true,
        valid: false,
        message: 'Verification failed. Please try again.',
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check if verified
    if (!verificationStatus.checked || !verificationStatus.valid) {
      setError('Please verify your information first')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          fullName: formData.fullName.trim(),
          sectionNumber: parseInt(formData.sectionNumber),
          groupName: formData.groupName,
          universityEmail: formData.universityEmail || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store access token
        if (data.accessToken) {
          document.cookie = `access_token=${data.accessToken}; path=/; max-age=900; SameSite=Strict` // 15 minutes
        }

        setSuccess('Registration successful! Redirecting to dashboard...')
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-orbitron font-bold text-dark-100 mb-2">
            Create Account
          </h1>
          <p className="text-dark-300">
            Register to access your personalized academic dashboard
          </p>
        </div>

        <div className="enhanced-card p-8 animate-slide-up">
          {/* Verification Section */}
          <div className="mb-6 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              Step 1: Verify Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value })
                    setVerificationStatus({ checked: false, valid: false, message: '' })
                  }}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Section Number
                </label>
                <select
                  value={formData.sectionNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, sectionNumber: e.target.value })
                    setVerificationStatus({ checked: false, valid: false, message: '' })
                  }}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                >
                  <option value="">Select Section</option>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Group
                </label>
                <select
                  value={formData.groupName}
                  onChange={(e) => {
                    setFormData({ ...formData, groupName: e.target.value })
                    setVerificationStatus({ checked: false, valid: false, message: '' })
                  }}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                >
                  <option value="">Select Group</option>
                  <option value="Group 1">Group 1 (A) - Sections 1-7</option>
                  <option value="Group 2">Group 2 (B) - Sections 8-15</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleVerify}
              disabled={verifying || !formData.fullName || !formData.sectionNumber || !formData.groupName}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verify Information
                </>
              )}
            </button>
            {verificationStatus.checked && (
              <div className={`mt-4 p-3 rounded-lg ${
                verificationStatus.valid
                  ? 'bg-cyber-green/20 border border-cyber-green/50 text-cyber-green'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}>
                <p className="text-sm">{verificationStatus.message}</p>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                  placeholder="Choose a username"
                  minLength={3}
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 pr-10 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                    placeholder="Min 8 characters"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-2 flex items-center text-dark-300 hover:text-dark-100"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-dark-400 mt-1">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full p-3 pr-10 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-2 flex items-center text-dark-300 hover:text-dark-100"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                University Email (Optional - Disabled until available)
              </label>
              <input
                type="email"
                value={formData.universityEmail}
                onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                className="w-full p-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-400 cursor-not-allowed"
                placeholder="Will be available soon"
                disabled
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-cyber-green/20 border border-cyber-green/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <p className="text-cyber-green text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !verificationStatus.valid || !formData.username || !formData.email || !formData.password}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-300 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-cyber-neon hover:text-cyber-green transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

