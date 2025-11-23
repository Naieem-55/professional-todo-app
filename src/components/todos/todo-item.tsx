'use client'

import { useState } from 'react'
import { TodoWithRelations } from '@/types'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from './priority-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash, Calendar } from 'lucide-react'
import { updateTodo, deleteTodo } from '@/lib/actions/todo.actions'
import { useToast } from '@/components/ui/use-toast'
import { formatDate, isOverdue } from '@/lib/utils'
import { TodoStatus } from '@prisma/client'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: TodoWithRelations
  onEdit?: (todo: TodoWithRelations) => void
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    const newStatus = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED

    const result = await updateTodo(todo.id, { status: newStatus })

    if (result.success) {
      toast({
        title: newStatus === TodoStatus.COMPLETED ? 'Todo completed!' : 'Todo reopened',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deleteTodo(todo.id)

    if (result.success) {
      toast({
        title: 'Todo moved to trash',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  const completedSubtasks = todo.subtasks?.filter((st) => st.isCompleted).length || 0
  const totalSubtasks = todo.subtasks?.length || 0

  // Determine card styling based on status
  const isCompleted = todo.status === TodoStatus.COMPLETED
  const isTaskOverdue = todo.dueDate && isOverdue(todo.dueDate) && !isCompleted

  return (
    <Card className={cn(
      'p-4 hover:shadow-md transition-shadow',
      isCompleted && 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
      isTaskOverdue && 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cn(
                'font-medium text-lg',
                isCompleted && 'text-green-700 dark:text-green-400',
                isTaskOverdue && 'text-red-700 dark:text-red-400'
              )}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={cn(
                  'text-sm mt-1 line-clamp-2',
                  isCompleted && 'text-green-600 dark:text-green-500',
                  isTaskOverdue && 'text-red-600 dark:text-red-500',
                  !isCompleted && !isTaskOverdue && 'text-muted-foreground'
                )}>
                  {todo.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(todo)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <PriorityBadge priority={todo.priority} />

            {todo.category && (
              <Badge
                variant="outline"
                style={{
                  backgroundColor: `${todo.category.color}20`,
                  borderColor: todo.category.color,
                  color: todo.category.color,
                }}
              >
                {todo.category.icon} {todo.category.name}
              </Badge>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <>
                {todo.tags.map((todoTag) => (
                  <Badge
                    key={todoTag.id}
                    variant="outline"
                    style={{
                      backgroundColor: `${todoTag.tag?.color}20`,
                      borderColor: todoTag.tag?.color,
                      color: todoTag.tag?.color,
                    }}
                  >
                    {todoTag.tag?.name}
                  </Badge>
                ))}
              </>
            )}

            {todo.dueDate && (
              <Badge
                variant="outline"
                className={cn(
                  'flex items-center gap-1',
                  isOverdue(todo.dueDate) && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(todo.dueDate)}
              </Badge>
            )}

            {totalSubtasks > 0 && (
              <Badge variant="outline">
                {completedSubtasks}/{totalSubtasks} subtasks
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
