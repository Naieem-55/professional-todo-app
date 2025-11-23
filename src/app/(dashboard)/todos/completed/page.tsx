import { getTodos } from '@/lib/actions/todo.actions'
import { TodoList } from '@/components/todos/todo-list'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { TodoStatus } from '@prisma/client'
import { CheckCircle2 } from 'lucide-react'

export default async function CompletedTodosPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Fetch only completed todos
  const result = await getTodos({ status: TodoStatus.COMPLETED })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Completed Todos</h1>
              <p className="text-muted-foreground">
                {result.todos.length} {result.todos.length === 1 ? 'task' : 'tasks'} completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {result.todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No completed tasks yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Tasks you mark as complete will appear here. Keep up the good work!
          </p>
        </div>
      ) : (
        <TodoList todos={result.todos} />
      )}
    </div>
  )
}
