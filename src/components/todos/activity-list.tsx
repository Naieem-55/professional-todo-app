'use client'

import { Activity } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { CheckCircle, Edit, Trash, Share, Plus, RefreshCw } from 'lucide-react'

interface ActivityListProps {
  activities: Activity[]
}

const activityIcons = {
  CREATED: Plus,
  UPDATED: Edit,
  COMPLETED: CheckCircle,
  DELETED: Trash,
  RESTORED: RefreshCw,
  SHARED: Share,
}

const activityColors = {
  CREATED: 'text-green-600 bg-green-50 dark:bg-green-950',
  UPDATED: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  COMPLETED: 'text-green-600 bg-green-50 dark:bg-green-950',
  DELETED: 'text-red-600 bg-red-50 dark:bg-red-950',
  RESTORED: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  SHARED: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {activity.type.toLowerCase()}
              </Badge>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
