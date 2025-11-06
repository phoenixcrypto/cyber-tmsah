import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured')
      return false
    }

    const mailOptions = {
      from: GMAIL_USER,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function sendArticleNotification(
  article: any,
  recipients: string[]
): Promise<boolean> {
  const subject = `New Article: ${article.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00ff88;">New Article Published</h2>
      <h3 style="color: #333;">${article.title}</h3>
      <p style="color: #666;">${article.description}</p>
      <p style="color: #999; font-size: 12px;">Published on: ${new Date(article.published_at).toLocaleDateString()}</p>
    </div>
  `

  return sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendTaskNotification(
  task: any,
  recipients: string[]
): Promise<boolean> {
  const subject = `New Task: ${task.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b5cf6;">New Task Assigned</h2>
      <h3 style="color: #333;">${task.title}</h3>
      <p style="color: #666;">${task.description}</p>
      <p style="color: #999;">Due Date: ${new Date(task.due_date).toLocaleDateString()}</p>
      <p style="color: #999; font-size: 12px;">Published on: ${new Date(task.published_at).toLocaleDateString()}</p>
    </div>
  `

  return sendEmail({
    to: recipients,
    subject,
    html,
  })
}

export async function sendTaskReminder(
  task: any,
  recipients: string[]
): Promise<boolean> {
  const subject = `Task Reminder: ${task.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Task Reminder</h2>
      <h3 style="color: #333;">${task.title}</h3>
      <p style="color: #666;">${task.description}</p>
      <p style="color: #dc2626; font-weight: bold;">Due Date: ${new Date(task.due_date).toLocaleDateString()}</p>
      <p style="color: #999; font-size: 12px;">This is a reminder that this task is due in 3 days.</p>
    </div>
  `

  return sendEmail({
    to: recipients,
    subject,
    html,
  })
}

