import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      subjectId,
      isGeneral,
      targetSections,
      targetGroups,
      files,
      sendNotification,
      notificationTiming,
      scheduledDate,
      scheduledTime,
    } = body

    // Validate
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Create article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title,
        content: description, // Use description as content for now
        subject_id: subjectId || null,
        target_sections: isGeneral ? null : (targetSections || []),
        target_groups: isGeneral ? null : (targetGroups || []),
        is_general: isGeneral || false,
        files: files || [],
        published_at: new Date().toISOString(),
        created_by: payload.userId,
      })
      .select()
      .single()

    if (articleError || !article) {
      console.error('Article creation error:', articleError)
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      )
    }

    // Send notification if requested
    if (sendNotification && notificationTiming === 'immediate') {
      try {
        // Get recipients
        const { data: users } = await supabase
          .from('users')
          .select('email')
          .eq('is_active', true)
        
        if (users && users.length > 0) {
          const recipients = users.map(u => u.email).filter(Boolean)
          // Import and send notification
          const { sendArticleNotification } = await import('@/lib/notifications/email')
          await sendArticleNotification(article, recipients)
        }
      } catch (err) {
        console.error('Notification error:', err)
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      article,
    })
  } catch (error) {
    console.error('Publish article error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

