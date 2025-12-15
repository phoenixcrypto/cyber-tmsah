/**
 * Theme Layout - Wraps theme pages with global layout
 */

import { ThemeProvider } from '@/lib/theme/loader'
import '../globals.css'
import '@/themes/default/styles/globals.css'

export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <main className="main-content" role="main">
        {children}
      </main>
    </ThemeProvider>
  )
}

