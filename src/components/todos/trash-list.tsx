'use client'

import { useState } from 'react'
import { TodoWithRelations } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from './priority-badge'
import { restoreTodo, deleteTodo, emptyTrash } from '@/lib/actions/todo.actions'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { RefreshCw, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface TrashListProps {
  todos: TodoWithRelations[]
}

export function TrashList({ todos }: TrashListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleRestore = async (id: string) => {
    setIsLoading(true)
    const result = await restoreTodo(id)

    if (result.success) {
      toast({
        title: 'Todo restored!',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  const handlePermanentDelete = async (id: string) => {
    setIsLoading(true)
    const result = await deleteTodo(id, true)

    if (result.success) {
      toast({
        title: 'Todo permanently deleted',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  const handleEmptyTrash = async () => {
    setIsLoading(true)
    const result = await emptyTrash()

    if (result.success) {
      toast({
        title: 'Trash emptied',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">Trash is empty</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Empty Trash
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Empty trash?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all todos in trash. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEmptyTrash}>
                Empty Trash
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <Card key={todo.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg">{todo.title}</h3>
                {todo.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {todo.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <PriorityBadge priority={todo.priority} />
                  {todo.category && (
                    <Badge variant="outline">
                      {todo.category.icon} {todo.category.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Deleted {formatRelativeTime(todo.deletedAt)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestore(todo.id)}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restore
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Permanently delete?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this todo. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handlePermanentDelete(todo.id)}>
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
