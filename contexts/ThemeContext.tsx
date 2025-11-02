'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
          setTheme(savedTheme)
          document.documentElement.setAttribute('data-theme', savedTheme)
        } else {
          // Default to dark
          setTheme('dark')
          document.documentElement.setAttribute('data-theme', 'dark')
        }
      } catch (error) {
        setTheme('dark')
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', 'dark')
        }
      }
    }
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
      } catch (error) {
        // Silently fail
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

