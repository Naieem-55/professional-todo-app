'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTodoSchema, type CreateTodoInput } from '@/lib/validations/todo.schema'
import { createTodo, updateTodo, getCategories, getTags } from '@/lib/actions/todo.actions'
import { useToast } from '@/components/ui/use-toast'
import { Priority, TodoStatus } from '@prisma/client'
import { TodoWithRelations } from '@/types'
import { Loader2 } from 'lucide-react'

interface TodoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo?: TodoWithRelations | null
}

export function TodoFormDialog({ open, onOpenChange, todo }: TodoFormDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: todo?.title || '',
      description: todo?.description || '',
      priority: todo?.priority || Priority.MEDIUM,
      status: todo?.status || TodoStatus.PENDING,
      dueDate: todo?.dueDate || null,
      categoryId: todo?.categoryId || null,
    },
  })

  useEffect(() => {
    const loadData = async () => {
      const [categoriesResult, tagsResult] = await Promise.all([
        getCategories(),
        getTags(),
      ])

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }

      if (tagsResult.success) {
        setTags(tagsResult.tags)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: CreateTodoInput) => {
    setIsLoading(true)

    const result = todo
      ? await updateTodo(todo.id, data)
      : await createTodo(data)

    if (result.success) {
      toast({
        title: todo ? 'Todo updated!' : 'Todo created!',
      })
      reset()
      onOpenChange(false)
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{todo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter todo title"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter todo description"
              rows={4}
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as Priority)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Priority.LOW}>Low</SelectItem>
                  <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={Priority.HIGH}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as TodoStatus)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TodoStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                {...register('dueDate', {
                  setValueAs: (value) => (value ? new Date(value) : null),
                })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch('categoryId') || 'none'}
                onValueChange={(value) => setValue('categoryId', value === 'none' ? null : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {todo ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
