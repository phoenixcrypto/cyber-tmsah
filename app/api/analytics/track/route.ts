/**
 * Analytics Tracking API
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/firebase'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // Store event in database
    await db.collection('analytics_events').add({
      ...event,
      createdAt: new Date(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

