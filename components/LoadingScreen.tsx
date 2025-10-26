'use client'

import { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
      <div className="loading-spinner"></div>
      <div className="loading-text">CYBER TMSAH</div>
    </div>
  )
}

export default LoadingScreen
