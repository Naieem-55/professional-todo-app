import { z } from 'zod'
import { Priority, TodoStatus } from '@prisma/client'

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(TodoStatus).default(TodoStatus.PENDING),
  dueDate: z.date().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  description: z.string().nullable().optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(TodoStatus).optional(),
  dueDate: z.date().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const createSubtaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  todoId: z.string(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().optional(),
})

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

export const reorderTodosSchema = z.object({
  todoId: z.string(),
  newOrder: z.number().int().min(0),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type ReorderTodosInput = z.infer<typeof reorderTodosSchema>
