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
    <aside className="w-64 border-r bg-gradient-to-b from-white to-gray-50 h-full flex flex-col shadow-sm">
      <div className="p-5 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <h2 className="font-bold text-lg text-primary">记账本</h2>
        <p className="text-xs text-muted-foreground mt-0.5">个人财务管家</p>
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
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? '' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t text-center">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </aside>
  )
}