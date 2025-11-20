'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  createTodoSchema,
  updateTodoSchema,
  createSubtaskSchema,
  createCategorySchema,
  createTagSchema,
  reorderTodosSchema,
} from '@/lib/validations/todo.schema'
import { ActivityType, Priority, TodoStatus } from '@prisma/client'
import type { FilterOptions } from '@/types'

async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user
}

// Todo CRUD Operations
export async function createTodo(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = createTodoSchema.parse(data)

    // Get the highest order value
    const lastTodo = await db.todo.findFirst({
      where: { userId: user.id, isDeleted: false },
      orderBy: { order: 'desc' },
    })

    const todo = await db.todo.create({
      data: {
        ...validated,
        userId: user.id,
        order: (lastTodo?.order ?? -1) + 1,
      },
      include: {
        category: true,
        subtasks: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Create activity log
    await db.activity.create({
      data: {
        type: ActivityType.CREATED,
        description: `Created todo "${todo.title}"`,
        userId: user.id,
        todoId: todo.id,
        metadata: { todoTitle: todo.title },
      },
    })

    // Handle tags if provided
    if (validated.tagIds && validated.tagIds.length > 0) {
      await db.todoTag.createMany({
        data: validated.tagIds.map((tagId: string) => ({
          todoId: todo.id,
          tagId,
        })),
      })
    }

    revalidatePath('/todos')
    return { success: true, todo }
  } catch (error) {
    console.error('Create todo error:', error)
    return { success: false, error: 'Failed to create todo' }
  }
}

export async function updateTodo(id: string, data: any) {
  try {
    const user = await getCurrentUser()
    const validated = updateTodoSchema.parse(data)

    const existingTodo = await db.todo.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingTodo) {
      return { success: false, error: 'Todo not found' }
    }

    // Handle tag updates
    if (validated.tagIds) {
      await db.todoTag.deleteMany({
        where: { todoId: id },
      })

      if (validated.tagIds.length > 0) {
        await db.todoTag.createMany({
          data: validated.tagIds.map((tagId: string) => ({
            todoId: id,
            tagId,
          })),
        })
      }
    }

    const { tagIds, ...updateData } = validated

    const todo = await db.todo.update({
      where: { id },
      data: {
        ...updateData,
        completedAt: validated.status === TodoStatus.COMPLETED ? new Date() : null,
      },
      include: {
        category: true,
        subtasks: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Create activity log
    await db.activity.create({
      data: {
        type: validated.status === TodoStatus.COMPLETED ? ActivityType.COMPLETED : ActivityType.UPDATED,
        description: validated.status === TodoStatus.COMPLETED
          ? `Completed todo "${todo.title}"`
          : `Updated todo "${todo.title}"`,
        userId: user.id,
        todoId: todo.id,
        metadata: { todoTitle: todo.title, changes: Object.keys(validated) },
      },
    })

    revalidatePath('/todos')
    return { success: true, todo }
  } catch (error) {
    console.error('Update todo error:', error)
    return { success: false, error: 'Failed to update todo' }
  }
}

export async function deleteTodo(id: string, permanent = false) {
  try {
    const user = await getCurrentUser()

    const existingTodo = await db.todo.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingTodo) {
      return { success: false, error: 'Todo not found' }
    }

    if (permanent) {
      await db.todo.delete({
        where: { id },
      })
    } else {
      await db.todo.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      })

      await db.activity.create({
        data: {
          type: ActivityType.DELETED,
          description: `Deleted todo "${existingTodo.title}"`,
          userId: user.id,
          todoId: id,
          metadata: { todoTitle: existingTodo.title },
        },
      })
    }

    revalidatePath('/todos')
    revalidatePath('/todos/trash')
    return { success: true }
  } catch (error) {
    console.error('Delete todo error:', error)
    return { success: false, error: 'Failed to delete todo' }
  }
}

export async function restoreTodo(id: string) {
  try {
    const user = await getCurrentUser()

    const todo = await db.todo.update({
      where: { id, userId: user.id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    await db.activity.create({
      data: {
        type: ActivityType.RESTORED,
        description: `Restored todo "${todo.title}"`,
        userId: user.id,
        todoId: id,
        metadata: { todoTitle: todo.title },
      },
    })

    revalidatePath('/todos')
    revalidatePath('/todos/trash')
    return { success: true }
  } catch (error) {
    console.error('Restore todo error:', error)
    return { success: false, error: 'Failed to restore todo' }
  }
}

export async function getTodos(filters?: FilterOptions) {
  try {
    const user = await getCurrentUser()

    const where: any = {
      userId: user.id,
      isDeleted: false,
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status
    }

    if (filters?.priority && filters.priority !== 'ALL') {
      where.priority = filters.priority
    }

    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      where.categoryId = filters.categoryId
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.dateRange?.from || filters?.dateRange?.to) {
      where.dueDate = {}
      if (filters.dateRange.from) {
        where.dueDate.gte = filters.dateRange.from
      }
      if (filters.dateRange.to) {
        where.dueDate.lte = filters.dateRange.to
      }
    }

    if (filters?.tagId && filters.tagId !== 'ALL') {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      }
    }

    const todos = await db.todo.findMany({
      where,
      include: {
        category: true,
        subtasks: {
          orderBy: { order: 'asc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    return { success: true, todos }
  } catch (error) {
    console.error('Get todos error:', error)
    return { success: false, error: 'Failed to fetch todos', todos: [] }
  }
}

export async function getTodoById(id: string) {
  try {
    const user = await getCurrentUser()

    const todo = await db.todo.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          { sharedWith: { some: { userId: user.id } } },
        ],
      },
      include: {
        category: true,
        subtasks: {
          orderBy: { order: 'asc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        sharedWith: {
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
        },
      },
    })

    if (!todo) {
      return { success: false, error: 'Todo not found' }
    }

    return { success: true, todo }
  } catch (error) {
    console.error('Get todo error:', error)
    return { success: false, error: 'Failed to fetch todo' }
  }
}

export async function reorderTodos(todoId: string, newOrder: number) {
  try {
    const user = await getCurrentUser()
    const validated = reorderTodosSchema.parse({ todoId, newOrder })

    // Update the order of the moved todo
    await db.todo.update({
      where: { id: validated.todoId, userId: user.id },
      data: { order: validated.newOrder },
    })

    revalidatePath('/todos')
    return { success: true }
  } catch (error) {
    console.error('Reorder todos error:', error)
    return { success: false, error: 'Failed to reorder todos' }
  }
}

// Subtask Operations
export async function createSubtask(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = createSubtaskSchema.parse(data)

    const todo = await db.todo.findFirst({
      where: { id: validated.todoId, userId: user.id },
    })

    if (!todo) {
      return { success: false, error: 'Todo not found' }
    }

    const lastSubtask = await db.subtask.findFirst({
      where: { todoId: validated.todoId },
      orderBy: { order: 'desc' },
    })

    const subtask = await db.subtask.create({
      data: {
        ...validated,
        order: (lastSubtask?.order ?? -1) + 1,
      },
    })

    revalidatePath('/todos')
    return { success: true, subtask }
  } catch (error) {
    console.error('Create subtask error:', error)
    return { success: false, error: 'Failed to create subtask' }
  }
}

export async function toggleSubtask(id: string) {
  try {
    const subtask = await db.subtask.findUnique({
      where: { id },
      include: { todo: true },
    })

    if (!subtask) {
      return { success: false, error: 'Subtask not found' }
    }

    const updated = await db.subtask.update({
      where: { id },
      data: { isCompleted: !subtask.isCompleted },
    })

    revalidatePath('/todos')
    return { success: true, subtask: updated }
  } catch (error) {
    console.error('Toggle subtask error:', error)
    return { success: false, error: 'Failed to toggle subtask' }
  }
}

export async function deleteSubtask(id: string) {
  try {
    await db.subtask.delete({
      where: { id },
    })

    revalidatePath('/todos')
    return { success: true }
  } catch (error) {
    console.error('Delete subtask error:', error)
    return { success: false, error: 'Failed to delete subtask' }
  }
}

// Category Operations
export async function createCategory(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = createCategorySchema.parse(data)

    const category = await db.category.create({
      data: {
        ...validated,
        userId: user.id,
      },
    })

    revalidatePath('/todos')
    return { success: true, category }
  } catch (error) {
    console.error('Create category error:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function getCategories() {
  try {
    const user = await getCurrentUser()

    const categories = await db.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    })

    return { success: true, categories }
  } catch (error) {
    console.error('Get categories error:', error)
    return { success: false, error: 'Failed to fetch categories', categories: [] }
  }
}

export async function deleteCategory(id: string) {
  try {
    const user = await getCurrentUser()

    await db.category.delete({
      where: { id, userId: user.id },
    })

    revalidatePath('/todos')
    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

// Tag Operations
export async function createTag(data: any) {
  try {
    const user = await getCurrentUser()
    const validated = createTagSchema.parse(data)

    const tag = await db.tag.create({
      data: {
        ...validated,
        userId: user.id,
      },
    })

    revalidatePath('/todos')
    return { success: true, tag }
  } catch (error) {
    console.error('Create tag error:', error)
    return { success: false, error: 'Failed to create tag' }
  }
}

export async function getTags() {
  try {
    const user = await getCurrentUser()

    const tags = await db.tag.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    })

    return { success: true, tags }
  } catch (error) {
    console.error('Get tags error:', error)
    return { success: false, error: 'Failed to fetch tags', tags: [] }
  }
}

export async function deleteTag(id: string) {
  try {
    const user = await getCurrentUser()

    await db.tag.delete({
      where: { id, userId: user.id },
    })

    revalidatePath('/todos')
    return { success: true }
  } catch (error) {
    console.error('Delete tag error:', error)
    return { success: false, error: 'Failed to delete tag' }
  }
}

// Trash Operations
export async function getDeletedTodos() {
  try {
    const user = await getCurrentUser()

    const todos = await db.todo.findMany({
      where: {
        userId: user.id,
        isDeleted: true,
      },
      include: {
        category: true,
        subtasks: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { deletedAt: 'desc' },
    })

    return { success: true, todos }
  } catch (error) {
    console.error('Get deleted todos error:', error)
    return { success: false, error: 'Failed to fetch deleted todos', todos: [] }
  }
}

export async function emptyTrash() {
  try {
    const user = await getCurrentUser()

    await db.todo.deleteMany({
      where: {
        userId: user.id,
        isDeleted: true,
      },
    })

    revalidatePath('/todos/trash')
    return { success: true }
  } catch (error) {
    console.error('Empty trash error:', error)
    return { success: false, error: 'Failed to empty trash' }
  }
}
