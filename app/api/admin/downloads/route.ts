import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getAllSoftware, addSoftware, updateSoftware, deleteSoftware } from '@/lib/db/downloads'
import { downloadSoftwareSchema } from '@/lib/validators/schemas'

// GET - Get all software
export async function GET() {
  try {
    const software = getAllSoftware()
    return NextResponse.json({ software })
  } catch (error) {
    console.error('Get downloads error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

// POST - Add new software
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || (payload.role !== 'admin' && payload.role !== 'editor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = downloadSoftwareSchema.omit({ id: true }).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const newSoftware = addSoftware(validationResult.data)
    return NextResponse.json({ software: newSoftware }, { status: 201 })
  } catch (error) {
    console.error('Add software error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة البرنامج' }, { status: 500 })
  }
}

// PUT - Update software
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || (payload.role !== 'admin' && payload.role !== 'editor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 })
    }

    const updated = updateSoftware(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'البرنامج غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ software: updated })
  } catch (error) {
    console.error('Update software error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التحديث' }, { status: 500 })
  }
}

// DELETE - Delete software
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 })
    }

    const deleted = deleteSoftware(id)
    if (!deleted) {
      return NextResponse.json({ error: 'البرنامج غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete software error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 })
  }
}

