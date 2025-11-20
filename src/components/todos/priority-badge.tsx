import { Priority } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variants = {
    LOW: { label: 'Low', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
    MEDIUM: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' },
    HIGH: { label: 'High', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' },
  }

  const variant = variants[priority]

  return (
    <Badge variant="outline" className={cn('font-medium', variant.className)}>
      {variant.label}
    </Badge>
  )
}
