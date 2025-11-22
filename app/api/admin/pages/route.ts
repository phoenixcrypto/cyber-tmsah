import { NextRequest, NextResponse } from 'next/server'
import { pageSchema } from '@/lib/validators/schemas'
import {
  getAllPages,
  getPageBySlug,
  addPage,
  updatePage,
  deletePage,
  type Page,
} from '@/lib/db/pages'

/**
 * GET /api/admin/pages
 * Get all pages
 */
export async function GET(_request: NextRequest) {
  try {
    const pages = getAllPages()
    return NextResponse.json({ success: true, pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الصفحات' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/pages
 * Create new page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = pageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const pageData = validationResult.data

    // Check if slug already exists
    const existingPage = getPageBySlug(pageData.slug)
    if (existingPage) {
      return NextResponse.json(
        { error: 'الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Prepare page data without optional undefined properties
    const pageToAdd: Omit<Page, 'id' | 'createdAt' | 'updatedAt'> = {
      slug: pageData.slug,
      title: pageData.title,
      titleEn: pageData.titleEn,
      content: pageData.content,
      contentEn: pageData.contentEn,
      status: pageData.status,
      ...(pageData.metaDescription && { metaDescription: pageData.metaDescription }),
      ...(pageData.metaDescriptionEn && { metaDescriptionEn: pageData.metaDescriptionEn }),
      ...(pageData.order !== undefined && { order: pageData.order }),
    }

    const newPage = addPage(pageToAdd)

    return NextResponse.json({
      success: true,
      page: newPage,
    })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الصفحة' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/pages
 * Update page
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الصفحة مطلوب' },
        { status: 400 }
      )
    }

    // Validate updates
    const validationResult = pageSchema.partial().safeParse(updates)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    // If slug is being updated, check if it's already taken by another page
    if (updates.slug) {
      const existingPage = getPageBySlug(updates.slug)
      if (existingPage && existingPage.id !== id) {
        return NextResponse.json(
          { error: 'الرابط مستخدم بالفعل' },
          { status: 400 }
        )
      }
    }

    const updatedPage = updatePage(id, updates)

    if (!updatedPage) {
      return NextResponse.json(
        { error: 'الصفحة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      page: updatedPage,
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الصفحة' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/pages
 * Delete page
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الصفحة مطلوب' },
        { status: 400 }
      )
    }

    const deleted = deletePage(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'الصفحة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الصفحة' },
      { status: 500 }
    )
  }
}

