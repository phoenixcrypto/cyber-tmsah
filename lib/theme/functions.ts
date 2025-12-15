/**
 * Theme Functions - Similar to WordPress functions.php
 * This file contains helper functions for themes
 */

import { getArticles, getMaterials, getNews, getPages, getSchedule, getDownloads } from '@/lib/content/api'
import { getSettings, getThemeSettings } from '@/lib/content/api'
import { applyFilters, doAction, HOOKS } from './hooks'

/**
 * Get theme setting
 */
export async function getThemeSetting(key: string, defaultValue: any = null) {
  const activeTheme = await import('./manager').then((m) => m.themeManager.getActiveTheme())
  const settings = await getThemeSettings(activeTheme)
  return settings[key] ?? defaultValue
}

/**
 * Get site setting
 */
export async function getSiteSetting(key: string, defaultValue: any = null) {
  const settings = await getSettings()
  return settings[key] ?? defaultValue
}

/**
 * Get posts (articles)
 */
export async function getPosts(options?: {
  limit?: number
  offset?: number
  status?: 'published' | 'draft'
  materialId?: string
}) {
  return getArticles(options)
}

/**
 * Get post (single article)
 */
export async function getPost(id: string) {
  return getArticles({ limit: 1 }).then((articles) => 
    articles.find((a: any) => a.id === id)
  )
}

/**
 * Get categories (materials)
 */
export async function getCategories(options?: {
  limit?: number
  offset?: number
}) {
  return getMaterials(options)
}

/**
 * Get category (single material)
 */
export async function getCategory(id: string) {
  return getMaterials().then((materials) =>
    materials.find((m: any) => m.id === id)
  )
}

/**
 * Get news
 */
export async function getNewsPosts(options?: {
  limit?: number
  offset?: number
  status?: 'published' | 'draft'
}) {
  return getNews(options)
}

/**
 * Get pages
 */
export async function getStaticPages(options?: {
  status?: 'published' | 'draft'
  slug?: string
}) {
  return getPages(options)
}

/**
 * Get page by slug
 */
export async function getStaticPage(slug: string) {
  return getPages({ slug, status: 'published' }).then((pages) =>
    pages.find((p: any) => p.slug === slug)
  )
}

/**
 * Get schedule
 */
export async function getScheduleItems(options?: {
  group?: string
  day?: string
}) {
  return getSchedule(options)
}

/**
 * Get downloads
 */
export async function getDownloadItems(options?: {
  limit?: number
  category?: string
}) {
  return getDownloads(options)
}

/**
 * Apply content filter
 */
export async function applyContentFilter(content: string, context?: any): Promise<string> {
  return applyFilters(HOOKS.FILTER_CONTENT, content, context)
}

/**
 * Apply title filter
 */
export async function applyTitleFilter(title: string, context?: any): Promise<string> {
  return applyFilters(HOOKS.FILTER_TITLE, title, context)
}

/**
 * Apply excerpt filter
 */
export async function applyExcerptFilter(excerpt: string, context?: any): Promise<string> {
  return applyFilters(HOOKS.FILTER_EXCERPT, excerpt, context)
}

/**
 * Trigger content created action
 */
export async function triggerContentCreated(content: any): Promise<void> {
  await doAction(HOOKS.CONTENT_CREATED, content)
}

/**
 * Trigger content updated action
 */
export async function triggerContentUpdated(content: any): Promise<void> {
  await doAction(HOOKS.CONTENT_UPDATED, content)
}

/**
 * Trigger content published action
 */
export async function triggerContentPublished(content: any): Promise<void> {
  await doAction(HOOKS.CONTENT_PUBLISHED, content)
}

