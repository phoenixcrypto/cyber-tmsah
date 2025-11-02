'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:ring-offset-2 focus:ring-offset-dark-900"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-cyber-violet/40 to-cyber-neon/40'
            : 'bg-gradient-to-r from-yellow-400/40 to-orange-400/40'
        }`}
      />
      
      {/* Toggle Circle */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-cyber-dark" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </div>
    </button>
  )
}

