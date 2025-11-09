import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminFromRequest } from '@/lib/auth/admin'
import { uploadFilesToStorage } from '@/lib/storage/upload'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/admin/storage/upload
 * Upload files to Supabase Storage (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminResult = await verifyAdminFromRequest(request)
    if (!adminResult) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    for (const file of files) {
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        )
      }
    }

    // Upload files
    const urls = await uploadFilesToStorage(files, folder)
    
    // Filter out null values (failed uploads)
    const successfulUrls = urls.filter((url): url is string => url !== null)
    const failedCount = urls.length - successfulUrls.length

    if (successfulUrls.length === 0) {
      return NextResponse.json(
        { error: 'All file uploads failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      urls: successfulUrls,
      uploaded: successfulUrls.length,
      failed: failedCount,
    })
  } catch (error: any) {
    logger.error('[Storage Upload API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    )
  }
}

