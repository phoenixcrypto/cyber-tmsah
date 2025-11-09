'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Search, ChevronDown } from 'lucide-react'

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
  const [namesList, setNamesList] = useState<Array<{
    id: string
    fullName: string
    sectionNumber: number
    groupName: string
    isRegistered: boolean
  }>>([])
  const [namesLoading, setNamesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [verificationStatus, setVerificationStatus] = useState<{
    checked: boolean
    valid: boolean
    message: string
  }>({ checked: false, valid: false, message: '' })
  
  // Fetch all names from verification_list on component mount
  useEffect(() => {
    const fetchNames = async () => {
      try {
        setNamesLoading(true)
        const response = await fetch('/api/auth/verification-names')
        const data = await response.json()
        
        if (data.success && Array.isArray(data.names)) {
          setNamesList(data.names)
        } else {
          console.error('[Register] Failed to fetch names:', data.error)
        }
      } catch (err) {
        console.error('[Register] Error fetching names:', err)
      } finally {
        setNamesLoading(false)
      }
    }
    
    fetchNames()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter names based on search term
  const filteredNames = namesList.filter((name) => {
    if (!searchTerm.trim()) return true
    const search = searchTerm.toLowerCase().trim()
    return name.fullName.toLowerCase().includes(search)
  })

  // Handle name selection
  const handleNameSelect = (name: {
    fullName: string
    sectionNumber: number
    groupName: string
  }) => {
    setFormData({
      ...formData,
      fullName: name.fullName,
      sectionNumber: name.sectionNumber.toString(),
      groupName: name.groupName,
    })
    setSearchTerm('')
    setShowDropdown(false)
    // Reset verification status when selecting a new name
    setVerificationStatus({ checked: false, valid: false, message: '' })
    setError('')
    setSuccess('')
  }

  // Verify student data before registration
  const handleVerify = async () => {
    // Clear previous messages
    setError('')
    setSuccess('')
    setVerificationStatus({ checked: false, valid: false, message: '' })

    // Validate required fields
    if (!formData.fullName || !formData.fullName.trim()) {
      setError('يرجى إدخال الاسم الكامل')
      return
    }

    if (!formData.sectionNumber) {
      setError('يرجى اختيار رقم السكشن')
      return
    }

    if (!formData.groupName) {
      setError('يرجى اختيار المجموعة')
      return
    }

    setVerifying(true)

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

      if (response.ok && data.valid) {
        setVerificationStatus({
          checked: true,
          valid: true,
          message: 'تم التحقق بنجاح! معلوماتك تطابق السجلات. يمكنك المتابعة مع التسجيل.',
        })
        setSuccess('تم التحقق من معلوماتك بنجاح. يرجى إكمال نموذج التسجيل أدناه.')
        setError('')
      } else {
        // Enhanced error messages with suggestions
        let errorMessage = data.error || 'فشل التحقق. يرجى التحقق من المعلومات والمحاولة مرة أخرى.'
        let detailedMessage = errorMessage
        
        if (data.suggestionDetails && data.suggestionDetails.length > 0) {
          // Show suggestions with section and group details
          detailedMessage += `\n\n${data.message || 'هل تقصد أحد هذه الأسماء؟'}\n\n`
          data.suggestionDetails.forEach((s: any, index: number) => {
            detailedMessage += `${index + 1}. ${s.fullName} (السكشن ${s.sectionNumber}, ${s.groupName})\n`
          })
        } else if (data.suggestions && data.suggestions.length > 0) {
          // Fallback to simple suggestions
          detailedMessage += `\n\n${data.message || 'هل تقصد أحد هذه الأسماء؟'}\n${data.suggestions.map((s: string) => `• ${s}`).join('\n')}`
        }
        
        if (data.foundName) {
          detailedMessage += `\n\nموجود في السجلات: ${data.foundName}\nالسكشن: ${data.foundSection}, المجموعة: ${data.foundGroup}`
        }

        setVerificationStatus({
          checked: true,
          valid: false,
          message: detailedMessage,
        })
        setError(detailedMessage)
        setSuccess('')
      }
    } catch (err) {
      console.error('Verification error:', err)
      const errorMessage = 'فشل التحقق. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
      setError(errorMessage)
      setVerificationStatus({
        checked: true,
        valid: false,
        message: errorMessage,
      })
      setSuccess('')
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
      setError('Please verify your information first by clicking "Verify Information"')
      return
    }

    // Validate all required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Step 1: Send verification code
      const sendCodeResponse = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
        }),
      })

      const sendCodeData = await sendCodeResponse.json()

      if (!sendCodeResponse.ok || !sendCodeData.success) {
        setError(sendCodeData.error || 'Failed to send verification code. Please try again.')
        setLoading(false)
        return
      }

      // Step 2: Store registration data in sessionStorage and redirect to verification page
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        sectionNumber: parseInt(formData.sectionNumber),
        groupName: formData.groupName,
        universityEmail: formData.universityEmail || undefined,
      }

      // Store in sessionStorage temporarily
      sessionStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

      // Redirect to verification page
      router.push(`/verify-code?email=${encodeURIComponent(formData.email.toLowerCase().trim())}&from=register`)
    } catch (err) {
      console.error('Error sending verification code:', err)
      setError('An error occurred. Please try again.')
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
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  الاسم الكامل (اختر من القائمة)
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm || formData.fullName}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowDropdown(true)
                        if (!e.target.value) {
                          setFormData({ ...formData, fullName: '' })
                          setVerificationStatus({ checked: false, valid: false, message: '' })
                          setError('')
                          setSuccess('')
                        }
                      }}
                      onFocus={() => {
                        if (namesList.length > 0) {
                          setShowDropdown(true)
                        }
                      }}
                      className={`w-full pl-10 pr-10 p-3 bg-cyber-dark border rounded-lg text-dark-100 focus:ring-1 focus:ring-cyber-neon/50 ${
                        verificationStatus.checked
                          ? verificationStatus.valid
                            ? 'border-cyber-green/50'
                            : 'border-red-500/50'
                          : 'border-cyber-neon/30'
                      } focus:border-cyber-neon`}
                      placeholder={namesLoading ? "جاري تحميل الأسماء..." : "ابحث عن اسمك من القائمة (703 طالب)"}
                      required
                    />
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {/* Dropdown */}
                  {showDropdown && !namesLoading && (
                    <div className="absolute z-50 w-full mt-1 bg-cyber-dark border border-cyber-neon/30 rounded-lg shadow-xl max-h-60 overflow-auto">
                      {filteredNames.length > 0 ? (
                        <div className="py-1">
                          {filteredNames.slice(0, 50).map((name) => (
                            <button
                              key={name.id}
                              type="button"
                              onClick={() => handleNameSelect(name)}
                              disabled={name.isRegistered}
                              className={`w-full text-right px-4 py-2 text-sm text-dark-100 hover:bg-cyber-neon/10 transition-colors ${
                                name.isRegistered
                                  ? 'opacity-50 cursor-not-allowed line-through'
                                  : 'cursor-pointer'
                              } ${formData.fullName === name.fullName ? 'bg-cyber-neon/20' : ''}`}
                            >
                              <div className="font-medium">{name.fullName}</div>
                              <div className="text-xs text-dark-400">
                                السكشن {name.sectionNumber} - {name.groupName}
                                {name.isRegistered && ' (مسجل بالفعل)'}
                              </div>
                            </button>
                          ))}
                          {filteredNames.length > 50 && (
                            <div className="px-4 py-2 text-xs text-dark-400 text-center">
                              عرض 50 من {filteredNames.length} نتيجة. استمر في البحث للعثور على المزيد.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-sm text-dark-400 text-center">
                          {searchTerm ? 'لم يتم العثور على نتائج' : 'ابدأ بالبحث عن اسمك'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {verificationStatus.checked && (
                  <p className={`mt-1 text-xs ${
                    verificationStatus.valid ? 'text-cyber-green' : 'text-red-400'
                  }`}>
                    {verificationStatus.message}
                  </p>
                )}
                {namesLoading && (
                  <p className="mt-1 text-xs text-dark-400">
                    جاري تحميل قائمة الأسماء...
                  </p>
                )}
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
              disabled={verifying || namesLoading || !formData.fullName || !formData.sectionNumber || !formData.groupName}
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
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                }}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                placeholder="your@email.com"
              />
              <p className="text-xs text-dark-400 mt-1">
                A verification code will be sent to this email when you click "Create Account"
              </p>
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
              disabled={loading || !verificationStatus.valid || !verificationStatus.checked || !formData.username || !formData.email || !formData.password}
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

