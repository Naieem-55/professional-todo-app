import { getSharedTodos } from '@/lib/actions/share.actions'
import { SharedTodoList } from '@/components/todos/shared-todo-list'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function SharedPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const result = await getSharedTodos()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shared with me</h2>
        <p className="text-muted-foreground">
          Todos that others have shared with you
        </p>
      </div>
      <SharedTodoList sharedTodos={result.sharedTodos} />
    </div>
  )
}
