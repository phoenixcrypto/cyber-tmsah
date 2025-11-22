import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear cookies
  response.cookies.delete('admin-token')
  response.cookies.delete('admin-refresh-token')

  return response
}

