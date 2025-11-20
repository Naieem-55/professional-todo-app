import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null): string {
  if (!date) return 'No date'

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`
  }

  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'HH:mm')}`
  }

  return format(dateObj, 'MMM dd, yyyy')
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return 'No date'

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return isPast(dateObj) && !isToday(dateObj)
}

export function getPriorityColor(priority: string): string {
  const colors = {
    LOW: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
    MEDIUM: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
    HIGH: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
  }

  return colors[priority as keyof typeof colors] || colors.MEDIUM
}

export function getStatusColor(status: string): string {
  const colors = {
    PENDING: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400',
    IN_PROGRESS: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
    COMPLETED: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
  }

  return colors[status as keyof typeof colors] || colors.PENDING
}

export function generateColor(): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}
