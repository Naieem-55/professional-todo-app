'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from './priority-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SharedTodoListProps {
  sharedTodos: any[]
}

export function SharedTodoList({ sharedTodos }: SharedTodoListProps) {
  if (sharedTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No shared todos</p>
        <p className="text-sm text-muted-foreground mt-1">
          Todos shared with you will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sharedTodos.map((sharedTodo) => {
        const todo = sharedTodo.todo

        return (
          <Card key={sharedTodo.id} className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-lg">{todo.title}</h3>
                {todo.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={todo.priority} />

                {todo.category && (
                  <Badge variant="outline">
                    {todo.category.icon} {todo.category.name}
                  </Badge>
                )}

                <Badge variant="outline" className="capitalize">
                  {sharedTodo.permission.toLowerCase()}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={todo.user.image || ''} />
                  <AvatarFallback>
                    {todo.user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>Shared by {todo.user.name || todo.user.email}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
