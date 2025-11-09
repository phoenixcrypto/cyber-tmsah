'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const from = searchParams.get('from') || ''
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [creatingAccount, setCreatingAccount] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char
        }
      })
      setCode(newCode)
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedCode.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Clear error when user types
    if (error) {
      setError('')
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d{1,6}$/.test(pastedData)) {
      const newCode = [...code]
      pastedData.split('').forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char
        }
      })
      setCode(newCode)
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    if (!email) {
      setError('Email is missing. Please return to registration.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Verify the code
      const verifyResponse = await fetch('/api/auth/send-verification-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: fullCode,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok || !verifyData.success) {
        setError(verifyData.error || 'Invalid verification code. Please try again.')
        // Clear code on error
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        setLoading(false)
        return
      }

      // Step 2: If coming from registration, create account automatically
      if (from === 'register') {
        const pendingRegistration = sessionStorage.getItem('pendingRegistration')
        
        if (!pendingRegistration) {
          setError('Registration data not found. Please return to registration page.')
          setLoading(false)
          return
        }

        setCreatingAccount(true)
        setSuccess(true)

        try {
          const registrationData = JSON.parse(pendingRegistration)
          
          const registerResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
          })

          const registerData = await registerResponse.json()

          if (registerResponse.ok && registerData.success) {
            // Clear pending registration
            sessionStorage.removeItem('pendingRegistration')
            
            // Redirect to dashboard after successful registration
            setTimeout(() => {
              router.push('/dashboard')
            }, 1500)
          } else {
            setError(registerData.error || 'Failed to create account. Please try again.')
            setSuccess(false)
            setCreatingAccount(false)
            // Clear code on error
            setCode(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
          }
        } catch (err) {
          console.error('Registration error:', err)
          setError('Failed to create account. Please try again.')
          setSuccess(false)
          setCreatingAccount(false)
          // Clear code on error
          setCode(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
        }
      } else {
        // Not from registration, just verify and redirect
        setSuccess(true)
        setTimeout(() => {
          router.push(`/register?email=${encodeURIComponent(email)}&verified=true`)
        }, 1500)
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError('An error occurred. Please try again.')
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Email is missing. Please return to registration.')
      return
    }

    setResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setError('')
        // Show success message temporarily
        setTimeout(() => {
          alert('Verification code has been resent to your email.')
        }, 100)
        // Clear code
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError(data.error || 'Failed to resend code. Please try again.')
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark-100 mb-4">Email Missing</h1>
          <p className="text-dark-300 mb-6">Please return to the registration page to start the verification process.</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-orbitron font-bold text-dark-100 mb-2">
            Verify Your Email
          </h1>
          <p className="text-dark-300">
            Enter the 6-digit code sent to
          </p>
          <p className="text-cyber-neon font-semibold mt-1">
            {email}
          </p>
        </div>

        <div className="enhanced-card p-8 animate-slide-up">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-cyber-green mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-dark-100 mb-2">
                {creatingAccount ? 'Creating Your Account...' : 'Code Verified!'}
              </h2>
              <p className="text-dark-300">
                {creatingAccount 
                  ? 'Your account is being created. You will be redirected to your dashboard shortly...'
                  : 'Redirecting to registration...'}
              </p>
              {creatingAccount && (
                <Loader2 className="w-8 h-8 animate-spin text-cyber-neon mx-auto mt-4" />
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-300 mb-4 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-14 h-14 text-center text-2xl font-bold bg-cyber-dark border-2 border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-2 focus:ring-cyber-neon/50 transition-all"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={loading || code.join('').length !== 6}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Verify Code
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-dark-300 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-cyber-neon hover:text-cyber-green transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="text-sm text-dark-300 hover:text-dark-100 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Registration
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

