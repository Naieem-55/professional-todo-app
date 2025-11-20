'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function getActivities(limit = 50) {
  try {
    const user = await getCurrentUser()

    const activities = await db.activity.findMany({
      where: { userId: user.id },
      include: {
        todo: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return { success: true, activities }
  } catch (error) {
    console.error('Get activities error:', error)
    return { success: false, error: 'Failed to fetch activities', activities: [] }
  }
}
