import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { sanitizeText, sanitizeHtml } from '@/lib/utils/security'
import { getRequestContext } from '@/lib/middleware/auth'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@cyber-tmsah.site'
const FROM_EMAIL = process.env.FROM_EMAIL || 'Cyber TMSAH <noreply@cyber-tmsah.site>'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(3).max(200),
  message: z.string().min(20).max(5000),
})

/**
 * POST /api/contact
 * Send contact form email
 */
export async function POST(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const body = await request.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const { name, email, subject, message } = validationResult.data

    // Sanitize inputs
    const sanitizedName = sanitizeText(name)
    const sanitizedSubject = sanitizeText(subject)
    const sanitizedMessage = sanitizeHtml(message)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      await logger.error('RESEND_API_KEY is not set', undefined, {
        method: 'POST',
        path: '/api/contact',
        ipAddress: context.ipAddress,
      })
      return errorResponse('لم يتم إعداد خدمة البريد الإلكتروني بعد.', 500)
    }

    const resend = new Resend(apiKey)

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[${sanitizedSubject}] رسالة جديدة من ${sanitizedName} - Cyber TMSAH`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #ff3b40; margin-bottom: 20px;">رسالة جديدة من نموذج الاتصال في موقع Cyber TMSAH</h2>
          <div style="background: rgba(255, 59, 64, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff3b40;">
            <p style="margin: 10px 0;"><strong style="color: #ff3b40;">الاسم:</strong> ${sanitizedName}</p>
            <p style="margin: 10px 0;"><strong style="color: #ff3b40;">البريد الإلكتروني:</strong> <a href="mailto:${email}" style="color: #ff6c73;">${email}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #ff3b40;">الموضوع:</strong> ${sanitizedSubject}</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #ff3b40;">نص الرسالة:</strong></p>
            <div style="margin: 0; line-height: 1.8; color: #f3f3f3;">${sanitizedMessage}</div>
          </div>
          <hr style="border: none; border-top: 1px solid rgba(255, 59, 64, 0.3); margin: 20px 0;"/>
          <p style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin: 0;">تم إرسال هذه الرسالة تلقائياً من نموذج الاتصال في موقع Cyber TMSAH.</p>
        </div>
      `,
    })

    if (error) {
      await logger.error('Resend email error', error as Error, {
        method: 'POST',
        path: '/api/contact',
        ipAddress: context.ipAddress,
      })
      return errorResponse('حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.', 500)
    }

    await logger.info('Contact form submitted', {
      email,
      subject: sanitizedSubject,
      ipAddress: context.ipAddress,
    })

    return successResponse({
      message: 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
    })
  } catch (error) {
    await logger.error('Contact form error', error as Error, {
      method: 'POST',
      path: '/api/contact',
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 500)
  }
}

/**
 * OPTIONS /api/contact
 * CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
