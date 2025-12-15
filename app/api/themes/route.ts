/**
 * Themes API - Manage themes
 */

import { NextRequest, NextResponse } from 'next/server'
import { themeManager } from '@/lib/theme/manager'
import { verifyAuth } from '@/lib/middleware/auth'

// GET /api/themes - Get all themes
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const themes = await themeManager.getThemes()
    const activeTheme = await themeManager.getActiveTheme()

    return NextResponse.json({
      success: true,
      data: {
        themes,
        activeTheme,
      },
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/themes/activate - Activate a theme
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { themeName } = body

    if (!themeName) {
      return NextResponse.json(
        { error: 'Theme name is required' },
        { status: 400 }
      )
    }

    const success = await themeManager.activateTheme(themeName)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to activate theme' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Theme activated successfully',
    })
  } catch (error) {
    console.error('Error activating theme:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

