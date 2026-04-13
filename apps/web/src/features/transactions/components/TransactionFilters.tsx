'use client'

import { useState } from 'react'
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
    <div className="flex gap-4 items-end flex-wrap">
      <div>
        <label className="text-sm font-medium">年份</label>
        <select
          value={String(year)}
          onChange={e => setYear(+e.target.value)}
          className="w-[120px] border rounded-md px-3 py-2"
        >
          {[2024, 2025, currentYear].map(y => <option key={y} value={String(y)}>{y}年</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">月份</label>
        <select
          value={String(month)}
          onChange={e => setMonth(+e.target.value)}
          className="w-[100px] border rounded-md px-3 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={String(m)}>{m}月</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">分类</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-[150px] border rounded-md px-3 py-2"
        >
          <option value="">全部</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Button onClick={handleApply}>筛选</Button>
    </div>
  )
}