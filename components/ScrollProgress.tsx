'use client'

import { useEffect, useState } from 'react'

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollPercent(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress">
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollPercent}%` }}
      />
    </div>
  )
}

export default ScrollProgress
