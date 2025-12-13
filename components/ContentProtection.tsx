'use client'

import { useEffect } from 'react'

/**
 * Content Protection Component
 * Prevents copying, right-click, text selection, and print screen
 * Professional-grade content protection for 2026
 */
export default function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault()
    }

    // Disable text selection
    const handleSelectStart = (e: Event): void => {
      e.preventDefault()
    }

    // Disable drag
    const handleDragStart = (e: DragEvent): void => {
      e.preventDefault()
    }

    // Disable copy (Ctrl+C, Cmd+C)
    const handleCopy = (e: ClipboardEvent): void => {
      e.preventDefault()
    }

    // Disable cut (Ctrl+X, Cmd+X)
    const handleCut = (e: ClipboardEvent): void => {
      e.preventDefault()
    }

    // Disable paste (Ctrl+V, Cmd+V) - optional, can be removed if needed
    // const handlePaste = (e: ClipboardEvent) => {
    //   e.preventDefault()
    //   return false
    // }

    // Disable print screen (F12, Print Screen)
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12' || (e.key === 'I' && e.ctrlKey && e.shiftKey)) {
        e.preventDefault()
        return
      }

      // Disable Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return
      }
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    // document.addEventListener('paste', handlePaste)
    document.addEventListener('keydown', handleKeyDown)

    // Disable text selection via CSS
    document.body.style.userSelect = 'none'
    ;(document.body.style as unknown as Record<string, string>)['webkitUserSelect'] = 'none'
    ;(document.body.style as unknown as Record<string, string>)['mozUserSelect'] = 'none'
    ;(document.body.style as unknown as Record<string, string>)['msUserSelect'] = 'none'

    // Disable image dragging (run after images load)
    const disableImageDrag = () => {
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        img.setAttribute('draggable', 'false')
        img.style.pointerEvents = 'none'
      })
    }

    // Run immediately and on image load
    disableImageDrag()
    window.addEventListener('load', disableImageDrag)
    
    // Use MutationObserver to catch dynamically loaded images
    const observer = new MutationObserver(disableImageDrag)
    observer.observe(document.body, { childList: true, subtree: true })

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      // document.removeEventListener('paste', handlePaste)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('load', disableImageDrag)
      observer.disconnect()

      // Restore text selection
      document.body.style.userSelect = ''
      ;(document.body.style as unknown as Record<string, string>)['webkitUserSelect'] = ''
      ;(document.body.style as unknown as Record<string, string>)['mozUserSelect'] = ''
      ;(document.body.style as unknown as Record<string, string>)['msUserSelect'] = ''
    }
  }, [])

  return null
}

