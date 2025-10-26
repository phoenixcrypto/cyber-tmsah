'use client'

import { useEffect } from 'react'

const CursorTrail = () => {
  useEffect(() => {
    const createCursorTrail = (e: MouseEvent) => {
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.left = e.clientX - 10 + 'px'
      trail.style.top = e.clientY - 10 + 'px'
      
      document.body.appendChild(trail)
      
      setTimeout(() => {
        trail.remove()
      }, 500)
    }

    document.addEventListener('mousemove', createCursorTrail)

    return () => {
      document.removeEventListener('mousemove', createCursorTrail)
    }
  }, [])

  return null
}

export default CursorTrail
