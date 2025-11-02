'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export default function FloatingThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-cyber-neon/20 blur-xl group-hover:bg-cyber-neon/30 transition-all duration-300 animate-pulse" />
      
      {/* Button Container */}
      <div className="relative w-14 h-14 rounded-full bg-cyber-dark backdrop-blur-md border-2 border-cyber-neon/50 shadow-2xl group-hover:border-cyber-neon transition-all duration-300 group-hover:scale-110 group-active:scale-95">
        {/* Inner Glow */}
        <div className={`absolute inset-2 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-cyber-violet/30 to-cyber-neon/30'
            : 'bg-gradient-to-br from-amber-400/30 to-orange-400/30'
        }`} />
        
        {/* Icon Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {theme === 'dark' ? (
            <Moon className="w-6 h-6 text-cyber-neon drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Sun className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] group-hover:rotate-180 transition-transform duration-300" />
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-cyber-dark/95 backdrop-blur-md border border-cyber-neon/30 rounded-lg text-xs font-semibold text-cyber-neon whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl z-50">
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyber-neon/30" />
        </div>
      </div>
    </button>
  )
}

