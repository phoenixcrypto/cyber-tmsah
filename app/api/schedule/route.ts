import { NextRequest, NextResponse } from 'next/server'
import { getAllScheduleItems, getScheduleByGroup } from '@/lib/db/schedule'

// Public API - Get schedule data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group') as 'Group 1' | 'Group 2' | null

    const items = group ? getScheduleByGroup(group) : getAllScheduleItems()
    
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Get schedule error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

