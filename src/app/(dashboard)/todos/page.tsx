import { getTodos } from '@/lib/actions/todo.actions'
import { TodoList } from '@/components/todos/todo-list'
import { TodoHeader } from '@/components/todos/todo-header'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function TodosPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const result = await getTodos()

  return (
    <div className="space-y-6">
      <TodoHeader />
      <TodoList todos={result.todos} />
    </div>
  )
}
