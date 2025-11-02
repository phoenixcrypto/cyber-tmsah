'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="w-16 h-9 rounded-full bg-cyber-dark-secondary border border-cyber-neon/20 animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-16 h-9 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:ring-offset-2 hover:scale-110 active:scale-95"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-cyber-violet/50 to-cyber-neon/50 shadow-lg shadow-cyber-neon/30'
            : 'bg-gradient-to-r from-yellow-400/50 to-orange-400/50 shadow-lg shadow-yellow-400/30'
        }`}
      />
      
      {/* Toggle Circle */}
      <div
        className={`absolute top-0.5 left-0.5 w-8 h-8 bg-white rounded-full shadow-xl transform transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-0' : 'translate-x-7'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-cyber-dark" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
      
      {/* Status Indicator */}
      <span className="ml-2 text-xs font-semibold text-cyber-neon hidden sm:block">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}

