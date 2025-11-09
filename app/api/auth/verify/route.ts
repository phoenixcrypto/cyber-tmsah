import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, sectionNumber, groupName } = body

    if (!fullName || !sectionNumber || !groupName) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'الاسم الكامل ورقم السكشن والمجموعة مطلوبة' 
        },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const trimmedName = fullName.trim()

    // First, check for EXACT match (case-insensitive, but must match exactly after trimming)
    // This ensures the name matches exactly as it appears in the verification list
    const { data: exactMatches, error: nameError } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered')
      .ilike('full_name', trimmedName) // Exact match (case-insensitive)
      .limit(10)

    if (nameError) {
      logger.error('[Verify] Error checking name:', nameError)
      return NextResponse.json(
        { 
          valid: false,
          error: 'Error verifying your information. Please try again.' 
        },
        { status: 500 }
      )
    }

    // Find exact match by comparing trimmed names (handles extra spaces)
    const exactMatch = exactMatches?.find(m => 
      m.full_name.trim().toLowerCase() === trimmedName.toLowerCase()
    )
    
    // If no exact match found, try to find similar names for suggestions
    let suggestions: any[] = []
    if (!exactMatch) {
      // Try partial match only for suggestions
      const { data: partialMatches } = await supabase
        .from('verification_list')
        .select('id, full_name, section_number, group_name, is_registered')
        .ilike('full_name', `%${trimmedName}%`)
        .limit(5)
      
      suggestions = (partialMatches || []).slice(0, 5).map(m => ({
        fullName: m.full_name,
        sectionNumber: m.section_number,
        groupName: m.group_name,
      }))
    }

    if (!exactMatch) {
      // Name not found - provide suggestions
      let errorMessage = 'الاسم الذي أدخلته لا يطابق الاسم الموجود في الكشف الرسمي.'
      let message = 'يرجى كتابة الاسم الكامل بالضبط كما هو مكتوب في الكشف الرسمي (703 طالب).'
      
      if (suggestions.length > 0) {
        errorMessage = 'الاسم الذي أدخلته لا يطابق الاسم الموجود في الكشف الرسمي. هل تقصد أحد هذه الأسماء؟'
        message = `تم العثور على ${suggestions.length} اسم مشابه. يرجى التحقق من أن اسمك يطابق أحدها:`
      }
      
      return NextResponse.json(
        { 
          valid: false,
          error: errorMessage,
          suggestions: suggestions.length > 0 ? suggestions.map(s => s.fullName) : undefined,
          suggestionDetails: suggestions.length > 0 ? suggestions : undefined,
          message: message,
        },
        { status: 200 }
      )
    }

    // Check if already registered
    if (exactMatch.is_registered) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'هذا الطالب مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.' 
        },
        { status: 200 }
      )
    }

    // Now verify section and group match
    // Use exact match for final verification (case-insensitive)
    // First try with exact name match
    let { data: verificationData, error: verificationError } = await supabase
      .from('verification_list')
      .select('*')
      .ilike('full_name', trimmedName) // Exact match for final verification
      .eq('section_number', sectionNumber)
      .eq('group_name', groupName)
      .eq('is_registered', false)
      .single()

    // If not found, try with trimmed name comparison (handle extra spaces)
    if (verificationError || !verificationData) {
      // Try to find by matching trimmed names
      const { data: allMatches } = await supabase
        .from('verification_list')
        .select('*')
        .ilike('full_name', `%${trimmedName}%`)
        .eq('section_number', sectionNumber)
        .eq('group_name', groupName)
        .eq('is_registered', false)

      // Find exact match by comparing trimmed names
      if (allMatches && allMatches.length > 0) {
        const trimmedMatch = allMatches.find(m => 
          m.full_name.trim().toLowerCase() === trimmedName.toLowerCase()
        )
        if (trimmedMatch) {
          verificationData = trimmedMatch
          verificationError = null
        }
      }
    }

    if (verificationError || !verificationData) {
      // Name exists but section/group don't match
      logger.debug('[Verify] Section/group mismatch:', {
        name: trimmedName,
        providedSection: sectionNumber,
        providedGroup: groupName,
        foundSection: exactMatch?.section_number,
        foundGroup: exactMatch?.group_name,
      })
      
      // Ensure exactMatch exists before accessing its properties
      if (!exactMatch) {
        return NextResponse.json(
          { 
            valid: false,
            error: 'الاسم الذي أدخلته لا يطابق الاسم الموجود في الكشف الرسمي. يرجى التحقق من المعلومات.',
          },
          { status: 200 }
        )
      }
      
      return NextResponse.json(
        { 
          valid: false,
          error: `تم العثور على الاسم، لكن رقم السكشن (${sectionNumber}) أو المجموعة (${groupName}) لا يطابق السجلات. يرجى التحقق من السكشن والمجموعة.`,
          foundName: exactMatch.full_name,
          foundSection: exactMatch.section_number,
          foundGroup: exactMatch.group_name,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        valid: true,
        message: 'تم التحقق بنجاح. يمكنك المتابعة مع التسجيل.',
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Verify] Verification error:', error)
    return NextResponse.json(
      { 
        valid: false,
        error: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.' 
      },
      { status: 500 }
    )
  }
}

