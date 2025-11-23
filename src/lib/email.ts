import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Email service configuration
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'resend' // 'resend' or 'smtp'

// Resend configuration
const resend = EMAIL_SERVICE === 'resend' && process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Nodemailer SMTP configuration
const transporter = EMAIL_SERVICE === 'smtp'
  ? nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    if (EMAIL_SERVICE === 'resend' && resend) {
      // Send via Resend
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Todo App <noreply@yourdomain.com>',
        to: [to],
        subject,
        html,
        text,
      })

      // Check if Resend returned an error
      if (data.error) {
        console.error('Email failed via Resend:', data.error)
        return { success: false, error: data.error }
      }

      console.log('Email sent via Resend:', data.data)
      return { success: true, data: data.data }
    } else if (EMAIL_SERVICE === 'smtp' && transporter) {
      // Send via SMTP (Nodemailer)
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Todo App" <noreply@yourdomain.com>',
        to,
        subject,
        html,
        text,
      })

      console.log('Email sent via SMTP:', info.messageId)
      return { success: true, messageId: info.messageId }
    } else {
      throw new Error('Email service not configured')
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

// Email templates
export function getOverdueTaskEmailHtml(data: {
  userName: string
  todoTitle: string
  todoDescription?: string
  dueDate: Date
  priority: string
  appUrl: string
}) {
  const { userName, todoTitle, todoDescription, dueDate, priority, appUrl } = data

  const priorityColor = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#3b82f6',
  }[priority] || '#6b7280'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Overdue Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">⏰ Task Overdue Reminder</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${userName},
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                This is a reminder that the following task is now <strong style="color: #ef4444;">overdue</strong>:
              </p>

              <!-- Task Card -->
              <div style="background-color: #f9fafb; border-left: 4px solid ${priorityColor}; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 10px 0;">
                  ${todoTitle}
                </h2>

                ${todoDescription ? `
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">
                  ${todoDescription}
                </p>
                ` : ''}

                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="padding: 5px 0;">
                      <span style="display: inline-block; background-color: ${priorityColor}; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${priority} Priority
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 0 0;">
                      <span style="color: #ef4444; font-size: 14px; font-weight: 500;">
                        📅 Due: ${dueDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${appUrl}/todos" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      View Task
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                Don't forget to mark it as complete when you're done! ✅
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">
                You're receiving this email because you have notifications enabled for overdue tasks.
                <br>
                <a href="${appUrl}" style="color: #667eea; text-decoration: none;">Visit Todo App</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function getOverdueTaskEmailText(data: {
  userName: string
  todoTitle: string
  todoDescription?: string
  dueDate: Date
  priority: string
  appUrl: string
}) {
  const { userName, todoTitle, todoDescription, dueDate, priority, appUrl } = data

  return `
Hi ${userName},

This is a reminder that the following task is now OVERDUE:

Task: ${todoTitle}
${todoDescription ? `Description: ${todoDescription}` : ''}
Priority: ${priority}
Due Date: ${dueDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

View your task: ${appUrl}/todos

Don't forget to mark it as complete when you're done!

---
You're receiving this email because you have notifications enabled for overdue tasks.
Visit: ${appUrl}
  `.trim()
}
