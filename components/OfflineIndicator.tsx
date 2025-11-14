'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 2500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOnline])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      <div className={`offline-indicator ${isOnline ? 'online' : ''}`}>
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-medium">تمت إعادة الاتصال بالشبكة</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">لا يوجد اتصال حالياً</span>
          </>
        )}
      </div>
    </div>
  )
}
