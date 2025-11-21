import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'support@cyber-tmsah.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'Cyber TMSAH <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { error: 'لم يتم إعداد خدمة البريد الإلكتروني بعد.' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `رسالة جديدة من نموذج الاتصال - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #00ffff; margin-bottom: 20px;">رسالة جديدة من نموذج الاتصال في موقع Cyber TMSAH</h2>
          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #00ffff;">الاسم:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #00ffff;">البريد الإلكتروني:</strong> ${email}</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #00ffff;">نص الرسالة:</strong></p>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 20px 0;"/>
          <p style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin: 0;">تم إرسال هذه الرسالة تلقائياً من نموذج الاتصال في موقع Cyber TMSAH.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS (لو احتجته من خارج الموقع)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

