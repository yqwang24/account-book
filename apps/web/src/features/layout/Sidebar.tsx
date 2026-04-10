'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@account-book/ui'
import { BookOpen, BarChart3 } from 'lucide-react'

const navItems = [
  { href: '/', label: '仪表盘', icon: BarChart3 },
  { href: '/books', label: '账本', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">记账本</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        单用户账本 v1.0
      </div>
    </aside>
  )
}