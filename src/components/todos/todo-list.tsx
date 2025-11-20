'use client'

import { useState } from 'react'
import { TodoWithRelations } from '@/types'
import { TodoItem } from './todo-item'
import { TodoFormDialog } from './todo-form-dialog'

interface TodoListProps {
  todos: TodoWithRelations[]
}

export function TodoList({ todos }: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<TodoWithRelations | null>(null)

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No todos found</p>
        <p className="text-sm text-muted-foreground mt-1">Create your first todo to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onEdit={setEditingTodo} />
        ))}
      </div>

      {editingTodo && (
        <TodoFormDialog
          todo={editingTodo}
          open={!!editingTodo}
          onOpenChange={(open) => !open && setEditingTodo(null)}
        />
      )}
    </>
  )
}
