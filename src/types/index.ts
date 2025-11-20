import { Priority, TodoStatus, ActivityType, SharePermission } from '@prisma/client'

export type { Priority, TodoStatus, ActivityType, SharePermission }

export interface Todo {
  id: string
  title: string
  description: string | null
  status: TodoStatus
  priority: Priority
  dueDate: Date | null
  order: number
  isDeleted: boolean
  deletedAt: Date | null
  completedAt: Date | null
  userId: string
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category | null
  subtasks?: Subtask[]
  tags?: TodoTag[]
  sharedWith?: SharedTodo[]
}

export interface Subtask {
  id: string
  title: string
  isCompleted: boolean
  order: number
  todoId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface TodoTag {
  id: string
  todoId: string
  tagId: string
  tag?: Tag
}

export interface SharedTodo {
  id: string
  todoId: string
  userId: string
  permission: SharePermission
  user?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  type: ActivityType
  description: string
  metadata: any
  userId: string
  todoId: string | null
  todo?: {
    id: string
    title: string
  } | null
  createdAt: Date
}

export interface FilterOptions {
  status?: TodoStatus | 'ALL'
  priority?: Priority | 'ALL'
  categoryId?: string | 'ALL'
  tagId?: string | 'ALL'
  search?: string
  dateRange?: {
    from?: Date
    to?: Date
  }
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface TodoWithRelations extends Todo {
  category: Category | null
  subtasks: Subtask[]
  tags: TodoTag[]
  sharedWith: SharedTodo[]
}
