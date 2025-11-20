import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'support@cyber-tmsah.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'Cyber TMSAH <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Basic validation
    if (!name || !email || !subject || !message) {
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
      subject: `رسالة جديدة من نموذج الاتصال: ${subject}`,
      html: `
        <h2>رسالة جديدة من نموذج الاتصال في موقع Cyber TMSAH</h2>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
        <p><strong>عنوان الرسالة:</strong> ${subject}</p>
        <p><strong>نص الرسالة:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p style="font-size:12px;color:#666;">تم إرسال هذه الرسالة تلقائياً من نموذج الاتصال في موقع Cyber TMSAH.</p>
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

