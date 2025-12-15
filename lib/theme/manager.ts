/**
 * Theme Manager - Manages themes installation, activation, and settings
 */

import fs from 'fs'
import path from 'path'
import { db } from '@/lib/db/firebase'

export interface ThemeConfig {
  name: string
  version: string
  description: string
  author: string
  license: string
  main?: string
  config?: {
    colors?: Record<string, string>
    fonts?: Record<string, string>
    layout?: Record<string, string>
    features?: Record<string, boolean>
  }
  pages?: Record<string, string>
  components?: Record<string, string>
}

export class ThemeManager {
  private themesPath: string
  private activeTheme: string | null = null

  constructor() {
    this.themesPath = path.join(process.cwd(), 'themes')
  }

  /**
   * Get all installed themes
   */
  async getThemes(): Promise<ThemeConfig[]> {
    try {
      const themes: ThemeConfig[] = []
      const dirs = fs.readdirSync(this.themesPath, { withFileTypes: true })

      for (const dir of dirs) {
        if (dir.isDirectory()) {
          const themePath = path.join(this.themesPath, dir.name)
          const themeJsonPath = path.join(themePath, 'theme.json')

          if (fs.existsSync(themeJsonPath)) {
            const themeJson = JSON.parse(
              fs.readFileSync(themeJsonPath, 'utf-8')
            )
            themes.push({
              ...themeJson,
              name: dir.name,
            })
          }
        }
      }

      return themes
    } catch (error) {
      console.error('Error getting themes:', error)
      return []
    }
  }

  /**
   * Get active theme
   */
  async getActiveTheme(): Promise<string> {
    try {
      const doc = await db.collection('settings').doc('theme').get()
      if (doc.exists) {
        this.activeTheme = doc.data()?.activeTheme || 'default'
      } else {
        this.activeTheme = 'default'
      }
      return this.activeTheme
    } catch (error) {
      console.error('Error getting active theme:', error)
      return 'default'
    }
  }

  /**
   * Activate a theme
   */
  async activateTheme(themeName: string): Promise<boolean> {
    try {
      // Verify theme exists
      const themePath = path.join(this.themesPath, themeName)
      if (!fs.existsSync(themePath)) {
        throw new Error(`Theme ${themeName} not found`)
      }

      // Update active theme in database
      await db.collection('settings').doc('theme').set({
        activeTheme: themeName,
        updatedAt: new Date(),
      })

      this.activeTheme = themeName

      // Clear cache
      const { clearAllCache } = await import('@/lib/content/api')
      clearAllCache()

      return true
    } catch (error) {
      console.error('Error activating theme:', error)
      return false
    }
  }

  /**
   * Get theme configuration
   */
  async getThemeConfig(themeName?: string): Promise<ThemeConfig | null> {
    try {
      const theme = themeName || (await this.getActiveTheme())
      const themePath = path.join(this.themesPath, theme, 'theme.json')

      if (!fs.existsSync(themePath)) {
        return null
      }

      const themeJson = JSON.parse(fs.readFileSync(themePath, 'utf-8'))
      return {
        ...themeJson,
        name: theme,
      }
    } catch (error) {
      console.error('Error getting theme config:', error)
      return null
    }
  }

  /**
   * Get theme path
   */
  getThemePath(themeName?: string): string {
    const theme = themeName || this.activeTheme || 'default'
    return path.join(this.themesPath, theme)
  }

  /**
   * Check if theme exists
   */
  themeExists(themeName: string): boolean {
    const themePath = path.join(this.themesPath, themeName)
    return fs.existsSync(themePath)
  }

  /**
   * Install theme from directory
   */
  async installTheme(sourcePath: string, themeName: string): Promise<boolean> {
    try {
      const targetPath = path.join(this.themesPath, themeName)

      if (fs.existsSync(targetPath)) {
        throw new Error(`Theme ${themeName} already exists`)
      }

      // Copy theme files
      this.copyDirectory(sourcePath, targetPath)

      // Verify theme.json exists
      const themeJsonPath = path.join(targetPath, 'theme.json')
      if (!fs.existsSync(themeJsonPath)) {
        throw new Error('theme.json not found in theme')
      }

      return true
    } catch (error) {
      console.error('Error installing theme:', error)
      return false
    }
  }

  /**
   * Delete theme
   */
  async deleteTheme(themeName: string): Promise<boolean> {
    try {
      if (themeName === 'default') {
        throw new Error('Cannot delete default theme')
      }

      const activeTheme = await this.getActiveTheme()
      if (themeName === activeTheme) {
        throw new Error('Cannot delete active theme')
      }

      const themePath = path.join(this.themesPath, themeName)
      if (fs.existsSync(themePath)) {
        fs.rmSync(themePath, { recursive: true, force: true })
      }

      return true
    } catch (error) {
      console.error('Error deleting theme:', error)
      return false
    }
  }

  /**
   * Copy directory recursively
   */
  private copyDirectory(source: string, target: string): void {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true })
    }

    const files = fs.readdirSync(source)

    for (const file of files) {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)

      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, targetPath)
      } else {
        fs.copyFileSync(sourcePath, targetPath)
      }
    }
  }
}

// Singleton instance
export const themeManager = new ThemeManager()

