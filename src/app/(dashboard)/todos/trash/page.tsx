import { getDeletedTodos } from '@/lib/actions/todo.actions'
import { TrashList } from '@/components/todos/trash-list'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function TrashPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const result = await getDeletedTodos()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trash</h2>
        <p className="text-muted-foreground">
          Restore or permanently delete todos
        </p>
      </div>
      <TrashList todos={result.todos} />
    </div>
  )
}
