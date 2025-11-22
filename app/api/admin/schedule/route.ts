import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getAllScheduleItems, addScheduleItem, updateScheduleItem, deleteScheduleItem } from '@/lib/db/schedule'
import { scheduleItemSchema } from '@/lib/validators/schemas'

// GET - Get all schedule items
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group') as 'Group 1' | 'Group 2' | null

    const items = getAllScheduleItems()
    const filtered = group ? items.filter((item) => item.group === group) : items

    return NextResponse.json({ items: filtered })
  } catch (error) {
    console.error('Get schedule error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

// POST - Add new schedule item
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
    const validationResult = scheduleItemSchema.omit({ id: true }).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const newItem = addScheduleItem(validationResult.data)
    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error('Add schedule error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة العنصر' }, { status: 500 })
  }
}

// PUT - Update schedule item
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

    const updated = updateScheduleItem(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ item: updated })
  } catch (error) {
    console.error('Update schedule error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التحديث' }, { status: 500 })
  }
}

// DELETE - Delete schedule item
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

    const deleted = deleteScheduleItem(id)
    if (!deleted) {
      return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete schedule error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 })
  }
}

