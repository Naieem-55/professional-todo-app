'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { shareTodoSchema, updateSharePermissionSchema } from '@/lib/validations/share.schema'
import { ActivityType } from '@prisma/client'

async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function shareTodo(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = shareTodoSchema.parse(data)

    // Check if the todo belongs to the user
    const todo = await db.todo.findFirst({
      where: { id: validated.todoId, userId: user.id },
    })

    if (!todo) {
      return { success: false, error: 'Todo not found' }
    }

    // Find the user to share with
    const shareWithUser = await db.user.findUnique({
      where: { email: validated.email },
    })

    if (!shareWithUser) {
      return { success: false, error: 'User not found' }
    }

    // Check if already shared
    const existingShare = await db.sharedTodo.findUnique({
      where: {
        todoId_userId: {
          todoId: validated.todoId,
          userId: shareWithUser.id,
        },
      },
    })

    if (existingShare) {
      return { success: false, error: 'Todo already shared with this user' }
    }

    const share = await db.sharedTodo.create({
      data: {
        todoId: validated.todoId,
        userId: shareWithUser.id,
        permission: validated.permission,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Create activity log
    await db.activity.create({
      data: {
        type: ActivityType.SHARED,
        description: `Shared todo "${todo.title}" with ${shareWithUser.name || shareWithUser.email}`,
        userId: user.id,
        todoId: todo.id,
        metadata: {
          sharedWith: shareWithUser.email,
          permission: validated.permission,
        },
      },
    })

    revalidatePath('/todos')
    return { success: true, share }
  } catch (error) {
    console.error('Share todo error:', error)
    return { success: false, error: 'Failed to share todo' }
  }
}

export async function updateSharePermission(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = updateSharePermissionSchema.parse(data)

    const share = await db.sharedTodo.findUnique({
      where: { id: validated.shareId },
      include: { todo: true },
    })

    if (!share || share.todo.userId !== user.id) {
      return { success: false, error: 'Share not found' }
    }

    const updated = await db.sharedTodo.update({
      where: { id: validated.shareId },
      data: { permission: validated.permission },
    })

    revalidatePath('/todos')
    return { success: true, share: updated }
  } catch (error) {
    console.error('Update share permission error:', error)
    return { success: false, error: 'Failed to update permission' }
  }
}

export async function removeShare(shareId: string) {
  try {
    const user = await getCurrentUser()

    const share = await db.sharedTodo.findUnique({
      where: { id: shareId },
      include: { todo: true },
    })

    if (!share || share.todo.userId !== user.id) {
      return { success: false, error: 'Share not found' }
    }

    await db.sharedTodo.delete({
      where: { id: shareId },
    })

    revalidatePath('/todos')
    return { success: true }
  } catch (error) {
    console.error('Remove share error:', error)
    return { success: false, error: 'Failed to remove share' }
  }
}

export async function getSharedTodos() {
  try {
    const user = await getCurrentUser()

    const sharedTodos = await db.sharedTodo.findMany({
      where: { userId: user.id },
      include: {
        todo: {
          include: {
            category: true,
            subtasks: true,
            tags: {
              include: {
                tag: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, sharedTodos }
  } catch (error) {
    console.error('Get shared todos error:', error)
    return { success: false, error: 'Failed to fetch shared todos', sharedTodos: [] }
  }
}
