import { getActivities } from '@/lib/actions/activity.actions'
import { ActivityList } from '@/components/todos/activity-list'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function ActivityPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const result = await getActivities()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
        <p className="text-muted-foreground">
          Recent activity on your todos
        </p>
      </div>
      <ActivityList activities={result.activities} />
    </div>
  )
}
