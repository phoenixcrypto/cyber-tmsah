import { NextResponse } from 'next/server'
import { getAllMaterials } from '@/lib/db/materials'

// Public API - Get materials data
export async function GET() {
  try {
    const materials = getAllMaterials()
    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Get materials error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

