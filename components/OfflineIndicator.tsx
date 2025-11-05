'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShow(true)
    } else {
      // Hide after 2 seconds when back online
      const timer = setTimeout(() => setShow(false), 2000)
      return () => clearTimeout(timer)
    }
    // Explicit return for consistency
    return undefined
  }, [isOnline])

  if (!show) return null

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md ${
          isOnline
            ? 'bg-cyber-green/20 border border-cyber-green/50 text-cyber-green'
            : 'bg-red-500/20 border border-red-500/50 text-red-400'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-medium">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">You're Offline</span>
          </>
        )}
      </div>
    </div>
  )
}
