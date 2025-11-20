'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckSquare, Share2, Trash2, Activity, ListTodo } from 'lucide-react'

const routes = [
  {
    label: 'All Todos',
    icon: CheckSquare,
    href: '/todos',
  },
  {
    label: 'Shared with me',
    icon: Share2,
    href: '/shared',
  },
  {
    label: 'Activity',
    icon: Activity,
    href: '/activity',
  },
  {
    label: 'Trash',
    icon: Trash2,
    href: '/todos/trash',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
      <div className="px-3 py-2">
        <Link href="/todos" className="flex items-center pl-3 mb-6">
          <ListTodo className="h-6 w-6 mr-3 text-primary" />
          <h1 className="text-2xl font-bold">Todo App</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                pathname === route.href && 'bg-secondary'
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
