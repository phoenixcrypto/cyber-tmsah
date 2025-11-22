import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getAllMaterials, addMaterial, updateMaterial, deleteMaterial } from '@/lib/db/materials'
import { materialSchema } from '@/lib/validators/schemas'

// GET - Get all materials
export async function GET() {
  try {
    const materials = getAllMaterials()
    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Get materials error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

// POST - Add new material
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
    const validationResult = materialSchema.omit({ id: true }).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const newMaterial = addMaterial({
      ...validationResult.data,
      lastUpdated: validationResult.data.lastUpdated || 'لا توجد مقالات بعد',
    })
    return NextResponse.json({ material: newMaterial }, { status: 201 })
  } catch (error) {
    console.error('Add material error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة المادة' }, { status: 500 })
  }
}

// PUT - Update material
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

    const updated = updateMaterial(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'المادة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json({ material: updated })
  } catch (error) {
    console.error('Update material error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التحديث' }, { status: 500 })
  }
}

// DELETE - Delete material
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

    const deleted = deleteMaterial(id)
    if (!deleted) {
      return NextResponse.json({ error: 'المادة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete material error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 })
  }
}

