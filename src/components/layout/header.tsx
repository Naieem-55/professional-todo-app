'use client'

import { User } from 'next-auth'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface HeaderProps {
  user: User
  onNewTodo?: () => void
}

export function Header({ user, onNewTodo }: HeaderProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="ml-auto flex items-center space-x-4">
          {onNewTodo && (
            <Button onClick={onNewTodo} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Todo
            </Button>
          )}
          <UserMenu user={user} />
        </div>
      </div>
    </div>
  )
}
