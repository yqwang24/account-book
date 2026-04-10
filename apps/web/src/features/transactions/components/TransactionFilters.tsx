'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@account-book/ui'
import { Button } from '@account-book/ui'

interface TransactionFiltersProps {
  onFilterChange: (filter: { year: number; month: number; categoryId?: string }) => void
  categories: { id: string; name: string }[]
}

export function TransactionFilters({ onFilterChange, categories }: TransactionFiltersProps) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [categoryId, setCategoryId] = useState<string>('')

  const handleApply = () => {
    onFilterChange({ year, month, categoryId: categoryId || undefined })
  }

  return (
    <div className="flex gap-4 items-end">
      <div>
        <label className="text-sm font-medium">年份</label>
        <Select value={String(year)} onValueChange={v => setYear(+v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, currentYear].map(y => <SelectItem key={y} value={String(y)}>{y}年</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">月份</label>
        <Select value={String(month)} onValueChange={v => setMonth(+v)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <SelectItem key={m} value={String(m)}>{m}月</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">分类</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleApply}>筛选</Button>
    </div>
  )
}