/**
 * Accessibility Features - WCAG 2.1 Compliance
 */

'use client'

import { useEffect, useState } from 'react'

/**
 * High Contrast Mode
 */
export function useHighContrast() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Check localStorage
    const stored = localStorage.getItem('highContrast')
    if (stored === 'true') {
      setEnabled(true)
      document.documentElement.classList.add('high-contrast')
    }
  }, [])

  const toggle = () => {
    const newValue = !enabled
    setEnabled(newValue)
    localStorage.setItem('highContrast', String(newValue))
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  return { enabled, toggle }
}

/**
 * Font Size Control
 */
export function useFontSize() {
  const [size, setSize] = useState(16)

  useEffect(() => {
    const stored = localStorage.getItem('fontSize')
    if (stored) {
      const fontSize = parseInt(stored, 10)
      setSize(fontSize)
      document.documentElement.style.fontSize = `${fontSize}px`
    }
  }, [])

  const setFontSize = (newSize: number) => {
    setSize(newSize)
    localStorage.setItem('fontSize', String(newSize))
    document.documentElement.style.fontSize = `${newSize}px`
  }

  const increase = () => setFontSize(Math.min(size + 2, 24))
  const decrease = () => setFontSize(Math.max(size - 2, 12))
  const reset = () => setFontSize(16)

  return { size, setFontSize, increase, decrease, reset }
}

/**
 * Screen Reader Announcements
 */
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([])

  const announce = (message: string) => {
    setAnnouncements((prev) => [...prev, message])
    
    // Create aria-live region if it doesn't exist
    let region = document.getElementById('screen-reader-announcements')
    if (!region) {
      region = document.createElement('div')
      region.id = 'screen-reader-announcements'
      region.setAttribute('role', 'status')
      region.setAttribute('aria-live', 'polite')
      region.setAttribute('aria-atomic', 'true')
      region.className = 'sr-only'
      document.body.appendChild(region)
    }

    region.textContent = message

    // Clear after a delay
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((msg) => msg !== message))
      if (region) {
        region.textContent = ''
      }
    }, 1000)
  }

  return { announce, announcements }
}

/**
 * Keyboard Navigation Helper
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content (Alt + M)
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        const main = document.querySelector('main')
        if (main) {
          main.focus()
          main.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Skip to navigation (Alt + N)
      if (event.altKey && event.key === 'n') {
        event.preventDefault()
        const nav = document.querySelector('nav')
        if (nav) {
          nav.focus()
          nav.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}

/**
 * Focus Trap for Modals
 */
export function useFocusTrap(elementRef: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !elementRef.current) return

    const element = elementRef.current
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive, elementRef])
}

/**
 * Accessibility Settings Component
 */
export function AccessibilitySettings() {
  const { enabled: highContrast, toggle: toggleHighContrast } = useHighContrast()
  const { size, increase, decrease, reset } = useFontSize()

  return (
    <div className="accessibility-settings" role="region" aria-label="Accessibility Settings">
      <h2>إعدادات إمكانية الوصول</h2>
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
          />
          وضع التباين العالي
        </label>
      </div>

      <div className="setting-group">
        <label>حجم الخط: {size}px</label>
        <div className="font-size-controls">
          <button onClick={decrease} aria-label="تقليل حجم الخط">-</button>
          <button onClick={reset} aria-label="إعادة تعيين حجم الخط">إعادة تعيين</button>
          <button onClick={increase} aria-label="زيادة حجم الخط">+</button>
        </div>
      </div>
    </div>
  )
}

