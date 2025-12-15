/**
 * Theme API - Get/Delete specific theme
 */

import { NextRequest, NextResponse } from 'next/server'
import { themeManager } from '@/lib/theme/manager'
import { verifyAuth } from '@/lib/middleware/auth'

// GET /api/themes/[name] - Get theme config
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params
    const config = await themeManager.getThemeConfig(name)

    if (!config) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/themes/[name] - Delete theme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name } = params
    const success = await themeManager.deleteTheme(name)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete theme' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting theme:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

