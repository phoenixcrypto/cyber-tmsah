/**
 * Dynamic Theme Router - Routes all theme pages
 * This file handles routing for theme pages
 */

import { notFound } from 'next/navigation'
import { themeManager } from '@/lib/theme/manager'
import { themeRouter } from '@/lib/theme/router'
import { loadThemePage } from '@/lib/theme/loader'

interface ThemePageProps {
  params: {
    theme?: string[]
  }
}

export default async function ThemePage({ params }: ThemePageProps) {
  // Get active theme name
  const activeThemeName = await themeManager.getActiveTheme()
  
  // Build path from params
  const path = params.theme ? `/${params.theme.join('/')}` : '/'
  
  // Get route
  const route = themeRouter.getRoute(path)
  
  if (!route) {
    notFound()
  }

  // Load page component dynamically
  let PageComponent: React.ComponentType<any> | null = null
  
  try {
    // For now, use direct imports for default theme
    // In production, this would use dynamic loading
    if (activeThemeName === 'default') {
      switch (route.page) {
        case 'home.tsx':
          PageComponent = (await import('@/themes/default/pages/home')).default
          break
        case 'materials/page.tsx':
          PageComponent = (await import('@/themes/default/pages/materials/page')).default
          break
        case 'materials/[id]/page.tsx':
          // Handle dynamic route
          const MaterialDetailPage = (await import('@/themes/default/pages/materials/[id]/page')).default
          PageComponent = MaterialDetailPage
          break
        case 'schedule/page.tsx':
          PageComponent = (await import('@/themes/default/pages/schedule/page')).default
          break
        case 'downloads/page.tsx':
          PageComponent = (await import('@/themes/default/pages/downloads/page')).default
          break
        case 'contact/page.tsx':
          PageComponent = (await import('@/themes/default/pages/contact/page')).default
          break
        case 'about/page.tsx':
          PageComponent = (await import('@/themes/default/pages/about/page')).default
          break
        case 'privacy/page.tsx':
          PageComponent = (await import('@/themes/default/pages/privacy/page')).default
          break
        case 'terms/page.tsx':
          PageComponent = (await import('@/themes/default/pages/terms/page')).default
          break
        default:
          PageComponent = await loadThemePage(activeThemeName, route.page)
      }
    } else {
      PageComponent = await loadThemePage(activeThemeName, route.page)
    }
  } catch (error) {
    console.error('Error loading page:', error)
    notFound()
  }
  
  if (!PageComponent) {
    notFound()
  }

  // Load layout
  const MainLayout = (await import('@/themes/default/layouts/MainLayout')).default

  // Render with layout
  return (
    <MainLayout>
      <PageComponent />
    </MainLayout>
  )
}

// Generate static params for known routes
export async function generateStaticParams() {
  const routes = [
    { theme: [] },
    { theme: ['materials'] },
    { theme: ['schedule'] },
    { theme: ['downloads'] },
    { theme: ['contact'] },
    { theme: ['about'] },
    { theme: ['privacy'] },
    { theme: ['terms'] },
  ]

  return routes
}

