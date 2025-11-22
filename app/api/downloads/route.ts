import { NextResponse } from 'next/server'
import { getAllSoftware } from '@/lib/db/downloads'

// Public API - Get downloads data
export async function GET() {
  try {
    const software = getAllSoftware()
    return NextResponse.json({ software })
  } catch (error) {
    console.error('Get downloads error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

