import { NextRequest, NextResponse } from 'next/server'
import { checkAndSendOverdueNotifications } from '@/lib/notifications'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// This API route will be called by a cron job
// Secure it with a secret token
export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🚀 Cron job triggered: Checking overdue tasks')

    const result = await checkAndSendOverdueNotifications()

    return NextResponse.json({
      success: true,
      message: 'Overdue notifications check completed',
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST method for manual testing
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🧪 Manual trigger: Checking overdue tasks')

    const result = await checkAndSendOverdueNotifications()

    return NextResponse.json({
      success: true,
      message: 'Manual notification check completed',
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in manual trigger:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
