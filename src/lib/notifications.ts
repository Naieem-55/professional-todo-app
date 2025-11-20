import { db } from '@/lib/db'
import { sendEmail, getOverdueTaskEmailHtml, getOverdueTaskEmailText } from '@/lib/email'
import { isPast, isToday, subDays } from 'date-fns'

export async function checkAndSendOverdueNotifications() {
  try {
    console.log('🔔 Checking for overdue tasks...')

    // Get all overdue todos that haven't been notified in the last 24 hours
    const overdueTodos = await db.todo.findMany({
      where: {
        isDeleted: false,
        status: {
          not: 'COMPLETED',
        },
        dueDate: {
          not: null,
          lt: new Date(), // Due date is in the past
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    console.log(`📋 Found ${overdueTodos.length} overdue tasks`)

    const results = []

    for (const todo of overdueTodos) {
      // Check if user has a valid email
      if (!todo.user.email) {
        console.log(`⚠️  Skipping todo ${todo.id} - user has no email`)
        continue
      }

      // Check if this task is actually overdue (not just due today)
      if (todo.dueDate && !isPast(todo.dueDate)) {
        continue
      }

      // Send email notification
      console.log(`📧 Sending overdue notification for: "${todo.title}" to ${todo.user.email}`)

      const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

      const emailHtml = getOverdueTaskEmailHtml({
        userName: todo.user.name || 'there',
        todoTitle: todo.title,
        todoDescription: todo.description || undefined,
        dueDate: todo.dueDate!,
        priority: todo.priority,
        appUrl,
      })

      const emailText = getOverdueTaskEmailText({
        userName: todo.user.name || 'there',
        todoTitle: todo.title,
        todoDescription: todo.description || undefined,
        dueDate: todo.dueDate!,
        priority: todo.priority,
        appUrl,
      })

      const result = await sendEmail({
        to: todo.user.email,
        subject: `⏰ Task Overdue: ${todo.title}`,
        html: emailHtml,
        text: emailText,
      })

      results.push({
        todoId: todo.id,
        userId: todo.user.id,
        email: todo.user.email,
        success: result.success,
      })

      // Log the notification in activity
      if (result.success) {
        await db.activity.create({
          data: {
            type: 'UPDATED',
            description: `Sent overdue notification for "${todo.title}"`,
            userId: todo.user.id,
            todoId: todo.id,
            metadata: {
              notificationType: 'overdue',
              sentAt: new Date().toISOString(),
            },
          },
        })
      }
    }

    console.log(`✅ Notification check complete. Sent ${results.filter(r => r.success).length} emails`)

    return {
      success: true,
      totalChecked: overdueTodos.length,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    }
  } catch (error) {
    console.error('❌ Error checking overdue notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendUpcomingDueNotifications() {
  try {
    console.log('🔔 Checking for upcoming due tasks...')

    // Get todos due in the next 24 hours
    const tomorrow = new Date()
    tomorrow.setHours(23, 59, 59, 999)

    const upcomingTodos = await db.todo.findMany({
      where: {
        isDeleted: false,
        status: {
          not: 'COMPLETED',
        },
        dueDate: {
          not: null,
          gte: new Date(),
          lte: tomorrow,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    console.log(`📋 Found ${upcomingTodos.length} upcoming tasks`)

    const results = []

    for (const todo of upcomingTodos) {
      if (!todo.user.email) continue

      const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

      // Similar email template for upcoming tasks
      const result = await sendEmail({
        to: todo.user.email,
        subject: `📅 Task Due Soon: ${todo.title}`,
        html: getOverdueTaskEmailHtml({
          userName: todo.user.name || 'there',
          todoTitle: todo.title,
          todoDescription: todo.description || undefined,
          dueDate: todo.dueDate!,
          priority: todo.priority,
          appUrl,
        }).replace('overdue', 'due soon'),
        text: getOverdueTaskEmailText({
          userName: todo.user.name || 'there',
          todoTitle: todo.title,
          todoDescription: todo.description || undefined,
          dueDate: todo.dueDate!,
          priority: todo.priority,
          appUrl,
        }).replace('OVERDUE', 'DUE SOON'),
      })

      results.push({
        todoId: todo.id,
        success: result.success,
      })
    }

    return {
      success: true,
      totalChecked: upcomingTodos.length,
      sent: results.filter(r => r.success).length,
    }
  } catch (error) {
    console.error('❌ Error sending upcoming notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
