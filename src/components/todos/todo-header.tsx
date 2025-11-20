'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TodoFormDialog } from './todo-form-dialog'

export function TodoHeader() {
  const [showNewTodoDialog, setShowNewTodoDialog] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Todos</h2>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button onClick={() => setShowNewTodoDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Todo
        </Button>
      </div>

      <TodoFormDialog
        open={showNewTodoDialog}
        onOpenChange={setShowNewTodoDialog}
      />
    </>
  )
}
