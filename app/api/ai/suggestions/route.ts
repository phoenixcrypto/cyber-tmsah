/**
 * AI Suggestions API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/middleware/auth'
import {
  generateTitleSuggestions,
  generateTagSuggestions,
  generateCategorySuggestions,
  generateRelatedContent,
  generateSEOSuggestions,
} from '@/lib/ai/content-suggestions'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, content, title, contentId, contentType, existingTags } = body

    let suggestions

    switch (type) {
      case 'title':
        suggestions = await generateTitleSuggestions(content || '')
        break

      case 'tags':
        suggestions = await generateTagSuggestions(content || '', existingTags || [])
        break

      case 'category':
        suggestions = await generateCategorySuggestions(content || '')
        break

      case 'related':
        if (!contentId || !contentType) {
          return NextResponse.json(
            { error: 'contentId and contentType are required' },
            { status: 400 }
          )
        }
        suggestions = await generateRelatedContent(contentId, contentType)
        break

      case 'seo':
        suggestions = await generateSEOSuggestions(content || '', title || '')
        break

      default:
        return NextResponse.json(
          { error: 'Invalid suggestion type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

