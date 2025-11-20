import { z } from 'zod'
import { SharePermission } from '@prisma/client'

export const shareTodoSchema = z.object({
  todoId: z.string(),
  email: z.string().email('Invalid email address'),
  permission: z.nativeEnum(SharePermission).default(SharePermission.VIEW),
})

export const updateSharePermissionSchema = z.object({
  shareId: z.string(),
  permission: z.nativeEnum(SharePermission),
})

export type ShareTodoInput = z.infer<typeof shareTodoSchema>
export type UpdateSharePermissionInput = z.infer<typeof updateSharePermissionSchema>
