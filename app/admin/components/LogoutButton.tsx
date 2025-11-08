'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Call logout API
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      
      // Clear all cookies client-side
      document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax'
      document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict'
      document.cookie = 'admin-token=; path=/; max-age=0; SameSite=Strict'
      
      // Redirect to login
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Even if API fails, clear cookies and redirect
      document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax'
      document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict'
      document.cookie = 'admin-token=; path=/; max-age=0; SameSite=Strict'
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4" />
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

