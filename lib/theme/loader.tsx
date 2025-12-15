/**
 * Theme Loader - Loads and renders theme components
 */

import React from 'react'
import { themeManager } from './manager'
import type { ThemeConfig } from './manager'

export interface ThemeContextType {
  theme: ThemeConfig | null
  themeName: string
  themePath: string
  loadComponent: (componentPath: string) => Promise<React.ComponentType<any> | null>
  loadPage: (pagePath: string) => Promise<React.ComponentType<any> | null>
}

export const ThemeContext = React.createContext<ThemeContextType | null>(null)

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

/**
 * Load a component from theme
 */
export async function loadThemeComponent(
  themeName: string,
  componentPath: string
): Promise<React.ComponentType<any> | null> {
  try {
    // Use Next.js dynamic import with path alias
    const module = await import(`@/themes/${themeName}/components/${componentPath}`)
    return module.default || module
  } catch (error) {
    console.error(`Error loading theme component ${componentPath}:`, error)
    return null
  }
}

/**
 * Load a page from theme
 */
export async function loadThemePage(
  themeName: string,
  pagePath: string
): Promise<React.ComponentType<any> | null> {
  try {
    // Use Next.js dynamic import with path alias
    // Remove .tsx extension if present
    const cleanPath = pagePath.replace(/\.tsx$/, '')
    const module = await import(`@/themes/${themeName}/pages/${cleanPath}`)
    return module.default || module
  } catch (error) {
    console.error(`Error loading theme page ${pagePath}:`, error)
    return null
  }
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeConfig | null>(null)
  const [themeName, setThemeName] = React.useState<string>('default')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadTheme() {
      try {
        const activeTheme = await themeManager.getActiveTheme()
        const themeConfig = await themeManager.getThemeConfig(activeTheme)
        
        setThemeName(activeTheme)
        setTheme(themeConfig)
      } catch (error) {
        console.error('Error loading theme:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTheme()
  }, [])

  const loadComponent = React.useCallback(
    async (componentPath: string) => {
      return loadThemeComponent(themeName, componentPath)
    },
    [themeName]
  )

  const loadPage = React.useCallback(
    async (pagePath: string) => {
      return loadThemePage(themeName, pagePath)
    },
    [themeName]
  )

  if (loading) {
    return <div>Loading theme...</div>
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        themePath: `themes/${themeName}`,
        loadComponent,
        loadPage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

